import React from 'react';
import { motion } from 'framer-motion';

const MOCK_GANTT_TASKS = [
  { id: 1, name: '前期研究', start: 1, duration: 4, color: 'bg-gradient-to-r from-cyan-400 to-blue-400', shadow: 'shadow-cyan-400/40' },
  { id: 2, name: '設計提案', start: 3, duration: 5, color: 'bg-gradient-to-r from-violet-400 to-purple-400', shadow: 'shadow-violet-400/40' },
  { id: 3, name: 'API 開發', start: 6, duration: 7, color: 'bg-gradient-to-r from-fuchsia-400 to-pink-400', shadow: 'shadow-fuchsia-400/40' },
  { id: 4, name: '整合測試', start: 12, duration: 3, color: 'bg-gradient-to-r from-rose-400 to-red-400', shadow: 'shadow-rose-400/40' },
];

export const GanttChart = ({ onTaskClick }: { onTaskClick: (task: any) => void }) => {
  return (
    <div className="bg-white/40 backdrop-blur-xl rounded-[2.5rem] border border-white/60 shadow-sm p-0 h-full overflow-hidden flex flex-col relative">
      {/* Today Line */}
      <div className="absolute top-14 bottom-0 left-[250px] z-0 pointer-events-none border-l-2 border-rose-400/40 border-dashed h-[calc(100%-3.5rem)]" style={{ transform: 'translateX(144px)' }}>
        <div className="absolute -top-1.5 -left-[5px] w-2.5 h-2.5 bg-rose-400 rounded-full shadow-sm ring-2 ring-white" />
        <div className="absolute -top-9 -left-6 bg-rose-400 text-white text-[10px] px-2 py-1 rounded-full font-bold shadow-sm opacity-90">
          TODAY
        </div>
      </div>

      {/* Header Row */}
      <div className="flex border-b border-white/50 bg-white/60 backdrop-blur-md z-20 relative h-14">
        <div className="w-[250px] shrink-0 flex items-center pl-6 font-black text-slate-400 uppercase text-xs tracking-wider border-r border-white/50">
          Task Name
        </div>
        <div className="flex-1 overflow-hidden relative">
           <div className="flex h-full items-center">
              {Array.from({ length: 20 }).map((_, i) => (
                <div key={i} className="w-12 shrink-0 text-center text-xs font-bold text-slate-400/70 border-l border-white/30 first:border-l-0">
                  Dec {i + 1}
                </div>
              ))}
           </div>
        </div>
      </div>

      {/* Scrollable Body */}
      <div className="flex-1 overflow-y-auto custom-scrollbar overflow-x-hidden relative z-10">
        <div className="flex min-h-full">
           {/* Sidebar Column */}
           <div className="w-[250px] shrink-0 border-r border-white/50 bg-white/30 backdrop-blur-sm z-20 sticky left-0">
              {MOCK_GANTT_TASKS.map((task) => (
                <div 
                  key={task.id} 
                  className="h-14 flex items-center px-6 border-b border-white/40 hover:bg-white/60 transition-colors cursor-pointer group" 
                  onClick={() => onTaskClick(task)}
                >
                   <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-[10px] font-bold shadow-md mr-3 bg-slate-800 group-hover:scale-110 transition-transform`}>
                      IT
                   </div>
                   <span className="text-sm font-bold text-slate-600 group-hover:text-pink-500 transition-colors truncate">{task.name}</span>
                </div>
              ))}
           </div>

           {/* Timeline Grid */}
           <div className="flex-1 relative overflow-x-auto custom-scrollbar" style={{ scrollBehavior: 'smooth' }}>
              <div className="flex h-full absolute inset-0 pointer-events-none z-0">
                 {Array.from({ length: 20 }).map((_, j) => (
                    <div key={j} className="w-12 shrink-0 border-l border-white/40 h-full bg-white/5 even:bg-white/20" />
                 ))}
              </div>

              <div className="relative py-0 z-10">
                 {MOCK_GANTT_TASKS.map((task) => (
                    <div key={task.id} className="h-14 flex items-center relative">
                       <motion.div
                          layoutId={`task-${task.id}`}
                          onClick={(e) => { 
                            e.preventDefault();
                            e.stopPropagation(); 
                            onTaskClick(task); 
                          }}
                          className={`absolute h-8 rounded-full ${task.color} ${task.shadow} shadow-lg flex items-center px-3 text-white text-[10px] font-bold cursor-pointer hover:brightness-110 hover:scale-[1.02] active:scale-95 transition-all z-50 ring-1 ring-white/30`}
                          style={{
                             left: `${(task.start - 1) * 48 + 6}px`,
                             width: `${task.duration * 48 - 12}px`
                          }}
                       >
                          <div className="absolute inset-0 rounded-full bg-gradient-to-b from-white/30 to-transparent pointer-events-none" />
                          <span className="drop-shadow-md truncate pointer-events-none relative z-10">{task.duration} days</span>
                       </motion.div>
                    </div>
                 ))}
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};