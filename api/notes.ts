import { createClient } from 'redis';
import type { VercelRequest, VercelResponse } from '@vercel/node';

const NOTES_KEY = 'gantt-v2:notes';

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
        const data = await db.get(NOTES_KEY);
        const notes = data ? JSON.parse(data) : [];
        return res.status(200).json({ notes });
      }

      case 'POST': {
        const newNote = req.body;
        if (!newNote || !newNote.title) {
          return res.status(400).json({ error: 'Note title is required' });
        }

        const data = await db.get(NOTES_KEY);
        const notes: any[] = data ? JSON.parse(data) : [];
        const noteWithId = {
          ...newNote,
          id: newNote.id || Date.now().toString(),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        notes.push(noteWithId);
        await db.set(NOTES_KEY, JSON.stringify(notes));
        return res.status(201).json({ note: noteWithId });
      }

      case 'PUT': {
        const { id, ...updates } = req.body;

        if (Array.isArray(req.body)) {
          await db.set(NOTES_KEY, JSON.stringify(req.body));
          return res.status(200).json({ notes: req.body });
        }

        if (!id) {
          return res.status(400).json({ error: 'Note ID is required' });
        }

        const data = await db.get(NOTES_KEY);
        const notes: any[] = data ? JSON.parse(data) : [];
        const index = notes.findIndex(n => String(n.id) === String(id));

        if (index === -1) {
          return res.status(404).json({ error: 'Note not found' });
        }

        notes[index] = {
          ...notes[index],
          ...updates,
          id,
          updatedAt: new Date().toISOString(),
        };

        await db.set(NOTES_KEY, JSON.stringify(notes));
        return res.status(200).json({ note: notes[index] });
      }

      case 'DELETE': {
        const noteId = req.query.id as string;
        if (!noteId) {
          return res.status(400).json({ error: 'Note ID is required' });
        }

        const data = await db.get(NOTES_KEY);
        const notes: any[] = data ? JSON.parse(data) : [];
        const filtered = notes.filter(n => String(n.id) !== String(noteId));

        if (filtered.length === notes.length) {
          return res.status(404).json({ error: 'Note not found' });
        }

        await db.set(NOTES_KEY, JSON.stringify(filtered));
        return res.status(200).json({ success: true });
      }

      default:
        return res.status(405).json({ error: 'Method not allowed' });
    }
  } catch (error) {
    console.error('Notes API error:', error);
    return res.status(500).json({
      error: 'Internal server error',
      details: String(error),
    });
  }
}
