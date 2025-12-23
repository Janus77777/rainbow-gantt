import { createClient } from 'redis';
import type { VercelRequest, VercelResponse } from '@vercel/node';

const PEOPLE_KEY = 'gantt-v2:people';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

let redisClient: any = null;

async function getRedis() {
  if (!redisClient) {
    redisClient = createClient({
      url: process.env.REDIS_URL,
    });

    redisClient.on('error', (err: any) => console.error('Redis Client Error', err));

    if (!redisClient.isOpen) {
      await redisClient.connect();
    }
  }
  return redisClient;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method === 'OPTIONS') {
    return res.status(200)
      .setHeader('Access-Control-Allow-Origin', '*')
      .setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
      .setHeader('Access-Control-Allow-Headers', 'Content-Type')
      .end();
  }

  Object.entries(corsHeaders).forEach(([key, value]) => {
    res.setHeader(key, value);
  });

  try {
    const db = await getRedis();

    switch (req.method) {
      case 'GET': {
        // 獲取人員列表
        const data = await db.get(PEOPLE_KEY);
        const people = data ? JSON.parse(data) : ['Janus', 'Joseph Chang'];
        return res.status(200).json({ people });
      }

      case 'PUT': {
        // 完整替換人員列表
        const { people } = req.body;
        if (!Array.isArray(people)) {
          return res.status(400).json({ error: 'People must be an array' });
        }

        await db.set(PEOPLE_KEY, JSON.stringify(people));
        return res.status(200).json({ people });
      }

      case 'POST': {
        // 新增單一人員
        const { name } = req.body;
        if (!name || typeof name !== 'string') {
          return res.status(400).json({ error: 'Name is required' });
        }

        const data = await db.get(PEOPLE_KEY);
        const people: string[] = data ? JSON.parse(data) : [];

        if (people.includes(name)) {
          return res.status(400).json({ error: 'Person already exists' });
        }

        people.push(name);
        await db.set(PEOPLE_KEY, JSON.stringify(people));
        return res.status(200).json({ people });
      }

      case 'DELETE': {
        // 刪除單一人員
        const { name } = req.query;
        if (!name || typeof name !== 'string') {
          return res.status(400).json({ error: 'Name parameter is required' });
        }

        const data = await db.get(PEOPLE_KEY);
        const people: string[] = data ? JSON.parse(data) : [];
        const filtered = people.filter(p => p !== name);

        if (filtered.length === people.length) {
          return res.status(404).json({ error: 'Person not found' });
        }

        await db.set(PEOPLE_KEY, JSON.stringify(filtered));
        return res.status(200).json({ people: filtered });
      }

      default:
        return res.status(405).json({ error: 'Method not allowed' });
    }
  } catch (error) {
    console.error('People API error:', error);
    return res.status(500).json({
      error: 'Internal server error',
      details: String(error),
    });
  }
}
