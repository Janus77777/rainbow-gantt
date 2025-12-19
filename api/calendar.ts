import { createClient } from 'redis';
import type { VercelRequest, VercelResponse } from '@vercel/node';

const CALENDAR_KEY_JA = 'gantt-v2:calendar:ja';
const CALENDAR_KEY_JO = 'gantt-v2:calendar:jo';

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
    const person = req.query.person as string;

    // 驗證 person 參數
    if (!person || (person !== 'ja' && person !== 'jo')) {
      return res.status(400).json({ error: 'Invalid person parameter. Must be "ja" or "jo"' });
    }

    const calendarKey = person === 'ja' ? CALENDAR_KEY_JA : CALENDAR_KEY_JO;

    switch (req.method) {
      case 'GET': {
        const data = await db.get(calendarKey);
        const entries = data ? JSON.parse(data) : {};
        return res.status(200).json({ entries });
      }

      case 'PUT': {
        // 完整替換所有日曆條目
        const entries = req.body;
        if (!entries || typeof entries !== 'object') {
          return res.status(400).json({ error: 'Invalid entries data' });
        }

        await db.set(calendarKey, JSON.stringify(entries));
        return res.status(200).json({ entries });
      }

      case 'POST': {
        // 新增或更新單一日期的條目
        const { date, entry } = req.body;
        if (!date || !entry) {
          return res.status(400).json({ error: 'Date and entry are required' });
        }

        const data = await db.get(calendarKey);
        const entries: any = data ? JSON.parse(data) : {};
        entries[date] = entry;
        await db.set(calendarKey, JSON.stringify(entries));
        return res.status(200).json({ entries });
      }

      case 'DELETE': {
        const date = req.query.date as string;
        if (!date) {
          return res.status(400).json({ error: 'Date parameter is required' });
        }

        const data = await db.get(calendarKey);
        const entries: any = data ? JSON.parse(data) : {};
        delete entries[date];
        await db.set(calendarKey, JSON.stringify(entries));
        return res.status(200).json({ entries });
      }

      default:
        return res.status(405).json({ error: 'Method not allowed' });
    }
  } catch (error) {
    console.error('Calendar API error:', error);
    return res.status(500).json({ error: 'Internal server error', details: String(error) });
  }
}
