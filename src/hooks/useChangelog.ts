import { useState, useEffect, useCallback } from 'react';

export interface ChangelogEntry {
  id: string;
  version: string;
  date: string;
  type: 'feature' | 'fix' | 'improvement' | 'breaking';
  title: string;
  description?: string;
  items?: string[];
  author?: string;
}

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';

export const useChangelog = () => {
  const [changelog, setChangelog] = useState<ChangelogEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 從雲端獲取更新日誌
  const fetchChangelog = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch(`${API_BASE_URL}/api/changelog`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setChangelog(data.changelog || []);
    } catch (err) {
      console.error('Failed to fetch changelog:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch changelog');

      // 如果雲端獲取失敗，使用本地預設數據
      const defaultChangelog: ChangelogEntry[] = [
        {
          id: '1',
          version: '2.1.0',
          date: '2025-12-23',
          type: 'feature',
          title: '人員管理雲端持久化',
          items: [
            '新增 People API 使用 Redis 儲存人員列表',
            '新增 usePeople Hook 實現雲端同步',
            '設定面板人員管理現在支援跨裝置同步',
            '移除未使用的 Upstash 依賴',
          ],
          author: 'Claude Sonnet 4.5',
        },
        {
          id: '2',
          version: '2.0.0',
          date: '2025-12-21',
          type: 'feature',
          title: '合作類型標識功能',
          items: [
            '新增任務合作類型欄位（solo/team）',
            '任務編輯面板新增合作類型選擇器（🙋 獨立 / 👥 合作）',
            '甘特圖左側列表顯示合作類型圖標',
          ],
          author: 'Claude Sonnet 4.5',
        },
        {
          id: '3',
          version: '1.9.0',
          date: '2025-12-19',
          type: 'fix',
          title: 'Calendar View 雲端儲存修復',
          items: [
            '修復 Calendar View 雲端儲存功能',
            '整合 Redis Cloud，支援跨裝置同步',
            'Calendar API 使用與甘特圖任務相同的 Redis Cloud',
          ],
        },
      ];
      setChangelog(defaultChangelog);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // 新增更新日誌條目
  const addEntry = useCallback(async (entry: Omit<ChangelogEntry, 'id'>) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/changelog`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(entry),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setChangelog(data.changelog || []);
      return true;
    } catch (err) {
      console.error('Failed to add changelog entry:', err);
      return false;
    }
  }, []);

  // 刪除更新日誌條目
  const deleteEntry = useCallback(async (id: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/changelog?id=${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setChangelog(data.changelog || []);
      return true;
    } catch (err) {
      console.error('Failed to delete changelog entry:', err);
      return false;
    }
  }, []);

  // 初始加載
  useEffect(() => {
    fetchChangelog();
  }, [fetchChangelog]);

  return {
    changelog,
    isLoading,
    error,
    refetch: fetchChangelog,
    addEntry,
    deleteEntry,
  };
};
