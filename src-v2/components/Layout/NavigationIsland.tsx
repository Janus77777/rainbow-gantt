import React from 'react';
import { motion } from 'framer-motion';
import { LayoutDashboard, FlaskConical, Settings } from 'lucide-react';

interface NavigationIslandProps {
  activeView: 'delivery' | 'poc' | 'admin';
  onChangeView: (view: 'delivery' | 'poc' | 'admin') => void;
}

export const NavigationIsland: React.FC<NavigationIslandProps> = ({ activeView, onChangeView }) => {
  const tabs = [
    { id: 'delivery', icon: LayoutDashboard, label: '專案交付' },
    { id: 'poc', icon: FlaskConical, label: 'POC 實驗室' },
    { id: 'admin', icon: Settings, label: '管理' },
  ];

  return (
    <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50">
      <div className="relative flex items-center bg-white/80 backdrop-blur-xl border border-white/40 shadow-2xl shadow-indigo-500/20 rounded-full p-1.5 gap-1">
        
        {tabs.map((tab) => {
          const isActive = activeView === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onChangeView(tab.id as any)}
              className={`relative flex items-center gap-2 px-5 py-3 rounded-full transition-colors duration-300 z-10 ${isActive ? 'text-white' : 'text-slate-500 hover:text-slate-800'}`}
            >
              {isActive && (
                <motion.div
                  layoutId="active-pill"
                  className="absolute inset-0 bg-gradient-to-r from-violet-500 to-fuchsia-500 rounded-full shadow-lg shadow-violet-500/30"
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}
              <tab.icon className="w-5 h-5 relative z-10" />
              <span className={`text-sm font-bold relative z-10 ${isActive ? '' : 'hidden sm:block'}`}>
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
