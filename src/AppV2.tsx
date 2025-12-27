import React, { useState, useMemo } from 'react';
import { NavigationIsland } from './components/Layout/NavigationIsland';
import { CalendarView } from './components/Gantt/CalendarView';
import { GanttChart } from './components/Gantt/GanttChart';
import { ContextPanel } from './components/ui/ContextPanel';
import { useTasks } from './hooks/useTasks';
import { useNotes, LearningNote } from './hooks/useNotes';
import { usePeople } from './hooks/usePeople';
import { useChangelog, ChangelogEntry } from './hooks/useChangelog';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Search, Calendar as CalendarIcon, BarChart3, List, Loader2, FlaskConical, Link as LinkIcon, BookOpen, X, Save, FileText, Trash2, Check, ChevronDown, Upload, Image as ImageIcon, PlayCircle, CheckCircle, Settings, FileCode, Copy } from 'lucide-react';
import { Task, TaskCategory, Material } from './types';

// Retro Panel Component
const Panel = ({ children, className = '' }: { children: React.ReactNode, className?: string }) => (
  <div className={`retro-panel p-6 ${className}`}>
    {children}
  </div>
);

// 類別顏色映射 - 半透明淺色、通透感
const CATEGORY_COLORS: Record<string, { bg: string; bar: string; text: string }> = {
  'AI賦能': { bg: 'bg-sky-100', bar: 'bg-sky-300', text: 'text-sky-700' },
  '流程優化': { bg: 'bg-rose-100', bar: 'bg-rose-300', text: 'text-rose-700' },
  '產品行銷': { bg: 'bg-violet-100', bar: 'bg-violet-300', text: 'text-violet-700' },
  '品牌行銷': { bg: 'bg-emerald-100', bar: 'bg-emerald-300', text: 'text-emerald-700' },
  '客戶開發': { bg: 'bg-amber-100', bar: 'bg-amber-300', text: 'text-amber-700' },
  '其他': { bg: 'bg-slate-100', bar: 'bg-slate-300', text: 'text-slate-700' },
};

const getColorForCategory = (category: string) => {
  return CATEGORY_COLORS[category] || CATEGORY_COLORS['其他'];
};

// 圓餅圖的顏色 - 淺色通透感
const PIE_COLORS = ['#7dd3fc', '#fda4af', '#c4b5fd', '#6ee7b7', '#fcd34d', '#cbd5e1']; // Sky, Rose, Violet, Emerald, Amber, Slate (300 系列)

// 狀態中文映射
const STATUS_LABELS: Record<string, string> = {
  'pending': '待處理',
  'in-progress': '進行中',
  'completed': '已完成',
  'unpublished': '未發布',
  'blocked': '受阻',
};

// 優先級中文映射
const PRIORITY_LABELS: Record<string, string> = {
  'urgent': '緊急',
  'high': '高',
  'medium': '中',
  'low': '低',
};

// 將任務陣列格式化為 Markdown
const formatTasksAsMarkdown = (tasks: Task[]): string => {
  if (tasks.length === 0) return '# 任務清單\n\n（無任務）';

  const lines: string[] = [`# 任務清單 (共 ${tasks.length} 項)\n`];

  tasks.forEach((task, index) => {
    const status = STATUS_LABELS[task.status] || task.status;
    lines.push(`## ${index + 1}. [${status}] ${task.name || '未命名任務'}`);

    // 基本資訊
    if (task.owner) lines.push(`- **負責人**: ${task.owner}`);
    lines.push(`- **類別**: ${task.category}`);
    if (task.priority) lines.push(`- **優先級**: ${PRIORITY_LABELS[task.priority] || task.priority}`);
    lines.push(`- **進度**: ${task.progress}%`);
    if (task.startDate || task.endDate) {
      const start = task.startDate ? new Date(task.startDate).toLocaleDateString('zh-TW') : '-';
      const end = task.endDate ? new Date(task.endDate).toLocaleDateString('zh-TW') : '-';
      lines.push(`- **期間**: ${start} ~ ${end}`);
    }
    if (task.collaborationType) {
      lines.push(`- **合作類型**: ${task.collaborationType === 'solo' ? '獨立' : '團隊'}`);
    }

    // 描述
    if (task.description) {
      lines.push(`\n### 描述\n${task.description}`);
    }

    // 備註
    if (task.comments && task.comments.length > 0) {
      lines.push(`\n### 備註 (${task.comments.length})`);
      task.comments.forEach(comment => {
        const date = new Date(comment.createdAt).toLocaleDateString('zh-TW');
        lines.push(`- **${comment.author}** (${date}): ${comment.content}`);
      });
    }

    // 版本記錄
    if (task.changelog && task.changelog.length > 0) {
      lines.push(`\n### 版本記錄`);
      task.changelog.forEach(log => {
        const date = new Date(log.createdAt).toLocaleDateString('zh-TW');
        lines.push(`- v${log.version} (${date}): ${log.content} - by ${log.author}`);
      });
    }

    // 附件
    if (task.materials && task.materials.length > 0) {
      lines.push(`\n### 附件 (${task.materials.length})`);
      task.materials.forEach(material => {
        if (material.type === 'link' && material.url) {
          lines.push(`- [${material.name}](${material.url})`);
        } else if (material.type === 'note' && material.note) {
          lines.push(`- 📝 ${material.name}: ${material.note}`);
        } else {
          lines.push(`- ${material.name} (${material.type})`);
        }
      });
    }

    lines.push(''); // 空行分隔任務
  });

  return lines.join('\n');
};

interface DeliveryViewProps {
  tasks: Task[];
  isLoading: boolean;
  onOpenTask: (task: Task | null) => void;
  onOpenSettings: () => void;
  people: string[];
}

const filterTasksByOwner = (tasks: Task[], filter: string) => {
  if (filter === 'all') return tasks;
  return tasks.filter(t => (t.owner || '').toLowerCase() === filter.toLowerCase());
};

