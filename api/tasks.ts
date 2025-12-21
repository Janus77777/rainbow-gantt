import { Redis } from '@upstash/redis';
import type { VercelRequest, VercelResponse } from '@vercel/node';

const TASKS_KEY = 'gantt-v2:tasks';

// CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

// 延遲初始化 Redis
let redis: Redis | null = null;
function getRedis() {
  if (!redis) {
    redis = new Redis({
      url: process.env.KV_REST_API_URL!,
      token: process.env.KV_REST_API_TOKEN!,
    });
  }
  return redis;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return res.status(200).setHeader('Access-Control-Allow-Origin', '*')
      .setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
      .setHeader('Access-Control-Allow-Headers', 'Content-Type')
      .end();
  }

  // Set CORS headers
  Object.entries(corsHeaders).forEach(([key, value]) => {
    res.setHeader(key, value);
  });

  try {
    const db = getRedis();

    switch (req.method) {
      case 'GET': {
        const tasks = await db.get(TASKS_KEY) || [];
        return res.status(200).json({ tasks });
      }

      case 'POST': {
        const newTask = req.body;
        if (!newTask || !newTask.name) {
          return res.status(400).json({ error: 'Task name is required' });
        }

        const tasks: any[] = await db.get(TASKS_KEY) || [];
        const taskWithId = {
          ...newTask,
          id: newTask.id || Date.now().toString(),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        tasks.push(taskWithId);
        await db.set(TASKS_KEY, tasks);
        return res.status(201).json({ task: taskWithId });
      }

      case 'PUT': {
        const { id, ...updates } = req.body;

        if (!id && Array.isArray(req.body)) {
          await db.set(TASKS_KEY, req.body);
          return res.status(200).json({ tasks: req.body });
        }

        if (!id) {
          return res.status(400).json({ error: 'Task ID is required' });
        }

        const tasks: any[] = await db.get(TASKS_KEY) || [];
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

        await db.set(TASKS_KEY, tasks);
        return res.status(200).json({ task: tasks[index] });
      }

      case 'DELETE': {
        const taskId = req.query.id as string;
        if (!taskId) {
          return res.status(400).json({ error: 'Task ID is required' });
        }

        const tasks: any[] = await db.get(TASKS_KEY) || [];
        const filtered = tasks.filter(t => String(t.id) !== String(taskId));

        if (filtered.length === tasks.length) {
          return res.status(404).json({ error: 'Task not found' });
        }

        await db.set(TASKS_KEY, filtered);
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
      envCheck: {
        hasUrl: !!process.env.KV_REST_API_URL,
        hasToken: !!process.env.KV_REST_API_TOKEN,
      }
    });
  }
}
