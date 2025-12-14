import React, { useState } from 'react';
import { NavigationIsland } from './components/Layout/NavigationIsland';
import { CalendarView } from './components/Gantt/CalendarView';
import { GanttChart } from './components/Gantt/GanttChart';
import { ContextPanel } from './components/ui/ContextPanel';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Search, Filter, Calendar as CalendarIcon, BarChart3, List, Zap, AlertCircle } from 'lucide-react';

// Jelly Card Component
const Card = ({ children, className = '' }: { children: React.ReactNode, className?: string }) => (
  <div className={`jelly-card rounded-[2rem] p-6 ${className}`}>
    {children}
  </div>
);

const DeliveryView = ({ onOpenTask }: { onOpenTask: (task: any) => void }) => {
  const [viewMode, setViewMode] = useState<'gantt' | 'calendar' | 'list'>('gantt');

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-6 pb-32 h-full flex flex-col pointer-events-auto"
    >
      {/* Top Bar */}
      <div className="flex items-center justify-between shrink-0 px-2">
        <div>
          <h1 className="text-3xl font-black text-slate-800 tracking-tight">🍬 夢幻糖果工廠</h1>
          <p className="text-slate-500 font-medium mt-1">今天也是充滿活力的一天！</p>
        </div>
        <div className="flex gap-3">
           <button className="p-3 bg-white rounded-2xl text-slate-400 hover:text-pink-500 hover:shadow-md transition-all">
             <Search className="w-5 h-5" />
           </button>
           <button 
             onClick={() => onOpenTask({ name: '新任務' })}
             className="flex items-center gap-2 bg-gradient-to-r from-pink-500 to-rose-500 text-white px-6 py-3 rounded-2xl font-bold shadow-xl shadow-pink-500/30 hover:scale-105 active:scale-95 transition-all cursor-pointer z-50"
           >
             <Plus className="w-5 h-5" />
             <span>新任務</span>
           </button>
        </div>
      </div>

      {/* Big Dashboard (The HUD) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 shrink-0">
        
        {/* Hero Donut Chart (Left - Large) */}
        <Card className="lg:col-span-5 relative overflow-hidden flex items-center justify-center min-h-[280px]">
           <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-pink-100/50 to-transparent pointer-events-none" />
           
           <div className="relative z-10 flex items-center gap-8">
              {/* 3D Donut */}
              <div className="relative w-48 h-48">
                 <svg className="w-full h-full -rotate-90 drop-shadow-xl" viewBox="0 0 36 36">
                    <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#ffe4e6" strokeWidth="4" strokeLinecap="round" />
                    <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="url(#candyGradient)" strokeWidth="4" strokeDasharray="68, 100" strokeLinecap="round" />
                    <defs>
                      <linearGradient id="candyGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#ff9a9e" />
                        <stop offset="100%" stopColor="#fec5bb" />
                      </linearGradient>
                    </defs>
                 </svg>
                 <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-700">
                    <span className="text-5xl font-black tracking-tighter text-pink-500">68%</span>
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">總進度</span>
                 </div>
              </div>

              {/* Legend / Details */}
              <div className="space-y-4">
                 <div>
                    <p className="text-sm text-slate-400 font-bold uppercase tracking-wide">本季目標</p>
                    <p className="text-2xl font-black text-slate-700">Q4 Release</p>
                 </div>
                 <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm font-medium text-slate-600">
                       <div className="w-3 h-3 rounded-full bg-pink-400 shadow-sm" />
                       <span>已完成 18</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm font-medium text-slate-600">
                       <div className="w-3 h-3 rounded-full bg-pink-100 shadow-sm" />
                       <span>待辦 12</span>
                    </div>
                 </div>
              </div>
           </div>
        </Card>

        {/* Secondary Stats (Right - Grid) */}
        <div className="lg:col-span-7 grid grid-cols-2 gap-6">
           <Card className="relative overflow-hidden group hover:shadow-lg transition-all cursor-pointer border-l-8 border-l-violet-400">
              <div className="absolute right-4 top-4 p-2 bg-violet-100 text-violet-500 rounded-xl">
                 <Zap className="w-6 h-6" />
              </div>
              <p className="text-sm font-bold text-slate-400 uppercase tracking-wider">本週衝刺</p>
              <div className="mt-2 flex items-baseline gap-2">
                 <span className="text-4xl font-black text-slate-700">12</span>
                 <span className="text-lg font-bold text-slate-400">任務</span>
              </div>
              <div className="mt-4 h-2 bg-slate-100 rounded-full overflow-hidden">
                 <div className="h-full bg-violet-400 w-[70%] rounded-full shadow-[0_0_10px_rgba(167,139,250,0.5)]" />
              </div>
           </Card>

           <Card className="relative overflow-hidden group hover:shadow-lg transition-all cursor-pointer border-l-8 border-l-orange-400">
              <div className="absolute right-4 top-4 p-2 bg-orange-100 text-orange-500 rounded-xl animate-pulse">
                 <AlertCircle className="w-6 h-6" />
              </div>
              <p className="text-sm font-bold text-slate-400 uppercase tracking-wider">卡關議題</p>
              <div className="mt-2 flex items-baseline gap-2">
                 <span className="text-4xl font-black text-slate-700">3</span>
                 <span className="text-lg font-bold text-slate-400">需關注</span>
              </div>
              <p className="mt-4 text-sm text-slate-500 font-medium truncate">
                 API 憑證過期, 設計圖缺漏...
              </p>
           </Card>

           {/* Another Slot (Maybe Team velocity or Calendar mini) */}
           <Card className="col-span-2 bg-gradient-to-r from-blue-50 to-cyan-50 border-none flex items-center justify-between px-8">
              <div>
                 <p className="font-bold text-slate-700 text-lg">🚀 團隊士氣高昂！</p>
                 <p className="text-slate-500 text-sm">距離下一個里程碑還有 5 天</p>
              </div>
              <div className="flex -space-x-3">
                 {[1,2,3,4].map(i => (
                    <div key={i} className="w-10 h-10 rounded-full bg-white border-2 border-white shadow-md flex items-center justify-center text-xs font-bold text-slate-400">
                       U{i}
                    </div>
                 ))}
                 <div className="w-10 h-10 rounded-full bg-slate-800 text-white border-2 border-white shadow-md flex items-center justify-center text-xs font-bold">
                    +2
                 </div>
              </div>
           </Card>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 min-h-[500px] flex flex-col relative z-10">
         <div className="absolute top-0 right-0 z-20 flex gap-2 p-4">
            {/* View Switcher - Jelly Style */}
            <div className="bg-white/60 backdrop-blur-md p-1.5 rounded-2xl border border-white shadow-sm flex gap-1 pointer-events-auto">
               <button 
                 onClick={() => setViewMode('gantt')}
                 className={`p-2.5 rounded-xl transition-all font-bold text-sm flex items-center gap-2 ${viewMode === 'gantt' ? 'bg-white text-pink-500 shadow-md' : 'text-slate-400 hover:text-slate-600'}`}
               >
                 <BarChart3 className="w-4 h-4 rotate-90"/>
                 甘特圖
               </button>
               <button 
                 onClick={() => setViewMode('calendar')}
                 className={`p-2.5 rounded-xl transition-all font-bold text-sm flex items-center gap-2 ${viewMode === 'calendar' ? 'bg-white text-pink-500 shadow-md' : 'text-slate-400 hover:text-slate-600'}`}
               >
                 <CalendarIcon className="w-4 h-4"/>
                 日曆
               </button>
               <button 
                 onClick={() => setViewMode('list')}
                 className={`p-2.5 rounded-xl transition-all font-bold text-sm flex items-center gap-2 ${viewMode === 'list' ? 'bg-white text-pink-500 shadow-md' : 'text-slate-400 hover:text-slate-600'}`}
               >
                 <List className="w-4 h-4"/>
                 列表
               </button>
            </div>
         </div>

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
                  <GanttChart onTaskClick={onOpenTask} />
                </motion.div>
              )}
              {viewMode === 'calendar' && (
                <motion.div 
                  key="calendar"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="absolute inset-0 pointer-events-auto"
                >
                  <CalendarView />
                </motion.div>
              )}
              {viewMode === 'list' && (
                <motion.div 
                  key="list"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 bg-white/50 backdrop-blur-xl rounded-3xl border border-white/60 p-6 flex items-center justify-center pointer-events-auto"
                >
                  <div className="text-slate-400 font-medium">List View Coming Soon</div>
                </motion.div>
              )}
            </AnimatePresence>
         </div>
      </div>
    </motion.div>
  );
};

