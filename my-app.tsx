import React, { useState, useEffect, useMemo, useCallback, useRef, useLayoutEffect } from 'react';
import {
  FileText,
  Edit2,
  Trash2,
  Plus,
  Link as LinkIcon,
  Image,
  File,
  ExternalLink,
  Paperclip,
  X,
  Calendar,
  Users,
  LayoutGrid,
  RefreshCw,
  Loader2,
  Eye,
} from 'lucide-react';

const catAvatar =
  'data:image/jpeg;base64,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';

const DEFAULT_VIEW_RANGE = {
  start: '2025-09-01',
  end: '2025-11-30',
} as const;

const DEFAULT_PROJECT_TITLE = '入職三個月目標';
const DEFAULT_WORKSPACE_ID = 'default';

const buildWorkspaceUrl = (workspaceId: string, extraQuery: Record<string, string | undefined> = {}) => {
  const searchParams = new URLSearchParams();
  searchParams.set('workspace', workspaceId);
  Object.entries(extraQuery).forEach(([key, value]) => {
    if (typeof value === 'string' && value.length > 0) {
      searchParams.set(key, value);
    }
  });

  return `/?${searchParams.toString()}`;
};

const computeDefaultApiBase = () => {
  if (typeof window === 'undefined') {
    return '';
  }

  const host = window.location.hostname;
  if (host === 'localhost' || host === '127.0.0.1') {
    return 'http://localhost:3001';
  }

  if (host.endsWith('.vercel.app')) {
    return 'https://backend-janus-projects-f12c2f60.vercel.app';
  }

  return '';
};

const resolveApiBaseUrl = () => {
  const rawEnv = import.meta.env;
  const envValue =
    rawEnv && typeof rawEnv.VITE_API_BASE_URL === 'string' ? rawEnv.VITE_API_BASE_URL.trim() : '';
  const fallback = computeDefaultApiBase();
  return (envValue || fallback || '').replace(/\/$/, '');
};

const bootstrapEntryOverride = () => {
  if (typeof window === 'undefined') {
    return null;
  }
  const current = {
    pathname: window.location.pathname || '/',
    search: window.location.search || '',
  };
  if (current.pathname.startsWith('/management')) {
    (window as any).__GANTT_ENTRY_OVERRIDE = current;
    const newUrl = current.search ? `/${current.search}` : '/';
    window.history.replaceState(window.history.state, '', newUrl);
    return current;
  }
  (window as any).__GANTT_ENTRY_OVERRIDE = null;
  return null;
};

const ENTRY_OVERRIDE = bootstrapEntryOverride();

const formatDateRangeLabel = (range?: { start?: string; end?: string }) => {
  if (!range) return '未設定';
  const start = range.start || '';
  const end = range.end || '';
  if (!start && !end) return '未設定';
  if (!start || !end) {
    return `${start || end}`;
  }
  return `${start} - ${end}`;
};

