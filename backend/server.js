import express from 'express';
import cors from 'cors';
import {
  loadTasks,
  saveTasks,
  normalizeWorkspaceState,
  loadWorkspace,
  saveWorkspace,
  listWorkspaces,
  createWorkspace,
  deleteWorkspace,
  DEFAULT_WORKSPACE_ID,
} from './storage.js';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors({ origin: true, credentials: false }));
app.use(express.json({ limit: '15mb' }));

app.get('/health', (_req, res) => {
  res.json({ status: 'ok', source: 'gantt-manager-api' });
});

app.get('/tasks', async (req, res) => {
  const workspaceId = typeof req.query.workspaceId === 'string' && req.query.workspaceId
    ? req.query.workspaceId
    : DEFAULT_WORKSPACE_ID;

  try {
    const state =
      workspaceId === DEFAULT_WORKSPACE_ID
        ? await loadTasks()
        : await loadWorkspace(workspaceId);

    if (!state) {
      return res.status(404).json({ error: 'Workspace not found' });
    }

    res.json(state);
  } catch (error) {
    console.error('[API] Failed to read tasks', error);
    res.status(500).json({ error: 'Failed to read tasks' });
  }
});

app.put('/tasks', async (req, res) => {
  const workspaceId = typeof req.query.workspaceId === 'string' && req.query.workspaceId
    ? req.query.workspaceId
    : DEFAULT_WORKSPACE_ID;
  const payload = req.body;
  const payloadSize = JSON.stringify(payload).length;

  const normalized = normalizeWorkspaceState(payload);
  const taskCount = normalized.tasks.length;

  console.log(
    `[API] PUT /tasks (workspace=${workspaceId}) - payload size: ${payloadSize} bytes, task count: ${taskCount}`,
  );

  // Check for large payloads that might contain base64 images
  if (payloadSize > 10 * 1024 * 1024) {
    console.warn(
      `[API] PUT /tasks (workspace=${workspaceId}) - Large payload detected: ${(
        payloadSize /
        1024 /
        1024
      ).toFixed(2)}MB`,
    );
  }

  try {
    if (workspaceId === DEFAULT_WORKSPACE_ID) {
      await saveTasks(normalized);
    } else {
      await saveWorkspace(workspaceId, normalized);
    }
    console.log(`[API] PUT /tasks - Successfully saved ${taskCount} tasks (workspace=${workspaceId})`);
    res.json({ success: true, count: taskCount });
  } catch (error) {
    console.error('[API] PUT /tasks - Failed to write tasks');
    console.error('[API] Error details:', {
      message: error?.message,
      stack: error?.stack,
      code: error?.code,
      payloadSize,
      taskCount
    });
    res.status(500).json({
      error: 'Failed to persist tasks',
      detail: error?.message ?? 'unknown error',
      code: error?.code
    });
  }
});

app.get('/workspaces', async (_req, res) => {
  try {
    const summaries = await listWorkspaces();
    res.json({ workspaces: summaries });
  } catch (error) {
    console.error('[API] GET /workspaces - Failed to list workspaces', error);
    res.status(500).json({ error: 'Failed to list workspaces' });
  }
});

app.post('/workspaces', async (req, res) => {
  const { name, owner, range } = req.body || {};
  try {
    const created = await createWorkspace({
      name,
      owner,
      range:
        range && typeof range === 'object'
          ? {
              start: typeof range.start === 'string' ? range.start : '',
              end: typeof range.end === 'string' ? range.end : '',
            }
          : undefined,
    });
    res.status(201).json(created);
  } catch (error) {
    console.error('[API] POST /workspaces - Failed to create workspace', error);
    res.status(500).json({ error: 'Failed to create workspace', detail: error?.message });
  }
});

app.patch('/workspaces/:workspaceId', async (req, res) => {
  const workspaceId = req.params.workspaceId;
  const { status, owner, name } = req.body || {};

  try {
    const current = await loadWorkspace(workspaceId);
    if (!current) {
      return res.status(404).json({ error: 'Workspace not found' });
    }

    const metaOverride = {};
    if (typeof status === 'string' && status.trim()) {
      metaOverride.status = status.trim();
    }
    if (typeof owner === 'string') {
      metaOverride.owner = owner;
    }
    if (typeof name === 'string' && name.trim()) {
      metaOverride.name = name.trim();
    }

    await saveWorkspace(workspaceId, current, metaOverride);
    const summaries = await listWorkspaces();
    const updated = summaries.find((item) => item.id === workspaceId);

    res.json({ workspace: updated || null });
  } catch (error) {
    console.error('[API] PATCH /workspaces - Failed to update workspace', error);
    res.status(500).json({ error: 'Failed to update workspace', detail: error?.message });
  }
});

app.delete('/workspaces/:workspaceId', async (req, res) => {
  const workspaceId = req.params.workspaceId;

  try {
    if (workspaceId === DEFAULT_WORKSPACE_ID) {
      return res.status(400).json({ error: 'Default workspace cannot be deleted' });
    }

    const removed = await deleteWorkspace(workspaceId);
    if (!removed) {
      return res.status(404).json({ error: 'Workspace not found' });
    }

    res.json({ success: true });
  } catch (error) {
    console.error('[API] DELETE /workspaces - Failed to delete workspace', error);
    res.status(500).json({ error: 'Failed to delete workspace', detail: error?.message });
  }
});

if (!process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`Gantt Manager API listening on port ${PORT}`);
  });
}

export default app;
