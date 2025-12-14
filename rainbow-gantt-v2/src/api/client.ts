// API 基礎路徑 - 使用同源 /api
export const getApiBaseUrl = () => {
  // 開發環境使用代理，生產環境使用同源
  if (typeof window !== 'undefined') {
    return window.location.origin;
  }
  return '';
};

// Tasks API
export const tasksApi = {
  async getAll() {
    const res = await fetch(`${getApiBaseUrl()}/api/tasks`);
    if (!res.ok) throw new Error(`Failed to fetch tasks: ${res.status}`);
    const data = await res.json();
    return data.tasks || [];
  },

  async create(task: any) {
    const res = await fetch(`${getApiBaseUrl()}/api/tasks`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(task),
    });
    if (!res.ok) throw new Error(`Failed to create task: ${res.status}`);
    return res.json();
  },

  async update(task: any) {
    const res = await fetch(`${getApiBaseUrl()}/api/tasks`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(task),
    });
    if (!res.ok) throw new Error(`Failed to update task: ${res.status}`);
    return res.json();
  },

  async bulkUpdate(tasks: any[]) {
    const res = await fetch(`${getApiBaseUrl()}/api/tasks`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(tasks),
    });
    if (!res.ok) throw new Error(`Failed to bulk update tasks: ${res.status}`);
    return res.json();
  },

  async delete(id: string) {
    const res = await fetch(`${getApiBaseUrl()}/api/tasks?id=${id}`, {
      method: 'DELETE',
    });
    if (!res.ok) throw new Error(`Failed to delete task: ${res.status}`);
    return res.json();
  },
};

// Notes API
export const notesApi = {
  async getAll() {
    const res = await fetch(`${getApiBaseUrl()}/api/notes`);
    if (!res.ok) throw new Error(`Failed to fetch notes: ${res.status}`);
    const data = await res.json();
    return data.notes || [];
  },

  async create(note: any) {
    const res = await fetch(`${getApiBaseUrl()}/api/notes`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(note),
    });
    if (!res.ok) throw new Error(`Failed to create note: ${res.status}`);
    return res.json();
  },

  async update(note: any) {
    const res = await fetch(`${getApiBaseUrl()}/api/notes`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(note),
    });
    if (!res.ok) throw new Error(`Failed to update note: ${res.status}`);
    return res.json();
  },

  async bulkUpdate(notes: any[]) {
    const res = await fetch(`${getApiBaseUrl()}/api/notes`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(notes),
    });
    if (!res.ok) throw new Error(`Failed to bulk update notes: ${res.status}`);
    return res.json();
  },

  async delete(id: string) {
    const res = await fetch(`${getApiBaseUrl()}/api/notes?id=${id}`, {
      method: 'DELETE',
    });
    if (!res.ok) throw new Error(`Failed to delete note: ${res.status}`);
    return res.json();
  },
};

// Attachments API
export const attachmentsApi = {
  async upload(name: string, type: string, dataUrl: string) {
    const res = await fetch(`${getApiBaseUrl()}/api/attachments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, type, dataUrl }),
    });
    if (!res.ok) throw new Error(`Failed to upload attachment: ${res.status}`);
    return res.json();
  },

  async get(id: string) {
    const res = await fetch(`${getApiBaseUrl()}/api/attachments?id=${id}`);
    if (!res.ok) throw new Error(`Failed to get attachment: ${res.status}`);
    return res.json();
  },

  async delete(id: string) {
    const res = await fetch(`${getApiBaseUrl()}/api/attachments?id=${id}`, {
      method: 'DELETE',
    });
    if (!res.ok) throw new Error(`Failed to delete attachment: ${res.status}`);
    return res.json();
  },
};

// 保留舊的 resolveApiBaseUrl 供向後兼容
export const resolveApiBaseUrl = getApiBaseUrl;
