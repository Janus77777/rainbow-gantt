import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { createClient } from 'redis';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const LEGACY_SEED_DATA_FILE = path.join(__dirname, 'tasks.json');

const hasRemoteKv = Boolean(process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN);
const hasRedis = Boolean(process.env.REDIS_URL);

const LEGACY_KV_KEY = process.env.KV_KEY || 'gantt:tasks';
const WORKSPACE_COLLECTION_KEY = process.env.WORKSPACE_COLLECTION_KEY || 'gantt:workspaces:v1';
export const DEFAULT_WORKSPACE_ID = process.env.DEFAULT_WORKSPACE_ID || 'default';

const WORKSPACE_VERSION = 1;
const DEFAULT_PROJECT_TITLE = '繽紛七彩酷炫甘特圖';
const DEFAULT_NEW_WORKSPACE_TITLE = '請輸入甘特圖名稱';

let redisClient = null;

const workspacePalette = [
  '#6366f1',
  '#ec4899',
  '#06b6d4',
  '#f59e0b',
  '#10b981',
  '#f97316',
  '#8b5cf6',
  '#0ea5e9',
];

const createEmptyCollection = () => ({
  version: WORKSPACE_VERSION,
  updatedAt: new Date().toISOString(),
  defaultWorkspaceId: DEFAULT_WORKSPACE_ID,
  workspaces: {},
});

const createWorkspaceSkeleton = ({
  id,
  name,
  owner = '',
  color,
  viewRange = { start: '', end: '' },
  status = 'active',
  source = 'system',
} = {}) => {
  const now = new Date().toISOString();
  const rangeMode =
    viewRange && viewRange.start && viewRange.end ? 'custom' : 'auto';

  const safeName =
    typeof name === 'string' && name.trim()
      ? name.trim()
      : source === 'user'
      ? DEFAULT_NEW_WORKSPACE_TITLE
      : DEFAULT_PROJECT_TITLE;

  return {
    id,
    name: safeName,
    owner,
    status,
    color,
    createdAt: now,
    updatedAt: now,
    lastSyncedAt: now,
    source,
    tasks: [],
    settings: {
      projectTitle: safeName,
      rangeMode,
      viewRange,
    },
  };
};

const createEmptyState = () => ({
  tasks: [],
  settings: {},
});

export const normalizeWorkspaceState = (value) => {
  if (Array.isArray(value)) {
    return {
      tasks: value,
      settings: {},
    };
  }

  if (value && typeof value === 'object') {
    const tasks = Array.isArray(value.tasks) ? value.tasks : [];
    const settings =
      value.settings && typeof value.settings === 'object' ? value.settings : {};

    return {
      tasks,
      settings,
    };
  }

  return createEmptyState();
};

let workspaceCollectionCache = globalThis.__GANTT_WORKSPACE_COLLECTION || null;
globalThis.__GANTT_WORKSPACE_COLLECTION = workspaceCollectionCache;

const ensureRemoteConfigured = () => {
  if (!hasRedis && !hasRemoteKv) {
    throw new Error(
      '[storage] Remote storage is not configured. Please set REDIS_URL or KV_REST_API_URL/KV_REST_API_TOKEN.',
    );
  }
};

const getRedisClient = async () => {
  if (!hasRedis) {
    return null;
  }

  if (!redisClient) {
    redisClient = createClient({
      url: process.env.REDIS_URL,
    });

    redisClient.on('error', (err) => {
      console.error('[storage] Redis client error', err);
    });
  }

  if (!redisClient.isOpen) {
    await redisClient.connect();
  }

  return redisClient;
};

const requestKv = async (command, ...args) => {
  const baseUrl = process.env.KV_REST_API_URL;
  const token = process.env.KV_REST_API_TOKEN;

  if (!baseUrl || !token) {
    throw new Error('KV_REST_API_URL or KV_REST_API_TOKEN is not set');
  }

  const url = [baseUrl.replace(/\/$/, ''), command, ...args.map((arg) => encodeURIComponent(arg))].join('/');
  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error(`KV request failed: ${response.status} ${response.statusText}`);
  }

  return response.json();
};

const readRemoteKey = async (key) => {
  ensureRemoteConfigured();

  let redis = null;
  try {
    redis = await getRedisClient();
  } catch (error) {
    console.warn('[storage] Redis connection failed, skipping Redis read');
    console.error('[storage] Redis connection error details:', {
      message: error?.message,
      stack: error?.stack,
    });
  }

  if (redis) {
    try {
      const value = await redis.get(key);
      if (value) {
        return value;
      }
    } catch (error) {
      console.error('[storage] Unable to read from Redis', {
        message: error?.message,
        stack: error?.stack,
      });
    }
  }

  if (hasRemoteKv) {
    try {
      const result = await requestKv('get', key);
      if (result && typeof result.result === 'string') {
        return result.result;
      }
    } catch (error) {
      console.error('[storage] Unable to read from KV', {
        message: error?.message,
        stack: error?.stack,
      });
    }
  }

  return null;
};

