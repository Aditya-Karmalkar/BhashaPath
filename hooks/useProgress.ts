import { useState, useEffect } from 'react';
import { StorageService, UserProgress } from '../services/StorageService';

export function useProgress() {
  const [progress, setProgress] = useState<UserProgress | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProgress();
  }, []);

  const loadProgress = async () => {
    try {
      const userProgress = await StorageService.getUserProgress();
      setProgress(userProgress || getDefaultProgress());
    } catch (error) {
      console.error('Failed to load progress:', error);
      setProgress(getDefaultProgress());
    } finally {
      setLoading(false);
    }
  };

  const updateProgress = async (newProgress: UserProgress) => {
    try {
      await StorageService.saveUserProgress(newProgress);
      setProgress(newProgress);
    } catch (error) {
      console.error('Failed to update progress:', error);
    }
  };

  const completeLesson = async (lessonId: string, score: number, timeSpent: number) => {
    try {
      await StorageService.updateLessonCompletion(lessonId, score, timeSpent);
      await loadProgress(); // Reload to get updated progress
    } catch (error) {
      console.error('Failed to complete lesson:', error);
    }
  };

  const getDefaultProgress = (): UserProgress => ({
    userId: 'default_user',
    completedLessons: [],
    currentLevel: 1,
    totalXP: 0,
    streakDays: 0,
    lastStudyDate: new Date().toISOString(),
    languageProgress: {
      marathi: { completedLessons: 0, totalLessons: 30, currentLevel: 1 },
      hindi: { completedLessons: 0, totalLessons: 25, currentLevel: 1 },
      gujarati: { completedLessons: 0, totalLessons: 20, currentLevel: 1 },
    },
  });

  return {
    progress,
    loading,
    updateProgress,
    completeLesson,
    refreshProgress: loadProgress,
  };
}