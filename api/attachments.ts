import { createClient } from 'redis';
import type { VercelRequest, VercelResponse } from '@vercel/node';

const ATTACHMENT_PREFIX = 'gantt-v2:attachment:';
const ATTACHMENT_INDEX_KEY = 'gantt-v2:attachments-index';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

interface AttachmentMeta {
  id: string;
  name: string;
  type: string;
  size: number;
  createdAt: string;
}

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '10mb',
    },
  },
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
      .setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS')
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
        const attachmentId = req.query.id as string;

        if (!attachmentId) {
          const data = await db.get(ATTACHMENT_INDEX_KEY);
          const index: AttachmentMeta[] = data ? JSON.parse(data) : [];
          return res.status(200).json({ attachments: index });
        }

        const attachmentData = await db.get(`${ATTACHMENT_PREFIX}${attachmentId}`);

        if (!attachmentData) {
          return res.status(404).json({ error: 'Attachment not found' });
        }

        const data: { meta: AttachmentMeta; dataUrl: string } = JSON.parse(attachmentData);
        return res.status(200).json(data);
      }

      case 'POST': {
        const { name, type, dataUrl } = req.body;

        if (!name || !dataUrl) {
          return res.status(400).json({ error: 'Name and dataUrl are required' });
        }

        const base64Length = dataUrl.length - (dataUrl.indexOf(',') + 1);
        const size = Math.floor(base64Length * 0.75);

        if (size > 5 * 1024 * 1024) {
          return res.status(413).json({ error: 'File too large (max 5MB)' });
        }

        const id = `${Date.now()}-${Math.random().toString(36).substring(2, 8)}`;
        const meta: AttachmentMeta = {
          id,
          name,
          type: type || 'application/octet-stream',
          size,
          createdAt: new Date().toISOString(),
        };

        await db.set(`${ATTACHMENT_PREFIX}${id}`, JSON.stringify({ meta, dataUrl }));

        const indexData = await db.get(ATTACHMENT_INDEX_KEY);
        const index: AttachmentMeta[] = indexData ? JSON.parse(indexData) : [];
        index.push(meta);
        await db.set(ATTACHMENT_INDEX_KEY, JSON.stringify(index));

        return res.status(201).json({ attachment: meta, dataUrl });
      }

      case 'DELETE': {
        const attachmentId = req.query.id as string;
        if (!attachmentId) {
          return res.status(400).json({ error: 'Attachment ID is required' });
        }

        await db.del(`${ATTACHMENT_PREFIX}${attachmentId}`);

        const indexData = await db.get(ATTACHMENT_INDEX_KEY);
        const index: AttachmentMeta[] = indexData ? JSON.parse(indexData) : [];
        const filtered = index.filter(a => a.id !== attachmentId);
        await db.set(ATTACHMENT_INDEX_KEY, JSON.stringify(filtered));

        return res.status(200).json({ success: true });
      }

      default:
        return res.status(405).json({ error: 'Method not allowed' });
    }
  } catch (error) {
    console.error('Attachments API error:', error);
    return res.status(500).json({
      error: 'Internal server error',
      details: String(error),
    });
  }
}
