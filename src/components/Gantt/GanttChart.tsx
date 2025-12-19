import React, { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Task, TaskPriority } from '../../types';

// 計算兩個日期之間的天數差（end - start）
const getDaysDiff = (start: Date, end: Date) => {
  const oneDay = 24 * 60 * 60 * 1000;
  return Math.round((end.getTime() - start.getTime()) / oneDay);
};

// 取得名字的前兩個字元作為頭像
const getInitials = (name?: string): string => {
  if (!name) return '??';
  return name.substring(0, 2).toUpperCase();
};

// 優先級配置 - 用文字標籤
const PRIORITY_CONFIG: Record<TaskPriority, { label: string; color: string; bgColor: string; textColor: string; order: number }> = {
  'urgent': { label: 'URGENT', color: 'text-red-600', bgColor: 'bg-red-200', textColor: 'text-red-800', order: 0 },
  'high': { label: 'HIGH', color: 'text-orange-600', bgColor: 'bg-amber-200', textColor: 'text-amber-800', order: 1 },
  'medium': { label: 'MEDIUM', color: 'text-yellow-600', bgColor: 'bg-yellow-200', textColor: 'text-yellow-800', order: 2 },
  'low': { label: 'LOW', color: 'text-gray-500', bgColor: 'bg-gray-200', textColor: 'text-gray-800', order: 3 },
};

const getPriorityOrder = (priority?: TaskPriority): number => {
  if (!priority) return 99; // Not set priorities go last
  return PRIORITY_CONFIG[priority]?.order ?? 99;
};

// 類別顏色映射
const getCategoryColors = (category: string) => {
  switch (category) {
    case 'AI賦能':
      return { color: 'bg-cyan-500', shadow: 'shadow-cyan-500/30' };
    case '產品行銷':
      return { color: 'bg-fuchsia-500', shadow: 'shadow-fuchsia-500/30' };
    case '流程優化':
      return { color: 'bg-amber-500', shadow: 'shadow-amber-500/30' };
    case '品牌行銷':
      return { color: 'bg-emerald-500', shadow: 'shadow-emerald-500/30' };
    case '客戶開發':
      return { color: 'bg-red-500', shadow: 'shadow-red-500/30' };
    default:
      return { color: 'bg-gray-500', shadow: 'shadow-gray-500/30' };
  }
};