const writeRemoteKey = async (key, value) => {
  ensureRemoteConfigured();

  let persisted = false;
  let redis = null;
  try {
    redis = await getRedisClient();
  } catch (error) {
    console.warn('[storage] Redis connection failed, skipping Redis save');
    console.error('[storage] Redis connection error details:', {
      message: error?.message,
      stack: error?.stack,
    });
  }

  if (redis) {
    try {
      await redis.set(key, value);
      persisted = true;
    } catch (error) {
      console.error('[storage] Failed to write to Redis', {
        message: error?.message,
        stack: error?.stack,
      });
    }
  }

  if (hasRemoteKv) {
    try {
      await requestKv('set', key, value);
      persisted = true;
    } catch (error) {
      console.error('[storage] Failed to write to KV', {
        message: error?.message,
        stack: error?.stack,
      });
    }
  }

  if (!persisted) {
    throw new Error('[storage] Unable to persist workspaces to any configured remote store');
  }
};

const deserializeCollection = (raw) => {
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw);
    if (parsed && typeof parsed === 'object' && parsed.workspaces) {
      return parsed;
    }
    if (parsed && Array.isArray(parsed.tasks)) {
      return {
        version: WORKSPACE_VERSION,
        updatedAt: new Date().toISOString(),
        defaultWorkspaceId: DEFAULT_WORKSPACE_ID,
        workspaces: {
          [DEFAULT_WORKSPACE_ID]: {
            ...createWorkspaceSkeleton({
              id: DEFAULT_WORKSPACE_ID,
              name: parsed.settings?.projectTitle || DEFAULT_PROJECT_TITLE,
            }),
            tasks: parsed.tasks,
            settings: parsed.settings && typeof parsed.settings === 'object'
              ? parsed.settings
              : { projectTitle: DEFAULT_PROJECT_TITLE, rangeMode: 'auto', viewRange: { start: '', end: '' } },
            lastSyncedAt: new Date().toISOString(),
          },
        },
      };
    }
  } catch (error) {
    console.error('[storage] Failed to parse workspace collection', error);
  }
  return null;
};

const hydrateCollection = async () => {
  if (workspaceCollectionCache) {
    return workspaceCollectionCache;
  }

  ensureRemoteConfigured();

  let collection = null;

  // Try current workspace collection key
  const rawCollection = await readRemoteKey(WORKSPACE_COLLECTION_KEY);
  if (rawCollection) {
    collection = deserializeCollection(rawCollection);
  }

  // Attempt to migrate from legacy key if needed
  if (!collection) {
    const legacyRaw = await readRemoteKey(LEGACY_KV_KEY);
    if (legacyRaw) {
      collection = deserializeCollection(legacyRaw);
      if (collection) {
        console.log('[storage] Migrated legacy workspace state into new collection format');
        await writeRemoteKey(WORKSPACE_COLLECTION_KEY, JSON.stringify(collection));
      }
    }
  }

  // Final fallback: seed file
  if (!collection) {
    try {
      const seedRaw = await fs.readFile(LEGACY_SEED_DATA_FILE, 'utf8');
      collection = deserializeCollection(seedRaw);
      if (collection) {
        console.log('[storage] Seeded collection from local tasks.json');
        await writeRemoteKey(WORKSPACE_COLLECTION_KEY, JSON.stringify(collection));
      }
    } catch (error) {
      if (error?.code !== 'ENOENT') {
        console.error('[storage] Failed to read seed file', {
          message: error?.message,
          stack: error?.stack,
        });
      }
    }
  }

  if (!collection) {
    console.warn('[storage] No existing workspaces found, creating empty collection');
    collection = createEmptyCollection();
    collection.workspaces[DEFAULT_WORKSPACE_ID] = createWorkspaceSkeleton({
      id: DEFAULT_WORKSPACE_ID,
      name: DEFAULT_PROJECT_TITLE,
      source: 'generated',
    });
    await writeRemoteKey(WORKSPACE_COLLECTION_KEY, JSON.stringify(collection));
  }

  if (!collection.workspaces[DEFAULT_WORKSPACE_ID]) {
    console.warn('[storage] Default workspace missing, creating placeholder');
    collection.workspaces[DEFAULT_WORKSPACE_ID] = createWorkspaceSkeleton({
      id: DEFAULT_WORKSPACE_ID,
      name: DEFAULT_PROJECT_TITLE,
      source: 'generated',
    });
  }

  workspaceCollectionCache = collection;
  globalThis.__GANTT_WORKSPACE_COLLECTION = workspaceCollectionCache;
  return workspaceCollectionCache;
};

const persistCollection = async (collection) => {
  const payload = JSON.stringify({
    ...collection,
    updatedAt: new Date().toISOString(),
  });
  await writeRemoteKey(WORKSPACE_COLLECTION_KEY, payload);
  workspaceCollectionCache = {
    ...collection,
    updatedAt: new Date().toISOString(),
  };
  globalThis.__GANTT_WORKSPACE_COLLECTION = workspaceCollectionCache;
  return workspaceCollectionCache;
};

const pickWorkspaceColor = (collection) => {
  const existingCount = Object.keys(collection.workspaces || {}).length;
  return workspacePalette[existingCount % workspacePalette.length];
};

