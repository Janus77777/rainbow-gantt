// 临时端点：从 Upstash 读取所有数据
import { Redis } from '@upstash/redis';
import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    const upstash = new Redis({
      url: process.env.KV_REST_API_URL!,
      token: process.env.KV_REST_API_TOKEN!,
    });

    const keys = [
      'gantt-v2:tasks',
      'gantt-v2:notes',
      'gantt-v2:calendar:ja',
      'gantt-v2:calendar:jo',
      'gantt-v2:attachments',
    ];

    const data: Record<string, any> = {};

    for (const key of keys) {
      const value = await upstash.get(key);
      data[key] = value;
    }

    return res.status(200).json({ success: true, data });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: String(error)
    });
  }
}
