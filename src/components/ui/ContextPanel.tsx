import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Link as LinkIcon, User, Calendar, Tag, PlayCircle, Save, Trash2, Plus, Upload, FileText, Image as ImageIcon, ChevronDown, Flame, ArrowUp, Minus, ArrowDown, Flag, Check, ExternalLink, MessageCircle } from 'lucide-react';
import { Task, TaskStatus, TaskCategory, TaskPriority, Material, TaskComment } from '../../types';

interface ContextPanelProps {
  isOpen: boolean;
  onClose: () => void;
  task: Task | null;
  onSave?: (task: Task) => void;
  onDelete?: (taskId: string | number) => void;
  customCategories?: string[];
  onCategoriesChange?: (categories: string[]) => void;
}

const DEFAULT_STATUS_OPTIONS: { value: TaskStatus; label: string; color: string }[] = [
  { value: 'pending', label: '待處理', color: 'bg-slate-100 text-slate-600' },
  { value: 'in-progress', label: '進行中', color: 'bg-blue-100 text-blue-600' },
  { value: 'completed', label: '已完成', color: 'bg-green-100 text-green-600' },
  { value: 'blocked', label: '已阻塞', color: 'bg-red-100 text-red-600' },
];

const DEFAULT_CATEGORIES: string[] = ['AI賦能', '流程優化', '產品行銷', '品牌行銷', '客戶開發'];

const PRIORITY_OPTIONS: { value: TaskPriority; label: string; color: string; bgColor: string }[] = [
  { value: 'urgent', label: '緊急', color: 'text-red-600', bgColor: 'bg-red-100' },
  { value: 'high', label: '高', color: 'text-orange-600', bgColor: 'bg-orange-100' },
  { value: 'medium', label: '中', color: 'text-yellow-600', bgColor: 'bg-yellow-100' },
  { value: 'low', label: '低', color: 'text-slate-500', bgColor: 'bg-slate-100' },
];

const getInitials = (name?: string): string => {
  if (!name) return '??';
  return name.substring(0, 2).toUpperCase();
};

// 簡化的下拉選單組件
interface SelectProps {
  value: string;
  options: string[];
  onChange: (value: string) => void;
  onAddOption?: (option: string) => void;
  placeholder?: string;
  className?: string;
}

