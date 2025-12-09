import React from 'react';
import { motion } from 'framer-motion';
import { LayoutDashboard, CheckCircle, FlaskConical, BookOpen } from 'lucide-react';

type ViewType = 'active' | 'completed' | 'poc' | 'learning';

interface NavigationIslandProps {
  activeView: ViewType;
  onChangeView: (view: ViewType) => void;
}

export const NavigationIsland: React.FC<NavigationIslandProps> = ({ activeView, onChangeView }) => {
  const tabs = [
    { id: 'active', icon: LayoutDashboard, label: 'ACTIVE_PROJECTS' },
    { id: 'completed', icon: CheckCircle, label: 'COMPLETED_LOG' },
    { id: 'poc', icon: FlaskConical, label: 'POC_PROTOCOLS' },
    { id: 'learning', icon: BookOpen, label: 'KNOWLEDGE_BASE' },
  ];

  return (
    <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50">
      <div className="retro-panel flex items-center p-1 gap-1">
        
        {tabs.map((tab) => {
          const isActive = activeView === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onChangeView(tab.id as ViewType)}
              className={`retro-btn relative flex items-center gap-2 px-4 py-2 text-sm uppercase transition-colors duration-200 z-10 ${isActive ? 'bg-black text-white' : 'text-gray-700 hover:bg-gray-100'}`}
            >
              {isActive && (
                <motion.div
                  layoutId="active-nav-pill"
                  className="absolute inset-0 bg-emerald-500 border-2 border-emerald-700 shadow-md shadow-emerald-500/50"
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}
              <tab.icon className="w-5 h-5 relative z-10" />
              <span className={`font-bold relative z-10 ${isActive ? '' : 'hidden sm:block'}`}>
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