export const listWorkspaces = async () => {
  const collection = await hydrateCollection();
  const entries = Object.values(collection.workspaces || {});

  return entries
    .map((workspace) => ({
      id: workspace.id,
      name: workspace.name || workspace.settings?.projectTitle || DEFAULT_PROJECT_TITLE,
      owner: workspace.owner || '',
      status: workspace.status || 'active',
      color: workspace.color || pickWorkspaceColor(collection),
      taskCount: Array.isArray(workspace.tasks) ? workspace.tasks.length : 0,
      range: workspace.settings?.viewRange || { start: '', end: '' },
      rangeMode: workspace.settings?.rangeMode || 'auto',
      updatedAt: workspace.updatedAt || workspace.lastSyncedAt || workspace.createdAt,
      createdAt: workspace.createdAt,
      lastSyncedAt: workspace.lastSyncedAt || workspace.updatedAt,
      projectTitle: workspace.settings?.projectTitle || workspace.name || DEFAULT_PROJECT_TITLE,
    }))
    .sort((a, b) => {
      const dateA = a.updatedAt ? new Date(a.updatedAt).getTime() : 0;
      const dateB = b.updatedAt ? new Date(b.updatedAt).getTime() : 0;
      return dateB - dateA;
    });
};

export const loadWorkspace = async (workspaceId = DEFAULT_WORKSPACE_ID) => {
  const collection = await hydrateCollection();
  const workspace = collection.workspaces[workspaceId];
  if (!workspace) {
    return null;
  }
  return {
    tasks: Array.isArray(workspace.tasks) ? workspace.tasks : [],
    settings: workspace.settings || {},
    meta: {
      id: workspace.id,
      name: workspace.name,
      owner: workspace.owner,
      status: workspace.status,
      color: workspace.color,
      createdAt: workspace.createdAt,
      updatedAt: workspace.updatedAt,
      lastSyncedAt: workspace.lastSyncedAt,
    },
  };
};

export const saveWorkspace = async (workspaceId, stateInput, metaOverride = {}) => {
  if (!workspaceId) {
    throw new Error('[storage] saveWorkspace requires a workspaceId');
  }

  const collection = await hydrateCollection();
  const normalized = normalizeWorkspaceState(stateInput);
  const taskCount = normalized.tasks.length;
  const now = new Date().toISOString();

  let workspace = collection.workspaces[workspaceId];
  if (!workspace) {
    workspace = createWorkspaceSkeleton({
      id: workspaceId,
      name: metaOverride?.name || DEFAULT_PROJECT_TITLE,
      owner: metaOverride?.owner || '',
      color: pickWorkspaceColor(collection),
    });
    collection.workspaces[workspaceId] = workspace;
  }

  workspace.tasks = normalized.tasks;
  workspace.settings = {
    ...workspace.settings,
    ...normalized.settings,
  };

  workspace.updatedAt = now;
  workspace.lastSyncedAt = now;
  workspace.status = metaOverride?.status || workspace.status || 'active';
  workspace.name = metaOverride?.name || workspace.settings?.projectTitle || workspace.name;
  workspace.owner = metaOverride?.owner ?? workspace.owner ?? '';
  workspace.color = metaOverride?.color || workspace.color || pickWorkspaceColor(collection);

  await persistCollection(collection);
  console.log(`[storage] Saved workspace "${workspaceId}" with ${taskCount} tasks`);
  return {
    tasks: workspace.tasks,
    settings: workspace.settings,
  };
};

export const createWorkspace = async ({ name, owner, range } = {}) => {
  const collection = await hydrateCollection();
  const id = `ws_${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`;
  const color = pickWorkspaceColor(collection);
  const viewRange = range && range.start && range.end ? range : { start: '', end: '' };

  collection.workspaces[id] = createWorkspaceSkeleton({
    id,
    name: name || DEFAULT_PROJECT_TITLE,
    owner: owner || '',
    color,
    viewRange,
    status: 'active',
    source: 'user',
  });

  await persistCollection(collection);
  return {
    id,
    name: collection.workspaces[id].name,
    owner: collection.workspaces[id].owner,
    color: collection.workspaces[id].color,
    status: collection.workspaces[id].status,
    range: collection.workspaces[id].settings.viewRange,
    createdAt: collection.workspaces[id].createdAt,
    updatedAt: collection.workspaces[id].updatedAt,
  };
};

export const deleteWorkspace = async (workspaceId) => {
  if (workspaceId === DEFAULT_WORKSPACE_ID) {
    throw new Error('[storage] Default workspace cannot be deleted');
  }

  const collection = await hydrateCollection();
  if (!collection.workspaces[workspaceId]) {
    return false;
  }

  delete collection.workspaces[workspaceId];
  await persistCollection(collection);
  return true;
};

export const loadTasks = async () => {
  const workspace = await loadWorkspace(DEFAULT_WORKSPACE_ID);
  return workspace || createEmptyState();
};

export const saveTasks = async (stateInput) => {
  return saveWorkspace(DEFAULT_WORKSPACE_ID, stateInput);
};
