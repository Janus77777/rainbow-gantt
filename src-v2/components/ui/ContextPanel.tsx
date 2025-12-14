import React from 'react';
import { motion } from 'framer-motion';
import { X, Link as LinkIcon, User, Calendar, Tag, PlayCircle } from 'lucide-react';

interface ContextPanelProps {
  isOpen: boolean;
  onClose: () => void;
  task?: any; // Replace with real Task type later
}

export const ContextPanel: React.FC<ContextPanelProps> = ({ isOpen, onClose, task }) => {
  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-slate-900/20 backdrop-blur-sm z-[60]"
        />
      )}

      {/* Slide-over Panel */}
      <motion.div
        initial={{ x: '100%' }}
        animate={{ x: isOpen ? 0 : '100%' }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        className="fixed top-0 right-0 bottom-0 w-full md:w-[480px] bg-white/90 backdrop-blur-2xl border-l border-white/50 shadow-2xl z-[70] flex flex-col"
      >
        {/* Header */}
        <div className="p-6 border-b border-slate-100/50 flex justify-between items-start bg-white/50">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="bg-violet-100 text-violet-700 text-xs font-bold px-2 py-0.5 rounded-full">AI賦能</span>
              <span className="bg-green-100 text-green-700 text-xs font-bold px-2 py-0.5 rounded-full">進行中</span>
            </div>
            <h2 className="text-2xl font-black text-slate-800 leading-tight">
              {task?.name || '設計系統 V2.0 開發'}
            </h2>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-slate-100 rounded-full text-slate-400 hover:text-slate-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-8">
          
          {/* 1. Description & Why */}
          <section>
            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-2">
              <Tag className="w-4 h-4" />
              專案目標
            </h3>
            <div className="text-slate-600 leading-relaxed space-y-2 text-sm">
              <p>建立一套統一的設計語言，以提升開發效率並確保產品視覺的一致性。</p>
              <ul className="list-disc list-inside text-slate-500 pl-2">
                <li>整合 React 元件庫</li>
                <li>定義 Design Tokens (Color, Typography)</li>
                <li>撰寫 Storybook 文件</li>
              </ul>
            </div>
          </section>

          {/* 2. Stakeholders (對接窗口) */}
          <section>
            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-2">
              <User className="w-4 h-4" />
              對接窗口
            </h3>
            <div className="flex flex-wrap gap-2">
              {/* Owner */}
              <div className="flex items-center gap-2 bg-slate-100 pl-1 pr-3 py-1 rounded-full border border-slate-200">
                <div className="w-6 h-6 bg-slate-800 rounded-full flex items-center justify-center text-white text-[10px] font-bold">IT</div>
                <div className="flex flex-col leading-none">
                  <span className="text-[10px] text-slate-400 font-bold">負責人</span>
                  <span className="text-xs font-bold text-slate-700">Janus</span>
                </div>
              </div>
              
              {/* Stakeholder 1 */}
              <div className="flex items-center gap-2 bg-white pl-1 pr-3 py-1 rounded-full border border-slate-200 shadow-sm">
                <div className="w-6 h-6 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center text-[10px] font-bold">PM</div>
                <div className="flex flex-col leading-none">
                  <span className="text-[10px] text-slate-400 font-bold">產品</span>
                  <span className="text-xs font-bold text-slate-700">Alice</span>
                </div>
              </div>

              {/* Add Button */}
              <button className="w-8 h-8 rounded-full border border-dashed border-slate-300 flex items-center justify-center text-slate-400 hover:text-slate-600 hover:border-slate-400 transition-colors">
                +
              </button>
            </div>
          </section>

          {/* 3. Media & Attachments (影片/連結) */}
          <section>
            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-2">
              <LinkIcon className="w-4 h-4" />
              相關資源
            </h3>
            
            {/* Video Preview */}
            <div className="bg-slate-900 rounded-xl overflow-hidden aspect-video mb-3 relative group cursor-pointer shadow-lg">
               <div className="absolute inset-0 flex items-center justify-center">
                  <PlayCircle className="w-12 h-12 text-white/80 group-hover:text-white group-hover:scale-110 transition-all" />
               </div>
               <img src="https://images.unsplash.com/photo-1611162617474-5b21e879e113?q=80&w=1000&auto=format&fit=crop" className="w-full h-full object-cover opacity-60 group-hover:opacity-40 transition-opacity" alt="Demo Video" />
               <div className="absolute bottom-2 left-3 text-white text-xs font-medium">
                  Feature Demo.mp4
               </div>
            </div>

            {/* Links List */}
            <div className="space-y-2">
               <a href="#" className="flex items-center gap-3 p-3 rounded-xl bg-white border border-slate-100 hover:border-violet-200 hover:shadow-md transition-all group">
                  <div className="w-8 h-8 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center">
                     F
                  </div>
                  <div className="flex-1 min-w-0">
                     <div className="text-sm font-bold text-slate-700 truncate group-hover:text-violet-600">Figma Design File</div>
                     <div className="text-xs text-slate-400 truncate">figma.com/file/xyz...</div>
                  </div>
               </a>
               <a href="#" className="flex items-center gap-3 p-3 rounded-xl bg-white border border-slate-100 hover:border-violet-200 hover:shadow-md transition-all group">
                  <div className="w-8 h-8 bg-orange-50 text-orange-600 rounded-lg flex items-center justify-center">
                     P
                  </div>
                  <div className="flex-1 min-w-0">
                     <div className="text-sm font-bold text-slate-700 truncate group-hover:text-violet-600">PRD 需求文件</div>
                     <div className="text-xs text-slate-400 truncate">notion.so/prd-v2...</div>
                  </div>
               </a>
            </div>
          </section>

        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-slate-100 bg-white/50 flex gap-3">
           <button className="flex-1 py-2.5 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition-colors shadow-lg shadow-slate-900/20">
             進入編輯模式
           </button>
           <button className="px-4 py-2.5 bg-white border border-slate-200 text-slate-600 rounded-xl font-bold hover:bg-slate-50 transition-colors">
             分享
           </button>
        </div>
      </motion.div>
    </>
  );
};
