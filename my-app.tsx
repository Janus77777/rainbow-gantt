import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { FileText, Edit2, Trash2, Plus, Link as LinkIcon, Image, File, ExternalLink, Paperclip, X } from 'lucide-react';

const catAvatar =
  'data:image/jpeg;base64,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';

const mergeMaterials = (remoteMaterials = [], localMaterials = []) => {
  const merged = [];
  const indexById = new Map();

  if (Array.isArray(remoteMaterials)) {
    remoteMaterials.forEach((material) => {
      if (!material) return;
      const copy = { ...material };
      const position = merged.push(copy) - 1;
      if (copy.id !== undefined && copy.id !== null) {
        indexById.set(copy.id, position);
      }
    });
  }

  if (Array.isArray(localMaterials)) {
    localMaterials.forEach((material) => {
      if (!material) return;
      const key = material.id;
      if (key !== undefined && key !== null && indexById.has(key)) {
        const targetIndex = indexById.get(key);
        const existing = merged[targetIndex];
        merged[targetIndex] = {
          ...existing,
          ...material,
          dataUrl: material.dataUrl || existing?.dataUrl || '',
        };
      } else {
        const copy = { ...material };
        const position = merged.push(copy) - 1;
        if (copy.id !== undefined && copy.id !== null) {
          indexById.set(copy.id, position);
        }
      }
    });
  }

  return merged;
};

const mergeTasks = (remoteTasks = [], localTasks = []) => {
  const merged = [];
  const indexById = new Map();

  if (Array.isArray(remoteTasks)) {
    remoteTasks.forEach((task) => {
      if (!task) return;
      const copy = {
        ...task,
        materials: mergeMaterials(task.materials, []),
      };
      const position = merged.push(copy) - 1;
      if (copy.id !== undefined && copy.id !== null) {
        indexById.set(copy.id, position);
      }
    });
  }

  if (Array.isArray(localTasks)) {
    localTasks.forEach((task) => {
      if (!task) return;
      const key = task.id;
      if (key !== undefined && key !== null && indexById.has(key)) {
        const targetIndex = indexById.get(key);
        const existing = merged[targetIndex];
        merged[targetIndex] = {
          ...existing,
          ...task,
          materials: mergeMaterials(existing?.materials, task.materials),
        };
      } else {
        const copy = {
          ...task,
          materials: mergeMaterials([], task.materials),
        };
        const position = merged.push(copy) - 1;
        if (copy.id !== undefined && copy.id !== null) {
          indexById.set(copy.id, position);
        }
      }
    });
  }

  return merged;
};

const sanitizeTasksForSync = (tasks) =>
  (Array.isArray(tasks) ? tasks : []).map((task) => ({
    ...task,
    materials: Array.isArray(task.materials)
      ? task.materials.map((material) => {
          if (!material) return material;
          // Remove dataUrl from ALL materials, not just images
          // This ensures we never accidentally send base64 data to the server
          const { dataUrl, ...rest } = material;
          return rest;
        })
      : [],
  }));