const DeliveryView = ({ tasks, isLoading, onOpenTask, onOpenSettings, people }: DeliveryViewProps) => {
  const [viewMode, setViewMode] = useState<'gantt' | 'list' | 'changelog'>('gantt');
  const [ownerFilter, setOwnerFilter] = useState<string>('all');
  const [isCopied, setIsCopied] = useState(false);
  const { changelog, isLoading: isLoadingChangelog, addEntry, deleteEntry } = useChangelog();

  // Changelog 新增表單狀態
  const [showChangelogForm, setShowChangelogForm] = useState(false);
  const [newChangelogEntry, setNewChangelogEntry] = useState({
    version: '',
    type: 'feature' as 'feature' | 'fix' | 'improvement' | 'breaking',
    title: '',
    description: '',
    items: '',
    author: '',
  });

  const handleAddChangelog = async () => {
    if (!newChangelogEntry.version || !newChangelogEntry.title) return;

    const entry = {
      version: newChangelogEntry.version,
      type: newChangelogEntry.type,
      title: newChangelogEntry.title,
      description: newChangelogEntry.description || undefined,
      items: newChangelogEntry.items ? newChangelogEntry.items.split('\n').filter(i => i.trim()) : undefined,
      author: newChangelogEntry.author || undefined,
      date: new Date().toISOString().split('T')[0],
    };

    const success = await addEntry(entry);
    if (success) {
      setNewChangelogEntry({ version: '', type: 'feature', title: '', description: '', items: '', author: '' });
      setShowChangelogForm(false);
    }
  };

  const handleDeleteChangelog = async (id: string) => {
    if (confirm('確定要刪除此更新記錄嗎？')) {
      await deleteEntry(id);
    }
  };

  // 根據 owner 篩選任務
  const filteredTasks = useMemo(() => filterTasksByOwner(tasks, ownerFilter), [tasks, ownerFilter]);

  // 計算統計數據（基於篩選後的任務）
  const stats = useMemo(() => {
    const total = filteredTasks.length;
    const completed = filteredTasks.filter(t => t.status === 'completed').length;
    const inProgress = filteredTasks.filter(t => t.status === 'in-progress').length;
    const pending = filteredTasks.filter(t => t.status === 'pending' || t.status === 'unpublished').length;
    const overallProgress = total > 0 ? Math.round((completed / total) * 100) : 0;

    // 按類別統計
    const byCategory = filteredTasks.reduce((acc, task) => {
      const cat = task.category || '其他';
      if (!acc[cat]) acc[cat] = { total: 0, completed: 0 };
      acc[cat].total++;
      if (task.status === 'completed') acc[cat].completed++;
      return acc;
    }, {} as Record<string, { total: number; completed: number }>);

    return { total, completed, inProgress, pending, overallProgress, byCategory };
  }, [filteredTasks]);

  // 計算圓餅圖的分段
  const pieSegments = useMemo(() => {
    const categories = Object.entries(stats.byCategory);
    if (categories.length === 0) return [];

    let offset = 0;
    return categories.map(([category, data], index) => {
      const percentage = stats.total > 0 ? (data.total / stats.total) * 100 : 0;
      const segment = {
        category,
        percentage,
        offset,
        color: PIE_COLORS[index % PIE_COLORS.length],
        count: data.total
      };
      offset += percentage;
      return segment;
    });
  }, [stats]);

  // 複製任務到剪貼簿
  const handleCopyTasks = async () => {
    const markdown = formatTasksAsMarkdown(filteredTasks);
    await navigator.clipboard.writeText(markdown);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-6 pb-32 h-full flex flex-col pointer-events-auto"
    >
      {/* Top Bar */}
      <div className="flex flex-col xl:flex-row items-start xl:items-center justify-between shrink-0 px-2 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tighter uppercase">SYS_GANTT_V2 // ACTIVE_PROJECTS</h1>
          <p className="text-gray-600 text-sm mt-1">OPERATIONAL_STATUS: ALL_SYSTEMS_GO</p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
           {/* View Switcher - Retro Style */}
           <div className="retro-panel p-1 flex gap-1 pointer-events-auto">
              <button
                onClick={() => setViewMode('gantt')}
                className={`retro-btn p-2.5 text-sm flex items-center gap-2 ${viewMode === 'gantt' ? 'bg-black text-white' : 'text-gray-700 hover:bg-gray-100'}`}
              >
                <BarChart3 className="w-4 h-4 rotate-90"/>
                GANTT
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`retro-btn p-2.5 text-sm flex items-center gap-2 ${viewMode === 'list' ? 'bg-black text-white' : 'text-gray-700 hover:bg-gray-100'}`}
              >
                <List className="w-4 h-4"/>
                LIST
              </button>
              <button
                onClick={() => setViewMode('changelog')}
                className={`retro-btn p-2.5 text-sm flex items-center gap-2 ${viewMode === 'changelog' ? 'bg-black text-white' : 'text-gray-700 hover:bg-gray-100'}`}
              >
                <FileCode className="w-4 h-4"/>
                CHANGELOG
              </button>
           </div>

           <button className="retro-btn p-3">
             <Search className="w-5 h-5" />
           </button>
           <button
             onClick={() => onOpenTask(null)}
             className="retro-btn bg-cyan-500 text-white px-6 py-3 hover:bg-cyan-600"
           >
             <Plus className="w-5 h-5" />
             <span>NEW_TASK</span>
           </button>
           <button
             onClick={handleCopyTasks}
             className={`retro-btn p-3 ${isCopied ? 'bg-emerald-500 text-white' : 'bg-white text-gray-800 hover:bg-gray-100'}`}
             title="複製任務到剪貼簿"
           >
             {isCopied ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
           </button>
           <button
             onClick={onOpenSettings}
             className="retro-btn p-3 bg-white text-gray-800 hover:bg-gray-100"
           >
             <Settings className="w-5 h-5" />
           </button>
        </div>
      </div>

      {/* Owner Filter Tabs */}
      <div className="flex items-center justify-center gap-2 shrink-0 flex-wrap">
        {['all', ...people].map((filter) => {
          const isActive = ownerFilter === filter;
          const count = filter === 'all'
            ? tasks.filter(t => !t.isPoc).length
            : filterTasksByOwner(tasks.filter(t => !t.isPoc), filter).length;

          // 動態配色
          const colors = filter === 'all'
            ? { bg: 'bg-gray-500', hover: 'hover:bg-gray-600' }
            : { bg: 'bg-blue-500', hover: 'hover:bg-blue-600' };

          return (
            <button
              key={filter}
              onClick={() => setOwnerFilter(filter)}
              className={`retro-btn relative px-5 py-2 text-sm text-white ${colors.bg} ${colors.hover} ${isActive ? 'bg-black' : ''}`}
            >
              {filter.toUpperCase()}
              <span className={`ml-2 px-2 py-0.5 text-xs ${isActive ? 'bg-white text-black' : 'bg-gray-200 text-gray-700'}`}>
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Dashboard - 參考舊版彩虹甘特圖布局 */}
      <Panel className="shrink-0">
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-gray-500" />
            <span className="ml-3 text-gray-700 font-medium">LOADING_DATA...</span>
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-8">
            {/* 左側：扁平化可愛甜甜圈 -> 數據環 */}
            <div className="flex items-center gap-6 lg:gap-8">
              <div className="relative w-40 h-40 lg:w-48 lg:h-48 shrink-0">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                  {/* Background Circle */}
                  <circle cx="18" cy="18" r="14" fill="none" stroke="#e5e7eb" strokeWidth="6" />
                  
                  {/* Pie Segments */}
                  {pieSegments.map((segment) => (
                    <circle
                      key={segment.category}
                      cx="18"
                      cy="18"
                      r="14"
                      fill="none"
                      stroke={segment.color}
                      strokeWidth="6"
                      strokeDasharray={`${segment.percentage} ${100 - segment.percentage}`}
                      strokeDashoffset={100 - segment.offset}
                      strokeLinecap="butt"
                      className="transition-all duration-500"
                    />
                  ))}
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-xs text-gray-500 font-bold uppercase tracking-wider">OVERALL_PROGRESS</span>
                  <span className="text-4xl lg:text-5xl font-black text-gray-900">
                    {stats.overallProgress}%
                  </span>
                </div>
              </div>
            </div>

            {/* 中間：總任務數 + 類別進度條 */}
            <div className="flex-1 space-y-4">
              <div className="flex items-baseline gap-3 mb-6">
                <span className="text-sm text-gray-500 font-bold uppercase tracking-wider">TOTAL_TASKS</span>
                <span className="text-4xl font-black text-gray-900">{stats.total}</span>
              </div>

              {/* 類別進度條 */}
              <div className="space-y-3">
                {Object.entries(stats.byCategory).map(([category, data]) => {
                  const colors = getColorForCategory(category);
                  const progress = data.total > 0 ? (data.completed / data.total) * 100 : 0;
                  const percentage = stats.total > 0 ? Math.round((data.total / stats.total) * 100) : 0;

                  return (
                    <div key={category} className="group">
                      <div className="flex items-center gap-3 mb-1.5">
                        <div className={`w-3 h-3 border border-gray-900 ${colors.bar}`} /> {/* Solid block */}
                        <span className={`text-sm font-bold ${colors.text}`}>{category.toUpperCase()}</span>
                        <span className="ml-auto text-sm text-gray-600">
                          {data.total} ({percentage}%)
                        </span>
                      </div>
                      <div className="h-2.5 bg-gray-200 border border-gray-400 overflow-hidden">
                        <div
                          className={`h-full ${colors.bar} transition-all duration-500`}
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* 右側：任務狀態圖例 */}
            <div className="lg:w-48 shrink-0">
              <div className="retro-panel p-4">
                <p className="text-xs text-gray-500 font-bold uppercase tracking-wider mb-3">TASK_STATUS</p>
                <div className="space-y-2.5">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-emerald-500 border border-gray-900" />
                    <span className="text-sm text-gray-700">COMPLETED</span>
                    <span className="ml-auto text-sm font-bold text-gray-900">{stats.completed}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-blue-500 border border-gray-900" />
                    <span className="text-sm text-gray-700">IN_PROGRESS</span>
                    <span className="ml-auto text-sm font-bold text-gray-900">{stats.inProgress}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-gray-400 border border-gray-900" />
                    <span className="text-sm text-gray-700">PENDING</span>
                    <span className="ml-auto text-sm font-bold text-gray-900">{stats.pending}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </Panel>

      {/* Main Content Area */}
      <div className="flex-1 min-h-[500px] flex flex-col relative z-10">
         <div className="flex-1 h-full relative">
            <AnimatePresence mode="wait">
              {viewMode === 'gantt' && (
                <motion.div
                  key="gantt"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="absolute inset-0 pointer-events-auto"
                >
                  <GanttChart tasks={filteredTasks} onTaskClick={onOpenTask} />
                </motion.div>
              )}
              {viewMode === 'list' && (
                <motion.div
                  key="list"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 retro-panel p-6 flex items-center justify-center pointer-events-auto"
                >
                  <div className="text-gray-700 font-medium">LIST_VIEW_INIT</div>
                </motion.div>
              )}
              {viewMode === 'changelog' && (
                <motion.div
                  key="changelog"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="absolute inset-0 overflow-y-auto custom-scrollbar pointer-events-auto"
                >
                  {isLoadingChangelog ? (
                    <div className="flex items-center justify-center py-20">
                      <Loader2 className="w-8 h-8 animate-spin text-gray-500" />
                      <span className="ml-3 text-gray-700 font-medium">LOADING_CHANGELOG...</span>
                    </div>
                  ) : (
                    <div className="space-y-4 pb-8">
                      {/* 新增按鈕 */}
                      <button
                        onClick={() => setShowChangelogForm(!showChangelogForm)}
                        className="retro-btn w-full p-3 bg-black text-white hover:bg-gray-800 flex items-center justify-center gap-2"
                      >
                        <Plus className="w-4 h-4" />
                        <span className="font-bold uppercase">新增版本記錄</span>
                      </button>

                      {/* 新增表單 */}
                      {showChangelogForm && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="retro-panel p-4 space-y-3"
                        >
                          <div className="grid grid-cols-2 gap-3">
                            <div>
                              <label className="text-xs font-bold text-gray-700 uppercase mb-1 block">版本號 *</label>
                              <input
                                type="text"
                                placeholder="例: 2.2.0"
                                value={newChangelogEntry.version}
                                onChange={(e) => setNewChangelogEntry(prev => ({ ...prev, version: e.target.value }))}
                                className="w-full px-3 py-2 border-2 border-gray-900 text-sm"
                              />
                            </div>
                            <div>
                              <label className="text-xs font-bold text-gray-700 uppercase mb-1 block">類型 *</label>
                              <select
                                value={newChangelogEntry.type}
                                onChange={(e) => setNewChangelogEntry(prev => ({ ...prev, type: e.target.value as any }))}
                                className="w-full px-3 py-2 border-2 border-gray-900 text-sm"
                              >
                                <option value="feature">✨ 新功能</option>
                                <option value="fix">🔧 修復</option>
                                <option value="improvement">⚡ 改進</option>
                                <option value="breaking">⚠️ 重大變更</option>
                              </select>
                            </div>
                          </div>
                          <div>
                            <label className="text-xs font-bold text-gray-700 uppercase mb-1 block">標題 *</label>
                            <input
                              type="text"
                              placeholder="更新標題"
                              value={newChangelogEntry.title}
                              onChange={(e) => setNewChangelogEntry(prev => ({ ...prev, title: e.target.value }))}
                              className="w-full px-3 py-2 border-2 border-gray-900 text-sm"
                            />
                          </div>
                          <div>
                            <label className="text-xs font-bold text-gray-700 uppercase mb-1 block">描述 (選填)</label>
                            <input
                              type="text"
                              placeholder="簡短描述"
                              value={newChangelogEntry.description}
                              onChange={(e) => setNewChangelogEntry(prev => ({ ...prev, description: e.target.value }))}
                              className="w-full px-3 py-2 border-2 border-gray-900 text-sm"
                            />
                          </div>
                          <div>
                            <label className="text-xs font-bold text-gray-700 uppercase mb-1 block">更新項目 (每行一項)</label>
                            <textarea
                              placeholder="新增了 XX 功能&#10;修復了 YY 問題&#10;改進了 ZZ 性能"
                              value={newChangelogEntry.items}
                              onChange={(e) => setNewChangelogEntry(prev => ({ ...prev, items: e.target.value }))}
                              className="w-full px-3 py-2 border-2 border-gray-900 text-sm h-24 resize-none"
                            />
                          </div>
                          <div>
                            <label className="text-xs font-bold text-gray-700 uppercase mb-1 block">作者 (選填)</label>
                            <input
                              type="text"
                              placeholder="你的名字"
                              value={newChangelogEntry.author}
                              onChange={(e) => setNewChangelogEntry(prev => ({ ...prev, author: e.target.value }))}
                              className="w-full px-3 py-2 border-2 border-gray-900 text-sm"
                            />
                          </div>
                          <div className="flex gap-2 pt-2">
                            <button
                              onClick={handleAddChangelog}
                              disabled={!newChangelogEntry.version || !newChangelogEntry.title}
                              className="retro-btn flex-1 p-2 bg-emerald-500 text-white hover:bg-emerald-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                            >
                              <Save className="w-4 h-4" />
                              <span className="font-bold uppercase">儲存</span>
                            </button>
                            <button
                              onClick={() => setShowChangelogForm(false)}
                              className="retro-btn p-2 bg-gray-200 text-gray-700 hover:bg-gray-300"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        </motion.div>
                      )}

                      {changelog.map((entry) => {
                        const typeConfig = {
                          feature: { bg: 'bg-sky-300/80', label: '新功能', icon: '✨' },
                          fix: { bg: 'bg-emerald-300/80', label: '修復', icon: '🔧' },
                          improvement: { bg: 'bg-amber-300/80', label: '改進', icon: '⚡' },
                          breaking: { bg: 'bg-rose-300/80', label: '重大變更', icon: '⚠️' },
                        };
                        const config = typeConfig[entry.type];

                        return (
                          <motion.div
                            key={entry.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="group retro-panel overflow-hidden"
                          >
                            {/* Header Bar */}
                            <div className={`h-2 ${config.bg}`} />

                            <div className="p-5 space-y-3">
                              {/* Version & Type */}
                              <div className="flex items-center gap-2 flex-wrap">
                                <span className="text-xs font-bold px-2.5 py-1 uppercase bg-black text-white border border-gray-900">
                                  v{entry.version}
                                </span>
                                <span className={`text-xs font-bold px-2.5 py-1 uppercase ${config.bg} text-gray-700 border border-white/50`}>
                                  {config.icon} {config.label}
                                </span>
                                <span className="text-xs text-gray-600 ml-auto">
                                  {new Date(entry.date).toLocaleDateString('zh-TW', { year: 'numeric', month: '2-digit', day: '2-digit' })}
                                </span>
                                <button
                                  onClick={() => handleDeleteChangelog(entry.id)}
                                  className="p-1.5 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                                  title="刪除此記錄"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>

                              {/* Title */}
                              <h3 className="text-lg font-bold text-gray-900 uppercase">
                                {entry.title}
                              </h3>

                              {/* Description */}
                              {entry.description && (
                                <p className="text-sm text-gray-700">
                                  {entry.description}
                                </p>
                              )}

                              {/* Items List */}
                              {entry.items && entry.items.length > 0 && (
                                <ul className="space-y-2 pt-2 border-t border-gray-300">
                                  {entry.items.map((item, idx) => (
                                    <li key={idx} className="flex items-start gap-2 text-sm text-gray-800">
                                      <span className="text-sky-500 font-bold shrink-0">▸</span>
                                      <span>{item}</span>
                                    </li>
                                  ))}
                                </ul>
                              )}

                              {/* Author */}
                              {entry.author && (
                                <div className="flex items-center gap-2 pt-2 border-t border-gray-300">
                                  <span className="text-xs text-gray-600 uppercase">作者:</span>
                                  <span className="text-xs font-medium text-gray-800">{entry.author}</span>
                                </div>
                              )}
                            </div>
                          </motion.div>
                        );
                      })}

                      {changelog.length === 0 && (
                        <div className="flex flex-col items-center justify-center py-20 retro-panel">
                          <div className="w-20 h-20 bg-gray-200 border-2 border-gray-900 flex items-center justify-center mb-4">
                            <FileCode className="w-10 h-10 text-gray-700" />
                          </div>
                          <h3 className="text-xl font-bold text-gray-900 mb-2 uppercase">NO_CHANGELOG</h3>
                          <p className="text-gray-600 text-sm">尚無更新記錄</p>
                        </div>
                      )}
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
         </div>
      </div>
    </motion.div>
  );
};

// POC 狀態配置
const POC_STATUS_CONFIG: Record<string, { label: string; color: string; bgColor: string }> = {
  'pending': { label: 'PENDING', color: 'text-gray-600', bgColor: 'bg-gray-200' },
  'in-progress': { label: 'IN_PROGRESS', color: 'text-blue-600', bgColor: 'bg-blue-200' },
  'completed': { label: 'COMPLETED', color: 'text-emerald-600', bgColor: 'bg-emerald-200' },
  'blocked': { label: 'BLOCKED', color: 'text-red-600', bgColor: 'bg-red-200' },
};

interface PocViewProps {
  tasks: Task[];
  isLoading: boolean;
  onOpenTask: (task: Task | null) => void;
  onOpenSettings: () => void;
  onDeleteTask: (taskId: string | number) => void;
}

const PocView = ({ tasks, isLoading, onOpenTask, onOpenSettings, onDeleteTask }: PocViewProps) => {
  const [isCopied, setIsCopied] = useState(false);

  // 只顯示 POC 任務（isPoc = true）
  const pocTasks = useMemo(() => tasks.filter(t => t.isPoc), [tasks]);

  const handleNewPoc = () => {
    // 建立新的 POC 提案（不需要日期）
    const newPoc: Partial<Task> = {
      name: '',
      owner: '',
      startDate: '',
      endDate: '',
      status: 'pending',
      category: 'AI賦能',
      progress: 0,
      description: '',
      materials: [],
      isPoc: true,
      stakeholders: [],
    };
    onOpenTask(newPoc as Task);
  };

  // 複製任務到剪貼簿
  const handleCopyTasks = async () => {
    const markdown = formatTasksAsMarkdown(pocTasks);
    await navigator.clipboard.writeText(markdown);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-6 pb-32 pointer-events-auto"
    >
      {/* Header */}
      <div className="flex items-center justify-between px-2">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tighter uppercase">DIAGNOSTIC // POC_PROTOCOL</h1>
          <p className="text-gray-600 text-sm mt-1">STATUS: EVALUATION_IN_PROGRESS</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleNewPoc}
            className="retro-btn bg-fuchsia-500 text-white px-6 py-3 hover:bg-fuchsia-600"
          >
            <Plus className="w-5 h-5" />
            <span>NEW_PROTOCOL</span>
          </button>
          <button
            onClick={handleCopyTasks}
            className={`retro-btn p-3 ${isCopied ? 'bg-emerald-500 text-white' : 'bg-white text-gray-800 hover:bg-gray-100'}`}
            title="複製任務到剪貼簿"
          >
            {isCopied ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
          </button>
          <button
            onClick={onOpenSettings}
            className="retro-btn p-3 bg-white text-gray-800 hover:bg-gray-100"
          >
            <Settings className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* POC Cards Grid */}
      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-gray-500" />
          <span className="ml-3 text-gray-700 font-medium">LOADING_DATA...</span>
        </div>
      ) : pocTasks.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 retro-panel">
          <div className="w-20 h-20 bg-gray-200 border-2 border-gray-900 flex items-center justify-center mb-4">
            <FlaskConical className="w-10 h-10 text-gray-700" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2 uppercase">NO_PROTOCOL_FOUND</h3>
          <p className="text-gray-600 mb-4 text-sm">INITIATE_NEW_PROTOCOL_SEQUENCE_BELOW</p>
          <button
            onClick={handleNewPoc}
            className="retro-btn bg-gray-700 text-white px-4 py-2 hover:bg-gray-900"
          >
            <Plus className="w-4 h-4" />
            INITIATE
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {pocTasks.map(poc => {
            const statusConfig = POC_STATUS_CONFIG[poc.status] || POC_STATUS_CONFIG['pending'];
            const categoryColor = getColorForCategory(poc.category);

            return (
              <motion.div
                key={poc.id}
                whileHover={{ y: -4 }}
                onClick={() => onOpenTask(poc)}
                className="retro-panel p-0 overflow-hidden relative group cursor-pointer hover:shadow-lg transition-all"
              >
                {/* Delete Button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    if (window.confirm('CONFIRM_DELETE_PROTOCOL?')) {
                      onDeleteTask(poc.id);
                    }
                  }}
                  className="retro-btn absolute top-3 right-3 p-1.5 bg-red-500 text-white hover:bg-red-600 z-10"
                  title="DELETE_PROTOCOL"
                >
                  <Trash2 className="w-4 h-4" />
                </button>

                {/* Card Header */}
                <div className={`h-2 ${categoryColor.bar}`} />

                <div className="p-5 space-y-4">
                  {/* Status & Category */}
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className={`text-xs font-bold px-2.5 py-1 uppercase ${statusConfig.bgColor} ${statusConfig.color} border border-gray-900`}>
                      {statusConfig.label}
                    </span>
                    <span className={`text-xs font-bold px-2.5 py-1 uppercase ${categoryColor.bg} ${categoryColor.text} border border-gray-900`}>
                      {poc.category}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="text-lg font-bold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-2 uppercase">
                    {poc.name || 'UNNAMED_PROTOCOL'}
                  </h3>

                  {/* Description */}
                  {poc.description && (
                    <p className="text-sm text-gray-700 line-clamp-2">
                      {poc.description}
                    </p>
                  )}

                  {/* Owner */}
                  <div className="flex items-center gap-3 pt-2 border-t border-gray-300">
                    <div className="w-8 h-8 bg-black text-white text-xs font-bold flex items-center justify-center border border-gray-900">
                      {poc.owner ? poc.owner.substring(0, 2).toUpperCase() : '??'}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-bold text-gray-900 truncate">
                        {poc.owner || 'UNKNOWN_AGENT'}
                      </div>
                      <div className="text-xs text-gray-600">AGENT</div>
                    </div>

                    {/* Materials Count */}
                    {poc.materials && poc.materials.length > 0 && (
                      <div className="flex items-center gap-1 text-gray-600">
                        <LinkIcon className="w-4 h-4" />
                        <span className="text-xs font-medium">{poc.materials.length}</span>
                      </div>
                    )}
                  </div>

                  {/* Stakeholders */}
                  {poc.stakeholders && poc.stakeholders.length > 0 && (
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-gray-600">STAKEHOLDERS:</span>
                      <div className="flex -space-x-2">
                        {poc.stakeholders.slice(0, 3).map((sh, i) => (
                          <div
                            key={sh.id || i}
                            className="w-6 h-6 bg-gray-300 text-gray-800 text-[10px] font-bold flex items-center justify-center border border-gray-900"
                            title={`${sh.name} (${sh.role})`}
                          >
                            {sh.name.substring(0, 1)}
                          </div>
                        ))}
                        {poc.stakeholders.length > 3 && (
                          <div className="w-6 h-6 bg-gray-200 text-gray-700 text-[10px] font-bold flex items-center justify-center border border-gray-900">
                            +{poc.stakeholders.length - 3}
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </motion.div>
  );
};

// ============ 已完成專案頁面 ============
interface CompletedProjectsViewProps {
  tasks: Task[];
  isLoading: boolean;
  onOpenTask: (task: Task | null) => void;
  onOpenSettings: () => void;
  onDeleteTask: (taskId: string | number) => void;
  people: string[];
}

const CompletedProjectsView = ({ tasks, isLoading, onOpenTask, onOpenSettings, onDeleteTask, people }: CompletedProjectsViewProps) => {
  const [ownerFilter, setOwnerFilter] = useState<string>('all');
  const [isCopied, setIsCopied] = useState(false);

  // 所有已完成的非 POC 任務
  const allCompletedTasks = useMemo(() =>
    tasks.filter(t => !t.isPoc && t.status === 'completed'),
    [tasks]
  );

  // 根據 owner 篩選並排序
  const completedTasks = useMemo(() =>
    filterTasksByOwner(allCompletedTasks, ownerFilter)
      .sort((a, b) => new Date(b.endDate || 0).getTime() - new Date(a.endDate || 0).getTime()),
    [allCompletedTasks, ownerFilter]
  );

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return '-';
    const date = new Date(dateStr);
    return `${date.getMonth() + 1}/${date.getDate()}`;
  };

  const calcDuration = (start?: string, end?: string) => {
    if (!start || !end) return '-';
    const startDate = new Date(start);
    const endDate = new Date(end);
    const diffTime = endDate.getTime() - startDate.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 1;
  };

  const handleNewCompleted = () => {
    const newTask: Partial<Task> = {
      name: '',
      owner: '',
      startDate: '',
      endDate: '',
      status: 'completed',
      category: 'AI賦能',
      progress: 100,
      description: '',
      materials: [],
      isPoc: false,
    };
    onOpenTask(newTask as Task);
  };

  // 複製任務到剪貼簿
  const handleCopyTasks = async () => {
    const markdown = formatTasksAsMarkdown(completedTasks);
    await navigator.clipboard.writeText(markdown);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-6 pb-32 pointer-events-auto"
    >
      {/* Header */}
      <div className="flex items-center justify-between px-2">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tighter uppercase">MISSION_LOG // COMPLETED_PROTOCOLS</h1>
          <p className="text-gray-600 text-sm mt-1">TOTAL_COMPLETED: {completedTasks.length}</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleNewCompleted}
            className="retro-btn bg-emerald-500 text-white px-6 py-3 hover:bg-emerald-600"
          >
            <Plus className="w-5 h-5" />
            <span>ADD_ENTRY</span>
          </button>
          <button
            onClick={handleCopyTasks}
            className={`retro-btn p-3 ${isCopied ? 'bg-emerald-500 text-white' : 'bg-white text-gray-800 hover:bg-gray-100'}`}
            title="複製任務到剪貼簿"
          >
            {isCopied ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
          </button>
          <button
            onClick={onOpenSettings}
            className="retro-btn p-3 bg-white text-gray-800 hover:bg-gray-100"
          >
            <Settings className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Owner Filter Tabs */}
      <div className="flex items-center justify-center gap-2 shrink-0 flex-wrap">
        {['all', ...people].map((filter) => {
          const isActive = ownerFilter === filter;
          const count = filter === 'all'
            ? allCompletedTasks.length
            : allCompletedTasks.filter(t => (t.owner || '').toLowerCase() === filter.toLowerCase()).length;

          // 動態配色
          const colors = filter === 'all'
            ? { bg: 'bg-gray-500', hover: 'hover:bg-gray-600' }
            : { bg: 'bg-blue-500', hover: 'hover:bg-blue-600' };

          return (
            <button
              key={filter}
              onClick={() => setOwnerFilter(filter)}
              className={`retro-btn relative px-5 py-2 text-sm text-white ${colors.bg} ${colors.hover} ${isActive ? 'bg-black' : ''}`}
            >
              {filter.toUpperCase()}
              <span className={`ml-2 px-2 py-0.5 text-xs ${isActive ? 'bg-white text-black' : 'bg-gray-200 text-gray-700'}`}>
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Table */}
      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-gray-500" />
          <span className="ml-3 text-gray-700 font-medium">LOADING_DATA...</span>
        </div>
      ) : completedTasks.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 retro-panel">
          <div className="w-20 h-20 bg-gray-200 border-2 border-gray-900 flex items-center justify-center mb-4">
            <CheckCircle className="w-10 h-10 text-gray-700" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2 uppercase">NO_COMPLETED_PROTOCOLS</h3>
          <p className="text-gray-600 text-sm">ARCHIVE_EMPTY. AWAITING_COMPLETION_SIGNAL.</p>
        </div>
      ) : (
        <div className="retro-panel overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-100 border-b-2 border-gray-900">
                <th className="text-left px-5 py-4 text-sm font-bold text-gray-900 uppercase">PROTOCOL_NAME</th>
                <th className="text-left px-4 py-4 text-sm font-bold text-gray-900 uppercase">AGENT</th>
                <th className="text-left px-4 py-4 text-sm font-bold text-gray-900 uppercase">CATEGORY</th>
                <th className="text-left px-4 py-4 text-sm font-bold text-gray-900 uppercase">START_DATE</th>
                <th className="text-left px-4 py-4 text-sm font-bold text-gray-900 uppercase">END_DATE</th>
                <th className="text-left px-4 py-4 text-sm font-bold text-gray-900 uppercase">DURATION</th>
                <th className="text-center px-4 py-4 text-sm font-bold text-gray-900 uppercase">ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {completedTasks.map((task, idx) => {
                const categoryColor = getColorForCategory(task.category);
                return (
                  <tr
                    key={task.id}
                    onClick={() => onOpenTask(task)}
                    className={`border-b border-gray-300 hover:bg-gray-100 cursor-pointer transition-colors ${idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}
                  >
                    <td className="px-5 py-4">
                      <span className="font-bold text-gray-900 uppercase">{task.name || 'UNNAMED'}</span>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 bg-black text-white text-xs font-bold flex items-center justify-center border border-gray-900">
                          {task.owner ? task.owner.substring(0, 1) : '?'}
                        </div>
                        <span className="text-sm text-gray-800">{task.owner || 'UNKNOWN'}</span>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <span className={`text-xs font-bold px-2.5 py-1 uppercase ${categoryColor.bg} ${categoryColor.text} border border-gray-900`}>
                        {task.category || '-'}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-700">{formatDate(task.startDate)}</td>
                    <td className="px-4 py-4 text-sm text-gray-700">{formatDate(task.endDate)}</td>
                    <td className="px-4 py-4">
                      <span className="text-sm font-medium text-emerald-600">{calcDuration(task.startDate, task.endDate)} DAYS</span>
                    </td>
                    <td className="px-4 py-4 text-center">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          if (window.confirm('CONFIRM_DELETE_ENTRY?')) {
                            onDeleteTask(task.id);
                          }
                        }}
                        className="retro-btn bg-red-500 text-white p-2 hover:bg-red-600"
                        title="DELETE_ENTRY"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </motion.div>
  );
};

interface LearningViewProps {
  tasks: Task[];
  notes: LearningNote[];
  isLoadingNotes: boolean;
  onOpenSettings: () => void;
  onAddNote: (note: Omit<LearningNote, 'id' | 'createdAt' | 'updatedAt'>) => Promise<LearningNote>;
  onUpdateNote: (note: LearningNote) => Promise<LearningNote>;
  onDeleteNote: (noteId: string) => Promise<void>;
}

const LearningView = ({ tasks, notes, isLoadingNotes, onOpenSettings, onAddNote, onUpdateNote, onDeleteNote }: LearningViewProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editingNote, setEditingNote] = useState<Partial<LearningNote> | null>(null);
  const [showProjectSelector, setShowProjectSelector] = useState(false);

  // 附件管理狀態
  const [newMaterial, setNewMaterial] = useState<{ type: Material['type']; name: string; url: string; note: string; dataUrl: string }>({
    type: 'link',
    name: '',
    url: '',
    note: '',
    dataUrl: ''
  });

  const handleNewNote = () => {
    setEditingNote({
      title: '',
      content: '',
      relatedTaskIds: [],
      materials: [],
    });
    setIsEditing(true);
  };

  const handleEditNote = (note: LearningNote) => {
    setEditingNote({ ...note });
    setIsEditing(true);
  };

  const handleSaveNote = async () => {
    if (!editingNote?.title) {
      alert('請輸入筆記標題');
      return;
    }

    try {
      if (editingNote.id) {
        // 更新現有筆記
        await onUpdateNote(editingNote as LearningNote);
      } else {
        // 新增筆記
        await onAddNote({
          title: editingNote.title || '',
          content: editingNote.content || '',
          relatedTaskIds: editingNote.relatedTaskIds || [],
          materials: editingNote.materials || [],
        });
      }

      setIsEditing(false);
      setEditingNote(null);
      setNewMaterial({ type: 'link', name: '', url: '', note: '', dataUrl: '' });
    } catch (err) {
      console.error('Failed to save note:', err);
      alert('儲存失敗，請稍後再試');
    }
  };

  // 附件管理函數
  const handleAddMaterial = () => {
    if (!newMaterial.name || !editingNote) return;
    const material: Material = {
      id: Date.now().toString(),
      type: newMaterial.type,
      name: newMaterial.name,
      url: newMaterial.url || undefined,
      dataUrl: newMaterial.dataUrl || undefined,
      note: newMaterial.note || undefined,
    };
    setEditingNote({
      ...editingNote,
      materials: [...(editingNote.materials || []), material]
    });
    setNewMaterial({ type: 'link', name: '', url: '', note: '', dataUrl: '' });
  };

  const handleDeleteMaterial = (materialId: string | number) => {
    if (!editingNote) return;
    setEditingNote({
      ...editingNote,
      materials: (editingNote.materials || []).filter(m => m.id !== materialId)
    });
  };

  const handleDeleteNote = async (noteId: string) => {
    if (window.confirm('確定要刪除這則筆記嗎？')) {
      try {
        await onDeleteNote(noteId);
      } catch (err) {
        console.error('Failed to delete note:', err);
        alert('刪除失敗，請稍後再試');
      }
    }
  };

  const handleToggleProject = (taskId: string) => {
    if (!editingNote) return;
    const current = editingNote.relatedTaskIds || [];
    if (current.includes(taskId)) {
      setEditingNote({ ...editingNote, relatedTaskIds: current.filter(id => id !== taskId) });
    } else {
      setEditingNote({ ...editingNote, relatedTaskIds: [...current, taskId] });
    }
  };

  const getTaskById = (taskId: string) => tasks.find(t => String(t.id) === taskId);

  // 非 POC 的專案任務
  const projectTasks = useMemo(() => tasks.filter(t => !t.isPoc), [tasks]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-6 pb-32 pointer-events-auto"
    >
      {/* Header */}
      <div className="flex items-center justify-between px-2">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tighter uppercase">KNOWLEDGE_BASE // LOG_ENTRIES</h1>
          <p className="text-gray-600 text-sm mt-1">RESEARCH_LOG_STATUS: OPERATIONAL</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleNewNote}
            className="retro-btn bg-emerald-500 text-white px-6 py-3 hover:bg-emerald-600"
          >
            <Plus className="w-5 h-5" />
            <span>NEW_ENTRY</span>
          </button>
          <button
            onClick={onOpenSettings}
            className="retro-btn p-3 bg-white text-gray-800 hover:bg-gray-100"
          >
            <Settings className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Notes List or Empty State */}
      {isLoadingNotes ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-gray-500" />
          <span className="ml-3 text-gray-700 font-medium">LOADING_DATA...</span>
        </div>
      ) : notes.length === 0 && !isEditing ? (
        <div className="flex flex-col items-center justify-center py-20 retro-panel">
          <div className="w-20 h-20 bg-gray-200 border-2 border-gray-900 flex items-center justify-center mb-4">
            <BookOpen className="w-10 h-10 text-gray-700" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2 uppercase">NO_LOG_ENTRIES</h3>
          <p className="text-gray-600 mb-4 text-sm text-center">CREATE_FIRST_LOG_ENTRY_BELOW</p>
          <button
            onClick={handleNewNote}
            className="retro-btn bg-gray-700 text-white px-4 py-2 hover:bg-gray-900"
          >
            <Plus className="w-4 h-4" />
            CREATE_ENTRY
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Notes Panels */}
          {notes.map(note => (
            <motion.div
              key={note.id}
              whileHover={{ y: -2 }}
              className="retro-panel overflow-hidden group"
            >
              <div className="p-5 space-y-3">
                {/* Title & Actions */}
                <div className="flex items-start justify-between gap-3">
                  <h3 className="text-lg font-bold text-gray-900 flex-1 uppercase">{note.title}</h3>
                  <div className="flex gap-1 shrink-0">
                    <button
                      onClick={() => handleEditNote(note)}
                      className="retro-btn p-1.5 text-gray-700 hover:text-blue-600 hover:bg-blue-100"
                    >
                      <FileText className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteNote(note.id)}
                      className="retro-btn p-1.5 text-gray-700 hover:text-red-600 hover:bg-red-100"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Content Preview */}
                {note.content && (
                  <p className="text-sm text-gray-700 line-clamp-3 whitespace-pre-wrap">
                    {note.content}
                  </p>
                )}

                {/* Related Protocols */}
                {note.relatedTaskIds.length > 0 && (
                  <div className="flex flex-wrap gap-2 pt-2 border-t border-gray-300">
                    <span className="text-xs text-gray-600 font-medium uppercase">RELATED_PROTOCOLS:</span>
                    {note.relatedTaskIds.map(taskId => {
                      const task = getTaskById(taskId);
                      if (!task) return null;
                      const colors = getColorForCategory(task.category);
                      return (
                        <span
                          key={taskId}
                          className={`text-xs font-bold px-2 py-0.5 uppercase ${colors.bg} ${colors.text} border border-gray-900`}
                        >
                          {task.name}
                        </span>
                      );
                    })}
                  </div>
                )}

                {/* Attachments Display */}
                {note.materials && note.materials.length > 0 && (
                  <div className="space-y-2 pt-2 border-t border-gray-300">
                    <span className="text-xs text-gray-600 font-medium flex items-center gap-1 uppercase">
                      <LinkIcon className="w-3 h-3" />ATTACHMENTS ({note.materials.length})
                    </span>
                    <div className="space-y-2">
                      {note.materials.map(material => (
                        <div key={material.id} className="flex items-center gap-2 p-2 retro-panel-inner">
                          <div className={`w-6 h-6 border border-gray-900 flex items-center justify-center text-xs shrink-0
                            ${material.type === 'link' ? 'bg-blue-500 text-white' :
                              material.type === 'image' ? 'bg-emerald-500 text-white' :
                              material.type === 'video' ? 'bg-red-500 text-white' :
                              material.type === 'note' ? 'bg-amber-500 text-white' : 'bg-gray-500 text-white'}`}
                          >
                            {material.type === 'link' ? <LinkIcon className="w-3 h-3" /> :
                             material.type === 'image' ? <ImageIcon className="w-3 h-3" /> :
                             material.type === 'video' ? <PlayCircle className="w-3 h-3" /> :
                             <FileText className="w-3 h-3" />}
                          </div>
                          <span className="text-xs font-medium text-gray-800 flex-1 truncate">{material.name}</span>
                          {material.type === 'image' && material.dataUrl && (
                            <img src={material.dataUrl} alt={material.name} className="w-8 h-8 object-cover border border-gray-900" />
                          )}
                          {material.url && (
                            <a
                              href={material.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-xs text-blue-600 hover:underline"
                              onClick={(e) => e.stopPropagation()}
                            >
                              OPEN
                            </a>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Meta */}
                <div className="text-xs text-gray-600 pt-2 uppercase">
                  LAST_MODIFIED: {new Date(note.updatedAt).toLocaleDateString('zh-TW')}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Note Editor Modal */}
      <AnimatePresence>
        {isEditing && editingNote && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[80] flex items-center justify-center p-4"
            onClick={() => { setIsEditing(false); setEditingNote(null); }}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="retro-panel w-full max-w-2xl max-h-[85vh] overflow-hidden flex flex-col"
            >
              {/* Editor Header */}
              <div className="p-5 border-b-2 border-gray-900 flex items-center justify-between bg-gray-100">
                <h3 className="text-lg font-bold text-gray-900 uppercase">
                  {editingNote.id ? 'EDIT_LOG_ENTRY' : 'NEW_LOG_ENTRY'}
                </h3>
                <button
                  onClick={() => { setIsEditing(false); setEditingNote(null); }}
                  className="retro-btn p-2 text-gray-700 hover:bg-gray-200"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Editor Content */}
              <div className="flex-1 overflow-y-auto p-5 space-y-5">
                {/* Title */}
                <div>
                  <label className="text-xs font-bold text-gray-600 uppercase tracking-wider mb-2 block">
                    TITLE
                  </label>
                  <input
                    type="text"
                    value={editingNote.title || ''}
                    onChange={(e) => setEditingNote({ ...editingNote, title: e.target.value })}
                    placeholder="ENTER_TITLE..."
                    className="w-full px-4 py-3 border-2 border-gray-400 bg-white text-lg font-bold focus:outline-none focus:border-cyan-500 uppercase"
                  />
                </div>

                {/* Related Protocols Selector */}
                <div>
                  <label className="text-xs font-bold text-gray-600 uppercase tracking-wider mb-2 block">
                    RELATED_PROTOCOLS (REF)
                  </label>
                  <div className="relative">
                    <button
                      onClick={() => setShowProjectSelector(!showProjectSelector)}
                      className="retro-btn w-full px-4 py-3 text-left flex items-center justify-between hover:border-gray-600"
                    >
                      <span className="text-gray-800 uppercase">
                        {(editingNote.relatedTaskIds?.length || 0) > 0
                          ? `SELECTED: ${editingNote.relatedTaskIds?.length}`
                          : 'SELECT_RELATED_PROTOCOL...'}
                      </span>
                      <ChevronDown className={`w-5 h-5 text-gray-600 transition-transform ${showProjectSelector ? 'rotate-180' : ''}`} />
                    </button>

                    {/* Protocol Dropdown */}
                    <AnimatePresence>
                      {showProjectSelector && (
                        <>
                          {/* Overlay to close on outside click */}
                          <div
                            className="fixed inset-0 z-[5]"
                            onClick={() => setShowProjectSelector(false)}
                          />
                          <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="absolute top-full left-0 right-0 mt-2 retro-panel overflow-hidden z-10 max-h-60"
                          >
                          {projectTasks.length === 0 ? (
                            <div className="p-4 text-center text-gray-600 text-sm">
                              NO_PROTOCOLS_AVAILABLE
                            </div>
                          ) : (
                            projectTasks.map(task => {
                              const isSelected = editingNote.relatedTaskIds?.includes(String(task.id));
                              const colors = getColorForCategory(task.category);
                              return (
                                <button
                                  key={task.id}
                                  onClick={() => handleToggleProject(String(task.id))}
                                  className={`w-full px-4 py-3 flex items-center gap-3 hover:bg-gray-100 transition-colors ${isSelected ? 'bg-emerald-100' : ''}`}
                                >
                                  <div className={`w-5 h-5 border-2 border-gray-900 flex items-center justify-center ${isSelected ? 'bg-emerald-500' : 'bg-gray-300'}`}>
                                    {isSelected && <Check className="w-3 h-3 text-white" />}
                                  </div>
                                  <span className={`text-xs font-bold px-2 py-0.5 uppercase ${colors.bg} ${colors.text} border border-gray-900`}>
                                    {task.category}
                                  </span>
                                  <span className="text-sm font-medium text-gray-900 flex-1 text-left uppercase">
                                    {task.name}
                                  </span>
                                </button>
                              );
                            })
                          )}
                          </motion.div>
                        </>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Selected Protocols Tags */}
                  {(editingNote.relatedTaskIds?.length || 0) > 0 && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {editingNote.relatedTaskIds?.map(taskId => {
                        const task = getTaskById(taskId);
                        if (!task) return null;
                        return (
                          <span
                            key={taskId}
                            className="inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1 uppercase bg-emerald-200 text-emerald-800 border border-gray-900"
                          >
                            {task.name}
                            <button
                              onClick={() => handleToggleProject(taskId)}
                              className="retro-btn p-0.5 bg-emerald-300 hover:bg-emerald-400"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </span>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* Content */}
                <div>
                  <label className="text-xs font-bold text-gray-600 uppercase tracking-wider mb-2 block">
                    CONTENT
                  </label>
                  <textarea
                    value={editingNote.content || ''}
                    onChange={(e) => setEditingNote({ ...editingNote, content: e.target.value })}
                    rows={6}
                    placeholder="RECORD_OBSERVATIONS_HERE..."
                    className="w-full px-4 py-3 border-2 border-gray-400 bg-white text-sm focus:outline-none focus:border-cyan-500 resize-none"
                  />
                </div>

                {/* Attachments */}
                <div>
                  <label className="text-xs font-bold text-gray-600 uppercase tracking-wider mb-2 block">
                    <LinkIcon className="w-3 h-3 inline mr-1" />ATTACHMENTS
                  </label>

                  {/* Existing Attachments List */}
                  <div className="space-y-2 mb-3">
                    {(editingNote.materials || []).map(material => (
                      <div key={material.id} className="flex items-center gap-3 p-3 retro-panel-inner group hover:border-blue-600 transition-colors">
                        <div className={`w-8 h-8 border border-gray-900 flex items-center justify-center text-xs shrink-0
                          ${material.type === 'link' ? 'bg-blue-500 text-white' :
                            material.type === 'image' ? 'bg-emerald-500 text-white' :
                            material.type === 'video' ? 'bg-red-500 text-white' :
                            material.type === 'note' ? 'bg-amber-500 text-white' : 'bg-gray-500 text-white'}`}
                        >
                          {material.type === 'link' ? <LinkIcon className="w-4 h-4" /> :
                           material.type === 'image' ? <ImageIcon className="w-4 h-4" /> :
                           material.type === 'video' ? <PlayCircle className="w-4 h-4" /> :
                           <FileText className="w-4 h-4" />}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-bold text-gray-900 truncate">{material.name}</div>
                          {material.url && <div className="text-xs text-gray-600 truncate">{material.url}</div>}
                        </div>
                        {material.type === 'image' && material.dataUrl && (
                          <img src={material.dataUrl} alt={material.name} className="w-10 h-10 object-cover border border-gray-900" />
                        )}
                        <button
                          onClick={() => handleDeleteMaterial(material.id)}
                          className="retro-btn p-1.5 text-gray-700 hover:text-red-600 hover:bg-red-100 opacity-0 group-hover:opacity-100 transition-all"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>

                  {/* Add New Attachment Form */}
                  <div className="space-y-3 p-3 bg-gray-100 border-2 border-dashed border-gray-400">
                    {/* Type Selection */}
                    <div className="flex flex-wrap gap-2">
                      {[
                        { type: 'link', label: '連結', icon: LinkIcon, color: 'bg-blue-500' },
                        { type: 'image', label: '圖片', icon: ImageIcon, color: 'bg-green-500' },
                        { type: 'file', label: '檔案', icon: FileText, color: 'bg-orange-500' },
                        { type: 'note', label: '筆記', icon: FileText, color: 'bg-yellow-500' },
                        { type: 'video', label: '影片', icon: PlayCircle, color: 'bg-red-500' },
                      ].map(item => (
                        <button
                          key={item.type}
                          onClick={() => setNewMaterial(prev => ({ ...prev, type: item.type as Material['type'] }))}
                          className={`flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-bold transition-all ${
                            newMaterial.type === item.type
                              ? `${item.color} text-white shadow-md`
                              : 'bg-white border border-slate-200 text-slate-600 hover:border-slate-300'
                          }`}
                        >
                          <item.icon className="w-3 h-3" />
                          {item.label}
                        </button>
                      ))}
                    </div>

                    {/* 名稱輸入 */}
                    <input
                      type="text"
                      placeholder="附件名稱"
                      value={newMaterial.name}
                      onChange={(e) => setNewMaterial(prev => ({ ...prev, name: e.target.value }))}
                      className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm focus:ring-2 focus:ring-emerald-300 outline-none"
                    />

                    {/* 根據類型顯示不同輸入 */}
                    {newMaterial.type === 'note' ? (
                      <textarea
                        placeholder="筆記內容..."
                        value={newMaterial.note || ''}
                        onChange={(e) => setNewMaterial(prev => ({ ...prev, note: e.target.value }))}
                        rows={2}
                        className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm focus:ring-2 focus:ring-emerald-300 outline-none resize-none"
                      />
                    ) : newMaterial.type === 'image' ? (
                      <div className="space-y-2">
                        <input
                          type="text"
                          placeholder="圖片網址 (或上傳圖片)"
                          value={newMaterial.url}
                          onChange={(e) => setNewMaterial(prev => ({ ...prev, url: e.target.value, dataUrl: '' }))}
                          className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm focus:ring-2 focus:ring-emerald-300 outline-none"
                        />
                        <label className="flex items-center justify-center gap-2 w-full py-2 bg-green-50 border-2 border-dashed border-green-300 text-green-600 rounded-lg text-xs font-medium cursor-pointer hover:bg-green-100 transition-colors">
                          <Upload className="w-4 h-4" />
                          上傳圖片
                          <input
                            type="file"
                            className="hidden"
                            accept="image/*"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (!file) return;
                              if (file.size > 5 * 1024 * 1024) {
                                alert('檔案大小不能超過 5MB');
                                return;
                              }
                              const reader = new FileReader();
                              reader.onload = () => {
                                setNewMaterial(prev => ({
                                  ...prev,
                                  name: prev.name || file.name,
                                  dataUrl: reader.result as string,
                                  url: ''
                                }));
                              };
                              reader.readAsDataURL(file);
                              e.target.value = '';
                            }}
                          />
                        </label>
                        {newMaterial.dataUrl && (
                          <div className="relative">
                            <img src={newMaterial.dataUrl} alt="預覽" className="w-full h-24 object-cover rounded-lg" />
                            <button
                              onClick={() => setNewMaterial(prev => ({ ...prev, dataUrl: '' }))}
                              className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </div>
                        )}
                      </div>
                    ) : newMaterial.type === 'file' ? (
                      <label className="flex items-center justify-center gap-2 w-full py-2 bg-orange-50 border-2 border-dashed border-orange-300 text-orange-600 rounded-lg text-xs font-medium cursor-pointer hover:bg-orange-100 transition-colors">
                        <Upload className="w-4 h-4" />
                        上傳檔案
                        <input
                          type="file"
                          className="hidden"
                          accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (!file) return;
                            if (file.size > 5 * 1024 * 1024) {
                              alert('檔案大小不能超過 5MB');
                              return;
                            }
                            const reader = new FileReader();
                            reader.onload = () => {
                              setNewMaterial(prev => ({
                                ...prev,
                                name: prev.name || file.name,
                                dataUrl: reader.result as string
                              }));
                            };
                            reader.readAsDataURL(file);
                            e.target.value = '';
                          }}
                        />
                      </label>
                    ) : (
                      <input
                        type="text"
                        placeholder={newMaterial.type === 'video' ? '影片網址' : '連結網址'}
                        value={newMaterial.url}
                        onChange={(e) => setNewMaterial(prev => ({ ...prev, url: e.target.value }))}
                        className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm focus:ring-2 focus:ring-emerald-300 outline-none"
                      />
                    )}

                    {/* 新增按鈕 */}
                    <button
                      onClick={handleAddMaterial}
                      disabled={
                        !newMaterial.name ||
                        (newMaterial.type === 'link' && !newMaterial.url) ||
                        (newMaterial.type === 'video' && !newMaterial.url) ||
                        (newMaterial.type === 'image' && !newMaterial.url && !newMaterial.dataUrl) ||
                        (newMaterial.type === 'file' && !newMaterial.dataUrl)
                      }
                      className="w-full py-2 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-lg text-sm font-bold hover:opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      <Plus className="w-4 h-4" />
                      新增附件
                    </button>
                  </div>
                </div>
              </div>

              {/* Editor Footer */}
              <div className="p-5 border-t-2 border-gray-900 flex gap-3 bg-gray-100">
                <button
                  onClick={handleSaveNote}
                  className="retro-btn flex-1 py-3 bg-blue-500 text-white hover:bg-blue-600"
                >
                  <Save className="w-5 h-5" />
                  SAVE_ENTRY
                </button>
                <button
                  onClick={() => { setIsEditing(false); setEditingNote(null); }}
                  className="retro-btn px-6 py-3 bg-gray-300 text-gray-800 hover:bg-gray-400"
                >
                  CANCEL
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

type ViewType = 'active' | 'completed' | 'poc' | 'learning' | 'calendar';

const AppV2 = () => {
  const [activeView, setActiveView] = useState<ViewType>('active');
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // 人員管理編輯狀態
  const [newPersonName, setNewPersonName] = useState('');
  const [editingPerson, setEditingPerson] = useState<string | null>(null);
  const [editingName, setEditingName] = useState('');

  // 連接真實後端數據
  const { tasks, isLoading, error, saveTasks, refetch } = useTasks();
  const { notes, isLoading: isLoadingNotes, addNote, updateNote, deleteNote } = useNotes();
  const { people, addPerson, deletePerson, updatePerson } = usePeople();

  // 人員管理函數
  const handleAddPerson = async () => {
    await addPerson(newPersonName);
    setNewPersonName('');
  };

  const handleDeletePerson = async (name: string) => {
    await deletePerson(name);
  };

  const handleStartEdit = (person: string) => {
    setEditingPerson(person);
    setEditingName(person);
  };

  const handleSaveEdit = async (oldName: string) => {
    const trimmed = editingName.trim();

    // 如果名稱沒有變化，直接取消編輯
    if (trimmed === oldName) {
      setEditingPerson(null);
      return;
    }

    // 更新人員名稱
    const success = await updatePerson(oldName, trimmed);
    if (!success) {
      setEditingPerson(null);
      return;
    }

    // 更新所有相關任務的 owner
    const updatedTasks = tasks.map(task => {
      if (task.owner === oldName) {
        return { ...task, owner: trimmed };
      }
      return task;
    });

    // 保存到後端
    await saveTasks(updatedTasks);

    setEditingPerson(null);
  };

  const handleCancelEdit = () => {
    setEditingPerson(null);
    setEditingName('');
  };

  const handleOpenTask = (task: Task | null) => {
    setSelectedTask(task);
    setIsPanelOpen(true);
  };

  const handleClosePanel = () => {
    setIsPanelOpen(false);
    setSelectedTask(null);
  };

  const handleSaveTask = async (updatedTask: Task) => {
    const existingIndex = tasks.findIndex(t => t.id === updatedTask.id);
    let newTasks: Task[];

    if (existingIndex >= 0) {
      // 更新現有任務
      newTasks = tasks.map(t => t.id === updatedTask.id ? updatedTask : t);
    } else {
      // 新增任務
      newTasks = [...tasks, { ...updatedTask, id: Date.now().toString() }];
    }

    await saveTasks(newTasks);
    setSelectedTask(null);
    setIsPanelOpen(false);
  };

  const handleDeleteTask = async (taskId: string | number) => {
    const newTasks = tasks.filter(t => t.id !== taskId);
    await saveTasks(newTasks);
  };

  return (
    <div className="retro-light-bg min-h-screen font-jetbrains-mono selection:bg-blue-200 selection:text-blue-900 overflow-hidden relative">
      <div className="w-full h-full overflow-y-auto custom-scrollbar p-2 md:p-6 relative z-0">
        <AnimatePresence mode="wait">
          {activeView === 'active' && (
            <DeliveryView
              key="active"
              tasks={tasks.filter(t => !t.isPoc)}
              isLoading={isLoading}
              onOpenTask={handleOpenTask}
              onOpenSettings={() => setIsSettingsOpen(true)}
              people={people}
            />
          )}
          {activeView === 'completed' && (
            <CompletedProjectsView
              key="completed"
              tasks={tasks}
              isLoading={isLoading}
              onOpenTask={handleOpenTask}
              onOpenSettings={() => setIsSettingsOpen(true)}
              onDeleteTask={handleDeleteTask}
              people={people}
            />
          )}
          {activeView === 'poc' && (
            <PocView
              key="poc"
              tasks={tasks}
              isLoading={isLoading}
              onOpenTask={handleOpenTask}
              onOpenSettings={() => setIsSettingsOpen(true)}
              onDeleteTask={handleDeleteTask}
            />
          )}
          {activeView === 'learning' && (
            <LearningView
              key="learning"
              tasks={tasks}
              notes={notes}
              isLoadingNotes={isLoadingNotes}
              onOpenSettings={() => setIsSettingsOpen(true)}
              onAddNote={addNote}
              onUpdateNote={updateNote}
              onDeleteNote={deleteNote}
            />
          )}
          {activeView === 'calendar' && (
            <motion.div
              key="calendar"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="pb-24 h-full flex flex-col pointer-events-auto"
            >
              {/* Compact Header */}
              <div className="flex items-center justify-between px-2 mb-3 shrink-0">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900 tracking-tighter uppercase">TIMELINE // CALENDAR_VIEW</h1>
                  <p className="text-gray-600 text-xs mt-0.5">DUAL_CALENDAR_SYNC_STATUS: OPERATIONAL</p>
                </div>
                <button
                  onClick={() => setIsSettingsOpen(true)}
                  className="retro-btn p-3 bg-white text-gray-800 hover:bg-gray-100"
                >
                  <Settings className="w-5 h-5" />
                </button>
              </div>

              {/* Calendar Component - Full Screen */}
              <div className="flex-1 min-h-0 overflow-hidden">
                <CalendarView />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <NavigationIsland activeView={activeView} onChangeView={setActiveView} />

      {/* 設定面板 */}
      <AnimatePresence>
        {isSettingsOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsSettingsOpen(false)}
              className="fixed inset-0 bg-black/50 z-60"
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="retro-panel fixed top-0 right-0 bottom-0 w-full md:w-96 z-70 flex flex-col"
            >
              {/* Header */}
              <div className="p-4 border-b-2 border-gray-900 bg-gray-100 flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900 uppercase">SETTINGS</h2>
                <button
                  onClick={() => setIsSettingsOpen(false)}
                  className="retro-btn p-2 text-gray-700 hover:bg-gray-200"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Content */}
              <div className="flex-1 overflow-y-auto p-4 space-y-6">
                {/* 人員管理 */}
                <div>
                  <h3 className="text-sm font-bold text-gray-600 uppercase mb-3">PEOPLE_MANAGEMENT</h3>

                  {/* 人員列表 */}
                  <div className="space-y-2 mb-3">
                    {people.map(person => (
                      <div key={person} className="retro-panel-inner flex items-center justify-between p-2 gap-2">
                        {editingPerson === person ? (
                          // 編輯模式
                          <>
                            <input
                              type="text"
                              value={editingName}
                              onChange={(e) => setEditingName(e.target.value)}
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') handleSaveEdit(person);
                                if (e.key === 'Escape') handleCancelEdit();
                              }}
                              onBlur={() => handleSaveEdit(person)}
                              autoFocus
                              className="flex-1 px-2 py-1 border-2 border-blue-500 bg-white text-sm font-bold text-gray-900 uppercase focus:outline-none"
                            />
                            <button
                              onClick={() => handleSaveEdit(person)}
                              className="retro-btn p-1 bg-green-500 text-white hover:bg-green-600"
                            >
                              <Check className="w-4 h-4" />
                            </button>
                            <button
                              onClick={handleCancelEdit}
                              className="retro-btn p-1 bg-gray-500 text-white hover:bg-gray-600"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </>
                        ) : (
                          // 顯示模式
                          <>
                            <span
                              onClick={() => handleStartEdit(person)}
                              className="flex-1 font-bold text-gray-900 uppercase cursor-pointer hover:text-blue-600 transition-colors"
                              title="點擊編輯"
                            >
                              {person}
                            </span>
                            <button
                              onClick={() => handleDeletePerson(person)}
                              className="retro-btn p-1 bg-red-500 text-white hover:bg-red-600"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* 新增人員 */}
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newPersonName}
                      onChange={(e) => setNewPersonName(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleAddPerson()}
                      placeholder="NAME"
                      className="flex-1 px-3 py-2 border-2 border-gray-400 bg-white text-sm focus:outline-none focus:border-blue-500 uppercase"
                    />
                    <button
                      onClick={handleAddPerson}
                      disabled={!newPersonName.trim()}
                      className="retro-btn bg-blue-500 text-white px-4 py-2 hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Plus className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isPanelOpen && (
          <ContextPanel
            isOpen={true}
            onClose={handleClosePanel}
            task={selectedTask}
            onSave={handleSaveTask}
            onDelete={handleDeleteTask}
          />
        )}
      </AnimatePresence>

      {/* 錯誤提示 */}
      {error && (
        <div className="fixed bottom-24 left-1/2 -translate-x-1/2 bg-red-500 text-white px-6 py-3 border-2 border-gray-900 uppercase">
          ERROR: {error}
        </div>
      )}
    </div>
  );
};

export default AppV2;
