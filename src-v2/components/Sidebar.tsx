import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  FlaskConical, 
  Settings, 
  ChevronRight, 
  Menu,
  X
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface SidebarProps {
  activeView: 'delivery' | 'poc' | 'admin';
  onChangeView: (view: 'delivery' | 'poc' | 'admin') => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeView, onChangeView }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const navItems = [
    { id: 'delivery', label: '專案交付', icon: LayoutDashboard, color: 'text-cyan-400' },
    { id: 'poc', label: 'POC 實驗室', icon: FlaskConical, color: 'text-purple-400' },
    { id: 'admin', label: '管理後台', icon: Settings, color: 'text-slate-400' },
  ];

  return (
    <motion.div 
      className={`fixed left-0 top-0 h-full bg-slate-900/90 backdrop-blur-xl border-r border-slate-800 z-50 flex flex-col transition-all duration-300 ${isExpanded ? 'w-64' : 'w-20'}`}
      onMouseEnter={() => setIsExpanded(true)}
      onMouseLeave={() => setIsExpanded(false)}
      initial={false}
    >
      {/* Logo Area */}
      <div className="h-20 flex items-center justify-center border-b border-slate-800/50">
        <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/20">
          <span className="text-white font-bold text-xl">G</span>
        </div>
        <AnimatePresence>
          {isExpanded && (
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="ml-3 font-bold text-white tracking-wider whitespace-nowrap overflow-hidden"
            >
              GANTT <span className="text-indigo-400">V2</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Nav Items */}
      <div className="flex-1 py-8 flex flex-col gap-2 px-3">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onChangeView(item.id as any)}
            className={`
              relative flex items-center h-12 rounded-xl transition-all duration-200 group
              ${activeView === item.id 
                ? 'bg-white/10 text-white shadow-lg shadow-black/20' 
                : 'text-slate-400 hover:bg-white/5 hover:text-white'}
            `}
          >
            {/* Active Indicator Line */}
            {activeView === item.id && (
              <motion.div 
                layoutId="active-nav"
                className="absolute left-0 w-1 h-6 bg-indigo-500 rounded-r-full" 
              />
            )}

            <div className="w-14 flex items-center justify-center shrink-0">
              <item.icon className={`w-6 h-6 ${activeView === item.id ? item.color : ''} group-hover:scale-110 transition-transform`} />
            </div>

            <AnimatePresence>
              {isExpanded && (
                <motion.span
                  initial={{ opacity: 0, width: 0 }}
                  animate={{ opacity: 1, width: 'auto' }}
                  exit={{ opacity: 0, width: 0 }}
                  className="whitespace-nowrap font-medium overflow-hidden"
                >
                  {item.label}
                </motion.span>
              )}
            </AnimatePresence>

            {/* Tooltip for collapsed state */}
            {!isExpanded && (
              <div className="absolute left-full ml-4 px-3 py-1.5 bg-slate-800 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-50 border border-slate-700 shadow-xl">
                {item.label}
              </div>
            )}
          </button>
        ))}
      </div>

      {/* User / Bottom Area */}
      <div className="p-4 border-t border-slate-800/50">
        <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-tr from-slate-700 to-slate-600 border border-slate-500/30">
          <span className="text-xs font-bold text-white">IT</span>
        </div>
      </div>
    </motion.div>
  );
};