const formatUpdatedAtLabel = (value?: string) => {
  if (!value) return '—';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '—';
  return date.toLocaleString('en-US', {
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
};

const cloneTasks = (tasks) =>
  (Array.isArray(tasks) ? tasks : []).map((task) => ({
    ...task,
    materials: Array.isArray(task.materials)
      ? task.materials.map((material) => (material ? { ...material } : material))
      : [],
  }));

const sanitizeTasksForSync = (tasks) => cloneTasks(tasks);

function parseDate(dateString) {
  if (!dateString) return null;
  return new Date(`${dateString}T00:00:00Z`);
}

function normalizeRange(range, fallback = DEFAULT_VIEW_RANGE) {
  const fallbackRange = fallback || DEFAULT_VIEW_RANGE;
  const hasStart = range && typeof range.start === 'string';
  const hasEnd = range && typeof range.end === 'string';
  const rawStart = hasStart ? range.start : fallbackRange.start;
  const rawEnd = hasEnd ? range.end : fallbackRange.end;

  const startDate = parseDate(rawStart);
  const endDate = parseDate(rawEnd);

  if (startDate && endDate) {
    if (endDate.getTime() < startDate.getTime()) {
      return { start: rawEnd, end: rawStart };
    }
    return { start: rawStart, end: rawEnd };
  }

  return { start: fallbackRange.start, end: fallbackRange.end };
}

const toInputDate = (date) => {
  if (!date) return '';
  const tzOffset = date.getTimezoneOffset() * 60000;
  return new Date(date.getTime() - tzOffset).toISOString().slice(0, 10);
};

function computeRangeFromTasks(taskList) {
  const list = Array.isArray(taskList) ? taskList : [];
  const startDates = list
    .map((task) => parseDate(task && task.startDate))
    .filter((date) => date instanceof Date && !Number.isNaN(date.getTime()));
  const endDates = list
    .map((task) => parseDate(task && task.endDate))
    .filter((date) => date instanceof Date && !Number.isNaN(date.getTime()));

  if (!startDates.length || !endDates.length) {
    return { ...DEFAULT_VIEW_RANGE };
  }

  const minStart = new Date(Math.min(...startDates.map((date) => date.getTime())));
  const maxEnd = new Date(Math.max(...endDates.map((date) => date.getTime())));

  return {
    start: toInputDate(minStart),
    end: toInputDate(maxEnd),
  };
}

type GanttWorkspaceAppProps = {
  workspaceId: string;
  embedMode: boolean;
  apiBaseUrl: string;
  onContextRefresh?: (nextWorkspaceId?: string) => void;
  onOpenManager?: () => void;
};

const GanttWorkspaceApp: React.FC<GanttWorkspaceAppProps> = ({
  workspaceId,
  embedMode,
  apiBaseUrl,
  onContextRefresh,
  onOpenManager,
}) => {
  const appRef = useRef(null);
  const API_BASE_URL = apiBaseUrl;
  const [apiAvailable, setApiAvailable] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncError, setSyncError] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [editingTask, setEditingTask] = useState(null);
  const tasksRef = useRef([]);
  const autoRangeRef = useRef({ ...DEFAULT_VIEW_RANGE });
  const projectTitleRef = useRef(DEFAULT_PROJECT_TITLE);
  const [persistedRangeMode, setPersistedRangeMode] = useState<'auto' | 'custom'>('auto');
  const [persistedViewRange, setPersistedViewRange] = useState(() => ({ ...DEFAULT_VIEW_RANGE }));
  const [workspaceMeta, setWorkspaceMeta] = useState<{
    id: string;
    name?: string;
    owner?: string;
    color?: string;
    updatedAt?: string;
  } | null>(null);
  const defaultCategoryOptions = useMemo(
    () => ['AI賦能', '流程優化', '產品行銷', '品牌行銷', '客戶開發', '學習與成長'],
    []
  );
  const [categoryOptions, setCategoryOptions] = useState(defaultCategoryOptions);
  const [newCategoryDraft, setNewCategoryDraft] = useState('');
  useEffect(() => {
    tasksRef.current = tasks;
  }, [tasks]);

  useEffect(() => {
    if (!editingTask) {
      setNewCategoryDraft('');
    }
  }, [editingTask]);

  useEffect(() => {
    setCategoryOptions((prev) => {
      const merged: string[] = [];
      const seen = new Set<string>();

      defaultCategoryOptions.forEach((option) => {
        if (!seen.has(option)) {
          seen.add(option);
          merged.push(option);
        }
      });

      prev.forEach((option) => {
        if (option && !seen.has(option)) {
          seen.add(option);
          merged.push(option);
        }
      });

      tasks.forEach((task) => {
        const option = task?.category;
        if (option && !seen.has(option)) {
          seen.add(option);
          merged.push(option);
        }
      });

      if (merged.length === prev.length && merged.every((option, index) => option === prev[index])) {
        return prev;
      }

      return merged;
    });
  }, [tasks, defaultCategoryOptions]);

  const sanitizeSettingsForSync = useCallback(
    (override = {}, tasksCandidate = null) => {
      const hasOverride = override && typeof override === 'object';
      const overrideMode = hasOverride ? override.rangeMode : undefined;
      const requestedMode =
        overrideMode === 'custom' || overrideMode === 'auto'
          ? overrideMode
          : persistedRangeMode;

      const candidateExecutionTasks = Array.isArray(tasksCandidate)
        ? tasksCandidate.filter((task) => task && task.category !== '學習與成長')
        : null;
      const autoRangeSource = candidateExecutionTasks
        ? computeRangeFromTasks(candidateExecutionTasks)
        : autoRangeRef.current;

      const rangeSource =
        hasOverride && override.viewRange != null
          ? override.viewRange
          : requestedMode === 'custom'
          ? persistedViewRange
          : autoRangeSource;

      const normalizedRange = normalizeRange(rangeSource);

      const rawTitle =
        hasOverride && typeof override.projectTitle === 'string'
          ? override.projectTitle
          : projectTitleRef.current;
      const safeTitle = rawTitle && rawTitle.trim() ? rawTitle.trim() : DEFAULT_PROJECT_TITLE;

      return {
        projectTitle: safeTitle,
        rangeMode: requestedMode,
        viewRange: normalizedRange,
      };
    },
    [persistedRangeMode, persistedViewRange, normalizeRange, computeRangeFromTasks]
  );

  const applyRemoteState = useCallback(
    (raw) => {
      let normalized;
      let meta = null;

      if (Array.isArray(raw)) {
        normalized = {
          tasks: raw,
          settings: sanitizeSettingsForSync({ rangeMode: 'auto' }, raw),
        };
      } else if (raw && typeof raw === 'object') {
        const remoteTasks = Array.isArray(raw.tasks) ? raw.tasks : [];
        const remoteSettings = raw.settings && typeof raw.settings === 'object' ? raw.settings : {};
        const remoteMode = remoteSettings.rangeMode === 'custom' ? 'custom' : 'auto';
        const remoteTitle =
          typeof remoteSettings.projectTitle === 'string' && remoteSettings.projectTitle.trim()
            ? remoteSettings.projectTitle.trim()
            : DEFAULT_PROJECT_TITLE;
        const normalizedRange = normalizeRange(remoteSettings.viewRange);

        normalized = {
          tasks: remoteTasks,
          settings: {
            projectTitle: remoteTitle,
            rangeMode: remoteMode,
            viewRange: normalizedRange,
          },
        };
        if (raw.meta && typeof raw.meta === 'object') {
          meta = {
            id: String(raw.meta.id || workspaceId),
            name: typeof raw.meta.name === 'string' ? raw.meta.name : undefined,
            owner: typeof raw.meta.owner === 'string' ? raw.meta.owner : undefined,
            color: typeof raw.meta.color === 'string' ? raw.meta.color : undefined,
            updatedAt: typeof raw.meta.updatedAt === 'string' ? raw.meta.updatedAt : undefined,
          };
        }
      } else {
        normalized = {
          tasks: [],
          settings: sanitizeSettingsForSync({ rangeMode: 'auto' }, []),
        };
      }

      setTasks(normalized.tasks);
      setProjectTitle(normalized.settings.projectTitle);
      setProjectTitleDraft(normalized.settings.projectTitle);
      setPersistedRangeMode(normalized.settings.rangeMode);
      setRangeMode(normalized.settings.rangeMode);
      setPersistedViewRange((prev) =>
        prev.start === normalized.settings.viewRange.start && prev.end === normalized.settings.viewRange.end
          ? prev
          : normalized.settings.viewRange
      );
      if (normalized.settings.rangeMode === 'custom') {
        setViewRange((prev) =>
          prev.start === normalized.settings.viewRange.start && prev.end === normalized.settings.viewRange.end
            ? prev
            : normalized.settings.viewRange
        );
      }

      setWorkspaceMeta(
        meta || {
          id: workspaceId,
          name: normalized.settings.projectTitle,
        }
      );

      return normalized;
    },
    [sanitizeSettingsForSync, normalizeRange, workspaceId]
  );

  useEffect(() => {
    let cancelled = false;

    const fetchWorkspace = async () => {
      if (!API_BASE_URL) {
        return;
      }

      try {
        const response = await fetch(
          `${API_BASE_URL}/tasks?workspaceId=${encodeURIComponent(workspaceId)}`,
          { cache: 'no-store' }
        );
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }
        const data = await response.json();
        if (!cancelled) {
          applyRemoteState(data);
          setApiAvailable(true);
          setSyncError(null);

          if (typeof window !== 'undefined' && !embedMode) {
            const params = new URLSearchParams(window.location.search);
            if (params.get('workspace') !== workspaceId) {
              params.set('workspace', workspaceId);
              const nextUrl = `${window.location.pathname}?${params.toString()}`;
              window.history.replaceState(
                { workspaceId },
                '',
                nextUrl
              );
              window.dispatchEvent(new Event('gantt:context-change'));
              onContextRefresh && onContextRefresh(workspaceId);
            }
          }
        }
      } catch (error) {
        console.warn('Failed to load workspace from API', error);
        if (!cancelled) {
          setApiAvailable(false);
          setSyncError('無法從雲端載入任務');
        }
      }
    };

    fetchWorkspace();

    return () => {
      cancelled = true;
    };
  }, [API_BASE_URL, applyRemoteState, workspaceId, embedMode, onContextRefresh]);

  const persistWorkspace = useCallback(
    async (nextTasks, overrideSettings = {}) => {
      if (!API_BASE_URL) {
        const error = new Error('未設定雲端同步端點');
        setSyncError(error.message);
        throw error;
      }

      const tasksPayload = sanitizeTasksForSync(nextTasks);
      const settingsPayload = sanitizeSettingsForSync(overrideSettings, tasksPayload);
      const payload = { tasks: tasksPayload, settings: settingsPayload };
      const payloadSize = JSON.stringify(payload).length;

      console.log(
        `[Frontend] Syncing ${tasksPayload.length} tasks + settings, payload size: ${payloadSize} bytes`
      );

      setIsSyncing(true);
      setSyncError(null);

      try {
        const response = await fetch(
          `${API_BASE_URL}/tasks?workspaceId=${encodeURIComponent(workspaceId)}`,
          {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
          }
        );

        if (!response.ok) {
          let errorDetail = `HTTP ${response.status}`;
          try {
            const errorBody = await response.json();
            errorDetail = errorBody.error || errorBody.detail || errorDetail;
            console.error('[Frontend] API error response:', errorBody);
          } catch (parseError) {
            console.warn('[Frontend] Could not parse error response');
          }
          throw new Error(errorDetail);
        }

        let latestData = payload;
        try {
          const latestResponse = await fetch(
            `${API_BASE_URL}/tasks?workspaceId=${encodeURIComponent(workspaceId)}`,
            { cache: 'no-store' }
          );
          if (latestResponse.ok) {
            latestData = await latestResponse.json();
          }
        } catch (refreshError) {
          console.warn('Failed to refresh workspace after sync', refreshError);
        }

        applyRemoteState(latestData);
        setApiAvailable(true);
        console.log('[Frontend] Sync successful');
        return latestData;
      } catch (error) {
        console.error('[Frontend] Failed to sync workspace');
        console.error('[Frontend] Error details:', {
          message: error && error.message,
          stack: error && error.stack,
          payloadSize,
          taskCount: tasksPayload.length,
        });

        const errorMessage = error && error.message ? error.message : '未知錯誤';
        setSyncError(errorMessage);
        setApiAvailable(false);

        setTimeout(() => setSyncError(null), 10000);
        throw error;
      } finally {
        setIsSyncing(false);
      }
    },
    [API_BASE_URL, sanitizeSettingsForSync, applyRemoteState, workspaceId]
  );

  const updateTasks = useCallback(
    (updater) => {
      const previousSnapshot = cloneTasks(tasksRef.current);
      const candidate = typeof updater === 'function' ? updater(tasksRef.current) : updater;
      const nextTasksArray = Array.isArray(candidate) ? candidate : [];

      setTasks(nextTasksArray);

      return persistWorkspace(nextTasksArray)
        .catch((error) => {
          console.error('[Frontend] Sync failed, reverting local changes', error);
          setTasks(previousSnapshot);
          return null;
        });
    },
    [persistWorkspace]
  );

  const [activeImage, setActiveImage] = useState(null);
  const [newMaterial, setNewMaterial] = useState({ type: 'link', name: '', url: '', note: '', dataUrl: '' });
  const [projectTitle, setProjectTitle] = useState(DEFAULT_PROJECT_TITLE);
  const [projectTitleDraft, setProjectTitleDraft] = useState(DEFAULT_PROJECT_TITLE);
  const [isTitleEditing, setIsTitleEditing] = useState(false);
  const [containerWidth, setContainerWidth] = useState(1024);
  const timelineViewportRef = useRef<HTMLDivElement | null>(null);
  const [draggedTaskId, setDraggedTaskId] = useState(null);
  const [dragOverTaskId, setDragOverTaskId] = useState(null);
  const [isPanningImage, setIsPanningImage] = useState(false);
  const [activePointerType, setActivePointerType] = useState<string | null>(null);
  const imageViewerRef = useRef<HTMLDivElement | null>(null);
  const timelineScrollRef = useRef<HTMLDivElement | null>(null);
  const topScrollTrackRef = useRef<HTMLDivElement | null>(null);
  const thumbDragState = useRef<{
    pointerId: number | null;
    startX: number;
    startThumbLeft: number;
    maxThumbLeft: number;
    maxScrollLeft: number;
  }>({
    pointerId: null,
    startX: 0,
    startThumbLeft: 0,
    maxThumbLeft: 0,
    maxScrollLeft: 0,
  });
  const [scrollIndicator, setScrollIndicator] = useState({
    left: false,
    right: false,
    thumbWidthRatio: 1,
    thumbLeftRatio: 0,
    isOverflow: false,
  });
  const panStateRef = useRef({
    isDragging: false,
    startX: 0,
    startY: 0,
    scrollLeft: 0,
    scrollTop: 0,
    pointerId: null as number | null,
    pointerType: null as string | null,
  });

  useEffect(() => {
    if (typeof document === 'undefined') {
      return;
    }
    const titleBase = workspaceMeta?.name || projectTitle;
    document.title = embedMode ? titleBase : `${titleBase} | 繽紛甘特圖管理`;
  }, [workspaceMeta, projectTitle, embedMode]);

  const showNavigation = !embedMode;
  const workspaceDisplayName = workspaceMeta?.name || projectTitle;
  const workspaceOwner = workspaceMeta?.owner || '';
  const workspaceColor = workspaceMeta?.color || '#6366f1';

  useLayoutEffect(() => {
    const updateWidth = () => {
      const target = timelineViewportRef.current;
      if (target) {
        setContainerWidth(target.clientWidth);
      } else if (typeof window !== 'undefined') {
        setContainerWidth(window.innerWidth);
      }
    };

    updateWidth();

    let observer: ResizeObserver | null = null;

    if (typeof ResizeObserver !== 'undefined') {
      observer = new ResizeObserver(() => updateWidth());
      if (timelineViewportRef.current) {
        observer.observe(timelineViewportRef.current);
      }
    }

    if (typeof window !== 'undefined') {
      window.addEventListener('resize', updateWidth);
    }

    return () => {
      if (observer) {
        observer.disconnect();
      }
      if (typeof window !== 'undefined') {
        window.removeEventListener('resize', updateWidth);
      }
    };
  }, []);

  useEffect(() => {
    projectTitleRef.current = projectTitle;
    setProjectTitleDraft(projectTitle);
  }, [projectTitle]);

  useEffect(() => {
    if (typeof document === 'undefined') return undefined;
    if (!activeImage) return undefined;

    const originalOverflow = document.body.style.overflow;
    const originalPaddingRight = document.body.style.paddingRight;
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;

    document.body.style.overflow = 'hidden';
    if (scrollbarWidth > 0) {
      document.body.style.paddingRight = `${scrollbarWidth}px`;
    }

    return () => {
      document.body.style.overflow = originalOverflow;
      document.body.style.paddingRight = originalPaddingRight;
    };
  }, [activeImage]);

  useEffect(() => {
    if (!activeImage || !imageViewerRef.current) return;
    imageViewerRef.current.scrollTo({ top: 0, left: 0 });
  }, [activeImage]);

  const viewerCursorClass =
    activePointerType === 'mouse'
      ? isPanningImage
        ? 'cursor-grabbing'
        : 'cursor-grab'
      : 'cursor-auto';

  const handleViewerPointerDown = useCallback((event: React.PointerEvent<HTMLDivElement>) => {
    if (!imageViewerRef.current) return;

    setActivePointerType(event.pointerType);

    if (event.pointerType === 'mouse' && event.button === 0) {
      event.preventDefault();
      imageViewerRef.current.setPointerCapture(event.pointerId);
      panStateRef.current = {
        isDragging: true,
        startX: event.clientX,
        startY: event.clientY,
        scrollLeft: imageViewerRef.current.scrollLeft,
        scrollTop: imageViewerRef.current.scrollTop,
        pointerId: event.pointerId,
        pointerType: event.pointerType,
      };
      setIsPanningImage(true);
    } else {
      panStateRef.current = {
        ...panStateRef.current,
        pointerType: event.pointerType,
        pointerId: event.pointerId,
      };
      setIsPanningImage(false);
    }
  }, []);

  const handleViewerPointerMove = useCallback((event: React.PointerEvent<HTMLDivElement>) => {
    const state = panStateRef.current;
    if (
      !state.isDragging ||
      state.pointerId !== event.pointerId ||
      !imageViewerRef.current
    ) {
      return;
    }

    event.preventDefault();
    const dx = event.clientX - state.startX;
    const dy = event.clientY - state.startY;
    imageViewerRef.current.scrollLeft = state.scrollLeft - dx;
    imageViewerRef.current.scrollTop = state.scrollTop - dy;
  }, []);

  const endPointerPan = useCallback((pointerId: number | null) => {
    if (!panStateRef.current.isDragging) return;
    if (pointerId !== null && panStateRef.current.pointerId !== pointerId) return;
    panStateRef.current.isDragging = false;
    panStateRef.current.pointerId = null;
    setIsPanningImage(false);
  }, []);

  const handleViewerPointerUp = useCallback((event: React.PointerEvent<HTMLDivElement>) => {
    if (imageViewerRef.current && imageViewerRef.current.hasPointerCapture(event.pointerId)) {
      imageViewerRef.current.releasePointerCapture(event.pointerId);
    }
    endPointerPan(event.pointerId);
    setActivePointerType(null);
  }, [endPointerPan]);

  const handleViewerPointerCancel = useCallback((event: React.PointerEvent<HTMLDivElement>) => {
    if (imageViewerRef.current && imageViewerRef.current.hasPointerCapture(event.pointerId)) {
      imageViewerRef.current.releasePointerCapture(event.pointerId);
    }
    endPointerPan(event.pointerId);
    setActivePointerType(null);
  }, [endPointerPan]);

  const handleViewerWheel = useCallback((event: React.WheelEvent<HTMLDivElement>) => {
    if (!imageViewerRef.current) return;
    if (event.ctrlKey) {
      return; // allow native pinch-zoom gestures
    }
    event.preventDefault();
    event.stopPropagation();
    imageViewerRef.current.scrollTop += event.deltaY;
    imageViewerRef.current.scrollLeft += event.deltaX;
  }, []);

  const msPerDay = 1000 * 60 * 60 * 24;
  const isEditingLearning = editingTask && editingTask.category === '學習與成長';

  const executionTasks = useMemo(
    () => tasks.filter((t) => t.category !== '學習與成長'),
    [tasks]
  );

  const learningTasks = useMemo(
    () => tasks.filter((t) => t.category === '學習與成長'),
    [tasks]
  );

  const dashboardTasks = executionTasks;

  const baseCategoryColors = useMemo(
    () => ({
      AI賦能: '#a855f7',
      流程優化: '#3b82f6',
      產品行銷: '#22c55e',
      品牌行銷: '#eab308',
      客戶開發: '#ef4444',
      學習與成長: '#6366f1',
    }),
    []
  );

  const categoryColorMap = useMemo(() => {
    const palette = [
      '#0ea5e9',
      '#f97316',
      '#14b8a6',
      '#f87171',
      '#8b5cf6',
      '#10b981',
      '#ec4899',
      '#f59e0b',
      '#94a3b8',
      '#7c3aed',
    ];
    const map = new Map<string, string>();
    const used = new Set<string>();

    Object.entries(baseCategoryColors).forEach(([name, color]) => {
      map.set(name, color);
      used.add(color);
    });

    let paletteIndex = 0;
    const nextColor = () => {
      while (paletteIndex < palette.length && used.has(palette[paletteIndex])) {
        paletteIndex += 1;
      }
      let color: string;
      if (paletteIndex < palette.length) {
        color = palette[paletteIndex];
        paletteIndex += 1;
      } else {
        const hue = (paletteIndex * 47) % 360;
        color = `hsl(${hue} 85% 60%)`;
        paletteIndex += 1;
      }
      used.add(color);
      return color;
    };

    const assignIfNeeded = (name: string | null | undefined) => {
      if (!name || map.has(name)) {
        return;
      }
      map.set(name, nextColor());
    };

    categoryOptions.forEach(assignIfNeeded);
    dashboardTasks.forEach((task) => assignIfNeeded(task?.category));

    return map;
  }, [baseCategoryColors, categoryOptions, dashboardTasks]);

  const formatTaskDate = (dateString) => {
    const parsed = parseDate(dateString);
    if (!parsed) return '';

    return new Intl.DateTimeFormat('zh-TW', {
      month: '2-digit',
      day: '2-digit',
      timeZone: 'UTC',
    }).format(parsed);
  };

  const defaultStartDate = useMemo(() => parseDate(DEFAULT_VIEW_RANGE.start), []);
  const defaultEndDate = useMemo(() => parseDate(DEFAULT_VIEW_RANGE.end), []);

  const autoRange = useMemo(() => computeRangeFromTasks(executionTasks), [executionTasks]);

  useEffect(() => {
    autoRangeRef.current = normalizeRange(autoRange);
  }, [autoRange, normalizeRange]);

  const [rangeMode, setRangeMode] = useState<'auto' | 'custom'>('auto');
  const [viewRange, setViewRange] = useState(() => ({ ...autoRange }));

  useEffect(() => {
    const normalizedAuto = normalizeRange(autoRange);

    if (rangeMode === 'auto') {
      setViewRange((prev) =>
        prev.start === normalizedAuto.start && prev.end === normalizedAuto.end ? prev : normalizedAuto
      );
    }

    if (persistedRangeMode === 'auto') {
      setPersistedViewRange((prev) =>
        prev.start === normalizedAuto.start && prev.end === normalizedAuto.end ? prev : normalizedAuto
      );
    }
  }, [autoRange, rangeMode, persistedRangeMode]);

  const resolvedRange = useMemo(() => {
    const fallbackStartDate = parseDate(autoRange.start) || defaultStartDate;
    const fallbackEndDate = parseDate(autoRange.end) || defaultEndDate;

    const inputStart = viewRange.start ? parseDate(viewRange.start) : null;
    const inputEnd = viewRange.end ? parseDate(viewRange.end) : null;

    let startDate = inputStart || fallbackStartDate;
    let endDate = inputEnd || fallbackEndDate;
    let error = '';

    if (rangeMode === 'custom' && (!inputStart || !inputEnd)) {
      error = '請選擇完整的日期範圍';
    }

    if (startDate && endDate && endDate < startDate) {
      error = '結束日需晚於開始日';
      endDate = startDate;
    }

    return {
      start: startDate || defaultStartDate,
      end: endDate || defaultEndDate,
      error,
    };
  }, [viewRange, autoRange, rangeMode, defaultStartDate, defaultEndDate]);

  const rangeError = resolvedRange.error;
  const timelineStart = resolvedRange.start || defaultStartDate;
  const rawTimelineEnd = resolvedRange.end || timelineStart;
  const timelineEnd = rawTimelineEnd < timelineStart ? new Date(timelineStart) : rawTimelineEnd;

  const hasPendingRangeChanges = useMemo(() => {
    if (rangeMode !== persistedRangeMode) {
      return true;
    }
    if (rangeMode === 'custom') {
      return viewRange.start !== persistedViewRange.start || viewRange.end !== persistedViewRange.end;
    }
    return false;
  }, [rangeMode, persistedRangeMode, viewRange, persistedViewRange]);

  const handleRangeChange = useCallback(
    (field: 'start' | 'end', value: string) => {
      setRangeMode('custom');
      setViewRange((prev) => ({
        ...prev,
        [field]: value,
      }));
    },
    []
  );

  const applyCategoryChange = useCallback(
    (nextCategory: string) => {
      setEditingTask((prev) => {
        if (!prev) {
          return prev;
        }

        if (nextCategory === '學習與成長') {
          return {
            ...prev,
            category: nextCategory,
            startDate: '',
            endDate: '',
            progress: 0,
          };
        }

        if (prev.category === '學習與成長' && nextCategory !== '學習與成長') {
          const fallbackStart = prev.startDate || toInputDate(new Date());
          const fallbackEnd = prev.endDate || toInputDate(new Date(Date.now() + 7 * msPerDay));
          return {
            ...prev,
            category: nextCategory,
            startDate: fallbackStart,
            endDate: fallbackEnd,
            progress: 0,
          };
        }

        return {
          ...prev,
          category: nextCategory,
        };
      });
    },
    [msPerDay]
  );

  const handleAddCustomCategory = useCallback(() => {
    const trimmed = newCategoryDraft.trim();
    if (!trimmed) {
      return;
    }

    setCategoryOptions((prev) => {
      if (prev.includes(trimmed)) {
        return prev;
      }
      return [...prev, trimmed];
    });
    applyCategoryChange(trimmed);
    setNewCategoryDraft('');
  }, [newCategoryDraft, applyCategoryChange]);

  const handleRemoveCustomCategory = useCallback(
    (category: string) => {
      if (!category || defaultCategoryOptions.includes(category)) {
        return;
      }

      setCategoryOptions((prev) => prev.filter((option) => option !== category));
      setEditingTask((prev) => {
        if (prev && prev.category === category) {
          return { ...prev, category: '' };
        }
        return prev;
      });

      const hasAffectedTasks = tasksRef.current.some((task) => task && task.category === category);
      if (hasAffectedTasks) {
        void updateTasks((prev) =>
          prev.map((task) =>
            task && task.category === category
              ? {
                  ...task,
                  category: '',
                }
              : task
          )
        );
      }
    },
    [defaultCategoryOptions, updateTasks]
  );

  const handleConfirmViewRange = useCallback(async () => {
    if (!hasPendingRangeChanges || rangeError) {
      return;
    }

    const targetMode = rangeMode === 'custom' ? 'custom' : 'auto';
    const overrideRange =
      targetMode === 'custom'
        ? normalizeRange(viewRange, persistedViewRange)
        : normalizeRange(autoRange);

    try {
      await persistWorkspace(tasksRef.current, {
        rangeMode: targetMode,
        viewRange: overrideRange,
      });
    } catch (error) {
      console.error('[Frontend] Failed to persist view range', error);
    }
  }, [
    hasPendingRangeChanges,
    rangeError,
    rangeMode,
    viewRange,
    persistedViewRange,
    autoRange,
    normalizeRange,
    persistWorkspace,
    tasksRef,
  ]);

  const now = new Date();
  const todayLocal = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const todayUtc = new Date(Date.UTC(now.getFullYear(), now.getMonth(), now.getDate()));
  const todayLabel = `${String(todayLocal.getMonth() + 1).padStart(2, '0')}/${String(todayLocal.getDate()).padStart(2, '0')}`;
  const totalDays = Math.max(1, Math.floor((timelineEnd - timelineStart) / msPerDay) + 1);

  // 響應式寬度計算
  const trackPaddingLeft = 24;
  const trackPaddingRight = 24;
  const availableWidth = Math.max(containerWidth - (trackPaddingLeft + trackPaddingRight), 360);

  const effectiveIntervals = totalDays > 1 ? totalDays - 1 : 1;
  const baseIntervalWidth = availableWidth / effectiveIntervals;

  let intervalWidth = baseIntervalWidth;
  let minIntervalWidth = 12;
  let maxIntervalWidth = 28;

  if (totalDays <= 7) {
    minIntervalWidth = 64;
    maxIntervalWidth = 160;
  } else if (totalDays <= 14) {
    minIntervalWidth = 36;
    maxIntervalWidth = 100;
  } else if (totalDays <= 30) {
    minIntervalWidth = 20;
    maxIntervalWidth = 60;
  }

  intervalWidth = Math.max(minIntervalWidth, Math.min(maxIntervalWidth, intervalWidth));

  if (totalDays <= 21) {
    intervalWidth = Math.max(intervalWidth, baseIntervalWidth);
  }

  if (totalDays === 1) {
    intervalWidth = Math.max(intervalWidth, availableWidth);
  }

  const timelinePixelWidth =
    totalDays > 1 ? intervalWidth * (totalDays - 1) : Math.max(intervalWidth, availableWidth);
  const timelineTotalWidth = timelinePixelWidth;

  const addDays = (baseDate, days) => new Date(baseDate.getTime() + days * msPerDay);

  const timelineDays = useMemo(() => {
    return Array.from({ length: totalDays }, (_, index) => {
      const date = addDays(timelineStart, index);
      return { index, date };
    });
  }, [timelineStart, totalDays]);

  const dayPositions = useMemo(() => {
    if (totalDays <= 1) {
      return [0];
    }
    return Array.from({ length: totalDays }, (_, index) => intervalWidth * index);
  }, [totalDays, intervalWidth]);

  const getDayStartPosition = useCallback(
    (index: number) => {
      if (totalDays <= 1) {
        return 0;
      }
      const clamped = Math.max(0, Math.min(index, totalDays - 1));
      return dayPositions[clamped] ?? 0;
    },
    [dayPositions, totalDays]
  );

  const getDayEndPosition = useCallback(
    (index: number) => {
      if (totalDays <= 1) {
        return timelinePixelWidth;
      }
      if (index >= totalDays - 1) {
        return timelinePixelWidth;
      }
      return dayPositions[index + 1] ?? timelinePixelWidth;
    },
    [dayPositions, totalDays, timelinePixelWidth]
  );

  const monthDayFormatter = useMemo(
    () =>
      new Intl.DateTimeFormat('zh-TW', {
        month: '2-digit',
        day: '2-digit',
        timeZone: 'UTC',
      }),
    []
  );

  const formatMonthDay = useCallback((date) => monthDayFormatter.format(date), [monthDayFormatter]);

  const monthSegments = useMemo(() => {
    if (!timelineDays.length) {
      return [];
    }

    const segments = [];
    let cursorIndex = 0;

    while (cursorIndex < timelineDays.length) {
      const startIndex = cursorIndex;
      const currentDate = timelineDays[startIndex].date;
      const month = currentDate.getUTCMonth();
      const year = currentDate.getUTCFullYear();

      while (
        cursorIndex < timelineDays.length &&
        timelineDays[cursorIndex].date.getUTCMonth() === month &&
        timelineDays[cursorIndex].date.getUTCFullYear() === year
      ) {
        cursorIndex += 1;
      }

      const dayCount = Math.max(1, cursorIndex - startIndex);
      const endIndex = Math.max(startIndex, cursorIndex - 1);
      const startPos = getDayStartPosition(startIndex);
      const endPos = getDayEndPosition(endIndex);
      const width = Math.max(intervalWidth, endPos - startPos);

      segments.push({
        key: `${year}-${month + 1}`,
        text: `${year}年 ${month + 1}月`,
        startIndex,
        dayCount,
        width,
      });
    }

    return segments;
  }, [timelineDays, getDayStartPosition, getDayEndPosition, intervalWidth]);

  const weekSegments = useMemo(() => {
    if (!timelineDays.length) {
      return [];
    }

    const segments = [];
    const firstDay = timelineDays[0].date;
    const lastDay = timelineDays[timelineDays.length - 1].date;
    const startTime = timelineStart.getTime();

    const alignToMonday = (date) => {
      const utc = date.getTime();
      const day = date.getUTCDay();
      const diff = (day + 7 - 1) % 7; // align to Monday
      return new Date(utc - diff * msPerDay);
    };

    const monthKeyForDate = (date) => `${date.getUTCFullYear()}-${date.getUTCMonth()}`;
    const weekCountsByMonth = new Map();

    let currentWeekStart = alignToMonday(firstDay);
    let guard = 0;

    while (currentWeekStart <= lastDay && guard < 400) {
      const currentWeekEnd = new Date(currentWeekStart.getTime() + 6 * msPerDay);
      const segStart = currentWeekStart < firstDay ? firstDay : currentWeekStart;
      const segEnd = currentWeekEnd > lastDay ? lastDay : currentWeekEnd;

      let startIndex = Math.floor((segStart.getTime() - startTime) / msPerDay);
      let endIndex = Math.floor((segEnd.getTime() - startTime) / msPerDay);
      if (startIndex < 0) startIndex = 0;
      if (endIndex > timelineDays.length - 1) endIndex = timelineDays.length - 1;

      const dayCount = Math.max(1, endIndex - startIndex + 1);
      const startPos = getDayStartPosition(startIndex);
      const endPos = getDayEndPosition(endIndex);
      const width = Math.max(intervalWidth, endPos - startPos);

      const monthKey = monthKeyForDate(segStart);
      const nextWeekNumber = (weekCountsByMonth.get(monthKey) || 0) + 1;
      weekCountsByMonth.set(monthKey, nextWeekNumber);

      segments.push({
        key: `week-${segStart.toISOString()}`,
        weekNumber: nextWeekNumber,
        startDate: segStart,
        endDate: segEnd,
        startIndex,
        dayCount,
        width,
        isPartial: dayCount < 7,
      });

      currentWeekStart = new Date(currentWeekEnd.getTime() + msPerDay);
      guard += 1;
    }

    return segments;
  }, [timelineDays, intervalWidth, timelineStart, getDayStartPosition, getDayEndPosition]);

  const todayExactIndex = (todayUtc.getTime() - timelineStart.getTime()) / msPerDay;
  const showTodayMarker = todayExactIndex >= 0 && todayExactIndex <= totalDays - 1;
  const clampedTodayIndex = Math.min(Math.max(todayExactIndex, 0), totalDays - 1);
  const todayColumnLeft = clampedTodayIndex * intervalWidth;

  const timelineScrollWidth = timelinePixelWidth + trackPaddingLeft + trackPaddingRight;

  const timelineOuterStyle = useMemo(
    () => ({
      minWidth: `${timelineScrollWidth}px`,
    }),
    [timelineScrollWidth]
  );

  const clampedThumbWidthRatio = useMemo(
    () => Math.max(0, Math.min(scrollIndicator.thumbWidthRatio, 1)),
    [scrollIndicator.thumbWidthRatio]
  );

  const clampedThumbLeftRatio = useMemo(
    () => Math.max(0, Math.min(scrollIndicator.thumbLeftRatio, 1)),
    [scrollIndicator.thumbLeftRatio]
  );

  useEffect(() => {
    const element = timelineScrollRef.current;
    if (!element) {
      return;
    }

    const updateScrollIndicators = () => {
      const { scrollLeft, scrollWidth, clientWidth } = element;
      const maxScrollLeft = Math.max(scrollWidth - clientWidth, 0);
      const left = scrollLeft > 2;
      const right = maxScrollLeft - scrollLeft > 2;
      const trackWidth = Math.max(clientWidth - 24, 0);
      const isOverflow = scrollWidth - clientWidth > 1;

      let thumbWidthRatio = 1;
      let thumbLeftRatio = 0;

      if (isOverflow && trackWidth > 0) {
        const visibleRatio = clientWidth / scrollWidth;
        const minThumbRatio = Math.min(32 / trackWidth, 0.95);
        thumbWidthRatio = Math.min(1, Math.max(visibleRatio, minThumbRatio));
        const maxThumbLeftRatio = Math.max(1 - thumbWidthRatio, 0);
        const scrollRatio = maxScrollLeft > 0 ? scrollLeft / maxScrollLeft : 0;
        thumbLeftRatio = maxThumbLeftRatio * scrollRatio;
      }

      setScrollIndicator({
        left,
        right,
        thumbWidthRatio,
        thumbLeftRatio,
        isOverflow,
      });
    };

    updateScrollIndicators();
    element.addEventListener('scroll', updateScrollIndicators, { passive: true });
    window.addEventListener('resize', updateScrollIndicators);
    return () => {
      element.removeEventListener('scroll', updateScrollIndicators);
      window.removeEventListener('resize', updateScrollIndicators);
    };
  }, [timelineScrollWidth, executionTasks.length]);

  const handleScrollTrackPointerDown = useCallback(
    (event: React.PointerEvent<HTMLDivElement>) => {
      if (!scrollIndicator.isOverflow) {
        return;
      }

      const scrollElement = timelineScrollRef.current;
      const trackElement = topScrollTrackRef.current;

      if (!scrollElement || !trackElement) {
        return;
      }

      const scrollWidth = scrollElement.scrollWidth;
      const clientWidth = scrollElement.clientWidth;
      const maxScrollLeft = Math.max(scrollWidth - clientWidth, 0);
      const rect = trackElement.getBoundingClientRect();
      const trackWidth = rect.width;

      if (maxScrollLeft <= 0 || trackWidth <= 0) {
        return;
      }

      const thumbWidth = trackWidth * clampedThumbWidthRatio;
      const maxThumbLeft = Math.max(trackWidth - thumbWidth, 0);
      const currentThumbLeft = maxThumbLeft > 0 ? (scrollElement.scrollLeft / maxScrollLeft) * maxThumbLeft : 0;
      const pointerPosition = event.clientX - rect.left;
      const isInsideThumb = pointerPosition >= currentThumbLeft && pointerPosition <= currentThumbLeft + thumbWidth;

      let desiredThumbLeft = currentThumbLeft;

      if (!isInsideThumb) {
        desiredThumbLeft = Math.max(0, Math.min(pointerPosition - thumbWidth / 2, maxThumbLeft));
        const newScrollLeft = maxThumbLeft > 0 ? (desiredThumbLeft / maxThumbLeft) * maxScrollLeft : 0;
        scrollElement.scrollLeft = newScrollLeft;
      }

      thumbDragState.current = {
        pointerId: event.pointerId,
        startX: event.clientX,
        startThumbLeft: desiredThumbLeft,
        maxThumbLeft,
        maxScrollLeft,
      };

      event.currentTarget.setPointerCapture(event.pointerId);
      event.preventDefault();
    },
    [clampedThumbWidthRatio, scrollIndicator.isOverflow]
  );

  const handleScrollTrackPointerMove = useCallback((event: React.PointerEvent<HTMLDivElement>) => {
    const state = thumbDragState.current;
    if (state.pointerId !== event.pointerId || state.maxThumbLeft <= 0 || state.maxScrollLeft <= 0) {
      return;
    }

    const scrollElement = timelineScrollRef.current;
    if (!scrollElement) {
      return;
    }

    const delta = event.clientX - state.startX;
    const newThumbLeft = Math.max(0, Math.min(state.startThumbLeft + delta, state.maxThumbLeft));
    const newScrollLeft = (newThumbLeft / state.maxThumbLeft) * state.maxScrollLeft;
    scrollElement.scrollLeft = newScrollLeft;

    event.preventDefault();
  }, []);

  const handleScrollTrackPointerUp = useCallback((event: React.PointerEvent<HTMLDivElement>) => {
    if (thumbDragState.current.pointerId !== event.pointerId) {
      return;
    }

    thumbDragState.current = {
      pointerId: null,
      startX: 0,
      startThumbLeft: 0,
      maxThumbLeft: 0,
      maxScrollLeft: 0,
    };

    try {
      if (event.currentTarget.hasPointerCapture(event.pointerId)) {
        event.currentTarget.releasePointerCapture(event.pointerId);
      }
    } catch {
      // ignore release errors
    }
  }, []);

  const timelineInnerStyle = useMemo(
    () => ({
      width: `${timelineScrollWidth}px`,
      minWidth: `${timelineScrollWidth}px`,
    }),
    [timelineScrollWidth]
  );

  const dayGridBackground = useMemo(
    () => ({
      backgroundImage: `repeating-linear-gradient(to right, transparent, transparent ${intervalWidth - 1}px, rgba(226, 232, 240, 0.8) ${intervalWidth - 1}px, rgba(226, 232, 240, 0.8) ${intervalWidth}px)`,
      backgroundSize: `${intervalWidth}px 100%`,
      backgroundRepeat: 'repeat',
    }),
    [intervalWidth]
  );

  const trackBackgroundStyle = {
    left: `${trackPaddingLeft}px`,
    width: `${timelinePixelWidth}px`,
    ...dayGridBackground,
  };

  const todayMarkerLeft = todayColumnLeft + trackPaddingLeft;

  const weekBoundaryPositions = useMemo(
    () =>
      weekSegments
        .filter((week) => week.startIndex > 0)
        .map((week) => getDayStartPosition(week.startIndex) + trackPaddingLeft),
    [weekSegments, getDayStartPosition, trackPaddingLeft]
  );

  const renderTimelineRow = (task) => {
    const { left, width, startIndex, endIndex } = getBarPosition(task.startDate, task.endDate);
    const taskDays = endIndex - startIndex + 1;
    const progressValue = clampProgress(task.progress);
    const categoryColor = getCategoryColor(task.category);
    const startLabelText = formatTaskDate(task.startDate);
    const endLabelText = formatTaskDate(task.endDate);

    // 設置最小寬度，避免色條太窄
    const minBarWidth = 80;
    const actualWidth = Math.max(width, minBarWidth);
    const barLeft = `${left + trackPaddingLeft}px`;
    const barWidth = `${actualWidth}px`;
    const todayStripeWidth = `${intervalWidth}px`;

    // 判斷是否為短任務（3天以內）
    const isShortTask = taskDays <= 3;

    const maxMaterialsToShow = 3;
    const materialsList = Array.isArray(task.materials) ? task.materials : [];
    const visibleMaterials = materialsList.slice(0, maxMaterialsToShow);
    const remainingMaterials = Math.max(materialsList.length - maxMaterialsToShow, 0);

    return (
      <div
        key={`timeline-task-${task.id}`}
        className={`space-y-2 group cursor-move transition-all ${
          draggedTaskId === task.id ? 'opacity-50' : ''
        } ${
          dragOverTaskId === task.id ? 'border-2 border-blue-500 rounded-lg' : ''
        }`}
        draggable
        onDragStart={(e) => handleDragStart(e, task.id)}
        onDragOver={(e) => handleDragOver(e, task.id)}
        onDragLeave={handleDragLeave}
        onDrop={(e) => handleDrop(e, task.id)}
        onDragEnd={handleDragEnd}
      >
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-3">
          <div className="flex flex-col gap-2">
            <div className="flex flex-wrap items-center gap-2">
              <div className="font-medium text-gray-800 text-sm">
                {task.name}
              </div>
              <span
                className="text-white text-xs px-2 py-0.5 rounded-full"
                style={{ backgroundColor: categoryColor }}
              >
                {task.category || '未分類'}
              </span>
              <span className="text-xs text-gray-500">
                {getStatusText(task.status)} · {progressValue}%
              </span>
            </div>
            {task.description && (
              <p className="text-xs text-gray-600 leading-snug max-w-3xl pr-4">
                {task.description.length > 160 ? `${task.description.slice(0, 160)}…` : task.description}
              </p>
            )}
            {task.materials && task.materials.length > 0 && (
              <div className="flex flex-wrap items-center gap-1.5">
                {visibleMaterials.map((material) => {
                  const isImage = material.type === 'image';
                  const imageSrc = material.dataUrl || material.url || '';

                  if (isImage && imageSrc) {
                    return (
                      <button
                        key={material.id}
                        type="button"
                        onClick={() => setActiveImage({ src: imageSrc, name: material.name })}
                        className="relative overflow-hidden rounded-md border border-blue-200 bg-blue-50 hover:bg-blue-100 transition-colors"
                        title={material.note || material.name}
                      >
                        <img
                          src={imageSrc}
                          alt={material.name}
                          className="w-14 h-14 object-cover"
                        />
                      </button>
                    );
                  }

                  return (
                    <a
                      key={material.id}
                      href={material.url || '#'}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 px-2 py-1 bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs rounded border border-blue-200 transition-colors"
                      title={material.note || material.name}
                      onClick={(e) => {
                        if (!material.url) {
                          e.preventDefault();
                        }
                      }}
                    >
                      <span className="flex-shrink-0">
                        {getMaterialIcon(material.type)}
                      </span>
                      <span className="max-w-[140px] truncate">
                        {material.name}
                      </span>
                    </a>
                  );
                })}
                {remainingMaterials > 0 && (
                  <span className="inline-flex items-center px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                    +{remainingMaterials}
                  </span>
                )}
              </div>
            )}
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => handleEdit(task)} className="p-2 text-blue-600 hover:bg-blue-50 rounded">
              <Edit2 className="w-4 h-4" />
            </button>
            <button onClick={() => handleDelete(task.id)} className="p-2 text-red-600 hover:bg-red-50 rounded">
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="relative h-20" style={timelineInnerStyle}>
          <div className="absolute inset-0 pointer-events-none">
            <div
              className="absolute top-5 bottom-5 rounded-full border border-slate-200 bg-slate-50"
              style={trackBackgroundStyle}
            ></div>
            {showTodayMarker && (
              <div
                className="absolute top-5 bottom-5"
                style={{ left: `${todayMarkerLeft}px`, width: todayStripeWidth }}
              >
                <div className="absolute inset-0 bg-red-500/10 rounded-full"></div>
                <div className="absolute inset-y-2 left-1/2 w-[2px] -translate-x-1/2 bg-red-500 rounded-full"></div>
              </div>
            )}
            {weekBoundaryPositions.map((position, index) => (
              <div
                key={`week-boundary-${task.id}-${index}`}
                className="absolute top-5 bottom-5 w-px bg-slate-300/70"
                style={{ left: `${position}px` }}
              ></div>
            ))}
          </div>

          <div
            className="absolute top-5 h-9 rounded-full shadow-sm flex items-center justify-center text-white text-xs font-semibold"
            style={{ left: barLeft, width: barWidth, backgroundColor: categoryColor }}
          >
            <span className="relative z-10">{progressValue}%</span>
            <div className="absolute inset-x-4 bottom-1.5 h-1.5 bg-white/50 rounded-full overflow-hidden">
              <div className="h-full bg-white" style={{ width: `${progressValue}%` }}></div>
            </div>
          </div>

          {isShortTask ? (
            <div
              className="absolute top-2 flex items-center text-xs text-gray-700 font-medium bg-white/90 px-2 py-0.5 rounded whitespace-nowrap"
              style={{ left: `calc(${barLeft} + ${barWidth} / 2)`, transform: 'translateX(-50%)' }}
            >
              {startLabelText} → {endLabelText}
            </div>
          ) : (
            <>
              <div
                className="absolute top-2 flex items-center text-xs text-gray-700 font-medium bg-white/90 px-1.5 py-0.5 rounded"
                style={{ left: barLeft }}
              >
                {startLabelText}
              </div>
              <div
                className="absolute top-2 flex items-center text-xs text-gray-700 font-medium bg-white/90 px-1.5 py-0.5 rounded -translate-x-full"
                style={{ left: `calc(${barLeft} + ${barWidth})` }}
              >
                {endLabelText}
              </div>
            </>
          )}
        </div>
      </div>
    );
  };

  const getBarPosition = (startDate, endDate) => {
    const start = parseDate(startDate);
    const end = parseDate(endDate);

    if (!start || !end) {
      return { left: 0, width: intervalWidth, startIndex: 0, endIndex: 0 };
    }

    const startOffset = Math.floor((start - timelineStart) / msPerDay);
    const endOffset = Math.floor((end - timelineStart) / msPerDay);

    const clampedStart = Math.max(0, Math.min(totalDays - 1, startOffset));
    const clampedEnd = Math.max(clampedStart, Math.min(totalDays - 1, endOffset));
    const startPos = getDayStartPosition(clampedStart);
    const endPos = getDayEndPosition(clampedEnd);
    const width = Math.max(intervalWidth, endPos - startPos);

    return {
      left: startPos,
      width,
      startIndex: clampedStart,
      endIndex: clampedEnd,
    };
  };

  const getStatusColor = (status) => {
    if (status === 'completed') return 'bg-green-500';
    if (status === 'in-progress') return 'bg-blue-500';
    if (status === 'pending') return 'bg-gray-400';
    if (status === 'unpublished') return 'bg-yellow-500';
    if (status === 'blocked') return 'bg-red-500';
    return 'bg-gray-400';
  };

  const getStatusText = (status) => {
    if (status === 'completed') return '已完成';
    if (status === 'in-progress') return '進行中';
    if (status === 'pending') return '待辦';
    if (status === 'unpublished') return '已完成未發布';
    if (status === 'blocked') return '卡關';
    return '未知';
  };

  const getCategoryColor = (category) => {
    if (!category) return '#94a3b8';
    return categoryColorMap.get(category) ?? '#94a3b8';
  };

  const getMaterialIcon = (type) => {
    if (type === 'link') return <LinkIcon className="w-4 h-4" />;
    if (type === 'image') return <Image className="w-4 h-4" />;
    if (type === 'file') return <File className="w-4 h-4" />;
    if (type === 'note') return <FileText className="w-4 h-4" />;
    return <Paperclip className="w-4 h-4" />;
  };

  const clampProgress = (value) => {
    const numeric = Number.isFinite(value) ? value : parseFloat(value) || 0;
    return Math.min(100, Math.max(0, Math.round(numeric)));
  };

  // 编辑任务
  const handleEdit = (task) => {
    setEditingTask({ ...task });
    setNewMaterial({ type: 'link', name: '', url: '', note: '', dataUrl: '' });
  };

  const handleSaveEdit = () => {
    if (!editingTask) {
      return;
    }

    const trimmedName = editingTask.name.trim();
    if (!trimmedName) {
      alert('請輸入任務名稱');
      return;
    }

    let normalizedTask = {
      ...editingTask,
      name: trimmedName,
      description: editingTask && editingTask.description ? editingTask.description.trim() : '',
    };

    if (normalizedTask.category === '學習與成長') {
      normalizedTask = {
        ...normalizedTask,
        startDate: '',
        endDate: '',
        progress: 0,
      };
    } else {
      if (!normalizedTask.startDate || !normalizedTask.endDate) {
        alert('請輸入開始與結束日期');
        return;
      }
      normalizedTask = {
        ...normalizedTask,
        progress: clampProgress(normalizedTask.progress),
      };
    }

    updateTasks((prev) => prev.map((t) => (t.id === normalizedTask.id ? normalizedTask : t)));
    setEditingTask(null);
    setNewMaterial({ type: 'link', name: '', url: '', note: '' });
  };

  const handleCancelEdit = () => {
    setEditingTask(null);
    setNewMaterial({ type: 'link', name: '', url: '', note: '' });
  };

  // 删除任务
  const handleDelete = (taskId) => {
    if (window.confirm('確定要刪除此任務嗎？')) {
      updateTasks((prev) => prev.filter((t) => t.id !== taskId));
    }
  };

  const handleAddExecutionTask = () => {
    const today = new Date();
    const endDate = new Date(today.getTime() + 7 * msPerDay);

    const newTask = {
      id: Date.now(),
      name: '新任務',
      startDate: toInputDate(today),
      endDate: toInputDate(endDate),
      status: 'pending',
      category: '流程優化',
      progress: 0,
      description: '',
      materials: [],
    };

    updateTasks((prev) => [...prev, newTask]);
    setEditingTask(newTask);
  };

  const handleAddLearningTask = () => {
    const newTask = {
      id: Date.now(),
      name: '新學習項目',
      startDate: '',
      endDate: '',
      status: 'in-progress',
      category: '學習與成長',
      progress: 0,
      description: '',
      materials: [],
    };

    updateTasks((prev) => [...prev, newTask]);
    setEditingTask(newTask);
  };

  // 添加补充材料
  const handleAddMaterial = () => {
    if (!newMaterial.name) {
      alert('請輸入材料名稱');
      return;
    }
    if (newMaterial.type === 'image') {
      if (!newMaterial.dataUrl && !newMaterial.url) {
        alert('請上傳圖片或輸入圖片連結');
        return;
      }
    } else if (newMaterial.type !== 'note' && !newMaterial.url) {
      alert('請輸入連結');
      return;
    }

    const materialWithId = {
      ...newMaterial,
      id: Date.now()
    };

    setEditingTask({
      ...editingTask,
      materials: [...(editingTask.materials || []), materialWithId]
    });
    setNewMaterial({ type: 'link', name: '', url: '', note: '', dataUrl: '' });
  };

  // 删除补充材料
  const handleDeleteMaterial = (materialId) => {
    setEditingTask({
      ...editingTask,
      materials: editingTask.materials.filter(m => m.id !== materialId)
    });
  };

  const handleMaterialImageSelect = (file) => {
    if (!file) {
      return;
    }
    const reader = new FileReader();
    reader.onloadend = () => {
      setNewMaterial((prev) => ({
        ...prev,
        dataUrl: typeof reader.result === 'string' ? reader.result : '',
        url: '',
      }));
    };
    reader.readAsDataURL(file);
  };

  // 拖曳處理函數
  const handleDragStart = (e, taskId) => {
    setDraggedTaskId(taskId);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e, taskId) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setDragOverTaskId(taskId);
  };

  const handleDragLeave = () => {
    setDragOverTaskId(null);
  };

  const handleDrop = (e, targetTaskId) => {
    e.preventDefault();
    if (!draggedTaskId || draggedTaskId === targetTaskId) {
      setDraggedTaskId(null);
      setDragOverTaskId(null);
      return;
    }

    updateTasks((prevTasks) => {
      const draggedIndex = prevTasks.findIndex(t => t.id === draggedTaskId);
      const targetIndex = prevTasks.findIndex(t => t.id === targetTaskId);

      if (draggedIndex === -1 || targetIndex === -1) return prevTasks;

      const draggedTask = prevTasks[draggedIndex];
      const targetTask = prevTasks[targetIndex];

      // 只允許同類別內拖曳
      if (draggedTask.category !== targetTask.category) {
        return prevTasks;
      }

      // 互換兩個任務的位置
      const newTasks = [...prevTasks];
      newTasks[draggedIndex] = targetTask;
      newTasks[targetIndex] = draggedTask;

      return newTasks;
    });

    setDraggedTaskId(null);
    setDragOverTaskId(null);
  };

  const handleDragEnd = () => {
    setDraggedTaskId(null);
    setDragOverTaskId(null);
  };

  const stats = useMemo(() => {
    const snapshot = {
      total: dashboardTasks.length,
      completed: 0,
      inProgress: 0,
      pending: 0,
      unpublished: 0,
      blocked: 0,
      other: 0,
    };
    dashboardTasks.forEach((task) => {
      switch (task?.status) {
        case 'completed':
          snapshot.completed += 1;
          break;
        case 'in-progress':
          snapshot.inProgress += 1;
          break;
        case 'pending':
          snapshot.pending += 1;
          break;
        case 'unpublished':
          snapshot.unpublished += 1;
          break;
        case 'blocked':
          snapshot.blocked += 1;
          break;
        default:
          snapshot.other += 1;
          break;
      }
    });
    return snapshot;
  }, [dashboardTasks]);

  const chartTotal = dashboardTasks.length;

  const categoryOrder = useMemo(() => {
    const order: string[] = [];
    categoryOptions.forEach((option) => {
      if (option && !order.includes(option)) {
        order.push(option);
      }
    });
    dashboardTasks.forEach((task) => {
      const key = task?.category || '';
      if (!key && !order.includes('')) {
        order.push('');
      } else if (key && !order.includes(key)) {
        order.push(key);
      }
    });
    return order;
  }, [categoryOptions, dashboardTasks]);

  const chartSegments = categoryOrder
    .map((key) => {
      const count = dashboardTasks.filter((task) => (task?.category || '') === key).length;
      const percent = chartTotal > 0 ? (count / chartTotal) * 100 : 0;
      const label = key || '未分類';
      const color = key ? categoryColorMap.get(key) ?? '#94a3b8' : '#94a3b8';
      return {
        key: key || 'uncategorized',
        label,
        color,
        count,
        percent,
      };
    })
    .filter((segment) => segment.count > 0);

  const donutGradient = chartTotal > 0
    ? (() => {
        let cumulative = 0;
        return chartSegments
          .map((segment) => {
            const start = cumulative;
            const end = cumulative + segment.percent;
            cumulative = end;
            return `${segment.color} ${start}% ${end}%`;
          })
          .join(', ');
      })()
    : '#d1d5db 0 100%';

  const overallProgress = dashboardTasks.length
    ? Math.round(
        dashboardTasks.reduce((sum, task) => sum + clampProgress(task.progress ?? 0), 0) / dashboardTasks.length
      )
    : 0;

  const rainbowTitleSegments = useMemo(() => ([
    { char: '繽', color: 'rgba(255, 99, 132, 0.9)' },
    { char: '紛', color: 'rgba(255, 159, 64, 0.9)' },
    { char: '七', color: 'rgba(255, 205, 86, 0.9)' },
    { char: '彩', color: 'rgba(102, 187, 106, 0.9)' },
    { char: '酷', color: 'rgba(66, 165, 245, 0.9)' },
    { char: '炫', color: 'rgba(99, 102, 241, 0.9)' },
    { char: '甘', color: 'rgba(165, 105, 236, 0.9)' },
    { char: '特', color: 'rgba(236, 72, 153, 0.9)' },
    { char: '圖', color: 'rgba(244, 114, 182, 0.9)' },
  ]), []);

  const handleProjectTitleCommit = () => {
    const trimmed = projectTitleDraft.trim();
    const nextTitle = trimmed || '未命名專案';
    const titleChanged = nextTitle !== projectTitle;

    setProjectTitle(nextTitle);
    setProjectTitleDraft(nextTitle);
    setIsTitleEditing(false);
    projectTitleRef.current = nextTitle;

    if (titleChanged) {
      void persistWorkspace(tasksRef.current, { projectTitle: nextTitle }).catch((error) => {
        console.error('[Frontend] Failed to persist project title', error);
      });
    }
  };

  const handleProjectTitleCancel = () => {
    setProjectTitleDraft(projectTitle);
    setIsTitleEditing(false);
  };

  return (
    <div ref={appRef} className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {showNavigation && (
        <div className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
          <div className="w-full px-4 sm:px-6 py-3">
            <div className="relative flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between sm:gap-6">
              <div className="flex flex-wrap items-center gap-4 min-w-0">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl border border-purple-200/60 overflow-hidden shadow-md">
                    <img
                      src={catAvatar}
                      alt="Gantt Mascot"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span
                        className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-gray-600"
                        style={{ border: `1px solid ${workspaceColor}33` }}
                      >
                        <span
                          className="w-2.5 h-2.5 rounded-full shadow-sm"
                          style={{ backgroundColor: workspaceColor }}
                        ></span>
                        {workspaceDisplayName}
                      </span>
                      {workspaceMeta?.id && workspaceMeta.id !== DEFAULT_WORKSPACE_ID && (
                        <span className="text-[11px] text-gray-400">ID: {workspaceMeta.id}</span>
                      )}
                      {workspaceOwner && (
                        <span className="inline-flex items-center gap-1 text-xs text-gray-500">
                          <Users className="w-3.5 h-3.5 opacity-60" />
                          <span className="truncate max-w-[120px]">{workspaceOwner}</span>
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 flex-wrap mt-1">
                      {isTitleEditing ? (
                        <input
                          value={projectTitleDraft}
                          onChange={(e) => setProjectTitleDraft(e.target.value)}
                          onBlur={handleProjectTitleCommit}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              e.preventDefault();
                              handleProjectTitleCommit();
                            } else if (e.key === 'Escape') {
                              e.preventDefault();
                              handleProjectTitleCancel();
                            }
                          }}
                          autoFocus
                          className="text-base font-semibold text-gray-900 border border-blue-300 rounded-lg px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-400 shadow-sm"
                        />
                      ) : (
                        <div className="flex items-center gap-2">
                          <h1 className="text-base font-semibold text-gray-900 truncate max-w-xs sm:max-w-md">
                            {projectTitle}
                          </h1>
                          <button
                            type="button"
                            onClick={() => setIsTitleEditing(true)}
                            className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-full transition"
                            title="編輯專案標題"
                            data-ignore-pdf="true"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      )}
                    </div>
                    <div className="flex flex-col gap-1 text-xs text-gray-500 mt-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="inline-flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5 text-gray-400" />
                          <input
                            type="date"
                            value={viewRange.start}
                            max={viewRange.end || undefined}
                            onChange={(e) => handleRangeChange('start', e.target.value)}
                            className="h-7 rounded border border-gray-200 px-2 text-xs text-gray-700 shadow-inner focus:border-blue-400 focus:outline-none focus:ring-1 focus:ring-blue-400"
                          />
                          <span className="text-gray-400">~</span>
                          <input
                            type="date"
                            value={viewRange.end}
                            min={viewRange.start || undefined}
                            onChange={(e) => handleRangeChange('end', e.target.value)}
                            className="h-7 rounded border border-gray-200 px-2 text-xs text-gray-700 shadow-inner focus:border-blue-400 focus:outline-none focus:ring-1 focus:ring-blue-400"
                          />
                        </span>
                        <button
                          type="button"
                          onClick={handleConfirmViewRange}
                          disabled={!hasPendingRangeChanges || Boolean(rangeError) || isSyncing}
                          className={`inline-flex items-center gap-1 rounded px-2 py-1 text-xs font-medium transition ${
                            !hasPendingRangeChanges || rangeError
                              ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                              : 'bg-blue-600 text-white hover:bg-blue-700'
                          } ${isSyncing ? 'opacity-70' : ''}`}
                        >
                          {isSyncing && hasPendingRangeChanges ? '儲存中...' : '確定'}
                        </button>
                        {hasPendingRangeChanges && !rangeError && (
                          <span className="text-xs text-orange-500">尚未儲存</span>
                        )}
                      </div>
                      {rangeError && (
                        <div className="text-xs text-red-500">{rangeError}</div>
                      )}
                      <div className="flex flex-wrap items-center gap-2">
                        <span className={`inline-flex items-center gap-1 ${apiAvailable ? 'text-green-600' : 'text-gray-400'}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${apiAvailable ? 'bg-green-500' : 'bg-gray-400'}`}></span>
                          {apiAvailable ? '已同步' : '離線'}
                        </span>
                        {isSyncing && <span className="text-blue-600">同步中...</span>}
                        {syncError && (
                          <span className="inline-flex items-center gap-1 text-red-600 bg-red-50 px-2 py-1 rounded">
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            同步失敗: {syncError}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="hidden md:flex md:absolute md:left-1/2 md:top-1/2 md:-translate-x-1/2 md:-translate-y-1/2 flex-col items-center text-center">
                <div className="text-base font-semibold tracking-wide drop-shadow-sm leading-tight flex items-center gap-1">
                  <span className="text-lg">😎</span>
                  <span>
                    {rainbowTitleSegments.map((segment, index) => (
                      <span key={`rainbow-${segment.char}-${index}`} style={{ color: segment.color }}>
                        {segment.char}
                      </span>
                    ))}
                  </span>
                  <span className="ml-1 text-gray-600/80">v1.1</span>
                </div>
                <div className="text-[11px] text-gray-400 mt-0.5 tracking-wide">
                  by Janus_澈行
                </div>
              </div>

              <div className="flex items-center gap-3 flex-shrink-0 w-full sm:w-auto justify-end">
                <button
                  onClick={() => {
                    if (onOpenManager) {
                      onOpenManager();
                    } else if (typeof window !== 'undefined') {
                      window.location.assign('/management');
                    }
                  }}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-white bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-lg shadow hover:shadow-md transition-colors"
                >
                  <LayoutGrid className="w-4 h-4" />
                  管理器
                </button>
                <button
                  onClick={async () => {
                    if (!appRef.current) return;

                    const loader = document.createElement('div');
                    loader.textContent = '生成 PDF 中…';
                    loader.className =
                      'fixed top-6 right-6 z-[1000] px-3 py-1.5 text-sm font-medium text-white bg-gray-800/80 rounded-lg shadow';
                    loader.dataset.ignorePdf = 'true';
                    document.body.appendChild(loader);

                    try {
                      const [{ default: html2canvas }, { default: jsPDF }] = await Promise.all([
                        import('https://cdn.jsdelivr.net/npm/html2canvas@1.4.1/+esm'),
                        import('https://cdn.jsdelivr.net/npm/jspdf@2.5.1/+esm'),
                        document.fonts?.ready?.catch(() => undefined) ?? Promise.resolve(),
                      ]);

                      const scale = Math.min(3, Math.max(2, window.devicePixelRatio || 1));

                      const canvas = await html2canvas(appRef.current, {
                        scale,
                        useCORS: true,
                        backgroundColor: '#ffffff',
                        ignoreElements: (element) => element.dataset && element.dataset.ignorePdf === 'true',
                        letterRendering: true,
                      });

                      const imgData = canvas.toDataURL('image/png', 1);
                      const orientation = canvas.width >= canvas.height ? 'landscape' : 'portrait';
                      const pdf = new jsPDF({
                        orientation,
                        unit: 'px',
                        format: [canvas.width, canvas.height],
                      });

                      pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height, undefined, 'FAST');
                      pdf.save('gantt-dashboard.pdf');
                    } catch (error) {
                      console.error('PDF 匯出失敗', error);
                      alert('匯出 PDF 失敗，請稍後再試。');
                    } finally {
                      if (loader.parentNode) {
                        loader.parentNode.removeChild(loader);
                      }
                    }
                  }}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                title="匯出為 PDF"
              >
                <svg className="w-4 h-4 inline mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                匯出 PDF
              </button>
              <img
                src={catAvatar}
                alt="Janus Avatar"
                className="w-9 h-9 rounded-full border-2 border-white shadow hover:shadow-lg transition-shadow object-cover cursor-pointer"
              />
            </div>
          </div>
        </div>
      </div>
      )}
      
      <div className={`w-full px-4 sm:px-6 ${showNavigation ? 'py-6' : 'pt-8 pb-6'}`}>
        {/* Stats Card */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          {/* Stats Dashboard */}
          <div>
            <div className="bg-gradient-to-br from-white via-slate-50 to-blue-50 border border-slate-200 rounded-2xl p-6 shadow-sm">
              <div className="flex flex-col lg:flex-row lg:items-center gap-8">
                <div className="flex items-center justify-center">
                  <div className="relative">
                    <div
                      className="w-40 h-40 rounded-full"
                      style={{
                        background: chartTotal > 0 ? `conic-gradient(${donutGradient})` : '#e5e7eb',
                      }}
                    ></div>
                    <div className="absolute inset-4 bg-white rounded-full flex flex-col items-center justify-center text-center">
                      <span className="text-xs text-gray-500">整體進度</span>
                      <span className="text-2xl font-bold text-purple-600">{overallProgress}%</span>
                    </div>
                  </div>
                </div>

                <div ref={timelineViewportRef} className="flex-1 w-full space-y-6">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                      <p className="text-sm text-gray-500">總任務數</p>
                      <p className="text-3xl font-bold text-gray-900">{stats.total}</p>
                    </div>
                    <div className="bg-white border border-slate-200 rounded-xl px-4 py-3 shadow-inner">
                      <p className="text-xs text-gray-500 uppercase tracking-wide">任務狀態</p>
                      <div className="flex items-center gap-3 mt-1">
                        <span className="inline-flex items-center gap-1 text-sm text-gray-600">
                          <span className="w-2.5 h-2.5 rounded-full bg-green-500"></span>
                          已完成 {stats.completed}
                        </span>
                        <span className="inline-flex items-center gap-1 text-sm text-gray-600">
                          <span className="w-2.5 h-2.5 rounded-full bg-blue-500"></span>
                          進行中 {stats.inProgress}
                        </span>
                        <span className="inline-flex items-center gap-1 text-sm text-gray-600">
                          <span className="w-2.5 h-2.5 rounded-full bg-gray-400"></span>
                          未完成 {stats.pending + stats.unpublished + stats.blocked + stats.other}
                        </span>
                        {stats.other > 0 && (
                          <span className="inline-flex items-center gap-1 text-xs text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
                            其他 {stats.other}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    {chartSegments.map((segment) => (
                      <div key={segment.key} className="group">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span
                              className="w-2.5 h-2.5 rounded-full"
                              style={{ backgroundColor: segment.color }}
                            ></span>
                            <span className="text-sm font-medium text-gray-700">{segment.label}</span>
                          </div>
                          <div className="text-sm text-gray-500">
                            {segment.count} 件（{chartTotal > 0 ? Math.round(segment.percent) : 0}%）
                          </div>
                        </div>
                        <div className="mt-2 h-2.5 bg-slate-200 rounded-full overflow-hidden">
                          <div
                            className="h-full rounded-full transition-all duration-500 group-hover:opacity-90"
                            style={{
                              width: chartTotal > 0 ? `${Math.max(segment.percent, 4)}%` : '4%',
                              backgroundColor: segment.color,
                            }}
                            title={`${segment.label}: ${segment.count}（${chartTotal > 0 ? segment.percent.toFixed(1) : 0}%）`}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Gantt Chart */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
            <h2 className="text-xl font-bold text-gray-800">任務進度</h2>
            <button
              onClick={handleAddExecutionTask}
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              <Plus className="w-4 h-4" />
              新增任務
            </button>
          </div>

          {executionTasks.length === 0 ? (
            <div className="text-sm text-gray-500 bg-gray-50 border border-dashed border-gray-300 rounded-lg p-6 text-center">
              尚未建立任務。點選「新增任務」建立第一個任務項目。
            </div>
          ) : (
            <div
              className="relative -mx-4 overflow-x-auto pb-6 sm:mx-0"
              ref={timelineScrollRef}
            >
              {scrollIndicator.isOverflow && (
                <>
                  {scrollIndicator.left && (
                    <div className="pointer-events-none absolute inset-y-0 left-0 w-6 bg-gradient-to-r from-white via-white/60 to-transparent" />
                  )}
                  {scrollIndicator.right && (
                    <div className="pointer-events-none absolute inset-y-0 right-0 w-6 bg-gradient-to-l from-white via-white/60 to-transparent" />
                  )}
                </>
              )}
              <div style={timelineOuterStyle}>
                <div className="space-y-6" style={timelineInnerStyle}>
                  <div className="sticky top-[16px] sm:top-[16px] lg:top-[16px] z-30 space-y-3 pb-4">
                    <div className="relative">
                      {showTodayMarker && (
                        <div
                          className="pointer-events-none absolute inset-y-0 z-0"
                          style={{ left: `${todayMarkerLeft}px`, width: `${intervalWidth}px` }}
                        >
                          <div className="absolute inset-0 bg-red-500/10"></div>
                          <div className="absolute inset-y-0 left-1/2 w-[2px] -translate-x-1/2 bg-red-500"></div>
                          <div className="absolute -top-9 left-1/2 -translate-x-1/2 rounded-full bg-red-500 px-2 py-1 text-xs text-white shadow">
                            今天 {todayLabel}
                          </div>
                        </div>
                      )}

                      <div
                        className="relative rounded-lg border border-slate-200 bg-slate-50/90 text-xs font-semibold text-gray-700 overflow-hidden shadow-sm backdrop-blur"
                        style={{
                          width: `${timelineScrollWidth}px`,
                          minWidth: `${timelineScrollWidth}px`,
                        }}
                      >
                        <div className="flex" style={{ marginLeft: `${trackPaddingLeft}px` }}>
                          {monthSegments.map((month, index) => (
                            <div
                              key={`month-${month.key}-${index}`}
                              className="flex items-center justify-center border-r border-slate-200 last:border-r-0 px-3 py-2 flex-shrink-0"
                              style={{ width: `${month.width}px`, minWidth: `${month.width}px` }}
                            >
                              {month.text}
                            </div>
                          ))}
                        </div>
                      </div>

                      <div
                        className="relative mt-2 rounded-lg border border-slate-200 bg-white text-xs text-gray-500 overflow-hidden shadow-sm backdrop-blur"
                        style={{
                          width: `${timelineScrollWidth}px`,
                          minWidth: `${timelineScrollWidth}px`,
                        }}
                      >
                        <div className="flex" style={{ marginLeft: `${trackPaddingLeft}px` }}>
                          {weekSegments.map((week) => {
                            const labelPrefix = `第${week.weekNumber}週`;
                            return (
                              <div
                                key={week.key}
                                className="flex flex-col items-center justify-center border-r border-slate-200 last:border-r-0 px-2 py-1.5 flex-shrink-0 text-xs leading-tight text-gray-600"
                                style={{ width: `${week.width}px`, minWidth: `${week.width}px` }}
                              >
                                <span className="font-medium">{labelPrefix}</span>
                                <span className="text-gray-500">
                                  {formatMonthDay(week.startDate)}-{formatMonthDay(week.endDate)}
                                </span>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>

                    {scrollIndicator.isOverflow && (
                      <div className="px-4 sm:px-6">
                        <div
                          ref={topScrollTrackRef}
                          className="relative h-1.5 rounded-full bg-blue-100 cursor-pointer"
                          onPointerDown={handleScrollTrackPointerDown}
                          onPointerMove={handleScrollTrackPointerMove}
                          onPointerUp={handleScrollTrackPointerUp}
                          onPointerCancel={handleScrollTrackPointerUp}
                        >
                          <div
                            className="absolute inset-y-[2px] rounded-full bg-blue-400 transition-all duration-150"
                            style={{
                              width: `${clampedThumbWidthRatio * 100}%`,
                              left: `${clampedThumbLeftRatio * 100}%`,
                            }}
                          ></div>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="relative space-y-6" style={timelineInnerStyle}>
                    {executionTasks.map(renderTimelineRow)}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
        {/* Learning & Growth */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
            <h2 className="text-xl font-bold text-gray-800">學習與成長</h2>
            <button
              onClick={handleAddLearningTask}
              className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
            >
              <Plus className="w-4 h-4" />
              新增項目
            </button>
          </div>

          {learningTasks.length === 0 ? (
            <div className="text-sm text-gray-500 bg-gray-50 border border-dashed border-gray-300 rounded-lg p-6 text-center">
              尚未建立學習項目，可用右上角按鈕新增。
            </div>
          ) : (
            <div className="space-y-3">
              {learningTasks.map((task) => {
                const maxMaterialsToShow = 3;
                const materialsList = Array.isArray(task.materials) ? task.materials : [];
                const visibleMaterials = materialsList.slice(0, maxMaterialsToShow);
                const remainingMaterials = Math.max(materialsList.length - maxMaterialsToShow, 0);

                return (
                  <div
                    key={task.id}
                    className={`p-4 border border-gray-200 rounded-lg bg-indigo-50/40 space-y-3 cursor-move transition-all ${
                      draggedTaskId === task.id ? 'opacity-50' : ''
                    } ${
                      dragOverTaskId === task.id ? 'border-2 border-indigo-500' : ''
                    }`}
                    draggable
                    onDragStart={(e) => handleDragStart(e, task.id)}
                    onDragOver={(e) => handleDragOver(e, task.id)}
                    onDragLeave={handleDragLeave}
                    onDrop={(e) => handleDrop(e, task.id)}
                    onDragEnd={handleDragEnd}
                  >
                    <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-3">
                      <div className="flex-1 space-y-2">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-medium text-gray-800">{task.name}</span>
                          <span className={`text-xs px-2 py-0.5 rounded-full ${getStatusColor(task.status)} text-white`}>
                            {getStatusText(task.status)}
                          </span>
                        </div>
                        {task.description && (
                          <p className="text-sm text-gray-600">{task.description}</p>
                        )}
                      </div>
                      {task.materials && task.materials.length > 0 && (
                        <div className="flex flex-wrap items-start justify-start gap-2 sm:justify-end lg:flex-col lg:items-end lg:min-w-[180px]">
                          {visibleMaterials.map((material) => {
                            const isImage = material.type === 'image';
                            const imageSrc = material.dataUrl || material.url || '';

                            if (isImage && imageSrc) {
                              return (
                                <button
                                  key={material.id}
                                  type="button"
                                  onClick={() => setActiveImage({ src: imageSrc, name: material.name })}
                                  className="relative overflow-hidden rounded-md border border-indigo-200 bg-indigo-50 hover:bg-indigo-100 transition-colors"
                                  title={material.note || material.name}
                                >
                                  <img
                                    src={imageSrc}
                                    alt={material.name}
                                    className="w-16 h-16 object-cover"
                                  />
                                </button>
                              );
                            }

                            return (
                              <a
                                key={material.id}
                                href={material.url || '#'}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1 px-2 py-1 bg-indigo-100 hover:bg-indigo-200 text-indigo-700 text-xs rounded border border-indigo-200 transition-colors"
                                title={material.note || material.name}
                                onClick={(e) => {
                                  if (!material.url) {
                                    e.preventDefault();
                                  }
                                }}
                              >
                                <span className="flex-shrink-0">
                                  {getMaterialIcon(material.type)}
                                </span>
                                <span className="max-w-[140px] truncate">
                                  {material.name}
                                </span>
                              </a>
                            );
                          })}
                          {remainingMaterials > 0 && (
                            <span className="inline-flex items-center px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                              +{remainingMaterials}
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                    <div className="flex justify-between gap-2 pt-2 border-t border-indigo-100 sm:justify-end">
                      <button
                        onClick={() => handleEdit(task)}
                        className="px-3 py-2 text-indigo-600 hover:bg-indigo-100 rounded-lg transition text-sm whitespace-nowrap"
                      >
                        編輯
                      </button>
                      <button
                        onClick={() => handleDelete(task.id)}
                        className="px-3 py-2 text-red-600 hover:bg-red-100 rounded-lg transition text-sm whitespace-nowrap"
                      >
                        刪除
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Edit Modal */}
        {editingTask && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl p-6 max-w-3xl w-full max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold">編輯任務</h3>
                <button onClick={handleCancelEdit} className="text-gray-500 hover:text-gray-700">
                  <X className="w-6 h-6" />
                </button>
              </div>
              
              <div className="space-y-4">
                {/* 基本信息 */}
                <div>
                  <label className="block text-sm font-medium mb-1">任務名稱</label>
                  <input
                    type="text"
                    value={editingTask.name}
                    onChange={(e) => setEditingTask({...editingTask, name: e.target.value})}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">描述</label>
                  <textarea
                    value={editingTask.description}
                    onChange={(e) => setEditingTask({...editingTask, description: e.target.value})}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 h-20 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                {!isEditingLearning && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">開始日期</label>
                      <input
                        type="date"
                        value={editingTask.startDate}
                        onChange={(e) => setEditingTask({...editingTask, startDate: e.target.value})}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">結束日期</label>
                      <input
                        type="date"
                        value={editingTask.endDate}
                        onChange={(e) => setEditingTask({...editingTask, endDate: e.target.value})}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                )}

                {/* 状态和分类 */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">狀態</label>
                    <select
                      value={editingTask.status}
                      onChange={(e) => setEditingTask({ ...editingTask, status: e.target.value })}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="pending">待辦</option>
                      <option value="in-progress">進行中</option>
                      <option value="completed">已完成</option>
                      <option value="unpublished">已完成未發布</option>
                      <option value="blocked">卡關</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">分類</label>
                    <div className="space-y-2">
                      <select
                        value={editingTask.category || ''}
                        onChange={(e) => applyCategoryChange(e.target.value)}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="">請選擇分類</option>
                        {categoryOptions.map((option) => (
                          <option key={option} value={option}>
                            {option}
                          </option>
                        ))}
                      </select>
                      <input
                        type="text"
                        value={newCategoryDraft}
                        onChange={(e) => setNewCategoryDraft(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            handleAddCustomCategory();
                          }
                        }}
                        placeholder="輸入新分類後按 Enter 新增"
                        className="w-full border border-dashed border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                      {categoryOptions.some((option) => !defaultCategoryOptions.includes(option)) && (
                        <div className="flex flex-wrap items-center gap-2 pt-1">
                          <span className="text-xs text-slate-400">自訂分類：</span>
                          {categoryOptions
                            .filter((option) => !defaultCategoryOptions.includes(option))
                            .map((option) => (
                              <button
                                type="button"
                                key={`custom-${option}`}
                                onClick={() => handleRemoveCustomCategory(option)}
                                className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-slate-50 px-2 py-0.5 text-xs text-slate-600 hover:border-red-300 hover:bg-red-50 hover:text-red-600 transition"
                              >
                                <span>{option}</span>
                                <X className="w-3 h-3" />
                              </button>
                            ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {!isEditingLearning && (
                  <div>
                    <label className="block text-sm font-medium mb-1">進度：{editingTask.progress}%</label>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={editingTask.progress}
                      onChange={(e) => setEditingTask({...editingTask, progress: parseInt(e.target.value, 10)})}
                      className="w-full"
                    />
                  </div>
                )}

                {/* 补充材料管理 */}
                <div className="border-t pt-4 mt-4">
                  <h4 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
                    <Paperclip className="w-5 h-5" />
                    補充材料管理
                  </h4>

                  {/* 现有材料列表 */}
                  {editingTask.materials && editingTask.materials.length > 0 && (
                    <div className="mb-4 space-y-2">
                      {editingTask.materials.map((material) => {
                        const isImage = material.type === 'image';
                        const imageSrc = material.dataUrl || material.url || '';

                        return (
                          <div key={material.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
                            <div className="flex-shrink-0">
                              {isImage && imageSrc ? (
                                <button
                                  type="button"
                                  onClick={() => setActiveImage({ src: imageSrc, name: material.name })}
                                  className="block w-12 h-12 overflow-hidden rounded-md border border-blue-200"
                                >
                                  <img src={imageSrc} alt={material.name} className="w-full h-full object-cover" />
                                </button>
                              ) : (
                                <div className="text-blue-600">
                                  {getMaterialIcon(material.type)}
                                </div>
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="text-sm font-medium text-gray-800">{material.name}</div>
                              {material.url && (
                                <div className="text-xs text-gray-500 truncate">{material.url}</div>
                              )}
                              {material.note && (
                                <div className="text-xs text-gray-600 mt-1">{material.note}</div>
                              )}
                            </div>
                            <button
                              onClick={() => handleDeleteMaterial(material.id)}
                              className="text-red-600 hover:bg-red-50 p-2 rounded transition"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {/* 添加新材料 */}
                  <div className="p-4 bg-blue-50 rounded-lg space-y-3">
                    <div className="font-medium text-gray-700">新增補充材料</div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-medium mb-1">類型</label>
                        <select
                          value={newMaterial.type}
                          onChange={(e) => {
                            const nextType = e.target.value;
                            setNewMaterial((prev) => ({
                              ...prev,
                              type: nextType,
                              url: nextType === 'note' ? '' : prev.url,
                              dataUrl: nextType === 'image' ? prev.dataUrl : '',
                            }));
                          }}
                          className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                        >
                          <option value="link">🔗 連結</option>
                          <option value="file">📄 文件</option>
                          <option value="image">🖼️ 圖片</option>
                          <option value="note">📝 備註</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-medium mb-1">名稱 *</label>
                        <input
                          type="text"
                          value={newMaterial.name}
                          onChange={(e) => setNewMaterial({...newMaterial, name: e.target.value})}
                          placeholder="材料名稱"
                          className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                        />
                      </div>
                    </div>

                    {newMaterial.type !== 'note' && (
                      newMaterial.type === 'image' ? (
                        <div>
                          <label className="block text-xs font-medium mb-1">上傳圖片</label>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => {
                              const files = e.target.files || undefined;
                              const firstFile = files && files[0] ? files[0] : null;
                              handleMaterialImageSelect(firstFile);
                            }}
                            className="w-full border border-dashed border-blue-200 rounded px-3 py-2 text-sm bg-blue-50/60"
                          />
                          {newMaterial.dataUrl && (
                            <div className="mt-2 flex items-center gap-3">
                              <img
                                src={newMaterial.dataUrl}
                                alt="預覽圖片"
                                className="w-20 h-20 object-cover rounded-md border"
                              />
                              <button
                                type="button"
                                onClick={() => setNewMaterial({ ...newMaterial, dataUrl: '' })}
                                className="px-2 py-1 text-xs text-red-600 border border-red-200 rounded hover:bg-red-50"
                              >
                                移除圖片
                              </button>
                            </div>
                          )}
                          <p className="mt-1 text-xs text-gray-500">支援常見圖片格式，建議上限 2MB。</p>
                          <div className="mt-3">
                            <label className="block text-xs font-medium mb-1">圖片網址（選填）</label>
                            <input
                              type="text"
                              value={newMaterial.url}
                              onChange={(e) => setNewMaterial({...newMaterial, url: e.target.value})}
                              placeholder="https://..."
                              className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                            />
                          </div>
                        </div>
                      ) : (
                        <div>
                          <label className="block text-xs font-medium mb-1">連結/網址 *</label>
                          <input
                            type="text"
                            value={newMaterial.url}
                            onChange={(e) => setNewMaterial({...newMaterial, url: e.target.value})}
                            placeholder="https://..."
                            className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                          />
                        </div>
                      )
                    )}

                    {newMaterial.type === 'image' && (
                      <div>
                        <label className="block text-xs font-medium mb-1">備註（選填）</label>
                        <input
                          type="text"
                          value={newMaterial.note}
                          onChange={(e) => setNewMaterial({...newMaterial, note: e.target.value})}
                          placeholder="簡短說明..."
                          className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                        />
                      </div>
                    )}

                    {newMaterial.type !== 'image' && (
                      <div>
                        <label className="block text-xs font-medium mb-1">說明（選填）</label>
                        <input
                          type="text"
                          value={newMaterial.note}
                          onChange={(e) => setNewMaterial({...newMaterial, note: e.target.value})}
                          placeholder="簡短說明..."
                          className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                        />
                      </div>
                    )}

                    <button
                      onClick={handleAddMaterial}
                      className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center justify-center gap-2"
                    >
                      <Plus className="w-4 h-4" />
                      新增材料
                    </button>
                  </div>
                </div>
              </div>

              {/* 底部按钮 */}
              <div className="flex justify-end gap-3 mt-6 pt-4 border-t">
                <button
                  onClick={handleCancelEdit}
                  className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
                >
                  取消
                </button>
                <button
                  onClick={handleSaveEdit}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                >
                  保存修改
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
      {activeImage && (
        <div
          className="fixed inset-0 z-[999] flex items-center justify-center bg-black/80 backdrop-blur-sm overflow-hidden p-4 sm:p-10"
          onClick={() => setActiveImage(null)}
          data-ignore-pdf="true"
        >
          <div
            className="mx-auto w-full max-w-[90vw] bg-white rounded-xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div
              ref={imageViewerRef}
              className={`flex-1 min-h-[60vh] overflow-auto bg-black p-4 select-none ${viewerCursorClass}`}
              style={{ touchAction: 'pan-x pan-y pinch-zoom', overscrollBehavior: 'contain' }}
              onWheel={handleViewerWheel}
              onPointerDown={handleViewerPointerDown}
              onPointerMove={handleViewerPointerMove}
              onPointerUp={handleViewerPointerUp}
              onPointerCancel={handleViewerPointerCancel}
            >
              <img
                src={activeImage.src}
                alt={activeImage.name}
                className="block mx-auto"
                style={{ maxWidth: 'none', maxHeight: 'none' }}
                draggable={false}
                onLoad={(event) => {
                  const target = event.currentTarget;
                  target.style.width = `${target.naturalWidth}px`;
                  target.style.height = `${target.naturalHeight}px`;
                }}
              />
            </div>
            <div className="flex items-center justify-between gap-3 px-4 py-3 border-t">
              <div className="text-sm font-medium text-gray-700 truncate">{activeImage.name}</div>
              <button
                type="button"
                onClick={() => setActiveImage(null)}
                className="px-3 py-1.5 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded"
              >
                關閉
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

type WorkspaceSummary = {
  id: string;
  name: string;
  owner?: string;
  status?: string;
  color?: string;
  taskCount: number;
  range?: { start?: string; end?: string };
  updatedAt?: string;
  createdAt?: string;
  lastSyncedAt?: string;
};

type ManagementDashboardProps = {
  apiBaseUrl: string;
  onOpenWorkspace?: (workspaceId: string, options?: { newTab?: boolean }) => void;
  onNavigateHome?: () => void;
};

const ManagementDashboard: React.FC<ManagementDashboardProps> = ({ apiBaseUrl, onOpenWorkspace, onNavigateHome }) => {
  const [workspaces, setWorkspaces] = useState<WorkspaceSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [creating, setCreating] = useState(false);
  const [previewWorkspaceId, setPreviewWorkspaceId] = useState<string | null>(null);
  const [updatingStatusId, setUpdatingStatusId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    owner: '',
    start: '',
    end: '',
  });
  const [deletingWorkspaceId, setDeletingWorkspaceId] = useState<string | null>(null);

  const fetchWorkspaces = useCallback(async () => {
    if (!apiBaseUrl) {
      setErrorMessage('未設定 API 端點，無法載入工作區。');
      setLoading(false);
      return;
    }

    setLoading(true);
    setErrorMessage(null);
    try {
      const response = await fetch(`${apiBaseUrl}/workspaces`, { cache: 'no-store' });
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      const data = await response.json();
      const list = Array.isArray(data.workspaces) ? data.workspaces : [];
      setWorkspaces(
        list.map((item) => ({
          ...item,
          taskCount: typeof item.taskCount === 'number' ? item.taskCount : 0,
        })),
      );
    } catch (error) {
      console.error('[Management] Failed to fetch workspaces', error);
      setErrorMessage(error instanceof Error ? error.message : '無法載入工作區列表');
    } finally {
      setLoading(false);
    }
  }, [apiBaseUrl]);

  useEffect(() => {
    void fetchWorkspaces();
  }, [fetchWorkspaces]);

  const handleCreateWorkspace = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!apiBaseUrl) return;
    setCreating(true);
    setErrorMessage(null);
    try {
      const payload = {
        name: formData.name.trim() || undefined,
        owner: formData.owner.trim() || undefined,
        range:
          formData.start || formData.end
            ? { start: formData.start || '', end: formData.end || '' }
            : undefined,
      };
      const response = await fetch(`${apiBaseUrl}/workspaces`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!response.ok) {
        const detail = await response.json().catch(() => ({}));
        const message = detail?.error || detail?.detail || `HTTP ${response.status}`;
        throw new Error(message);
      }
      const created = await response.json();
      setFormData({ name: '', owner: '', start: '', end: '' });
      setFormOpen(false);
      await fetchWorkspaces();
      if (created?.id) {
        handleOpenWorkspace(created.id, { newTab: true });
      }
    } catch (error) {
      console.error('[Management] Failed to create workspace', error);
      setErrorMessage(error instanceof Error ? error.message : '建立工作區失敗');
    } finally {
      setCreating(false);
    }
  };

  const handleOpenWorkspace = (id: string, options?: { newTab?: boolean }) => {
    if (onOpenWorkspace) {
      onOpenWorkspace(id, options);
      return;
    }
    if (typeof window === 'undefined') return;
    if (options?.newTab) {
      window.open(buildWorkspaceUrl(id), '_blank', 'noopener');
    } else {
      window.location.href = buildWorkspaceUrl(id);
    }
  };

  const handlePreviewWorkspace = (id: string) => {
    setPreviewWorkspaceId(id);
  };

  const handleClosePreview = () => setPreviewWorkspaceId(null);

  const hasWorkspaces = workspaces.length > 0;
  const statusOptions = [
    { value: 'active', label: '進行中', color: '#ec4899' },
    { value: 'closed', label: '已結案', color: '#64748b' },
  ];

  const handleStatusChange = async (workspace: WorkspaceSummary, nextStatus: string) => {
    if (!apiBaseUrl || workspace.status === nextStatus) {
      return;
    }

    setUpdatingStatusId(workspace.id);
    setErrorMessage(null);
    try {
      const response = await fetch(`${apiBaseUrl}/workspaces/${encodeURIComponent(workspace.id)}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: nextStatus }),
      });

      if (!response.ok) {
        const detail = await response.json().catch(() => ({}));
        const message = detail?.error || detail?.detail || `HTTP ${response.status}`;
        throw new Error(message);
      }

      const result = await response.json();
      const updated = result?.workspace;
      if (updated) {
        setWorkspaces((prev) =>
          prev.map((item) =>
            item.id === workspace.id
              ? { ...item, status: updated.status ?? nextStatus, updatedAt: updated.updatedAt ?? item.updatedAt }
              : item
          )
        );
      } else {
        setWorkspaces((prev) =>
          prev.map((item) => (item.id === workspace.id ? { ...item, status: nextStatus } : item))
        );
      }
    } catch (error) {
      console.error('[Management] Failed to update workspace status', error);
      setErrorMessage(error instanceof Error ? error.message : '更新狀態失敗');
    } finally {
      setUpdatingStatusId(null);
    }
  };

  const handleDeleteWorkspace = async (workspace: WorkspaceSummary) => {
    if (!apiBaseUrl) return;
    if (workspace.id === DEFAULT_WORKSPACE_ID) {
      setErrorMessage('預設工作區無法刪除');
      return;
    }

    const confirmed =
      typeof window !== 'undefined'
        ? window.confirm(`確定刪除「${workspace.name || workspace.id}」？此操作無法復原。`)
        : true;
    if (!confirmed) {
      return;
    }

    setDeletingWorkspaceId(workspace.id);
    setErrorMessage(null);
    try {
      const response = await fetch(`${apiBaseUrl}/workspaces/${encodeURIComponent(workspace.id)}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const detail = await response.json().catch(() => ({}));
        const message = detail?.error || detail?.detail || `HTTP ${response.status}`;
        throw new Error(message);
      }

      setWorkspaces((prev) => prev.filter((item) => item.id !== workspace.id));
    } catch (error) {
      console.error('[Management] Failed to delete workspace', error);
      setErrorMessage(error instanceof Error ? error.message : '刪除失敗');
    } finally {
      setDeletingWorkspaceId(null);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/60 to-indigo-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
        <header className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-white/70 border border-white py-1 px-3 shadow-sm text-sm text-indigo-600 font-medium">
              <LayoutGrid className="w-4 h-4" />
              甘特圖管理
            </div>
            <h1 className="mt-3 text-3xl font-semibold text-slate-900">
              七彩甘特圖管理器
            </h1>
            <p className="mt-2 text-sm text-slate-600 max-w-2xl">
              集中檢視所有專案甘特圖、追蹤負責人與時程，並快速開啟或建立新的工作區。
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {onNavigateHome && (
              <button
                onClick={onNavigateHome}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-white rounded-lg border border-slate-200 transition-colors"
              >
                返回工作區
              </button>
            )}
            <button
              onClick={() => void fetchWorkspaces()}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-white rounded-lg border border-slate-200 transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
              重新整理
            </button>
            <button
              onClick={() => setFormOpen((prev) => !prev)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-white bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-lg shadow hover:shadow-md transition-colors"
            >
              <Plus className="w-4 h-4" />
              新增甘特圖
            </button>
          </div>
        </header>

        {errorMessage && (
          <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600 shadow-sm">
            {errorMessage}
          </div>
        )}

        {formOpen && (
          <form
            onSubmit={handleCreateWorkspace}
            className="bg-white rounded-xl shadow-lg border border-slate-100 p-6 space-y-4"
          >
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h2 className="text-lg font-semibold text-slate-900">建立新的甘特圖</h2>
                <p className="text-sm text-slate-500">
                  輸入專案名稱與基本資訊，系統會建立空白甘特圖供你設定。
                </p>
              </div>
              <button
                type="button"
                onClick={() => setFormOpen(false)}
                className="text-sm text-slate-500 hover:text-slate-700"
              >
                取消
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <label className="flex flex-col gap-2 text-sm text-slate-700">
                專案名稱 *
                <input
                  required
                  value={formData.name}
                  onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                  placeholder="例如：2025 Q1 行銷計畫"
                  className="rounded-lg border border-slate-200 px-3 py-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </label>
              <label className="flex flex-col gap-2 text-sm text-slate-700">
                負責人
                <input
                  value={formData.owner}
                  onChange={(e) => setFormData((prev) => ({ ...prev, owner: e.target.value }))}
                  placeholder="負責人"
                  className="rounded-lg border border-slate-200 px-3 py-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </label>
              <label className="flex flex-col gap-2 text-sm text-slate-700">
                開始日期
                <input
                  type="date"
                  value={formData.start}
                  onChange={(e) => setFormData((prev) => ({ ...prev, start: e.target.value }))}
                  className="rounded-lg border border-slate-200 px-3 py-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </label>
              <label className="flex flex-col gap-2 text-sm text-slate-700">
                結束日期
                <input
                  type="date"
                  value={formData.end}
                  min={formData.start || undefined}
                  onChange={(e) => setFormData((prev) => ({ ...prev, end: e.target.value }))}
                  className="rounded-lg border border-slate-200 px-3 py-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </label>
            </div>
            <div className="flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => {
                  setFormOpen(false);
                  setFormData({ name: '', owner: '', start: '', end: '' });
                }}
                className="px-4 py-2 text-sm text-slate-500 hover:text-slate-700"
              >
                關閉
              </button>
              <button
                type="submit"
                disabled={creating}
                className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg shadow hover:bg-indigo-700 disabled:opacity-70"
              >
                {creating && <Loader2 className="w-4 h-4 animate-spin" />}
                建立
              </button>
            </div>
          </form>
        )}

        <section className="bg-white rounded-xl shadow-lg border border-slate-100 overflow-hidden">
          <div className="px-4 sm:px-6 py-4 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-slate-900">甘特圖清單</h2>
              <p className="text-xs text-slate-500">
                共 {workspaces.length} 個工作區
              </p>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-100 text-sm">
              <thead className="bg-slate-50">
                <tr className="text-slate-500 text-xs uppercase tracking-wide">
                  <th className="px-4 py-3 text-left">專案</th>
                  <th className="px-4 py-3 text-left">負責人</th>
                  <th className="px-4 py-3 text-left">期間</th>
                  <th className="px-4 py-3 text-center">任務數</th>
                  <th className="px-4 py-3 text-left">狀態</th>
                  <th className="px-4 py-3 text-left">最近更新</th>
                  <th className="px-4 py-3 text-right">操作</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                {loading ? (
                  <tr>
                    <td colSpan={7} className="px-4 py-10 text-center text-slate-500">
                      <div className="inline-flex items-center gap-2 text-sm">
                        <Loader2 className="w-4 h-4 animate-spin" />
                        載入中…
                      </div>
                    </td>
                  </tr>
                ) : hasWorkspaces ? (
                  workspaces.map((workspace) => (
                    <tr key={workspace.id} className="hover:bg-slate-50/70 transition">
                      <td className="px-4 py-3">
                        <div className="flex flex-col">
                          <span className="font-medium text-slate-900">
                            {workspace.name || '未命名專案'}
                          </span>
                          <span className="text-xs text-slate-400">
                            ID: {workspace.id}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-slate-600">
                        {workspace.owner || '—'}
                      </td>
                      <td className="px-4 py-3 text-slate-600">
                        {formatDateRangeLabel(workspace.range)}
                      </td>
                      <td className="px-4 py-3 text-center font-semibold text-slate-800">
                        {workspace.taskCount}
                      </td>
                      <td className="px-4 py-3">
                        <label className="inline-flex items-center gap-2 text-xs font-medium text-slate-600">
                          <span
                            className="w-2.5 h-2.5 rounded-full"
                            style={{
                              backgroundColor:
                                statusOptions.find((option) => option.value === workspace.status)?.color ||
                                workspace.color ||
                                '#6366f1',
                            }}
                          ></span>
                          <select
                            className="rounded-lg border border-slate-200 px-2 py-1 text-xs text-slate-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 disabled:bg-slate-100 disabled:text-slate-400"
                            value={workspace.status || 'active'}
                            onChange={(e) => handleStatusChange(workspace, e.target.value)}
                            disabled={updatingStatusId === workspace.id}
                          >
                            {statusOptions.map((option) => (
                              <option key={option.value} value={option.value}>
                                {option.label}
                              </option>
                            ))}
                          </select>
                        </label>
                      </td>
                      <td className="px-4 py-3 text-slate-500">
                        {formatUpdatedAtLabel(workspace.updatedAt)}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => handlePreviewWorkspace(workspace.id)}
                            className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-2.5 py-1.5 text-xs font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            預覽
                          </button>
                          <button
                            onClick={() => handleOpenWorkspace(workspace.id)}
                            className="inline-flex items-center gap-1 rounded-lg bg-indigo-600 px-2.5 py-1.5 text-xs font-medium text-white shadow hover:bg-indigo-700 transition"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                            開啟
                          </button>
                          <button
                            onClick={() => handleDeleteWorkspace(workspace)}
                            className={`inline-flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-xs font-medium transition border ${
                              workspace.id === DEFAULT_WORKSPACE_ID
                                ? 'border-slate-200 text-slate-300 cursor-not-allowed'
                                : 'border-red-200 text-red-600 hover:bg-red-50'
                            }`}
                            disabled={
                              workspace.id === DEFAULT_WORKSPACE_ID || deletingWorkspaceId === workspace.id
                            }
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            刪除
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} className="px-4 py-12 text-center text-slate-500">
                      目前尚未建立任何甘特圖。點擊「新增甘特圖」開始第一個專案。
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>

        {previewWorkspaceId && (
          <section className="bg-white rounded-xl shadow-lg border border-slate-100 overflow-hidden">
            <div className="flex items-center justify-between px-4 sm:px-6 py-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-2 rounded-full bg-indigo-100 text-indigo-600 px-2.5 py-1 text-xs font-semibold">
                  <Eye className="w-3.5 h-3.5" />
                  即時預覽
                </span>
                <span className="text-sm text-slate-600">
                  {workspaces.find((item) => item.id === previewWorkspaceId)?.name || '未命名專案'}
                </span>
              </div>
              <button
                onClick={handleClosePreview}
                className="text-xs text-slate-500 hover:text-slate-700"
              >
                關閉
              </button>
            </div>
            <div className="relative bg-slate-100">
              <iframe
                key={previewWorkspaceId}
                src={buildWorkspaceUrl(previewWorkspaceId, { embed: '1' })}
                className="w-full h-[560px] border-0"
                title="甘特圖預覽"
              ></iframe>
            </div>
          </section>
        )}
      </div>
    </div>
  );
};

type WorkspaceRouteProps = {
  apiBaseUrl: string;
};

const ApiConfigError: React.FC = () => (
  <div className="min-h-screen bg-slate-900 text-slate-200 flex items-center justify-center">
    <div className="text-center space-y-3">
      <h1 className="text-xl font-semibold">API 端點未設定</h1>
      <p className="text-sm text-slate-400">請確認部署環境變數或本地設定。</p>
    </div>
  </div>
);

const getLocationSnapshot = () =>
  typeof window === 'undefined'
    ? { pathname: '/', search: '' }
    : { pathname: window.location.pathname, search: window.location.search };

const AppShell: React.FC = () => {
  const [locationSnapshot, setLocationSnapshot] = useState(() => ENTRY_OVERRIDE ?? getLocationSnapshot());
  const apiBaseUrl = useMemo(() => resolveApiBaseUrl(), []);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }
    const handlePopState = () => {
      setLocationSnapshot(getLocationSnapshot());
    };
    window.addEventListener('popstate', handlePopState);
    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      (window as any).__GANTT_ENTRY_OVERRIDE = null;
    }
  }, []);

  const handleUpdateWorkspace = useCallback((nextWorkspaceId?: string) => {
    if (typeof window === 'undefined') {
      return;
    }
  const params = new URLSearchParams(window.location.search || '');
  if (nextWorkspaceId) {
    params.set('workspace', nextWorkspaceId);
  }
  const nextUrl = `${window.location.pathname}?${params.toString()}`;
    window.history.replaceState({ workspaceId: nextWorkspaceId }, '', nextUrl);
    setLocationSnapshot(getLocationSnapshot());
  }, []);

  const handleNavigateManager = useCallback(() => {
    if (typeof window !== 'undefined') {
      window.location.href = '/management';
    }
  }, []);

  const handleOpenWorkspace = useCallback((workspaceId: string, options?: { newTab?: boolean }) => {
    if (typeof window === 'undefined') {
      return;
    }
    const target = buildWorkspaceUrl(workspaceId);
    if (options?.newTab) {
      window.open(target, '_blank', 'noopener');
    } else {
      window.location.href = target;
    }
  }, []);

  if (!apiBaseUrl) {
    return <ApiConfigError />;
  }

  const params = new URLSearchParams(locationSnapshot.search || '');
  const workspaceId = params.get('workspace')?.trim() || DEFAULT_WORKSPACE_ID;
  const embed = ['1', 'true', 'yes'].includes((params.get('embed') || '').toLowerCase());

  const mode = locationSnapshot.pathname.startsWith('/management') ? 'manager' : 'workspace';

  if (mode === 'manager') {
    return (
      <ManagementDashboard
        apiBaseUrl={apiBaseUrl}
        onOpenWorkspace={(id, options) => handleOpenWorkspace(id, options)}
        onNavigateHome={() => handleOpenWorkspace(workspaceId)}
      />
    );
  }

  return (
    <GanttWorkspaceApp
      workspaceId={workspaceId}
      embedMode={embed}
      apiBaseUrl={apiBaseUrl}
      onContextRefresh={handleUpdateWorkspace}
      onOpenManager={handleNavigateManager}
    />
  );
};

export const routes = [
  {
    path: '/*',
    element: <AppShell />,
  },
];

export default AppShell;
