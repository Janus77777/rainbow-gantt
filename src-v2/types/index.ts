export type TaskStatus = 'pending' | 'in-progress' | 'completed' | 'unpublished' | 'blocked';
export type TaskCategory = 'AI賦能' | '流程優化' | '產品行銷' | '品牌行銷' | '客戶開發' | '學習與成長' | string;

export interface Material {
  id: string | number;
  type: 'link' | 'image' | 'file' | 'note' | 'video';
  name: string;
  url?: string;
  dataUrl?: string;
  note?: string;
}

export interface Stakeholder {
  id: string;
  name: string;
  role: string;
  avatar?: string;
}

export interface Task {
  id: string | number;
  name: string;
  startDate: string;
  endDate: string;
  status: TaskStatus;
  category: TaskCategory;
  progress: number;
  description?: string;
  materials: Material[];
  
  // V2 New Fields (Optional for backward compatibility)
  stakeholders?: Stakeholder[];
  isPoc?: boolean;
}

export interface WorkspaceSettings {
  projectTitle: string;
  rangeMode: 'auto' | 'custom';
  viewRange: { start: string; end: string };
}

export interface WorkspaceData {
  tasks: Task[];
  settings: WorkspaceSettings;
}