const PocView = () => (
  <motion.div className="space-y-6 pb-32 pointer-events-auto">
     <h1 className="text-3xl font-black text-slate-800 tracking-tight">🧪 POC 實驗室</h1>
     <div className="flex gap-6 overflow-x-auto pb-4 snap-x">
        {/* Placeholders for Kanban */}
        <div className="min-w-[300px] h-[400px] bg-white/50 rounded-3xl border border-white/50 flex items-center justify-center text-slate-400">
           Kanban Coming Soon
        </div>
     </div>
  </motion.div>
);

const AdminView = () => (
  <motion.div className="space-y-6 pb-32">
     <h1 className="text-3xl font-black text-slate-800 tracking-tight">⚙️ 管理後台</h1>
  </motion.div>
);

const AppV2 = () => {
  const [activeView, setActiveView] = useState<'delivery' | 'poc' | 'admin'>('delivery');
  const [selectedTask, setSelectedTask] = useState<any>(null);

  return (
    <div className="candy-bg min-h-screen font-sans selection:bg-pink-200 selection:text-pink-900 overflow-hidden relative">
      <div className="w-full h-full overflow-y-auto custom-scrollbar p-2 md:p-6 relative z-0">
        <AnimatePresence mode="wait">
          {activeView === 'delivery' && <DeliveryView key="delivery" onOpenTask={setSelectedTask} />}
          {activeView === 'poc' && <PocView key="poc" />}
          {activeView === 'admin' && <AdminView key="admin" />}
        </AnimatePresence>
      </div>

      <NavigationIsland activeView={activeView} onChangeView={setActiveView} />
      
      <AnimatePresence>
        {selectedTask && (
          <ContextPanel 
            isOpen={!!selectedTask} 
            onClose={() => setSelectedTask(null)} 
            task={selectedTask}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default AppV2;