const GanttManager = () => {
  const appRef = useRef(null);
  const initialTasks = [
    {
      id: 1,
      name: '會議記錄工具開發',
      startDate: '2025-09-01',
      endDate: '2025-10-22',
      status: 'completed',
      category: 'AI賦能',
      progress: 100,
      description: 'Electron桌面應用，含STT轉錄、AI摘要',
      materials: [
        { id: 1, type: 'link', name: '動態說明書', url: 'https://example.com/docs', note: '完整使用文檔' },
        { id: 2, type: 'link', name: '專案架構文件', url: 'https://example.com/architecture', note: '技術架構說明' }
      ]
    },
    {
      id: 2,
      name: '銷售流程圖',
      startDate: '2025-09-15',
      endDate: '2025-10-05',
      status: 'completed',
      category: '流程優化',
      progress: 100,
      description: '訪談銷售同事，繪製流程圖',
      materials: []
    },
    {
      id: 3,
      name: 'iMobile 產品網站',
      startDate: '2025-09-20',
      endDate: '2025-10-22',
      status: 'completed',
      category: '產品行銷',
      progress: 100,
      description: '產品介紹網頁製作與上線',
      materials: [
        { id: 1, type: 'link', name: '線上網站', url: 'https://imobilebi.com', note: 'iMobile BI 產品官網' }
      ]
    },
    {
      id: 4,
      name: 'MSTR 產品網站',
      startDate: '2025-10-23',
      endDate: '2025-10-31',
      status: 'in-progress',
      category: '產品行銷',
      progress: 70,
      description: '產品介紹網頁製作中',
      materials: []
    },
    {
      id: 5,
      name: 'DemandETL 產品網站',
      startDate: '2025-11-01',
      endDate: '2025-11-15',
      status: 'pending',
      category: '產品行銷',
      progress: 0,
      description: '第三個產品網站製作',
      materials: []
    },
    {
      id: 6,
      name: '三個網站優化',
      startDate: '2025-11-01',
      endDate: '2025-11-30',
      status: 'pending',
      category: '產品行銷',
      progress: 0,
      description: '根據回饋優化三個產品網站',
      materials: []
    },
    {
      id: 7,
      name: 'GA 流量分析設定',
      startDate: '2025-11-05',
      endDate: '2025-11-15',
      status: 'pending',
      category: '產品行銷',
      progress: 0,
      description: '導入SEO關鍵字與GA流量統計',
      materials: []
    },
    {
      id: 8,
      name: 'SOP 撰寫',
      startDate: '2025-11-01',
      endDate: '2025-11-20',
      status: 'pending',
      category: '流程優化',
      progress: 0,
      description: '銷售團隊標準作業程序文件',
      materials: []
    },
    {
      id: 9,
      name: 'SEO 優化執行',
      startDate: '2025-11-10',
      endDate: '2025-11-25',
      status: 'pending',
      category: '品牌行銷',
      progress: 0,
      description: '網站與文章SEO優化',
      materials: []
    },
    {
      id: 10,
      name: '季度成效報告',
      startDate: '2025-11-23',
      endDate: '2025-11-30',
      status: 'pending',
      category: '品牌行銷',
      progress: 0,
      description: '三個月工作成果總結報告',
      materials: []
    },
    {
      id: 11,
      name: '品牌文章撰寫',
      startDate: '2025-09-10',
      endDate: '2025-11-30',
      status: 'unpublished',
      category: '品牌行銷',
      progress: 78,
      description: '已完成7篇，待審查發布',
      materials: []
    },
    {
      id: 12,
      name: '客戶開發（Capalyze）',
      startDate: '2025-10-10',
      endDate: '2025-11-15',
      status: 'blocked',
      category: '客戶開發',
      progress: 30,
      description: '技術卡關中',
      materials: []
    },
    {
      id: 13,
      name: 'Agentic Coding 工具研究',
      startDate: '2025-09-05',
      endDate: '2025-10-20',
      status: 'completed',
      category: '學習與成長',
      progress: 100,
      description: '研究AI編程工具',
      materials: []
    },
    {
      id: 15,
      name: '版本控制工具學習',
      startDate: '2025-09-10',
      endDate: '2025-10-15',
      status: 'completed',
      category: '學習與成長',
      progress: 100,
      description: 'Git工具研究',
      materials: []
    },
    {
      id: 26,
      name: 'CI/CD 方法學習',
      startDate: '2025-10-01',
      endDate: '2025-11-05',
      status: 'in-progress',
      category: '學習與成長',
      progress: 40,
      description: '持續整合/部署流程實作',
      materials: []
    },
    {
      id: 16,
      name: 'Prompt Engineering 研究',
      startDate: '2025-09-20',
      endDate: '2025-11-30',
      status: 'in-progress',
      category: '學習與成長',
      progress: 65,
      description: '提示詞工程研究',
      materials: []
    },
    {
      id: 17,
      name: '跨平台開發踩坑紀錄',
      startDate: '2025-09-15',
      endDate: '2025-10-22',
      status: 'completed',
      category: '學習與成長',
      progress: 100,
      description: 'Electron開發經驗',
      materials: []
    },
    {
      id: 18,
      name: '內容自動化工作流',
      startDate: '2025-10-01',
      endDate: '2025-11-30',
      status: 'in-progress',
      category: '學習與成長',
      progress: 40,
      description: 'n8n/Dify 自動化系統',
      materials: []
    },
    {
      id: 19,
      name: 'AI工作流持續研究',
      startDate: '2025-09-01',
      endDate: '2025-11-30',
      status: 'in-progress',
      category: '學習與成長',
      progress: 50,
      description: 'MCP、Computer Use 追蹤',
      materials: []
    }
  ];

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

  const resolvedEnvApiBase = (() => {
    const value = import.meta.env?.VITE_API_BASE_URL;
    return typeof value === 'string' ? value.trim() : '';
  })();

  const rawApiBase = resolvedEnvApiBase || computeDefaultApiBase();
  const API_BASE_URL = rawApiBase ? rawApiBase.replace(/\/$/, '') : '';
  const [apiAvailable, setApiAvailable] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncError, setSyncError] = useState(null);
  const [tasks, setTasks] = useState(() => {
    if (typeof window !== 'undefined') {
      try {
        const stored = window.localStorage.getItem('ganttTasks');
        if (stored) {
          return JSON.parse(stored);
        }
      } catch (error) {
        console.error('Failed to parse stored tasks', error);
      }
    }
    return initialTasks;
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        window.localStorage.setItem('ganttTasks', JSON.stringify(tasks));
      } catch (error) {
        console.error('Failed to persist tasks', error);
      }
    }
  }, [tasks]);

  useEffect(() => {
    let cancelled = false;

    const fetchTasksFromApi = async () => {
      if (typeof window === 'undefined' || !API_BASE_URL) {
        return;
      }

      try {
        const response = await fetch(`${API_BASE_URL}/tasks`, { cache: 'no-store' });
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }
        const data = await response.json();
        if (!cancelled && Array.isArray(data)) {
          let mergedData = data;
          if (typeof window !== 'undefined') {
            try {
              const stored = window.localStorage.getItem('ganttTasks');
              if (stored) {
                const localTasks = JSON.parse(stored);
                if (Array.isArray(localTasks)) {
                  mergedData = mergeTasks(data, localTasks);
                }
              }
            } catch (storageError) {
              console.warn('Failed to merge local tasks with API response', storageError);
            }
          }

          setTasks(mergedData);
          setApiAvailable(true);
        }
      } catch (error) {
        console.warn('Failed to load tasks from API, falling back to local storage', error);
      }
    };

    fetchTasksFromApi();

    return () => {
      cancelled = true;
    };
  }, [API_BASE_URL]);

  const persistTasks = async (nextTasks) => {
    if (!API_BASE_URL) {
      return;
    }

    const payload = sanitizeTasksForSync(nextTasks);
    const payloadSize = JSON.stringify(payload).length;

    console.log(`[Frontend] Syncing ${payload.length} tasks, payload size: ${payloadSize} bytes`);

    try {
      setIsSyncing(true);
      setSyncError(null); // Clear previous errors

      const response = await fetch(`${API_BASE_URL}/tasks`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

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

      try {
        const latestResponse = await fetch(`${API_BASE_URL}/tasks`, { cache: 'no-store' });
        if (latestResponse.ok) {
          const latestData = await latestResponse.json();
          if (Array.isArray(latestData)) {
            let merged = latestData;
            if (typeof window !== 'undefined') {
              try {
                const stored = window.localStorage.getItem('ganttTasks');
                if (stored) {
                  const localTasks = JSON.parse(stored);
                  if (Array.isArray(localTasks)) {
                    merged = mergeTasks(latestData, localTasks);
                  }
                }
              } catch (mergeError) {
                console.warn('Failed to merge local tasks after sync', mergeError);
              }
            }
            setTasks(merged);
          }
        }
      } catch (refreshError) {
        console.warn('Failed to refresh tasks after sync', refreshError);
      }
      setApiAvailable(true);
      console.log('[Frontend] Sync successful');
    } catch (error) {
      console.error('[Frontend] Failed to sync tasks to API, switching to offline mode');
      console.error('[Frontend] Error details:', {
        message: error?.message,
        stack: error?.stack,
        payloadSize,
        taskCount: payload.length
      });

      const errorMessage = error?.message || '未知錯誤';
      setSyncError(errorMessage);
      setApiAvailable(false);

      // Auto-clear error after 10 seconds
      setTimeout(() => setSyncError(null), 10000);
    } finally {
      setIsSyncing(false);
    }
  };

  const updateTasks = (updater) => {
    setTasks((prevTasks) => {
      const nextTasks = typeof updater === 'function' ? updater(prevTasks) : updater;
      persistTasks(nextTasks);
      return nextTasks;
    });
  };

  const [editingTask, setEditingTask] = useState(null);
  const [activeImage, setActiveImage] = useState(null);
  const [newMaterial, setNewMaterial] = useState({ type: 'link', name: '', url: '', note: '', dataUrl: '' });
  const [projectTitle, setProjectTitle] = useState(() => {
    if (typeof window !== 'undefined') {
      const stored = window.localStorage.getItem('ganttProjectTitle');
      if (stored) return stored;
    }
    return '入職三個月目標';
  });
  const [projectTitleDraft, setProjectTitleDraft] = useState(projectTitle);
  const [isTitleEditing, setIsTitleEditing] = useState(false);
  const [containerWidth, setContainerWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1920);
  const [draggedTaskId, setDraggedTaskId] = useState(null);
  const [dragOverTaskId, setDragOverTaskId] = useState(null);
  const [isPanningImage, setIsPanningImage] = useState(false);
  const imageViewerRef = useRef<HTMLDivElement | null>(null);
  const panStateRef = useRef({
    isDragging: false,
    startX: 0,
    startY: 0,
    scrollLeft: 0,
    scrollTop: 0,
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleResize = () => {
      setContainerWidth(window.innerWidth);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        window.localStorage.setItem('ganttProjectTitle', projectTitle);
      } catch (error) {
        console.warn('Failed to persist project title', error);
      }
    }
  }, [projectTitle]);

  useEffect(() => {
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

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      if (!panStateRef.current.isDragging || !imageViewerRef.current) return;
      event.preventDefault();
      const dx = event.clientX - panStateRef.current.startX;
      const dy = event.clientY - panStateRef.current.startY;
      imageViewerRef.current.scrollLeft = panStateRef.current.scrollLeft - dx;
      imageViewerRef.current.scrollTop = panStateRef.current.scrollTop - dy;
    };

    const handleMouseUp = () => {
      if (!panStateRef.current.isDragging) return;
      panStateRef.current.isDragging = false;
      setIsPanningImage(false);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, []);

  const msPerDay = 1000 * 60 * 60 * 24;
  const isEditingLearning = editingTask?.category === '學習與成長';

  const executionTasks = useMemo(
    () => tasks.filter(t => t.category !== '學習與成長'),
    [tasks]
  );

  const learningTasks = useMemo(
    () => tasks.filter(t => t.category === '學習與成長'),
    [tasks]
  );

  const parseDate = (dateString) => {
    if (!dateString) return null;
    return new Date(`${dateString}T00:00:00Z`);
  };

  const toInputDate = (date) => {
    if (!date) return '';
    const tzOffset = date.getTimezoneOffset() * 60000;
    return new Date(date.getTime() - tzOffset).toISOString().slice(0, 10);
  };

  const formatTaskDate = (dateString) => {
    const parsed = parseDate(dateString);
    if (!parsed) return '';

    return new Intl.DateTimeFormat('zh-TW', {
      month: '2-digit',
      day: '2-digit',
      timeZone: 'UTC',
    }).format(parsed);
  };

  // 任務時間範圍
  const fallbackStart = parseDate('2025-09-01');
  const fallbackEnd = parseDate('2025-11-30');

  const executionStartDates = executionTasks
    .map(task => parseDate(task.startDate))
    .filter(Boolean);
  const executionEndDates = executionTasks
    .map(task => parseDate(task.endDate))
    .filter(Boolean);

  const timelineStart = executionStartDates.length
    ? new Date(Math.min(...executionStartDates.map(date => date.getTime())))
    : fallbackStart;

  const rawTimelineEnd = executionEndDates.length
    ? new Date(Math.max(...executionEndDates.map(date => date.getTime())))
    : fallbackEnd;

  const timelineEnd = rawTimelineEnd < timelineStart ? new Date(timelineStart) : rawTimelineEnd;

  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const todayLabel = `${String(today.getMonth() + 1).padStart(2, '0')}/${String(today.getDate()).padStart(2, '0')}`;
  const totalDays = Math.max(1, Math.floor((timelineEnd - timelineStart) / msPerDay) + 1);

  // 響應式寬度計算
  const containerPadding = 48; // 左右各 24px padding (px-6)
  const cardPadding = 48; // 卡片內的 padding (p-6)
  const safetyMargin = 40; // 額外安全邊距
  const trackPaddingLeft = 60;
  const trackPaddingRight = 60;
  const totalReservedSpace = containerPadding + cardPadding + safetyMargin + trackPaddingLeft + trackPaddingRight;
  const availableWidth = containerWidth - totalReservedSpace;
  const calculatedDayWidth = availableWidth / totalDays;
  const minDayWidth = 7; // 最小每日寬度，避免太擠
  const maxDayWidth = 22; // 最大每日寬度，避免太寬
  const dayWidth = Math.max(minDayWidth, Math.min(maxDayWidth, calculatedDayWidth));
  const timelinePixelWidth = totalDays * dayWidth;
  const timelineTotalWidth = timelinePixelWidth;

  const addDays = (baseDate, days) => new Date(baseDate.getTime() + days * msPerDay);

  const timelineDays = useMemo(() => {
    return Array.from({ length: totalDays }, (_, index) => {
      const date = addDays(timelineStart, index);
      return { index, date };
    });
  }, [timelineStart, totalDays]);

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

      segments.push({
        key: `${year}-${month + 1}`,
        text: `${year}年 ${month + 1}月`,
        startIndex,
        dayCount,
        width: dayCount * dayWidth,
      });
    }

    return segments;
  }, [timelineDays, dayWidth]);

  const weekSegments = useMemo(() => {
    if (!timelineDays.length) {
      return [];
    }

    const getWeekStartKey = (date) => {
      const day = date.getUTCDay();
      const diff = day === 0 ? -6 : 1 - day; // align weeks to Monday
      const weekStart = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate() + diff));
      return weekStart.toISOString().slice(0, 10);
    };

    const map = new Map();

    timelineDays.forEach(({ date, index }) => {
      const key = getWeekStartKey(date);
      if (!map.has(key)) {
        map.set(key, {
          key,
          startIndex: index,
          firstDate: date,
          lastDate: date,
          dayCount: 0,
        });
      }
      const entry = map.get(key);
      entry.dayCount += 1;
      entry.lastDate = date;
    });

    const sorted = Array.from(map.values()).sort((a, b) => a.startIndex - b.startIndex);
    let weekNumber = 1;

    return sorted.map((entry) => ({
      key: `week-${entry.startIndex}`,
      label: `第${weekNumber++}週 ${formatMonthDay(entry.firstDate)}-${formatMonthDay(entry.lastDate)}`,
      startIndex: entry.startIndex,
      dayCount: entry.dayCount,
      width: entry.dayCount * dayWidth,
    }));
  }, [timelineDays, dayWidth, formatMonthDay]);

  const todayIndexRaw = Math.floor((today - timelineStart) / msPerDay);
  const todayIndexClamped = Math.max(0, Math.min(totalDays - 1, todayIndexRaw));
  const showTodayMarker = todayIndexRaw >= 0 && todayIndexRaw < totalDays;
  const todayColumnLeft = todayIndexClamped * dayWidth;

  const timelineScrollWidth = timelinePixelWidth + trackPaddingLeft + trackPaddingRight;

  const timelineOuterStyle = useMemo(
    () => ({
      minWidth: `${timelineScrollWidth}px`,
    }),
    [timelineScrollWidth]
  );

  const timelineInnerStyle = useMemo(
    () => ({
      width: `${timelineScrollWidth}px`,
      minWidth: `${timelineScrollWidth}px`,
    }),
    [timelineScrollWidth]
  );

  const dayGridBackground = useMemo(
    () => ({
      backgroundImage: `repeating-linear-gradient(to right, transparent, transparent ${dayWidth - 1}px, rgba(226, 232, 240, 0.8) ${dayWidth - 1}px, rgba(226, 232, 240, 0.8) ${dayWidth}px)`,
      backgroundSize: `${dayWidth}px 100%`,
      backgroundRepeat: 'repeat',
    }),
    [dayWidth]
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
        .map((week) => week.startIndex * dayWidth + trackPaddingLeft),
    [weekSegments, dayWidth, trackPaddingLeft]
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
    const todayStripeWidth = `${dayWidth}px`;

    // 判斷是否為短任務（3天以內）
    const isShortTask = taskDays <= 3;

    const maxMaterialsToShow = 3;
    const visibleMaterials = task.materials?.slice(0, maxMaterialsToShow) || [];
    const remainingMaterials = (task.materials?.length || 0) - maxMaterialsToShow;

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
              <span className={`${categoryColor} text-white text-xs px-2 py-0.5 rounded-full`}>
                {task.category}
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
            className={`${categoryColor} absolute top-5 h-9 rounded-full shadow-sm flex items-center justify-center text-white text-xs font-semibold`}
            style={{ left: barLeft, width: barWidth }}
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
      return { left: 0, width: dayWidth };
    }

    const startOffset = Math.floor((start - timelineStart) / msPerDay);
    const endOffset = Math.floor((end - timelineStart) / msPerDay);

    const clampedStart = Math.max(0, Math.min(totalDays - 1, startOffset));
    const clampedEnd = Math.max(clampedStart, Math.min(totalDays - 1, endOffset));
    const widthDays = Math.max(1, clampedEnd - clampedStart + 1);

    return {
      left: clampedStart * dayWidth,
      width: widthDays * dayWidth,
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
    if (category === 'AI賦能') return 'bg-purple-500';
    if (category === '流程優化') return 'bg-blue-500';
    if (category === '產品行銷') return 'bg-green-500';
    if (category === '品牌行銷') return 'bg-yellow-500';
    if (category === '客戶開發') return 'bg-red-500';
    if (category === '學習與成長') return 'bg-indigo-500';
    return 'bg-gray-500';
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
      description: editingTask.description?.trim() ?? '',
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

  const categoryMeta = [
    { key: 'AI賦能', label: 'AI賦能', color: '#a855f7' },
    { key: '流程優化', label: '流程優化', color: '#3b82f6' },
    { key: '產品行銷', label: '產品行銷', color: '#22c55e' },
    { key: '品牌行銷', label: '品牌行銷', color: '#eab308' },
    { key: '客戶開發', label: '客戶開發', color: '#ef4444' },
  ];

  const stats = {
    total: executionTasks.length,
    completed: executionTasks.filter(t => t.status === 'completed').length,
    inProgress: executionTasks.filter(t => t.status === 'in-progress').length,
    pending: executionTasks.filter(t => t.status === 'pending').length,
    unpublished: executionTasks.filter(t => t.status === 'unpublished').length,
    blocked: executionTasks.filter(t => t.status === 'blocked').length,
  };

  const categoryStats = categoryMeta.reduce((acc, cat) => {
    acc[cat.key] = executionTasks.filter(t => t.category === cat.key).length;
    return acc;
  }, {});

  const chartTotal = executionTasks.length;

  const chartSegments = categoryMeta
    .map((meta) => {
      const count = categoryStats[meta.key] || 0;
      const percent = chartTotal > 0 ? (count / chartTotal) * 100 : 0;
      return { ...meta, count, percent };
    })
    .filter(segment => segment.count > 0);

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

  const overallProgress = executionTasks.length
    ? Math.round(executionTasks.reduce((sum, task) => sum + clampProgress(task.progress), 0) / executionTasks.length)
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
    setProjectTitle(trimmed || '未命名專案');
    setIsTitleEditing(false);
  };

  const handleProjectTitleCancel = () => {
    setProjectTitleDraft(projectTitle);
    setIsTitleEditing(false);
  };

  return (
    <div ref={appRef} className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Top Navigation Bar - SaaS Style */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
        <div className="w-full px-4 sm:px-6 py-3">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between sm:gap-6">
            {/* Left: Logo & Project Info */}
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
                        <h1 className="text-base font-semibold text-gray-900 truncate max-w-xs sm:max-w-md">{projectTitle}</h1>
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
                  <div className="flex items-center gap-2 text-xs text-gray-500 mt-0.5 flex-wrap">
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span>2025/09/01 - 2025/11/30</span>
                    <span>·</span>
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

            {/* Center: Project Tagline */}
            <div className="hidden md:flex flex-col items-center flex-1 text-center">
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

            {/* Right: Actions & User */}
            <div className="flex items-center gap-3 flex-shrink-0 w-full sm:w-auto justify-end">
              <button
                onClick={async () => {
                  if (!appRef.current) return;
                  const loader = document.createElement('div');
                  loader.textContent = '生成 PDF 中…';
                  loader.className = 'fixed top-6 right-6 z-[1000] px-3 py-1.5 text-sm font-medium text-white bg-gray-800/80 rounded-lg shadow';
                  loader.dataset.ignorePdf = 'true';
                  document.body.appendChild(loader);

                  try {
                    const [{ default: html2canvas }, { default: jsPDF }] = await Promise.all([
                      import('https://cdn.jsdelivr.net/npm/html2canvas@1.4.1/+esm'),
                      import('https://cdn.jsdelivr.net/npm/jspdf@2.5.1/+esm'),
                    ]);

                    const canvas = await html2canvas(appRef.current, {
                      scale: Math.max(2, window.devicePixelRatio || 1),
                      useCORS: true,
                      backgroundColor: getComputedStyle(document.body).backgroundColor || '#f8fafc',
                      ignoreElements: (element) => element.dataset && element.dataset.ignorePdf === 'true',
                    });

                    const imgData = canvas.toDataURL('image/png');
                    const pdf = new jsPDF({
                      orientation: canvas.width >= canvas.height ? 'landscape' : 'portrait',
                      unit: 'px',
                      format: [canvas.width, canvas.height],
                    });
                    pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
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

      <div className="w-full px-4 sm:px-6 py-6">
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

                <div className="flex-1 w-full space-y-6">
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
                          未完成 {stats.pending + stats.unpublished + stats.blocked}
                        </span>
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
            <div className="-mx-4 overflow-x-auto pb-4 sm:mx-0">
              <div style={timelineOuterStyle}>
                <div className="space-y-6" style={timelineInnerStyle}>
                  <div className="sticky top-[16px] sm:top-[16px] lg:top-[16px] z-30 space-y-2 pb-4 relative">
                    {showTodayMarker && (
                      <div
                        className="pointer-events-none absolute inset-y-0 z-0"
                        style={{ left: `${todayMarkerLeft}px`, width: `${dayWidth}px` }}
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
                      minWidth: `${timelineScrollWidth}px`
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
                    className="relative rounded-lg border border-slate-200 bg-white text-xs text-gray-500 overflow-hidden shadow-sm backdrop-blur"
                    style={{
                      width: `${timelineScrollWidth}px`,
                      minWidth: `${timelineScrollWidth}px`
                    }}
                  >
                    <div className="flex" style={{ marginLeft: `${trackPaddingLeft}px` }}>
                      {weekSegments.map((week) => (
                        <div
                          key={week.key}
                          className="flex items-center justify-center border-r border-slate-200 last:border-r-0 px-2 py-1.5 flex-shrink-0"
                          style={{ width: `${week.width}px`, minWidth: `${week.width}px` }}
                        >
                            {week.label}
                          </div>
                        ))}
                      </div>
                    </div>
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
                const visibleMaterials = task.materials?.slice(0, maxMaterialsToShow) || [];
                const remainingMaterials = (task.materials?.length || 0) - maxMaterialsToShow;

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
                      onChange={(e) => setEditingTask({...editingTask, status: e.target.value})}
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
                    <select
                      value={editingTask.category}
                      onChange={(e) => {
                        const nextCategory = e.target.value;
                        if (nextCategory === '學習與成長') {
                          setEditingTask({
                            ...editingTask,
                            category: nextCategory,
                            startDate: '',
                            endDate: '',
                            progress: 0,
                          });
                        } else if (editingTask.category === '學習與成長') {
                          const fallbackStart = editingTask.startDate || toInputDate(new Date());
                          const fallbackEnd = editingTask.endDate || toInputDate(new Date(Date.now() + 7 * msPerDay));
                          setEditingTask({
                            ...editingTask,
                            category: nextCategory,
                            startDate: fallbackStart,
                            endDate: fallbackEnd,
                            progress: 0,
                          });
                        } else {
                          setEditingTask({...editingTask, category: nextCategory});
                        }
                      }}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="AI賦能">AI賦能</option>
                      <option value="流程優化">流程優化</option>
                      <option value="產品行銷">產品行銷</option>
                      <option value="品牌行銷">品牌行銷</option>
                      <option value="客戶開發">客戶開發</option>
                      <option value="學習與成長">學習與成長</option>
                    </select>
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
                            onChange={(e) => handleMaterialImageSelect(e.target.files?.[0] || null)}
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
              className={`flex-1 min-h-[60vh] overflow-auto bg-black p-4 select-none ${
                isPanningImage ? 'cursor-grabbing' : 'cursor-grab'
              }`}
              style={{ touchAction: 'none', overscrollBehavior: 'contain' }}
              onWheel={(e) => {
                e.stopPropagation();
                e.preventDefault();
                if (!imageViewerRef.current) return;
                imageViewerRef.current.scrollTop += e.deltaY;
                imageViewerRef.current.scrollLeft += e.deltaX;
              }}
              onMouseDown={(e) => {
                if (e.button !== 0) return;
                if (!imageViewerRef.current) return;
                e.preventDefault();
                e.stopPropagation();

                panStateRef.current = {
                  isDragging: true,
                  startX: e.clientX,
                  startY: e.clientY,
                  scrollLeft: imageViewerRef.current.scrollLeft,
                  scrollTop: imageViewerRef.current.scrollTop,
                };
                setIsPanningImage(true);
              }}
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

export default GanttManager;
