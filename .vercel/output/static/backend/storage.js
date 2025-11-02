import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { createClient } from 'redis';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const SEED_DATA_FILE = path.join(__dirname, 'tasks.json');
const RUNTIME_DATA_FILE = process.env.VERCEL ? path.join('/tmp', 'gantt-tasks.json') : SEED_DATA_FILE;
const hasRemoteKv = Boolean(process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN);
const hasRedis = Boolean(process.env.REDIS_URL);
const KV_KEY = process.env.KV_KEY || 'gantt:tasks';

let redisClient = null;
let inMemoryTasks = globalThis.__GANTT_TASK_CACHE || null;
globalThis.__GANTT_TASK_CACHE = inMemoryTasks;

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

export const loadTasks = async () => {
  console.log('[storage] loadTasks called, in-memory cache exists:', Array.isArray(inMemoryTasks));

  if (Array.isArray(inMemoryTasks)) {
    console.log('[storage] Returning from in-memory cache:', inMemoryTasks.length, 'tasks');
    return inMemoryTasks;
  }

  const redis = await getRedisClient();
  if (redis) {
    try {
      const value = await redis.get(KV_KEY);
      if (value) {
        const parsed = JSON.parse(value);
        if (Array.isArray(parsed)) {
          console.log('[storage] Loaded from Redis:', parsed.length, 'tasks');
          inMemoryTasks = parsed;
          globalThis.__GANTT_TASK_CACHE = inMemoryTasks;
          return parsed;
        }
      }
    } catch (error) {
      console.warn('[storage] unable to read from Redis, falling back to KV/file');
      console.error('[storage] Redis error details:', {
        message: error?.message,
        stack: error?.stack
      });
    }
  }

  if (hasRemoteKv) {
    try {
      const result = await requestKv('get', KV_KEY);
      if (result && typeof result.result === 'string') {
        const parsed = JSON.parse(result.result);
        if (Array.isArray(parsed)) {
          console.log('[storage] Loaded from KV:', parsed.length, 'tasks');
          inMemoryTasks = parsed;
          globalThis.__GANTT_TASK_CACHE = inMemoryTasks;
          return parsed;
        }
      }
    } catch (error) {
      console.warn('[storage] unable to read from KV, falling back to file');
      console.error('[storage] KV error details:', {
        message: error?.message,
        stack: error?.stack
      });
    }
  }

  try {
    let raw;
    try {
      raw = await fs.readFile(RUNTIME_DATA_FILE, 'utf8');
      console.log('[storage] Read runtime file:', RUNTIME_DATA_FILE, 'size:', raw.length, 'bytes');
    } catch (runtimeError) {
      if (runtimeError.code === 'ENOENT') {
        console.log('[storage] Runtime file not found, copying from seed:', SEED_DATA_FILE);
        const seed = await fs.readFile(SEED_DATA_FILE, 'utf8');
        await fs.writeFile(RUNTIME_DATA_FILE, seed, 'utf8');
        raw = seed;
      } else {
        throw runtimeError;
      }
    }

    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      inMemoryTasks = parsed;
      globalThis.__GANTT_TASK_CACHE = inMemoryTasks;
      console.log('[storage] Loaded from file:', parsed.length, 'tasks');
      return parsed;
    }
  } catch (error) {
    if (error.code === 'ENOENT') {
      console.warn('[storage] File not found, creating empty array');
      await fs.writeFile(RUNTIME_DATA_FILE, '[]', 'utf8');
      return [];
    }
    console.error('[storage] failed to read tasks.json');
    console.error('[storage] Error details:', {
      message: error?.message,
      stack: error?.stack,
      code: error?.code
    });
  }

  console.warn('[storage] Returning empty array as fallback');
  return [];
};

export const saveTasks = async (tasks) => {
  const taskCount = Array.isArray(tasks) ? tasks.length : 0;
  const dataSize = JSON.stringify(tasks).length;

  console.log(`[storage] saveTasks called with ${taskCount} tasks, size: ${dataSize} bytes`);

  inMemoryTasks = Array.isArray(tasks) ? tasks : [];
  globalThis.__GANTT_TASK_CACHE = inMemoryTasks;

  const redis = await getRedisClient();
  if (redis) {
    try {
      await redis.set(KV_KEY, JSON.stringify(inMemoryTasks));
      console.log(`[storage] Successfully saved ${taskCount} tasks to Redis`);
      return;
    } catch (error) {
      console.error('[storage] failed to write to Redis, falling back to KV/file');
      console.error('[storage] Redis error details:', {
        message: error?.message,
        stack: error?.stack,
        dataSize
      });
    }
  }

  if (hasRemoteKv) {
    try {
      await requestKv('set', KV_KEY, JSON.stringify(inMemoryTasks));
      console.log(`[storage] Successfully saved ${taskCount} tasks to KV`);
      return;
    } catch (error) {
      console.error('[storage] failed to write to KV, falling back to file');
      console.error('[storage] KV error details:', {
        message: error?.message,
        stack: error?.stack,
        dataSize
      });
    }
  }

  try {
    await fs.writeFile(RUNTIME_DATA_FILE, JSON.stringify(inMemoryTasks, null, 2), 'utf8');
    console.log(`[storage] Successfully saved ${taskCount} tasks to file: ${RUNTIME_DATA_FILE}`);
  } catch (error) {
    console.error('[storage] failed to write tasks to runtime file, keeping in-memory cache');
    console.error('[storage] File write error details:', {
      message: error?.message,
      stack: error?.stack,
      code: error?.code,
      file: RUNTIME_DATA_FILE,
      dataSize
    });
    throw error; // Re-throw to propagate error to API handler
  }
};
