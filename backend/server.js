import express from 'express';
import cors from 'cors';
import { loadTasks, saveTasks } from './storage.js';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors({ origin: true, credentials: false }));
app.use(express.json({ limit: '1mb' }));

app.get('/health', (_req, res) => {
  res.json({ status: 'ok', source: 'gantt-manager-api' });
});

app.get('/tasks', async (_req, res) => {
  try {
    const tasks = await loadTasks();
    res.json(tasks);
  } catch (error) {
    console.error('[API] Failed to read tasks', error);
    res.status(500).json({ error: 'Failed to read tasks' });
  }
});

app.put('/tasks', async (req, res) => {
  const payload = req.body;

  if (!Array.isArray(payload)) {
    return res.status(400).json({ error: 'Payload must be an array of tasks' });
  }

  try {
    await saveTasks(payload);
    res.json({ success: true, count: payload.length });
  } catch (error) {
    console.error('[API] Failed to write tasks', error);
    res.status(500).json({ error: 'Failed to persist tasks', detail: error?.message ?? 'unknown error' });
  }
});

if (!process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`Gantt Manager API listening on port ${PORT}`);
  });
}

export default app;
