import { Redis } from '@upstash/redis';
import type { VercelRequest, VercelResponse } from '@vercel/node';

const NOTES_KEY = 'gantt-v2:notes';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

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
    const db = getRedis();

    switch (req.method) {
      case 'GET': {
        const notes = await db.get(NOTES_KEY) || [];
        return res.status(200).json({ notes });
      }

      case 'POST': {
        const newNote = req.body;
        if (!newNote || !newNote.title) {
          return res.status(400).json({ error: 'Note title is required' });
        }

        const notes: any[] = await db.get(NOTES_KEY) || [];
        const noteWithId = {
          ...newNote,
          id: newNote.id || Date.now().toString(),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        notes.push(noteWithId);
        await db.set(NOTES_KEY, notes);
        return res.status(201).json({ note: noteWithId });
      }

      case 'PUT': {
        const { id, ...updates } = req.body;

        if (Array.isArray(req.body)) {
          await db.set(NOTES_KEY, req.body);
          return res.status(200).json({ notes: req.body });
        }

        if (!id) {
          return res.status(400).json({ error: 'Note ID is required' });
        }

        const notes: any[] = await db.get(NOTES_KEY) || [];
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

        await db.set(NOTES_KEY, notes);
        return res.status(200).json({ note: notes[index] });
      }

      case 'DELETE': {
        const noteId = req.query.id as string;
        if (!noteId) {
          return res.status(400).json({ error: 'Note ID is required' });
        }

        const notes: any[] = await db.get(NOTES_KEY) || [];
        const filtered = notes.filter(n => String(n.id) !== String(noteId));

        if (filtered.length === notes.length) {
          return res.status(404).json({ error: 'Note not found' });
        }

        await db.set(NOTES_KEY, filtered);
        return res.status(200).json({ success: true });
      }

      default:
        return res.status(405).json({ error: 'Method not allowed' });
    }
  } catch (error) {
    console.error('Notes API error:', error);
    return res.status(500).json({ error: 'Internal server error', details: String(error) });
  }
}
