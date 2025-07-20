import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ArrowLeft, Play, Lock, CircleCheck as CheckCircle, Star, Clock } from 'lucide-react-native';
import { useProgress } from '@/hooks/useProgress';

interface LessonUnit {
  id: string;
  title: string;
  description: string;
  lessons: Lesson[];
  isUnlocked: boolean;
  completedLessons: number;
}

interface Lesson {
  id: string;
  title: string;
  type: 'vocabulary' | 'grammar' | 'pronunciation' | 'conversation';
  duration: number;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  isCompleted: boolean;
  isLocked: boolean;
  stars: number;
}

export default function LanguageDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { progress, loading } = useProgress();
  
  const [languageInfo] = useState({
    name: id === 'marathi' ? 'Marathi' : id === 'hindi' ? 'Hindi' : 'Gujarati',
    nativeName: id === 'marathi' ? 'मराठी' : id === 'hindi' ? 'हिन्दी' : 'ગુજરાતી',
    description: 'Master the fundamentals and build your confidence',
    totalLessons: 30,
    completedLessons: 19,
    currentLevel: 8,
    color: id === 'marathi' ? '#FF7722' : id === 'hindi' ? '#059669' : '#1E3A8A'
  });

  const [units] = useState<LessonUnit[]>([
    {
      id: 'unit-1',
      title: 'Basic Greetings & Introductions',
      description: 'Learn essential greetings and how to introduce yourself',
      isUnlocked: true,
      completedLessons: 5,
      lessons: [
        {
          id: 'lesson-1',
          title: 'Hello & Goodbye',
          type: 'vocabulary',
          duration: 15,
          difficulty: 'Easy',
          isCompleted: true,
          isLocked: false,
          stars: 3
        },
        {
          id: 'lesson-2',
          title: 'Introducing Yourself',
          type: 'conversation',
          duration: 20,
          difficulty: 'Easy',
          isCompleted: true,
          isLocked: false,
          stars: 2
        },
        {
          id: 'lesson-3',
          title: 'Asking Names',
          type: 'vocabulary',
          duration: 12,
          difficulty: 'Easy',
          isCompleted: true,
          isLocked: false,
          stars: 3
        },
        {
          id: 'lesson-4',
          title: 'Pronunciation Practice',
          type: 'pronunciation',
          duration: 18,
          difficulty: 'Medium',
          isCompleted: false,
          isLocked: false,
          stars: 0
        },
        {
          id: 'lesson-5',
          title: 'Polite Expressions',
          type: 'conversation',
          duration: 25,
          difficulty: 'Medium',
          isCompleted: false,
          isLocked: false,
          stars: 0
        }
      ]
    },
    {
      id: 'unit-2',
      title: 'Family & Relationships',
      description: 'Words for family members and close relationships',
      isUnlocked: true,
      completedLessons: 3,
      lessons: [
        {
          id: 'lesson-6',
          title: 'Family Members',
          type: 'vocabulary',
          duration: 20,
          difficulty: 'Easy',
          isCompleted: true,
          isLocked: false,
          stars: 3
        },
        {
          id: 'lesson-7',
          title: 'Family Relationships',
          type: 'grammar',
          duration: 25,
          difficulty: 'Medium',
          isCompleted: true,
          isLocked: false,
          stars: 2
        },
        {
          id: 'lesson-8',
          title: 'Talking About Family',
          type: 'conversation',
          duration: 30,
          difficulty: 'Medium',
          isCompleted: true,
          isLocked: false,
          stars: 1
        },
        {
          id: 'lesson-9',
          title: 'Family Traditions',
          type: 'vocabulary',
          duration: 22,
          difficulty: 'Medium',
          isCompleted: false,
          isLocked: false,
          stars: 0
        }
      ]
    },
    {
      id: 'unit-3',
      title: 'Daily Activities',
      description: 'Express your daily routine and common activities',
      isUnlocked: false,
      completedLessons: 0,
      lessons: [
        {
          id: 'lesson-10',
          title: 'Morning Routine',
          type: 'vocabulary',
          duration: 18,
          difficulty: 'Medium',
          isCompleted: false,
          isLocked: true,
          stars: 0
        },
        {
          id: 'lesson-11',
          title: 'At Work/School',
          type: 'conversation',
          duration: 28,
          difficulty: 'Medium',
          isCompleted: false,
          isLocked: true,
          stars: 0
        }
      ]
    }
  ]);

  const languageProgressPercentage = (languageInfo.completedLessons / languageInfo.totalLessons) * 100;

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'vocabulary': return '#059669';
      case 'grammar': return '#1E3A8A';
      case 'pronunciation': return '#FF7722';
      case 'conversation': return '#7C3AED';
      default: return '#6B7280';
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return '#059669';
      case 'Medium': return '#FF7722';
      case 'Hard': return '#DC2626';
      default: return '#6B7280';
    }
  };

  const handleLessonPress = (lesson: Lesson) => {
    if (!lesson.isLocked) {
      router.push(`/lesson/${lesson.id}`);
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading language details...</Text>
        </View>
      </SafeAreaView>
    );
  }

  const renderStars = (count: number) => {
    return (
      <View style={styles.starsContainer}>
        {[1, 2, 3].map((star) => (
          <Star
            key={star}
            size={12}
            color={star <= count ? '#FFD700' : '#E5E7EB'}
            fill={star <= count ? '#FFD700' : 'none'}
          />
        ))}
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: languageInfo.color }]}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <ArrowLeft size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <View style={styles.headerContent}>
          <Text style={styles.languageName}>{languageInfo.name}</Text>
          <Text style={styles.languageNative}>{languageInfo.nativeName}</Text>
          <Text style={styles.languageDescription}>{languageInfo.description}</Text>
        </View>
      </View>

      {/* Progress Section */}
      <View style={styles.progressSection}>
        <View style={styles.progressHeader}>
          <Text style={styles.progressTitle}>Your Progress</Text>
          <Text style={styles.progressPercentage}>{Math.round(languageProgressPercentage)}%</Text>
        </View>
        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { width: `${languageProgressPercentage}%`, backgroundColor: languageInfo.color }]} />
        </View>
        <View style={styles.progressStats}>
          <Text style={styles.progressText}>
            {languageInfo.completedLessons} of {languageInfo.totalLessons} lessons completed
          </Text>
          <Text style={styles.levelText}>Level {languageInfo.currentLevel}</Text>
        </View>
      </View>

      {/* Lessons Content */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {units.map((unit) => (
          <View key={unit.id} style={styles.unitContainer}>
            <View style={styles.unitHeader}>
              <View style={styles.unitTitleContainer}>
                <Text style={styles.unitTitle}>{unit.title}</Text>
                <Text style={styles.unitDescription}>{unit.description}</Text>
              </View>
              {!unit.isUnlocked && (
                <View style={styles.lockContainer}>
                  <Lock size={20} color="#6B7280" />
                </View>
              )}
            </View>

            {unit.isUnlocked && (
              <View style={styles.lessonsContainer}>
                {unit.lessons.map((lesson, index) => (
                  <TouchableOpacity
                    key={lesson.id}
                    style={[
                      styles.lessonCard,
                      lesson.isLocked && styles.lockedLessonCard,
                      lesson.isCompleted && styles.completedLessonCard
                    ]}
                    onPress={() => handleLessonPress(lesson)}
                    disabled={lesson.isLocked}
                  >
                    <View style={styles.lessonHeader}>
                      <View style={styles.lessonNumber}>
                        <Text style={styles.lessonNumberText}>{index + 1}</Text>
                      </View>
                      <View style={styles.lessonInfo}>
                        <Text style={[
                          styles.lessonTitle,
                          lesson.isLocked && styles.lockedText
                        ]}>
                          {lesson.title}
                        </Text>
                        <View style={styles.lessonMeta}>
                          <View style={[
                            styles.typeBadge,
                            { backgroundColor: getTypeColor(lesson.type) }
                          ]}>
                            <Text style={styles.typeText}>{lesson.type}</Text>
                          </View>
                          <View style={styles.lessonDetails}>
                            <Clock size={12} color="#6B7280" />
                            <Text style={styles.durationText}>{lesson.duration}m</Text>
                          </View>
                          <View style={[
                            styles.difficultyBadge,
                            { backgroundColor: getDifficultyColor(lesson.difficulty) }
                          ]}>
                            <Text style={styles.difficultyText}>{lesson.difficulty}</Text>
                          </View>
                        </View>
                      </View>
                      <View style={styles.lessonStatus}>
                        {lesson.isLocked ? (
                          <Lock size={20} color="#9CA3AF" />
                        ) : lesson.isCompleted ? (
                          <CheckCircle size={24} color="#059669" />
                        ) : (
                          <Play size={20} color={languageInfo.color} />
                        )}
                      </View>
                    </View>
                    {lesson.isCompleted && lesson.stars > 0 && (
                      <View style={styles.lessonFooter}>
                        {renderStars(lesson.stars)}
                      </View>
                    )}
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>
        ))}

        {/* Coming Soon Section */}
        <View style={styles.comingSoonContainer}>
          <Text style={styles.comingSoonTitle}>More lessons coming soon!</Text>
          <Text style={styles.comingSoonText}>
            New units are being added regularly. Keep practicing to unlock advanced content.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  header: {
    paddingTop: 40,
    paddingBottom: 20,
    paddingHorizontal: 20,
  },
  backButton: {
    marginBottom: 16,
  },
  headerContent: {
    alignItems: 'center',
  },
  languageName: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  languageNative: {
    fontSize: 24,
    color: '#FFFFFF',
    marginBottom: 8,
    opacity: 0.9,
  },
  languageDescription: {
    fontSize: 16,
    color: '#FFFFFF',
    textAlign: 'center',
    opacity: 0.8,
  },
  progressSection: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  progressTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  progressPercentage: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#059669',
  },
  progressBar: {
    height: 12,
    backgroundColor: '#E5E7EB',
    borderRadius: 6,
    marginBottom: 12,
  },
  progressFill: {
    height: '100%',
    borderRadius: 6,
  },
  progressStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  progressText: {
    fontSize: 14,
    color: '#6B7280',
  },
  levelText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  unitContainer: {
    marginBottom: 32,
  },
  unitHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  unitTitleContainer: {
    flex: 1,
  },
  unitTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 4,
  },
  unitDescription: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
  },
  lockContainer: {
    marginLeft: 12,
  },
  lessonsContainer: {
    gap: 12,
  },
  lessonCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  lockedLessonCard: {
    backgroundColor: '#F9FAFB',
    opacity: 0.6,
  },
  completedLessonCard: {
    borderWidth: 2,
    borderColor: '#059669',
  },
  lessonHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  lessonNumber: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  lessonNumberText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#374151',
  },
  lessonInfo: {
    flex: 1,
  },
  lessonTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 8,
  },
  lockedText: {
    color: '#9CA3AF',
  },
  lessonMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  typeBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  typeText: {
    fontSize: 10,
    color: '#FFFFFF',
    fontWeight: 'bold',
    textTransform: 'capitalize',
  },
  lessonDetails: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  durationText: {
    fontSize: 10,
    color: '#6B7280',
  },
  difficultyBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  difficultyText: {
    fontSize: 10,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  lessonStatus: {
    marginLeft: 12,
  },
  lessonFooter: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  starsContainer: {
    flexDirection: 'row',
    gap: 4,
  },
  comingSoonContainer: {
    backgroundColor: '#FFFFFF',
    padding: 24,
    borderRadius: 16,
    alignItems: 'center',
    marginTop: 16,
  },
  comingSoonTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 8,
  },
  comingSoonText: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 18,
    color: '#6B7280',
  },
});