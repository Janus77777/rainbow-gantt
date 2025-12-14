import React from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';

// Placeholder for tasks
const MOCK_TASKS = [
  { id: '1', title: 'Design System v2', date: '2025-12-08', color: 'bg-violet-500' },
  { id: '2', title: 'User Testing', date: '2025-12-10', color: 'bg-rose-500' },
  { id: '3', title: 'API Integration', date: '2025-12-15', color: 'bg-cyan-500' },
];

export const CalendarView = () => {
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const currentDate = new Date(2025, 11, 8); // Dec 8, 2025

  return (
    <div className="bg-white/50 backdrop-blur-xl rounded-3xl border border-white/60 shadow-sm p-4 md:p-6 h-full flex flex-col overflow-hidden">
      {/* Calendar Header */}
      <div className="flex items-center justify-between mb-4 shrink-0">
        <h2 className="text-2xl font-bold text-slate-800">December 2025</h2>
        <div className="flex gap-2">
          <button className="p-2 rounded-full hover:bg-white/50 text-slate-600 transition-colors">
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button className="p-2 rounded-full hover:bg-white/50 text-slate-600 transition-colors">
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Grid Header */}
      <div className="grid grid-cols-7 gap-2 mb-2 shrink-0">
        {days.map(d => (
          <div key={d} className="text-center text-xs md:text-sm font-bold text-slate-400 uppercase tracking-wider">
            {d}
          </div>
        ))}
      </div>

      {/* Grid Body */}
      <div className="grid grid-cols-7 gap-2 flex-1 overflow-y-auto custom-scrollbar p-1">
        {/* Empty slots */}
        {Array.from({ length: 1 }).map((_, i) => (
          <div key={`empty-${i}`} className="p-2 bg-transparent" />
        ))}

        {/* Days */}
        {Array.from({ length: 31 }).map((_, i) => {
          const dayNum = i + 1;
          const dayStr = `2025-12-${dayNum.toString().padStart(2, '0')}`;
          const dayTasks = MOCK_TASKS.filter(t => t.date === dayStr);
          const isToday = dayNum === 8;

          return (
            <motion.div 
              key={dayNum}
              whileHover={{ scale: 1.02, zIndex: 10 }}
              className={`
                relative p-2 rounded-xl border transition-all duration-200 flex flex-col gap-1 overflow-hidden min-h-[120px]
                ${isToday 
                  ? 'bg-white border-violet-200 shadow-md shadow-violet-500/10 ring-1 ring-violet-400' 
                  : 'bg-white/40 border-white/60 hover:bg-white/80 hover:border-white hover:shadow-sm'}
              `}
            >
              <div className="flex justify-between items-start">
                <span className={`text-sm font-bold ${isToday ? 'text-violet-600 bg-violet-50 px-1.5 rounded' : 'text-slate-500'}`}>
                  {dayNum}
                </span>
                {dayTasks.length > 0 && (
                   <span className="text-[10px] text-slate-400 font-medium">{dayTasks.length} 項</span>
                )}
              </div>
              
              {/* Task Bars */}
              <div className="flex flex-col gap-1 mt-1 overflow-y-auto custom-scrollbar max-h-[80px]">
                {dayTasks.map(task => (
                  <div key={task.id} className={`text-[10px] px-1.5 py-1 rounded text-white truncate font-medium shadow-sm ${task.color} hover:opacity-90 cursor-pointer`}>
                    {task.title}
                  </div>
                ))}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};
