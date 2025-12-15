import React, { useState, useMemo, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Plus, X, Save, FileText, Link as LinkIcon, Image as ImageIcon, PlayCircle, Upload, Trash2, Paperclip, ZoomIn } from 'lucide-react';
import { Material } from '../../types';

interface DailyEntry {
  id: string;
  content: string;
  materials: Material[];
  createdAt: string;
  updatedAt: string;
}

interface DailyEntries {
  [date: string]: DailyEntry;
}

type PersonType = 'ja' | 'jo';

const PERSON_CONFIG = {
  ja: {
    name: 'JA',
    color: 'bg-fuchsia-500',
    bgColor: 'bg-fuchsia-200',
    textColor: 'text-fuchsia-800',
    accentColor: 'fuchsia',
    storageKey: 'gantt-v2:calendar:ja',
  },
  jo: {
    name: 'JO',
    color: 'bg-cyan-500',
    bgColor: 'bg-cyan-200',
    textColor: 'text-cyan-800',
    accentColor: 'cyan',
    storageKey: 'gantt-v2:calendar:jo',
  },
};

export const CalendarView = () => {
  const [activePerson, setActivePerson] = useState<PersonType>('ja');
  const [currentDate, setCurrentDate] = useState(new Date());
  const [dailyEntriesJa, setDailyEntriesJa] = useState<DailyEntries>({});
  const [dailyEntriesJo, setDailyEntriesJo] = useState<DailyEntries>({});
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  // 根據當前選擇的人取得對應的 entries
  const dailyEntries = activePerson === 'ja' ? dailyEntriesJa : dailyEntriesJo;
  const setDailyEntries = activePerson === 'ja' ? setDailyEntriesJa : setDailyEntriesJo;
  const personConfig = PERSON_CONFIG[activePerson];
  const [editContent, setEditContent] = useState('');
  const [editMaterials, setEditMaterials] = useState<Material[]>([]);
  const [viewingImage, setViewingImage] = useState<{ src: string; name: string } | null>(null);
  const [newMaterial, setNewMaterial] = useState<{ type: Material['type']; name: string; url: string; note: string; dataUrl: string }>({
    type: 'link',
    name: '',
    url: '',
    note: '',
    dataUrl: ''
  });

  const days = ['日', '一', '二', '三', '四', '五', '六'];

  // 從 localStorage 載入資料
  useEffect(() => {
    const savedJa = localStorage.getItem(PERSON_CONFIG.ja.storageKey);
    const savedJo = localStorage.getItem(PERSON_CONFIG.jo.storageKey);
    if (savedJa) setDailyEntriesJa(JSON.parse(savedJa));
    if (savedJo) setDailyEntriesJo(JSON.parse(savedJo));
  }, []);

  // 儲存 Ja 資料到 localStorage
  useEffect(() => {
    if (Object.keys(dailyEntriesJa).length > 0) {
      localStorage.setItem(PERSON_CONFIG.ja.storageKey, JSON.stringify(dailyEntriesJa));
    }
  }, [dailyEntriesJa]);

  // 儲存 Jo 資料到 localStorage
  useEffect(() => {
    if (Object.keys(dailyEntriesJo).length > 0) {
      localStorage.setItem(PERSON_CONFIG.jo.storageKey, JSON.stringify(dailyEntriesJo));
    }
  }, [dailyEntriesJo]);

  // 切換人時關閉編輯面板
  const handlePersonChange = (person: PersonType) => {
    setActivePerson(person);
    setSelectedDate(null);
  };

  // 計算當月資訊
  const monthInfo = useMemo(() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const monthName = currentDate.toLocaleDateString('zh-TW', { year: 'numeric', month: 'long' });
    return { year, month, firstDay, daysInMonth, monthName };
  }, [currentDate]);

  const today = new Date();
  const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;

  const getDateStr = (day: number) => {
    return `${monthInfo.year}-${String(monthInfo.month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
  };

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const handleDayClick = (day: number) => {
    const dateStr = getDateStr(day);
    setSelectedDate(dateStr);
    const entry = dailyEntries[dateStr];
    setEditContent(entry?.content || '');
    setEditMaterials(entry?.materials || []);
    setNewMaterial({ type: 'link', name: '', url: '', note: '', dataUrl: '' });
  };

  const handleSaveEntry = () => {
    if (!selectedDate) return;

    const now = new Date().toISOString();
    const existingEntry = dailyEntries[selectedDate];

    setDailyEntries(prev => ({
      ...prev,
      [selectedDate]: {
        id: existingEntry?.id || Date.now().toString(),
        content: editContent,
        materials: editMaterials,
        createdAt: existingEntry?.createdAt || now,
        updatedAt: now
      }
    }));

    setSelectedDate(null);
  };

  const handleAddMaterial = () => {
    if (!newMaterial.name) return;

    const material: Material = {
      id: Date.now().toString(),
      type: newMaterial.type,
      name: newMaterial.name,
      url: newMaterial.url || undefined,
      dataUrl: newMaterial.dataUrl || undefined,
      note: newMaterial.note || undefined,
    };

    setEditMaterials(prev => [...prev, material]);
    setNewMaterial({ type: 'link', name: '', url: '', note: '', dataUrl: '' });
  };

  const handleDeleteMaterial = (materialId: string | number) => {
    setEditMaterials(prev => prev.filter(m => m.id !== materialId));
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, type: 'image' | 'file') => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 10 * 1024 * 1024) {
      alert('檔案大小不能超過 10MB');
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      setNewMaterial(prev => ({
        ...prev,
        type,
        name: prev.name || file.name,
        dataUrl: reader.result as string,
      }));
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('zh-TW', { month: 'long', day: 'numeric' });
  };

  return (
    <div className="retro-panel h-full flex flex-col overflow-hidden p-4">
      {!selectedDate ? (
        <>
          {/* Compact Header with Person Tabs + Month Navigation */}
          <div className="flex items-center justify-between mb-3 shrink-0">
            {/* Person Tabs - Compact */}
            <div className="flex items-center gap-2">
              {(['ja', 'jo'] as PersonType[]).map((person) => {
                const config = PERSON_CONFIG[person];
                const isActive = activePerson === person;
                return (
                  <button
                    key={person}
                    onClick={() => handlePersonChange(person)}
                    className={`retro-btn relative px-4 py-1.5 font-bold text-xs uppercase transition-all ${
                      isActive
                        ? `${config.color} text-white border-2 border-black`
                        : 'bg-white text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    {config.name}
                  </button>
                );
              })}
            </div>

            {/* Month Display + Navigation */}
            <div className="flex items-center gap-3">
              <button
                onClick={handlePrevMonth}
                className="retro-btn p-1.5 bg-gray-200 text-gray-700 hover:bg-gray-300"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <h2 className="text-lg font-bold text-gray-900 uppercase min-w-[140px] text-center">{monthInfo.monthName}</h2>
              <button
                onClick={handleNextMonth}
                className="retro-btn p-1.5 bg-gray-200 text-gray-700 hover:bg-gray-300"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Grid Header */}
          <div className="grid grid-cols-7 gap-2 mb-2 shrink-0">
            {days.map(d => (
              <div key={d} className="text-center text-xs font-bold text-gray-700 uppercase tracking-wider border-b border-gray-300 pb-1">
                {d}
              </div>
            ))}
          </div>

          {/* Grid Body - No scroll, fit to screen */}
          <div className="grid grid-cols-7 gap-2 flex-1 min-h-0 p-1">
        {/* Empty slots for first week */}
        {Array.from({ length: monthInfo.firstDay }).map((_, i) => (
          <div key={`empty-${i}`} className="p-2" />
        ))}

        {/* Days */}
        {Array.from({ length: monthInfo.daysInMonth }).map((_, i) => {
          const dayNum = i + 1;
          const dateStr = getDateStr(dayNum);
          const entry = dailyEntries[dateStr];
          const isToday = dateStr === todayStr;
          const isSelected = dateStr === selectedDate;
          const hasContent = entry?.content || (entry?.materials && entry.materials.length > 0);

          return (
            <motion.div
              key={dayNum}
              whileHover={{ y: -1 }}
              onClick={() => handleDayClick(dayNum)}
              className={`
                retro-panel p-2 transition-all duration-200 flex flex-col gap-0.5 overflow-hidden h-full cursor-pointer relative
                ${isToday
                  ? 'border-blue-500 bg-blue-100'
                  : isSelected
                    ? 'border-emerald-500 bg-emerald-100'
                    : hasContent
                      ? 'border-gray-500 bg-gray-100 hover:bg-gray-200'
                      : 'border-gray-300 hover:bg-gray-50'}
              `}
            >
              <div className="flex justify-between items-start shrink-0">
                <span className={`text-xs font-bold uppercase ${isToday ? 'text-blue-800' : 'text-gray-800'}`}>
                  {dayNum}
                </span>
                {entry?.materials && entry.materials.length > 0 && (
                  <span className="flex items-center gap-0.5 text-[9px] font-bold px-1 py-0.5 border border-black bg-gray-200 text-gray-800 uppercase">
                    <Paperclip className="w-2 h-2" />
                    {entry.materials.length}
                  </span>
                )}
              </div>

              {/* Content Preview - Full Display */}
              {entry?.content && (
                <div className="flex-1 mt-0.5 overflow-y-auto custom-scrollbar">
                  <p className="text-xs text-gray-700 leading-snug whitespace-pre-wrap">
                    {entry.content}
                  </p>
                </div>
              )}

              {/* Has content indicator */}
              {hasContent && (
                <div className="absolute bottom-1 right-1 w-1.5 h-1.5 border border-black bg-blue-500" />
              )}
            </motion.div>
          );
        })}
          </div>
        </>
      ) : (
        /* Edit Mode - Full Screen */
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          className="h-full flex flex-col"
        >
            <div className="flex items-center justify-between p-4 border-b-2 border-gray-900 bg-gray-100 shrink-0">
              <h3 className="font-bold text-lg text-gray-900 uppercase">
                ENTRY_LOG // {formatDate(selectedDate)}
              </h3>
              <div className="flex gap-2">
                <button
                  onClick={handleSaveEntry}
                  className="retro-btn bg-blue-500 text-white px-3 py-1.5 text-sm hover:bg-blue-600"
                >
                  <Save className="w-4 h-4" />
                  SAVE_ENTRY
                </button>
                <button
                  onClick={() => setSelectedDate(null)}
                  className="retro-btn p-1.5 bg-gray-200 text-gray-700 hover:bg-gray-300"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar p-5 space-y-4">
              {/* Content Textarea */}
              <div>
                <label className="text-xs font-bold text-gray-600 uppercase tracking-wider mb-2 block">
                  <FileText className="w-3 h-3 inline mr-1" />
                  ENTRY_CONTENT
                </label>
                <textarea
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                  rows={5}
                  placeholder="RECORD_DAILY_OPERATIONS_AND_OBSERVATIONS_HERE..."
                  className="w-full px-4 py-3 border-2 border-gray-400 bg-white text-sm focus:outline-none focus:border-blue-500 resize-none"
                />
              </div>

              {/* Attachments Section */}
              <div>
                <label className="text-xs font-bold text-gray-600 uppercase tracking-wider mb-2 block">
                  <Paperclip className="w-3 h-3 inline mr-1" />
                  ATTACHMENTS
                </label>

                {/* Existing Materials */}
                {editMaterials.length > 0 && (
                  <div className="space-y-2 mb-3">
                    {editMaterials.map(material => (
                      <div key={material.id} className="flex items-center gap-3 p-2.5 retro-panel-inner group hover:border-blue-600">
                        <div className={`w-8 h-8 border border-gray-900 flex items-center justify-center text-xs shrink-0
                          ${material.type === 'link' ? 'bg-blue-500 text-white' :
                            material.type === 'image' ? 'bg-emerald-500 text-white' :
                            material.type === 'video' ? 'bg-red-500 text-white' :
                            material.type === 'note' ? 'bg-fuchsia-500 text-white' : 'bg-gray-500 text-white'}`}
                        >
                          {material.type === 'link' ? <LinkIcon className="w-4 h-4" /> :
                           material.type === 'image' ? <ImageIcon className="w-4 h-4" /> :
                           material.type === 'video' ? <PlayCircle className="w-4 h-4" /> :
                           <FileText className="w-4 h-4" />}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-bold text-gray-900 truncate">{material.name}</div>
                          {material.url && <div className="text-xs text-gray-600 truncate">{material.url}</div>}
                          {material.note && <div className="text-xs text-gray-700 mt-0.5">{material.note}</div>}
                        </div>
                        {material.type === 'image' && (material.dataUrl || material.url) && (
                          <button
                            onClick={() => setViewingImage({ src: material.dataUrl || material.url || '', name: material.name })}
                            className="relative group/img"
                          >
                            <img src={material.dataUrl || material.url} alt={material.name} className="w-12 h-12 border border-gray-900 object-cover" />
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/img:opacity-100 transition-opacity flex items-center justify-center">
                              <ZoomIn className="w-4 h-4 text-white" />
                            </div>
                          </button>
                        )}
                        <button
                          onClick={() => handleDeleteMaterial(material.id)}
                          className="retro-btn p-1.5 text-gray-700 hover:text-red-600 hover:bg-red-100 opacity-0 group-hover:opacity-100 transition-all"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                                  {/* Add New Material */}
                                  <div className="space-y-3 p-3 bg-gray-100 border-2 border-dashed border-gray-400">                    {/* Type Selection */}
                    <div className="flex flex-wrap gap-2">
                      {[{
                        type: 'link',
                        label: 'LINK',
                        icon: LinkIcon,
                        color: 'bg-blue-500'
                      }, {
                        type: 'image',
                        label: 'IMAGE',
                        icon: ImageIcon,
                        color: 'bg-emerald-500'
                      }, {
                        type: 'file',
                        label: 'FILE',
                        icon: FileText,
                        color: 'bg-amber-500'
                      }, {
                        type: 'video',
                        label: 'VIDEO',
                        icon: PlayCircle,
                        color: 'bg-red-500'
                      }, {
                        type: 'note',
                        label: 'NOTE',
                        icon: FileText,
                        color: 'bg-fuchsia-500'
                      }, ].map(item => (
                        <button
                          key={item.type}
                          onClick={() => setNewMaterial(prev => ({ ...prev,
                            type: item.type as Material['type']
                          }))}
                          className={`retro-btn flex items-center gap-1 px-2.5 py-1.5 text-xs uppercase ${
                            newMaterial.type === item.type ? `${item.color} text-white` : 'bg-white text-gray-700 hover:bg-gray-100'
                          }`}
                        >
                          <item.icon className="w-3 h-3" />
                          {item.label}
                        </button>
                      ))}
                    </div>

                    {/* Name Input */}
                    <input
                      type="text"
                      placeholder="ATTACHMENT_NAME"
                      value={newMaterial.name}
                      onChange={(e) => setNewMaterial(prev => ({ ...prev, name: e.target.value }))}
                      className="w-full px-3 py-2 border-2 border-gray-400 bg-white text-sm focus:outline-none focus:border-blue-500 uppercase"
                    />

                                      {/* Type-specific inputs */}
                                      {newMaterial.type === 'note' ? (
                                        <textarea
                                          placeholder="NOTE_CONTENT..."
                                          value={newMaterial.note || ''}
                                          onChange={(e) => setNewMaterial(prev => ({ ...prev, note: e.target.value }))}
                                          rows={2}
                                          className="w-full px-3 py-2 border-2 border-gray-400 bg-white text-sm focus:outline-none focus:border-blue-500 resize-none"
                                        />
                                      ) : newMaterial.type === 'image' ? (
                                        <div className="space-y-2">
                                          <input
                                            type="text"
                                            placeholder="IMAGE_URL (OR_UPLOAD)"
                                            value={newMaterial.url}
                                            onChange={(e) => setNewMaterial(prev => ({ ...prev, url: e.target.value, dataUrl: '' }))}
                                            className="w-full px-3 py-2 border-2 border-gray-400 bg-white text-sm focus:outline-none focus:border-blue-500"
                                          />
                                          <label className="retro-btn flex items-center justify-center gap-2 w-full py-2.5 bg-emerald-500 text-white cursor-pointer hover:bg-emerald-600">
                                            <Upload className="w-3.5 h-3.5" />
                                            UPLOAD_IMAGE
                                            <input type="file" className="hidden" accept="image/*" onChange={(e) => handleFileUpload(e, 'image')} />
                                          </label>
                                          {newMaterial.dataUrl && (
                                            <div className="relative">
                                              <img src={newMaterial.dataUrl} alt="PREVIEW" className="w-full h-24 object-cover border border-gray-900" />
                                              <button
                                                onClick={() => setNewMaterial(prev => ({ ...prev, dataUrl: '' }))}
                                                className="retro-btn absolute top-1 right-1 p-1 bg-red-500 text-white hover:bg-red-600"
                                              >
                                                <X className="w-3 h-3" />
                                              </button>
                                            </div>
                                          )}
                                        </div>
                                      ) : newMaterial.type === 'file' ? (
                                        <div className="space-y-2">
                                          <input
                                            type="text"
                                            placeholder="FILE_URL (OR_UPLOAD)"
                                            value={newMaterial.url}
                                            onChange={(e) => setNewMaterial(prev => ({ ...prev, url: e.target.value, dataUrl: '' }))}
                                            className="w-full px-3 py-2 border-2 border-gray-400 bg-white text-sm focus:outline-none focus:border-blue-500"
                                          />
                                          <label className="retro-btn flex items-center justify-center gap-2 w-full py-2.5 bg-amber-500 text-white cursor-pointer hover:bg-amber-600">
                                            <Upload className="w-3.5 h-3.5" />
                                            UPLOAD_FILE
                                            <input type="file" className="hidden" accept="audio/*,.pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.mp3,.m4a,.wav" onChange={(e) => handleFileUpload(e, 'file')} />
                                          </label>
                                          {newMaterial.dataUrl && (
                                            <div className="relative">
                                              <input type="text" value={newMaterial.name} readOnly className="w-full px-3 py-2 border-2 border-gray-400 bg-gray-100 text-sm" />
                                              <button
                                                onClick={() => setNewMaterial(prev => ({ ...prev, dataUrl: '', name: '' }))}
                                                className="retro-btn absolute top-1 right-1 p-1 bg-red-500 text-white hover:bg-red-600"
                                              >
                                                <X className="w-3 h-3" />
                                              </button>
                                            </div>
                                          )}
                                        </div>
                                      ) : (
                                        <input
                                          type="text"
                                          placeholder={newMaterial.type === 'video' ? 'VIDEO_URL' : 'LINK_URL'}
                                          value={newMaterial.url}
                                          onChange={(e) => setNewMaterial(prev => ({ ...prev, url: e.target.value }))}
                                          className="w-full px-3 py-2 border-2 border-gray-400 bg-white text-sm focus:outline-none focus:border-blue-500"
                                        />
                                      )}
                                      {/* Add Button */}
                                      <button
                                        onClick={handleAddMaterial}
                                        disabled={!newMaterial.name || (newMaterial.type !== 'note' && newMaterial.type !== 'file' && newMaterial.type !== 'image' && !newMaterial.url)}
                                        className="retro-btn w-full py-2 bg-blue-500 text-white hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
                                      >
                                        <Plus className="w-4 h-4" />
                                        ADD_ATTACHMENT
                                      </button>                </div>
              </div>
            </div>
        </motion.div>
      )}

      {/* Image Viewer Modal */}
      <AnimatePresence>
        {viewingImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setViewingImage(null)}
            className="fixed inset-0 bg-black/80 z-[100] flex items-center justify-center p-8 cursor-zoom-out"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="retro-panel relative max-w-4xl max-h-[90vh] overflow-hidden"
            >
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b-2 border-gray-900 bg-gray-100">
                <h4 className="font-bold text-gray-900 truncate uppercase">{viewingImage.name}</h4>
                <button
                  onClick={() => setViewingImage(null)}
                  className="retro-btn p-2 bg-gray-200 text-gray-700 hover:bg-gray-300"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Image */}
              <div className="p-4 bg-gray-50">
                <img
                  src={viewingImage.src}
                  alt={viewingImage.name}
                  className="max-w-full max-h-[70vh] object-contain mx-auto border border-gray-900"
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
