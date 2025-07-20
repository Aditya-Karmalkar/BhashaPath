import AsyncStorage from '@react-native-async-storage/async-storage';

export interface UserProgress {
  userId: string;
  completedLessons: string[];
  currentLevel: number;
  totalXP: number;
  streakDays: number;
  lastStudyDate: string;
  languageProgress: {
    [languageId: string]: {
      completedLessons: number;
      totalLessons: number;
      currentLevel: number;
    };
  };
}

export interface LessonResult {
  lessonId: string;
  score: number;
  completedAt: string;
  timeSpent: number;
  attempts: number;
}

export class StorageService {
  private static readonly USER_PROGRESS_KEY = 'user_progress';
  private static readonly LESSON_RESULTS_KEY = 'lesson_results';

  static async getUserProgress(): Promise<UserProgress | null> {
    try {
      const data = await AsyncStorage.getItem(this.USER_PROGRESS_KEY);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error('Failed to get user progress:', error);
      return null;
    }
  }

  static async saveUserProgress(progress: UserProgress): Promise<void> {
    try {
      await AsyncStorage.setItem(this.USER_PROGRESS_KEY, JSON.stringify(progress));
    } catch (error) {
      console.error('Failed to save user progress:', error);
    }
  }

  static async updateLessonCompletion(lessonId: string, score: number, timeSpent: number): Promise<void> {
    try {
      const progress = await this.getUserProgress() || this.getDefaultProgress();
      
      if (!progress.completedLessons.includes(lessonId)) {
        progress.completedLessons.push(lessonId);
        progress.totalXP += Math.round(score * 10);
        
        // Update streak
        const today = new Date().toDateString();
        const lastStudy = new Date(progress.lastStudyDate).toDateString();
        const yesterday = new Date(Date.now() - 86400000).toDateString();
        
        if (lastStudy === yesterday) {
          progress.streakDays += 1;
        } else if (lastStudy !== today) {
          progress.streakDays = 1;
        }
        
        progress.lastStudyDate = new Date().toISOString();
        
        await this.saveUserProgress(progress);
      }

      // Save lesson result
      const result: LessonResult = {
        lessonId,
        score,
        completedAt: new Date().toISOString(),
        timeSpent,
        attempts: 1,
      };

      const results = await this.getLessonResults();
      results.push(result);
      await AsyncStorage.setItem(this.LESSON_RESULTS_KEY, JSON.stringify(results));
    } catch (error) {
      console.error('Failed to update lesson completion:', error);
    }
  }

  static async getLessonResults(): Promise<LessonResult[]> {
    try {
      const data = await AsyncStorage.getItem(this.LESSON_RESULTS_KEY);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Failed to get lesson results:', error);
      return [];
    }
  }

  private static getDefaultProgress(): UserProgress {
    return {
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
    };
  }
}