const Select: React.FC<SelectProps> = ({ value, options, onChange, onAddOption, placeholder, className }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleAdd = () => {
    if (inputValue.trim() && !options.includes(inputValue.trim())) {
      onAddOption?.(inputValue.trim());
      onChange(inputValue.trim());
      setInputValue('');
      setIsOpen(false);
    }
  };

  return (
    <div ref={ref} className={`relative ${className}`}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between gap-1.5 px-2.5 py-1.5 rounded-full border border-slate-200 bg-white hover:border-pink-300 transition-all text-xs text-left h-8"
      >
        <span className={`truncate max-w-[80px] ${value ? 'text-slate-700 font-medium' : 'text-slate-400'}`}>{value || placeholder}</span>
        <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform shrink-0 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-full left-0 right-0 mt-1 bg-white rounded-xl shadow-xl border border-slate-100 overflow-hidden z-50"
          >
            <div className="max-h-48 overflow-y-auto">
              {options.map(opt => (
                <button
                  key={opt}
                  onClick={() => { onChange(opt); setIsOpen(false); }}
                  className={`w-full text-left px-3 py-2 text-sm hover:bg-pink-50 transition-colors ${
                    value === opt ? 'bg-pink-100 text-pink-700 font-bold' : 'text-slate-600'
                  }`}
                >
                  {opt}
                </button>
              ))}
            </div>
            {onAddOption && (
              <div className="border-t border-slate-100 p-2">
                <div className="flex gap-1">
                  <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
                    placeholder="新增..."
                    className="flex-1 px-2 py-1.5 text-xs border border-slate-200 rounded-lg focus:ring-2 focus:ring-pink-300 outline-none"
                  />
                  <button
                    onClick={handleAdd}
                    disabled={!inputValue.trim()}
                    className="px-2 py-1.5 bg-pink-500 text-white rounded-lg text-xs font-bold disabled:opacity-50"
                  >
                    <Plus className="w-3 h-3" />
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// 多選人員組件
interface MultiSelectPeopleProps {
  value: string[];
  options: string[];
  onChange: (value: string[]) => void;
  onAddOption?: (option: string) => void;
}

const MultiSelectPeople: React.FC<MultiSelectPeopleProps> = ({ value, options, onChange, onAddOption }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleToggle = (person: string) => {
    if (value.includes(person)) {
      onChange(value.filter(p => p !== person));
    } else {
      onChange([...value, person]);
    }
  };

  const handleAdd = () => {
    const trimmed = inputValue.trim();
    if (trimmed) {
      if (!options.includes(trimmed)) {
        onAddOption?.(trimmed);
      }
      if (!value.includes(trimmed)) {
        onChange([...value, trimmed]);
      }
      setInputValue('');
    }
  };

  return (
    <div ref={ref} className="relative">
      <div className="flex flex-wrap gap-2 mb-2">
        {value.map(person => (
          <span key={person} className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-gradient-to-r from-cyan-100 to-teal-100 text-cyan-700 text-xs font-bold">
            <span className="w-5 h-5 rounded-full bg-gradient-to-br from-cyan-400 to-teal-500 text-white text-[10px] font-bold flex items-center justify-center">
              {person.substring(0, 1)}
            </span>
            {person}
            <button onClick={() => onChange(value.filter(p => p !== person))} className="p-0.5 hover:bg-cyan-200 rounded-full">
              <X className="w-3 h-3" />
            </button>
          </span>
        ))}
      </div>

      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-full bg-slate-100 text-slate-500 hover:bg-cyan-50 hover:text-cyan-600 transition-all"
      >
        <Plus className="w-3.5 h-3.5" />
        {value.length === 0 ? '新增相關人' : '新增'}
        <ChevronDown className={`w-3 h-3 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-full left-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-slate-100 overflow-hidden z-50"
          >
            <div className="p-2 border-b border-slate-100">
              <div className="flex gap-1">
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
                  placeholder="搜尋或新增..."
                  className="flex-1 px-2 py-1.5 text-xs border border-slate-200 rounded-lg focus:ring-2 focus:ring-cyan-300 outline-none"
                />
                <button onClick={handleAdd} disabled={!inputValue.trim()} className="px-2 py-1.5 bg-cyan-500 text-white rounded-lg text-xs font-bold disabled:opacity-50">
                  <Plus className="w-3 h-3" />
                </button>
              </div>
            </div>
            <div className="max-h-48 overflow-y-auto">
              {options.map(person => {
                const isSelected = value.includes(person);
                return (
                  <button
                    key={person}
                    onClick={() => handleToggle(person)}
                    className={`w-full flex items-center gap-2 px-3 py-2.5 text-sm hover:bg-slate-50 ${isSelected ? 'bg-cyan-50' : ''}`}
                  >
                    <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center ${isSelected ? 'bg-cyan-500 border-cyan-500' : 'border-slate-300'}`}>
                      {isSelected && <Check className="w-3 h-3 text-white" />}
                    </div>
                    <span className="text-slate-700 font-medium">{person}</span>
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export const ContextPanel: React.FC<ContextPanelProps> = ({ isOpen, onClose, task, onSave, onDelete, customCategories = [], onCategoriesChange }) => {
  const [editedTask, setEditedTask] = useState<Partial<Task>>({});
  const [categories, setCategories] = useState<string[]>([...DEFAULT_CATEGORIES, ...customCategories]);
  const [statuses] = useState(DEFAULT_STATUS_OPTIONS.map(s => s.label));
  const [owners, setOwners] = useState<string[]>([]);
  const [peopleOptions, setPeopleOptions] = useState<string[]>([]);

  // 附件表單狀態
  const [materialType, setMaterialType] = useState<Material['type']>('link');
  const [materialName, setMaterialName] = useState('');
  const [materialUrl, setMaterialUrl] = useState('');
  const [materialNote, setMaterialNote] = useState('');
  const [materialDataUrl, setMaterialDataUrl] = useState('');

  // 圖片放大彈窗
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);

  // 備註狀態
  const [commentAuthor, setCommentAuthor] = useState('');
  const [commentContent, setCommentContent] = useState('');

  useEffect(() => {
    if (task) {
      setEditedTask({ ...task });
      if (task.category && !categories.includes(task.category)) {
        setCategories(prev => [...prev, task.category as string]);
      }
      if (task.owner && !owners.includes(task.owner)) {
        setOwners(prev => [...prev, task.owner as string]);
      }
      if (task.stakeholders && task.stakeholders.length > 0) {
        const names = task.stakeholders.map(s => s.name);
        setPeopleOptions(prev => [...new Set([...prev, ...names])]);
      }
    } else {
      setEditedTask({
        name: '',
        owner: '',
        startDate: new Date().toISOString().split('T')[0],
        endDate: new Date().toISOString().split('T')[0],
        status: 'pending',
        category: 'AI賦能',
        progress: 0,
        description: '',
        materials: []
      });
    }
    // 重置附件表單
    resetMaterialForm();
  }, [task]);

  const resetMaterialForm = () => {
    setMaterialType('link');
    setMaterialName('');
    setMaterialUrl('');
    setMaterialNote('');
    setMaterialDataUrl('');
  };

  const resetCommentForm = () => {
    setCommentAuthor('');
    setCommentContent('');
  };

  const handleAddComment = () => {
    if (!commentAuthor.trim() || !commentContent.trim()) return;

    const newComment: TaskComment = {
      id: Date.now().toString(),
      author: commentAuthor.trim(),
      content: commentContent.trim(),
      createdAt: new Date().toISOString(),
    };

    setEditedTask(prev => ({
      ...prev,
      comments: [...(prev.comments || []), newComment]
    }));

    resetCommentForm();
  };

  const handleDeleteComment = (commentId: string) => {
    setEditedTask(prev => ({
      ...prev,
      comments: (prev.comments || []).filter(c => c.id !== commentId)
    }));
  };

  const handleSave = () => {
    if (!editedTask.name) {
      alert('請輸入任務名稱');
      return;
    }
    onSave?.(editedTask as Task);
  };

  const handleAddCategory = (newCat: string) => {
    if (!categories.includes(newCat)) {
      const updated = [...categories, newCat];
      setCategories(updated);
      onCategoriesChange?.(updated.filter(c => !DEFAULT_CATEGORIES.includes(c)));
    }
  };

  const handleAddOwner = (newOwner: string) => {
    if (!owners.includes(newOwner)) {
      setOwners(prev => [...prev, newOwner]);
    }
  };

  const handleAddPerson = (newPerson: string) => {
    if (!peopleOptions.includes(newPerson)) {
      setPeopleOptions(prev => [...prev, newPerson]);
    }
  };

  const getStakeholderNames = (): string[] => {
    return (editedTask.stakeholders || []).map(s => s.name);
  };

  const updateStakeholders = (names: string[]) => {
    const stakeholders = names.map(name => ({ id: name, name, role: '' }));
    setEditedTask(prev => ({ ...prev, stakeholders }));
  };

  const getStatusInfo = (statusValue: string) => {
    const found = DEFAULT_STATUS_OPTIONS.find(s => s.value === statusValue || s.label === statusValue);
    return found || { value: statusValue as TaskStatus, label: statusValue, color: 'bg-purple-100 text-purple-600' };
  };

  const getPriorityInfo = (priority?: TaskPriority) => {
    return PRIORITY_OPTIONS.find(p => p.value === priority);
  };

  // 附件管理
  const handleAddMaterial = () => {
    if (!materialName) return;

    const material: Material = {
      id: Date.now().toString(),
      type: materialType,
      name: materialName,
      url: materialUrl || undefined,
      dataUrl: materialDataUrl || undefined,
      note: materialNote || undefined,
    };

    setEditedTask(prev => ({
      ...prev,
      materials: [...(prev.materials || []), material]
    }));

    resetMaterialForm();
  };

  const handleDeleteMaterial = (materialId: string | number) => {
    setEditedTask(prev => ({
      ...prev,
      materials: (prev.materials || []).filter(m => m.id !== materialId)
    }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      alert('檔案大小不能超過 5MB');
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      setMaterialDataUrl(reader.result as string);
      if (!materialName) setMaterialName(file.name);
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const canAddMaterial = () => {
    if (!materialName) return false;
    if (materialType === 'note') return true;
    if (materialType === 'image') return !!(materialUrl || materialDataUrl);
    if (materialType === 'file') return !!materialDataUrl;
    return !!materialUrl;
  };

  const currentStatus = getStatusInfo(editedTask.status || 'pending');
  const currentPriority = getPriorityInfo(editedTask.priority);

  return (
    <>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-slate-900/20 backdrop-blur-sm z-[60]"
        />
      )}

      <motion.div
        initial={{ x: '100%' }}
        animate={{ x: isOpen ? 0 : '100%' }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        className="fixed top-0 right-0 bottom-0 w-full md:w-[480px] bg-white/95 backdrop-blur-2xl border-l border-white/50 shadow-2xl z-[70] flex flex-col"
      >
        {/* Header */}
        <div className="p-4 border-b border-slate-100 bg-white/80">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-1.5">
              {/* 優先級 */}
              <Select
                value={currentPriority?.label || '優先級'}
                options={PRIORITY_OPTIONS.map(p => p.label)}
                onChange={(val) => {
                  const found = PRIORITY_OPTIONS.find(p => p.label === val);
                  if (found) setEditedTask(prev => ({ ...prev, priority: found.value }));
                }}
              />
              {/* 類別 */}
              <Select
                value={editedTask.category || ''}
                options={categories}
                onChange={(val) => setEditedTask(prev => ({ ...prev, category: val }))}
                onAddOption={handleAddCategory}
                placeholder="類別"
              />
              {/* 狀態 */}
              <Select
                value={currentStatus.label}
                options={statuses}
                onChange={(val) => {
                  const found = DEFAULT_STATUS_OPTIONS.find(s => s.label === val);
                  setEditedTask(prev => ({ ...prev, status: found ? found.value : val as TaskStatus }));
                }}
                placeholder="狀態"
              />
            </div>
            <div className="flex items-center gap-1">
              {task?.id && onDelete && (
                <button
                  onClick={() => {
                    if (window.confirm('確定要刪除此任務嗎？')) {
                      onDelete(task.id);
                      onClose();
                    }
                  }}
                  className="p-2 hover:bg-red-100 rounded-full text-slate-400 hover:text-red-500 shrink-0 transition-colors"
                  title="刪除任務"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              )}
              <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full text-slate-400 hover:text-slate-600 shrink-0">
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* 標題 */}
          <input
            type="text"
            value={editedTask.name || ''}
            onChange={(e) => setEditedTask(prev => ({ ...prev, name: e.target.value }))}
            placeholder="任務名稱"
            className="text-xl font-black text-slate-800 bg-transparent border-b-2 border-transparent hover:border-slate-200 focus:border-pink-400 outline-none w-full pb-1 transition-colors"
          />
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-5 space-y-5">

          {/* 負責人 & 進度 */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5 block">
                <User className="w-3 h-3 inline mr-1" />負責人
              </label>
              <Select
                value={editedTask.owner || ''}
                options={owners}
                onChange={(val) => setEditedTask(prev => ({ ...prev, owner: val }))}
                onAddOption={handleAddOwner}
                placeholder="選擇或輸入"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5 block">
                <Tag className="w-3 h-3 inline mr-1" />進度
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={editedTask.progress || 0}
                  onChange={(e) => setEditedTask(prev => ({ ...prev, progress: parseInt(e.target.value) }))}
                  className="flex-1 h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-pink-500"
                />
                <span className="text-sm font-bold text-pink-500 w-12 text-right">{editedTask.progress || 0}%</span>
              </div>
            </div>
          </div>

          {/* 合作類型 */}
          <div>
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 block">
              合作類型
            </label>
            <div className="flex gap-2">
              <button
                onClick={() => setEditedTask(prev => ({ ...prev, collaborationType: 'solo' }))}
                className={`flex-1 py-2 px-3 border-2 border-slate-300 rounded-lg text-sm font-bold uppercase transition-all ${
                  editedTask.collaborationType === 'solo'
                    ? 'bg-blue-500 text-white border-blue-500'
                    : 'bg-white text-slate-700 hover:bg-slate-50'
                }`}
              >
                🙋 獨立
              </button>
              <button
                onClick={() => setEditedTask(prev => ({ ...prev, collaborationType: 'team' }))}
                className={`flex-1 py-2 px-3 border-2 border-slate-300 rounded-lg text-sm font-bold uppercase transition-all ${
                  editedTask.collaborationType === 'team'
                    ? 'bg-orange-500 text-white border-orange-500'
                    : 'bg-white text-slate-700 hover:bg-slate-50'
                }`}
              >
                👥 合作
              </button>
            </div>
          </div>

          {/* 相關人 */}
          <div>
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 block">
              <User className="w-3 h-3 inline mr-1" />相關人
            </label>
            <MultiSelectPeople
              value={getStakeholderNames()}
              options={peopleOptions}
              onChange={updateStakeholders}
              onAddOption={handleAddPerson}
            />
          </div>

          {/* 日期範圍 (非 POC) */}
          {!editedTask.isPoc && (
            <div>
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 block">
                <Calendar className="w-3 h-3 inline mr-1" />日期範圍
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="date"
                  value={editedTask.startDate || ''}
                  onChange={(e) => setEditedTask(prev => ({ ...prev, startDate: e.target.value }))}
                  className="flex-1 px-3 py-2 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-pink-300 outline-none"
                />
                <span className="text-slate-400">~</span>
                <input
                  type="date"
                  value={editedTask.endDate || ''}
                  onChange={(e) => setEditedTask(prev => ({ ...prev, endDate: e.target.value }))}
                  className="flex-1 px-3 py-2 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-pink-300 outline-none"
                />
              </div>
            </div>
          )}

          {/* 描述 */}
          <div>
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5 block">
              <Tag className="w-3 h-3 inline mr-1" />描述
            </label>
            <textarea
              value={editedTask.description || ''}
              onChange={(e) => setEditedTask(prev => ({ ...prev, description: e.target.value }))}
              rows={3}
              placeholder="輸入描述..."
              className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white focus:ring-2 focus:ring-pink-300 outline-none text-sm resize-none"
            />
          </div>

          {/* 備註/意見 */}
          <div>
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 block">
              <MessageCircle className="w-3 h-3 inline mr-1" />備註/意見
            </label>

            {/* 現有備註列表 */}
            {(editedTask.comments || []).length > 0 && (
              <div className="space-y-2 mb-3">
                {(editedTask.comments || []).map(comment => (
                  <div key={comment.id} className="group p-3 bg-amber-50/50 rounded-xl border border-amber-100">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="px-2 py-0.5 bg-amber-100 text-amber-700 rounded-full text-xs font-bold">
                        {comment.author}
                      </span>
                      <span className="text-[10px] text-slate-400">
                        {new Date(comment.createdAt).toLocaleDateString('zh-TW')}
                      </span>
                      <button
                        onClick={() => handleDeleteComment(comment.id)}
                        className="ml-auto p-1.5 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all opacity-0 hover:opacity-100 group-hover:opacity-100"
                        title="刪除此備註"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <p className="text-sm text-slate-600 whitespace-pre-wrap">{comment.content}</p>
                  </div>
                ))}
              </div>
            )}

            {/* 新增備註表單 */}
            <div className="p-3 bg-slate-50 rounded-xl border border-dashed border-slate-200 space-y-2">
              <input
                type="text"
                placeholder="你的名字"
                value={commentAuthor}
                onChange={(e) => setCommentAuthor(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm focus:ring-2 focus:ring-amber-300 outline-none"
              />
              <textarea
                placeholder="輸入備註內容..."
                value={commentContent}
                onChange={(e) => setCommentContent(e.target.value)}
                rows={2}
                className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm focus:ring-2 focus:ring-amber-300 outline-none resize-none"
              />
              <button
                onClick={handleAddComment}
                disabled={!commentAuthor.trim() || !commentContent.trim()}
                className="w-full py-2 bg-gradient-to-r from-amber-400 to-orange-400 text-white rounded-lg text-sm font-bold hover:opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                <Plus className="w-4 h-4" />
                新增備註
              </button>
            </div>
          </div>

          {/* 附件資源 */}
          <div>
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 block">
              <LinkIcon className="w-3 h-3 inline mr-1" />附件資源
            </label>

            {/* 現有附件 - 所有都可點擊 */}
            <div className="space-y-2 mb-3">
              {(editedTask.materials || []).map(material => {
                const imageUrl = material.dataUrl || material.url;
                const isImage = material.type === 'image';
                const hasLink = material.url;

                return (
                  <div key={material.id} className="retro-panel-inner overflow-hidden group hover:border-blue-600 transition-all">
                    {/* 圖片大圖 - 點擊放大 */}
                    {isImage && imageUrl && (
                      <button onClick={() => setLightboxImage(imageUrl)} className="block w-full">
                        <img src={imageUrl} alt={material.name} className="w-full h-32 object-cover hover:opacity-90 cursor-zoom-in border-b border-gray-300" />
                      </button>
                    )}

                    <div className="flex items-center gap-3 p-3">
                      <div className={`w-8 h-8 border border-gray-900 flex items-center justify-center shrink-0 ${
                        material.type === 'link' ? 'bg-blue-500 text-white' :
                        material.type === 'image' ? 'bg-emerald-500 text-white' :
                        material.type === 'video' ? 'bg-red-500 text-white' :
                        material.type === 'note' ? 'bg-fuchsia-500 text-white' : 'bg-gray-500 text-white'
                      }`}>
                        {material.type === 'link' ? <LinkIcon className="w-4 h-4" /> :
                         material.type === 'image' ? <ImageIcon className="w-4 h-4" /> :
                         material.type === 'video' ? <PlayCircle className="w-4 h-4" /> :
                         <FileText className="w-4 h-4" />}
                      </div>

                      <div className="flex-1 min-w-0">
                        {hasLink ? (
                          <a href={material.url} target="_blank" rel="noopener noreferrer" className="text-sm font-bold text-gray-900 hover:text-blue-600 truncate block uppercase">
                            {material.name}
                          </a>
                        ) : (
                          <div className="text-sm font-bold text-gray-900 truncate uppercase">{material.name}</div>
                        )}
                        {material.url && <div className="text-xs text-gray-600 truncate">{material.url}</div>}
                        {material.note && <div className="text-xs text-gray-700 mt-1">{material.note}</div>}
                      </div>

                      {hasLink && (
                        <a href={material.url} target="_blank" rel="noopener noreferrer" className="retro-btn p-1.5 bg-gray-200 text-gray-700 hover:bg-gray-300">
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      )}

                      <button
                        onClick={() => handleDeleteMaterial(material.id)}
                        className="retro-btn p-1.5 text-gray-700 hover:text-red-600 hover:bg-red-100"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

                        {/* 新增附件表單 */}
                        <div className="space-y-3 p-3 bg-gray-100 border-2 border-dashed border-gray-400">
                          {/* 類型選擇 */}
                          <div className="flex flex-wrap gap-2">
                            {[
                              { type: 'link', label: 'LINK', icon: LinkIcon, color: 'bg-blue-500' },
                              { type: 'image', label: 'IMAGE', icon: ImageIcon, color: 'bg-emerald-500' },
                              { type: 'file', label: 'FILE', icon: FileText, color: 'bg-amber-500' },
                              { type: 'note', label: 'NOTE', icon: FileText, color: 'bg-fuchsia-500' },
                              { type: 'video', label: 'VIDEO', icon: PlayCircle, color: 'bg-red-500' },
                            ].map(item => (
                              <button
                                key={item.type}
                                onClick={() => setMaterialType(item.type as Material['type'])}
                                className={`retro-btn flex items-center gap-1 px-2.5 py-1.5 text-xs uppercase ${
                                  materialType === item.type
                                    ? `${item.color} text-white`
                                    : 'bg-white text-gray-700 hover:bg-gray-100'
                                }`}
                              >
                                <item.icon className="w-3.5 h-3.5" />
                                {item.label}
                              </button>
                            ))}
                          </div>
            
                          {/* 名稱 */}
                          <input
                            type="text"
                            placeholder="ATTACHMENT_NAME"
                            value={materialName}
                            onChange={(e) => setMaterialName(e.target.value)}
                            className="w-full px-3 py-2 border-2 border-gray-400 bg-white text-sm focus:outline-none focus:border-blue-500 uppercase"
                          />
            
                          {/* 根據類型顯示不同輸入 */}
                          {materialType === 'note' ? (
                            <textarea
                              placeholder="NOTE_CONTENT..."
                              value={materialNote}
                              onChange={(e) => setMaterialNote(e.target.value)}
                              rows={2}
                              className="w-full px-3 py-2 border-2 border-gray-400 bg-white text-sm focus:outline-none focus:border-blue-500 resize-none"
                            />
                          ) : materialType === 'image' ? (
                            <div className="space-y-2">
                              <input
                                type="text"
                                placeholder="IMAGE_URL (OR_UPLOAD)"
                                value={materialUrl}
                                onChange={(e) => { setMaterialUrl(e.target.value); setMaterialDataUrl(''); }}
                                className="w-full px-3 py-2 border-2 border-gray-400 bg-white text-sm focus:outline-none focus:border-blue-500"
                              />
                              <label className="retro-btn flex items-center justify-center gap-2 w-full py-2.5 bg-emerald-500 text-white cursor-pointer hover:bg-emerald-600">
                                <Upload className="w-4 h-4" />
                                UPLOAD_IMAGE
                                <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
                              </label>
                              {materialDataUrl && (
                                <div className="relative">
                                  <img src={materialDataUrl} alt="PREVIEW" className="w-full h-24 object-cover border border-gray-900" />
                                  <button
                                    onClick={() => setMaterialDataUrl('')}
                                    className="retro-btn absolute top-1 right-1 p-1 bg-red-500 text-white hover:bg-red-600"
                                  >
                                    <X className="w-3 h-3" />
                                  </button>
                                </div>
                              )}
                            </div>
                          ) : materialType === 'file' ? (
                            <label className="retro-btn flex items-center justify-center gap-2 w-full py-2.5 bg-amber-500 text-white cursor-pointer hover:bg-amber-600">
                              <Upload className="w-4 h-4" />
                              UPLOAD_FILE
                              <input
                                type="file"
                                className="hidden"
                                accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx"
                                onChange={(e) => {
                                  const file = e.target.files?.[0];
                                  if (!file) return;
                                  if (file.size > 5 * 1024 * 1024) {
                                    alert('FILE_TOO_LARGE: MAX_5MB');
                                    return;
                                  }
                                  const reader = new FileReader();
                                  reader.onload = () => {
                                    setMaterialDataUrl(reader.result as string);
                                    if (!materialName) setMaterialName(file.name);
                                  };
                                  reader.readAsDataURL(file);
                                  e.target.value = '';
                                }}
                              />
                            </label>
                          ) : (
                            <input
                              type="text"
                              placeholder={materialType === 'video' ? 'VIDEO_URL' : 'LINK_URL'}
                              value={materialUrl}
                              onChange={(e) => setMaterialUrl(e.target.value)}
                              className="w-full px-3 py-2 border-2 border-gray-400 bg-white text-sm focus:outline-none focus:border-blue-500"
                            />
                          )}
            
                          {/* 新增按鈕 */}
                          <button
                            onClick={handleAddMaterial}
                            disabled={!canAddMaterial()}
                            className="retro-btn w-full py-2 bg-gray-700 text-white hover:bg-gray-900 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            <Plus className="w-4 h-4" />
                            ADD_ATTACHMENT
                          </button>
                        </div>          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t-2 border-gray-900 bg-gray-100 flex gap-3">
          <button
            onClick={handleSave}
            className="retro-btn flex-1 py-2.5 bg-blue-500 text-white hover:bg-blue-600"
          >
            <Save className="w-4 h-4" />
            SAVE
          </button>
          <button
            onClick={onClose}
            className="retro-btn px-4 py-2.5 bg-gray-300 text-gray-800 hover:bg-gray-400"
          >
            CANCEL
          </button>
        </div>
      </motion.div>

      {/* 圖片放大彈窗 Lightbox */}
      <AnimatePresence>
        {lightboxImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setLightboxImage(null)}
            className="fixed inset-0 bg-black/90 z-[100] flex items-center justify-center p-4 cursor-zoom-out"
          >
            <button
              onClick={() => setLightboxImage(null)}
              className="absolute top-4 right-4 p-2 bg-white/20 hover:bg-white/30 rounded-full text-white transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
            <motion.img
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              src={lightboxImage}
              alt="放大圖片"
              className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
