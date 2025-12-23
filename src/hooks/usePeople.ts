import { useState, useEffect, useCallback } from 'react';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';

export const usePeople = () => {
  const [people, setPeople] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 從雲端獲取人員列表
  const fetchPeople = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch(`${API_BASE_URL}/api/people`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setPeople(data.people || []);
    } catch (err) {
      console.error('Failed to fetch people:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch people');

      // 如果雲端獲取失敗，嘗試從 localStorage 讀取
      const saved = localStorage.getItem('gantt-v2:people');
      if (saved) {
        setPeople(JSON.parse(saved));
      } else {
        setPeople(['Janus', 'Joseph Chang']);
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  // 保存人員列表到雲端
  const savePeople = useCallback(async (newPeople: string[]) => {
    try {
      setError(null);

      const response = await fetch(`${API_BASE_URL}/api/people`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ people: newPeople }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setPeople(data.people);

      // 同時更新 localStorage 作為備份
      localStorage.setItem('gantt-v2:people', JSON.stringify(data.people));
    } catch (err) {
      console.error('Failed to save people:', err);
      setError(err instanceof Error ? err.message : 'Failed to save people');

      // 如果雲端保存失敗，至少保存到 localStorage
      localStorage.setItem('gantt-v2:people', JSON.stringify(newPeople));
      setPeople(newPeople);
    }
  }, []);

  // 新增人員
  const addPerson = useCallback(async (name: string) => {
    const trimmed = name.trim();
    if (!trimmed || people.includes(trimmed)) {
      return;
    }

    const newPeople = [...people, trimmed];
    await savePeople(newPeople);
  }, [people, savePeople]);

  // 刪除人員
  const deletePerson = useCallback(async (name: string) => {
    const newPeople = people.filter(p => p !== name);
    await savePeople(newPeople);
  }, [people, savePeople]);

  // 更新人員名稱
  const updatePerson = useCallback(async (oldName: string, newName: string) => {
    const trimmed = newName.trim();

    // 驗證：不能為空，不能與現有名稱重複（除了自己）
    if (!trimmed || (trimmed !== oldName && people.includes(trimmed))) {
      return false;
    }

    // 如果名稱沒有變化，不需要更新
    if (trimmed === oldName) {
      return true;
    }

    const newPeople = people.map(p => p === oldName ? trimmed : p);
    await savePeople(newPeople);
    return true;
  }, [people, savePeople]);

  // 初始加載
  useEffect(() => {
    fetchPeople();
  }, [fetchPeople]);

  return {
    people,
    isLoading,
    error,
    addPerson,
    deletePerson,
    updatePerson,
    savePeople,
    refetch: fetchPeople,
  };
};
