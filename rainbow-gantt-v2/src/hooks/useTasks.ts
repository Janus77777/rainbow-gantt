import { useState, useEffect, useCallback } from 'react';
import { Task } from '../types';
import { tasksApi } from '../api/client';

export const useTasks = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTasks = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const loadedTasks = await tasksApi.getAll();
      setTasks(loadedTasks);
    } catch (err) {
      console.error('Failed to fetch tasks:', err);
      setError(err instanceof Error ? err.message : 'Failed to load tasks');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Initial load
  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const addTask = useCallback(async (task: Omit<Task, 'id'>) => {
    setIsSyncing(true);
    try {
      const result = await tasksApi.create(task);
      setTasks(prev => [...prev, result.task]);
      return result.task;
    } catch (err) {
      console.error('Failed to add task:', err);
      setError('Failed to add task');
      throw err;
    } finally {
      setIsSyncing(false);
    }
  }, []);

  const updateTask = useCallback(async (task: Task) => {
    setIsSyncing(true);
    try {
      const result = await tasksApi.update(task);
      setTasks(prev => prev.map(t =>
        String(t.id) === String(task.id) ? result.task : t
      ));
      return result.task;
    } catch (err) {
      console.error('Failed to update task:', err);
      setError('Failed to update task');
      throw err;
    } finally {
      setIsSyncing(false);
    }
  }, []);

  const deleteTask = useCallback(async (taskId: string) => {
    setIsSyncing(true);
    try {
      await tasksApi.delete(taskId);
      setTasks(prev => prev.filter(t => String(t.id) !== String(taskId)));
    } catch (err) {
      console.error('Failed to delete task:', err);
      setError('Failed to delete task');
      throw err;
    } finally {
      setIsSyncing(false);
    }
  }, []);

  const saveTasks = useCallback(async (nextTasks: Task[]) => {
    setIsSyncing(true);
    try {
      await tasksApi.bulkUpdate(nextTasks);
      setTasks(nextTasks);
    } catch (err) {
      console.error('Sync failed:', err);
      setError('Sync failed');
      throw err;
    } finally {
      setIsSyncing(false);
    }
  }, []);

  return {
    tasks,
    isLoading,
    isSyncing,
    error,
    refetch: fetchTasks,
    addTask,
    updateTask,
    deleteTask,
    saveTasks,
  };
};
