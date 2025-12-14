import { useState, useEffect, useCallback } from 'react';
import { notesApi } from '../api/client';
import { Material } from '../types';

export interface LearningNote {
  id: string;
  title: string;
  content: string;
  relatedTaskIds: string[];
  materials: Material[];
  createdAt: string;
  updatedAt: string;
}

export const useNotes = () => {
  const [notes, setNotes] = useState<LearningNote[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchNotes = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const loadedNotes = await notesApi.getAll();
      setNotes(loadedNotes);
    } catch (err) {
      console.error('Failed to fetch notes:', err);
      setError(err instanceof Error ? err.message : 'Failed to load notes');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Initial load
  useEffect(() => {
    fetchNotes();
  }, [fetchNotes]);

  const addNote = useCallback(async (note: Omit<LearningNote, 'id' | 'createdAt' | 'updatedAt'>) => {
    setIsSyncing(true);
    try {
      const result = await notesApi.create(note);
      setNotes(prev => [...prev, result.note]);
      return result.note;
    } catch (err) {
      console.error('Failed to add note:', err);
      setError('Failed to add note');
      throw err;
    } finally {
      setIsSyncing(false);
    }
  }, []);

  const updateNote = useCallback(async (note: LearningNote) => {
    setIsSyncing(true);
    try {
      const result = await notesApi.update(note);
      setNotes(prev => prev.map(n =>
        String(n.id) === String(note.id) ? result.note : n
      ));
      return result.note;
    } catch (err) {
      console.error('Failed to update note:', err);
      setError('Failed to update note');
      throw err;
    } finally {
      setIsSyncing(false);
    }
  }, []);

  const deleteNote = useCallback(async (noteId: string) => {
    setIsSyncing(true);
    try {
      await notesApi.delete(noteId);
      setNotes(prev => prev.filter(n => String(n.id) !== String(noteId)));
    } catch (err) {
      console.error('Failed to delete note:', err);
      setError('Failed to delete note');
      throw err;
    } finally {
      setIsSyncing(false);
    }
  }, []);

  const saveNotes = useCallback(async (nextNotes: LearningNote[]) => {
    setIsSyncing(true);
    try {
      await notesApi.bulkUpdate(nextNotes);
      setNotes(nextNotes);
    } catch (err) {
      console.error('Sync failed:', err);
      setError('Sync failed');
      throw err;
    } finally {
      setIsSyncing(false);
    }
  }, []);

  return {
    notes,
    isLoading,
    isSyncing,
    error,
    refetch: fetchNotes,
    addNote,
    updateNote,
    deleteNote,
    saveNotes,
  };
};