export const GanttChart = ({ tasks, onTaskClick }: { tasks: Task[], onTaskClick: (task: Task) => void }) => {
  // 月份狀態管理
  const [currentMonth, setCurrentMonth] = useState(() => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), 1);
  });

  const timelineStart = currentMonth;

  const daysInMonth = useMemo(() => {
    return new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0).getDate();
  }, [currentMonth]);

  // 計算今天在時間軸上的位置（0-indexed），如果不在當前月則返回 -1
  const todayOffset = useMemo(() => {
    const now = new Date();
    const isCurrentMonth = now.getFullYear() === currentMonth.getFullYear() &&
                          now.getMonth() === currentMonth.getMonth();
    return isCurrentMonth ? now.getDate() - 1 : -1;
  }, [currentMonth]);

  // 月份切換函數
  const goToPrevMonth = () => {
    setCurrentMonth(prev => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
  };

  const goToNextMonth = () => {
    setCurrentMonth(prev => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
  };

  const jumpToToday = () => {
    const now = new Date();
    setCurrentMonth(new Date(now.getFullYear(), now.getMonth(), 1));
  };

  // 格式化月份顯示
  const monthLabel = useMemo(() => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.toLocaleString('en-US', { month: 'short' }).toUpperCase();
    return `${month}_${year}`;
  }, [currentMonth]);

  const dayWidth = 48;

  const processedTasks = useMemo(() => {
    const monthStart = timelineStart;
    const monthEnd = new Date(timelineStart.getFullYear(), timelineStart.getMonth() + 1, 0);

    return tasks
      .filter(t => !t.isPoc) // 只顯示非 POC 任務
      .filter(t => {
        // 過濾：只顯示與當前月份有重疊的任務
        const taskStart = new Date(t.startDate);
        const taskEnd = new Date(t.endDate);
        return taskEnd >= monthStart && taskStart <= monthEnd;
      })
      .map(t => {
        const taskStart = new Date(t.startDate);
        const taskEnd = new Date(t.endDate);

        // 判斷是否跨月
        const startsBeforeMonth = taskStart < monthStart;
        const endsAfterMonth = taskEnd > monthEnd;

        // 裁切顯示範圍
        const displayStart = startsBeforeMonth ? monthStart : taskStart;
        const displayEnd = endsAfterMonth ? monthEnd : taskEnd;

        // 計算顯示位置和長度
        const offsetDays = getDaysDiff(monthStart, displayStart);
        const duration = getDaysDiff(displayStart, displayEnd) + 1;

        const { color, shadow } = getCategoryColors(t.category);

        return {
          ...t,
          offsetDays,
          duration,
          color,
          shadow,
          continueFromPrev: startsBeforeMonth,
          continueToNext: endsAfterMonth,
        };
      })
      // 排序：完成狀態 > 優先級 > 開始日期
      .sort((a, b) => {
        // 1. 已完成的排最後
        const aCompleted = a.status === 'completed' ? 1 : 0;
        const bCompleted = b.status === 'completed' ? 1 : 0;
        if (aCompleted !== bCompleted) return aCompleted - bCompleted;

        // 2. 優先級
        const priorityDiff = getPriorityOrder(a.priority) - getPriorityOrder(b.priority);
        if (priorityDiff !== 0) return priorityDiff;

        // 3. 開始日期
        return new Date(a.startDate).getTime() - new Date(b.startDate).getTime();
      });
  }, [tasks, timelineStart]);

  return (
    <div className="retro-panel p-0 h-full overflow-auto custom-scrollbar relative">
      <div className="min-w-fit flex flex-col relative">

        {/* Month Navigation - Sticky Top */}
        <div className="retro-panel p-2 flex items-center justify-between sticky top-0 z-50">
          <button
            onClick={goToPrevMonth}
            className="retro-btn bg-gray-700 text-white px-4 py-2 hover:bg-gray-800"
          >
            <ChevronLeft className="w-4 h-4" />
            <span className="text-xs font-bold uppercase">PREV</span>
          </button>

          <span className="text-lg font-bold text-gray-900 uppercase tracking-wider">{monthLabel}</span>

          <button
            onClick={goToNextMonth}
            className="retro-btn bg-gray-700 text-white px-4 py-2 hover:bg-gray-800"
          >
            <span className="text-xs font-bold uppercase">NEXT</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Header Row - Sticky Top */}
        <div className="sticky top-0 z-40 flex h-16 bg-gray-100 border-b-2 border-gray-900 shadow-sm">
          {/* Corner (Task Name) - Sticky Left + Top */}
          <div className="sticky left-0 z-50 w-[250px] shrink-0 bg-gray-100 border-r-2 border-gray-900 flex items-center pl-6 font-bold text-gray-800 text-xs tracking-wider uppercase">
            TASK_NAME
          </div>
          
          {/* Date Header - Scrollable horizontally */}
          <div className="flex">
            {Array.from({ length: daysInMonth }).map((_, i) => {
              const d = new Date(timelineStart);
              d.setDate(d.getDate() + i);
              const isToday = i === todayOffset;
              return (
                <div
                  key={i}
                  className={`w-12 shrink-0 text-center text-xs font-bold border-r border-gray-300 flex items-center justify-center
                    ${isToday ? 'bg-cyan-100 text-cyan-800 border-cyan-500' : 'text-gray-600'}`}
                >
                  {d.getDate()}
                </div>
              );
            })}
          </div>
        </div>

        {/* Body Section */}
        <div className="flex flex-1 relative">
          
          {/* Left Sidebar - Sticky Left */}
          <div className="sticky left-0 z-30 w-[250px] shrink-0 bg-gray-100 border-r-2 border-gray-900">
            {processedTasks.map((task) => {
              const priorityConfig = task.priority ? PRIORITY_CONFIG[task.priority] : null;
              return (
                <div
                  key={task.id}
                  className="h-14 flex items-center px-3 border-b border-gray-300 hover:bg-gray-200 transition-colors cursor-pointer group"
                  onClick={() => onTaskClick(task)}
                >
                  {/* 優先級文字標籤 */}
                  <div className={`px-2 py-1 border border-gray-900 text-[10px] font-bold mr-2 shrink-0 ${priorityConfig ? `${priorityConfig.bgColor} ${priorityConfig.textColor}` : 'bg-gray-200 text-gray-800'}`}>
                    {priorityConfig?.label || 'NONE'}
                  </div>

                  {/* 負責人頭像 */}
                  <div className={`w-8 h-8 bg-black text-white text-[10px] font-bold flex items-center justify-center border border-gray-900 mr-2 shrink-0`}>
                    {getInitials(task.owner)}
                  </div>

                  {/* 任務名稱 */}
                  <span className="text-sm font-bold text-gray-800 group-hover:text-blue-600 transition-colors truncate uppercase">
                    {task.name}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Right Gantt Area */}
          <div className="relative flex-1">
            
            {/* Grid Lines (Background) */}
            <div className="absolute inset-0 flex pointer-events-none z-0">
              {Array.from({ length: daysInMonth }).map((_, j) => (
                <div
                  key={j}
                  className={`w-12 shrink-0 border-r border-gray-300 h-full
                    ${j === todayOffset ? 'bg-blue-50/50' : j % 2 === 0 ? 'bg-gray-50' : 'bg-white'}`}
                />
              ))}
            </div>

            {/* Today Line Indicator - Only show if in current month */}
            {todayOffset >= 0 && (
              <div
                className="absolute top-0 bottom-0 z-20 pointer-events-none border-l-2 border-cyan-500 border-solid"
                style={{ left: `${todayOffset * dayWidth + dayWidth / 2}px` }}
              >
                <div className="absolute -top-1 -left-[5px] w-2.5 h-2.5 bg-cyan-500 border border-gray-900" />
              </div>
            )}

            {/* Task Bars (Foreground) */}
            <div className="relative z-10 w-full">
              {processedTasks.map((task) => {
                // 計算條狀位置和寬度
                const barLeft = task.offsetDays * dayWidth;
                const barWidth = Math.max(task.duration * dayWidth, 48); // 最小寬度 48px

                return (
                  <div key={task.id} className="h-14 flex items-center relative">
                    <motion.div
                      layoutId={`task-${task.id}`}
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        onTaskClick(task);
                      }}
                      className={`absolute h-8 ${task.color} ${task.shadow} tech-bar flex items-center justify-center text-white text-xs font-bold cursor-pointer hover:brightness-110 hover:scale-[1.02] active:scale-95 transition-all z-50`}
                      style={{
                        left: `${barLeft}px`,
                        width: `${barWidth}px`
                      }}
                    >
                      <span className="drop-shadow-md pointer-events-none relative z-10 flex items-center justify-between w-full px-2">
                        {(task as any).continueFromPrev ? (
                          <span className="text-[10px] text-red-400">← from上月</span>
                        ) : <span></span>}
                        <span>{task.progress}%</span>
                        {(task as any).continueToNext ? (
                          <span className="text-[10px] text-red-400">to下月 →</span>
                        ) : <span></span>}
                      </span>
                    </motion.div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};