import express from 'express';
import cors from 'cors';
import { loadTasks, saveTasks } from './storage.js';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors({ origin: true, credentials: false }));
app.use(express.json({ limit: '15mb' }));

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
  const payloadSize = JSON.stringify(payload).length;

  console.log(`[API] PUT /tasks - payload size: ${payloadSize} bytes, task count: ${Array.isArray(payload) ? payload.length : 'N/A'}`);

  if (!Array.isArray(payload)) {
    console.error('[API] PUT /tasks - Invalid payload type:', typeof payload);
    return res.status(400).json({ error: 'Payload must be an array of tasks' });
  }

  // Check for large payloads that might contain base64 images
  if (payloadSize > 10 * 1024 * 1024) {
    console.warn(`[API] PUT /tasks - Large payload detected: ${(payloadSize / 1024 / 1024).toFixed(2)}MB`);
  }

  try {
    await saveTasks(payload);
    console.log(`[API] PUT /tasks - Successfully saved ${payload.length} tasks`);
    res.json({ success: true, count: payload.length });
  } catch (error) {
    console.error('[API] PUT /tasks - Failed to write tasks');
    console.error('[API] Error details:', {
      message: error?.message,
      stack: error?.stack,
      code: error?.code,
      payloadSize,
      taskCount: payload.length
    });
    res.status(500).json({
      error: 'Failed to persist tasks',
      detail: error?.message ?? 'unknown error',
      code: error?.code
    });
  }
});

if (!process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`Gantt Manager API listening on port ${PORT}`);
  });
}

export default app;
