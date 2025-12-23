export type TaskStatus = 'pending' | 'in-progress' | 'completed' | 'unpublished' | 'blocked';
export type TaskCategory = 'AI賦能' | '流程優化' | '產品行銷' | '品牌行銷' | '客戶開發' | string;
export type TaskPriority = 'urgent' | 'high' | 'medium' | 'low';
export type CollaborationType = 'solo' | 'team';

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

export interface TaskComment {
  id: string;
  author: string;
  content: string;
  createdAt: string;
}

export interface TaskChangelogEntry {
  id: string;
  version: string;
  content: string;
  author: string;
  createdAt: string;
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
  owner?: string;           // 負責人名稱
  stakeholders?: Stakeholder[];
  isPoc?: boolean;
  priority?: TaskPriority;  // 優先級：urgent > high > medium > low
  comments?: TaskComment[]; // 備註/意見
  collaborationType?: CollaborationType;  // 合作類型：solo | team
  changelog?: TaskChangelogEntry[];  // 版本記錄
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