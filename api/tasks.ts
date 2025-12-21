import { createClient } from 'redis';
import type { VercelRequest, VercelResponse } from '@vercel/node';

const TASKS_KEY = 'gantt-v2:tasks';

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
    return res.status(200).setHeader('Access-Control-Allow-Origin', '*')
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
        const data = await db.get(TASKS_KEY);
        const tasks = data ? JSON.parse(data) : [];
        return res.status(200).json({ tasks });
      }

      case 'POST': {
        const newTask = req.body;
        if (!newTask || !newTask.name) {
          return res.status(400).json({ error: 'Task name is required' });
        }

        const data = await db.get(TASKS_KEY);
        const tasks: any[] = data ? JSON.parse(data) : [];
        const taskWithId = {
          ...newTask,
          id: newTask.id || Date.now().toString(),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        tasks.push(taskWithId);
        await db.set(TASKS_KEY, JSON.stringify(tasks));
        return res.status(201).json({ task: taskWithId });
      }

      case 'PUT': {
        const { id, ...updates } = req.body;

        if (!id && Array.isArray(req.body)) {
          await db.set(TASKS_KEY, JSON.stringify(req.body));
          return res.status(200).json({ tasks: req.body });
        }

        if (!id) {
          return res.status(400).json({ error: 'Task ID is required' });
        }

        const data = await db.get(TASKS_KEY);
        const tasks: any[] = data ? JSON.parse(data) : [];
        const index = tasks.findIndex(t => String(t.id) === String(id));

        if (index === -1) {
          return res.status(404).json({ error: 'Task not found' });
        }

        tasks[index] = {
          ...tasks[index],
          ...updates,
          id,
          updatedAt: new Date().toISOString(),
        };

        await db.set(TASKS_KEY, JSON.stringify(tasks));
        return res.status(200).json({ task: tasks[index] });
      }

      case 'DELETE': {
        const taskId = req.query.id as string;
        if (!taskId) {
          return res.status(400).json({ error: 'Task ID is required' });
        }

        const data = await db.get(TASKS_KEY);
        const tasks: any[] = data ? JSON.parse(data) : [];
        const filtered = tasks.filter(t => String(t.id) !== String(taskId));

        if (filtered.length === tasks.length) {
          return res.status(404).json({ error: 'Task not found' });
        }

        await db.set(TASKS_KEY, JSON.stringify(filtered));
        return res.status(200).json({ success: true });
      }

      default:
        return res.status(405).json({ error: 'Method not allowed' });
    }
  } catch (error) {
    console.error('Tasks API error:', error);
    return res.status(500).json({
      error: 'Internal server error',
      details: String(error),
    });
  }
}
