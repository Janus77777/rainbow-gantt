import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { createClient } from 'redis';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_FILE = path.join(__dirname, 'tasks.json');
const hasRemoteKv = Boolean(process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN);
const hasRedis = Boolean(process.env.REDIS_URL);
const KV_KEY = process.env.KV_KEY || 'gantt:tasks';

let redisClient = null;

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
  const redis = await getRedisClient();
  if (redis) {
    try {
      const value = await redis.get(KV_KEY);
      if (value) {
        const parsed = JSON.parse(value);
        if (Array.isArray(parsed)) {
          return parsed;
        }
      }
    } catch (error) {
      console.warn('[storage] unable to read from Redis, falling back to KV/file', error);
    }
  }

  if (hasRemoteKv) {
    try {
      const result = await requestKv('get', KV_KEY);
      if (result && typeof result.result === 'string') {
        const parsed = JSON.parse(result.result);
        if (Array.isArray(parsed)) {
          return parsed;
        }
      }
    } catch (error) {
      console.warn('[storage] unable to read from KV, falling back to file', error);
    }
  }

  try {
    const raw = await fs.readFile(DATA_FILE, 'utf8');
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      return parsed;
    }
  } catch (error) {
    if (error.code === 'ENOENT') {
      await fs.writeFile(DATA_FILE, '[]', 'utf8');
      return [];
    }
    console.error('[storage] failed to read tasks.json', error);
  }

  return [];
};

export const saveTasks = async (tasks) => {
  const redis = await getRedisClient();
  if (redis) {
    try {
      await redis.set(KV_KEY, JSON.stringify(tasks));
      return;
    } catch (error) {
      console.error('[storage] failed to write to Redis, falling back to KV/file', error);
    }
  }

  if (hasRemoteKv) {
    try {
      await requestKv('set', KV_KEY, JSON.stringify(tasks));
      return;
    } catch (error) {
      console.error('[storage] failed to write to KV, falling back to file', error);
    }
  }

  await fs.writeFile(DATA_FILE, JSON.stringify(tasks, null, 2), 'utf8');
};
