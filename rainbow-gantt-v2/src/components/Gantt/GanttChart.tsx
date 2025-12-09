import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
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
  // 動態計算當前月份的時間範圍
  const timelineStart = useMemo(() => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), 1);
  }, []);

  const daysInMonth = useMemo(() => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
  }, []);

  // 計算今天在時間軸上的位置（0-indexed）
  const todayOffset = useMemo(() => {
    const now = new Date();
    return now.getDate() - 1; // 1號 = index 0
  }, []);

  const dayWidth = 48;

  const processedTasks = useMemo(() => {
    return tasks
      .filter(t => !t.isPoc) // 只顯示非 POC 任務
      .map(t => {
        const taskStart = new Date(t.startDate);
        const taskEnd = new Date(t.endDate);

        // 計算任務開始日期相對於月初的偏移天數
        const offsetDays = getDaysDiff(timelineStart, taskStart);

        // 計算任務持續天數（包含起始和結束當天）
        const duration = getDaysDiff(taskStart, taskEnd) + 1;

        const { color, shadow } = getCategoryColors(t.category);

        return {
          ...t,
          offsetDays,
          duration,
          color,
          shadow
        };
      })
      // 排序：優先級 > 開始日期
      .sort((a, b) => {
        const priorityDiff = getPriorityOrder(a.priority) - getPriorityOrder(b.priority);
        if (priorityDiff !== 0) return priorityDiff;
        return new Date(a.startDate).getTime() - new Date(b.startDate).getTime();
      });
  }, [tasks, timelineStart]);

  return (
    <div className="retro-panel p-0 h-full overflow-hidden flex flex-col relative">
      {/* Today Line - 動態位置 */}
      <div
        className="absolute top-14 bottom-0 z-30 pointer-events-none border-l-2 border-cyan-500/60 border-solid"
        style={{ left: `${250 + todayOffset * dayWidth + dayWidth / 2}px` }}
      >
        <div className="absolute -top-1.5 -left-[5px] w-2.5 h-2.5 bg-cyan-500 border border-gray-900" />
        <div className="absolute -top-9 -left-6 bg-cyan-500 text-white text-[10px] px-2 py-1 uppercase font-bold border border-gray-900">
          TODAY
        </div>
      </div>

      {/* Header Row */}
      <div className="flex border-b-2 border-gray-900 bg-gray-100 z-20 relative h-14">
        <div className="w-[250px] shrink-0 flex items-center pl-6 font-bold text-gray-800 text-xs tracking-wider border-r-2 border-gray-900 uppercase">
          TASK_NAME
        </div>
        <div className="flex-1 overflow-hidden relative">
           <div className="flex h-full items-center">
              {/* 動態生成當月日期頭部 */}
              {Array.from({ length: daysInMonth }).map((_, i) => {
                 const d = new Date(timelineStart);
                 d.setDate(d.getDate() + i);
                 const isToday = i === todayOffset;
                 return (
                    <div
                      key={i}
                      className={`w-12 shrink-0 text-center text-xs font-bold border-l border-gray-300 first:border-l-0
                        ${isToday ? 'bg-cyan-100 text-cyan-800 border-cyan-500' : 'text-gray-600'}`}
                    >
                      {d.getDate()}
                    </div>
                 );
              })}
           </div>
        </div>
      </div>

      {/* Scrollable Body */}
      <div className="flex-1 overflow-y-auto custom-scrollbar overflow-x-hidden relative z-10">
        <div className="flex min-h-full">
           {/* Sidebar Column */}
           <div className="w-[250px] shrink-0 border-r-2 border-gray-900 bg-gray-100 z-20 sticky left-0">
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
                     <span className="text-sm font-bold text-gray-800 group-hover:text-blue-600 transition-colors truncate uppercase">{task.name}</span>
                  </div>
                );
              })}
           </div>

           {/* Timeline Grid */}
           <div className="flex-1 relative overflow-x-auto custom-scrollbar" style={{ scrollBehavior: 'smooth' }}>
              <div className="flex h-full absolute inset-0 pointer-events-none z-0">
                 {Array.from({ length: daysInMonth }).map((_, j) => (
                    <div
                      key={j}
                      className={`w-12 shrink-0 border-l border-gray-300 h-full
                        ${j === todayOffset ? 'bg-blue-100' : j % 2 === 0 ? 'bg-gray-50' : 'bg-white'}`}
                    />
                 ))}
              </div>

              <div className="relative py-0 z-10 h-full">
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
                            <span className="drop-shadow-md pointer-events-none relative z-10">
                              {task.progress}%
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
