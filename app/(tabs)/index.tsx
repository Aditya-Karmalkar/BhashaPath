import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView } from 'react-native';
import { Play, Star, Clock, Volume2 } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { AudioService } from '@/services/AudioService';
import { useProgress } from '@/hooks/useProgress';

interface Language {
  id: string;
  name: string;
  nativeName: string;
  progress: number;
  totalLessons: number;
  completedLessons: number;
  color: string;
}

interface Lesson {
  id: string;
  title: string;
  description: string;
  duration: number;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  language: string;
  completed: boolean;
}

export default function LearnScreen() {
  const router = useRouter();
  const { progress, loading } = useProgress();
  
  const [languages] = useState<Language[]>([
    {
      id: 'marathi',
      name: 'Marathi',
      nativeName: 'मराठी',
      progress: 65,
      totalLessons: 30,
      completedLessons: 19,
      color: '#FF7722'
    },
    {
      id: 'hindi',
      name: 'Hindi',
      nativeName: 'हिन्दी',
      progress: 40,
      totalLessons: 25,
      completedLessons: 10,
      color: '#059669'
    },
    {
      id: 'gujarati',
      name: 'Gujarati',
      nativeName: 'ગુજરાતી',
      progress: 20,
      totalLessons: 20,
      completedLessons: 4,
      color: '#1E3A8A'
    }
  ]);

  const [todayLessons] = useState<Lesson[]>([
    {
      id: '1',
      title: 'Basic Greetings',
      description: 'Learn how to say hello, goodbye, and thank you',
      duration: 15,
      difficulty: 'Beginner',
      language: 'Marathi',
      completed: false
    },
    {
      id: '2',
      title: 'Family Relations',
      description: 'Words for family members and relationships',
      duration: 20,
      difficulty: 'Beginner',
      language: 'Hindi',
      completed: false
    },
    {
      id: '3',
      title: 'Numbers 1-10',
      description: 'Learn counting from one to ten',
      duration: 12,
      difficulty: 'Beginner',
      language: 'Gujarati',
      completed: true
    }
  ]);

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner': return '#059669';
      case 'Intermediate': return '#FF7722';
      case 'Advanced': return '#DC2626';
      default: return '#6B7280';
    }
  };

  const navigateToLesson = (lesson: Lesson) => {
    router.push(`/lesson/${lesson.id}`);
  };

  const handlePlayAudio = async (text: string, language: string) => {
    try {
      await AudioService.playText(text, language);
    } catch (error) {
      console.error('Failed to play audio:', error);
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading your progress...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>नमस्कार! Welcome Back</Text>
          <Text style={styles.headerSubtitle}>Continue your language journey</Text>
        </View>

        {/* Language Progress Cards */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Your Languages</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.languageScroll}>
            {languages.map((language) => (
              <TouchableOpacity 
                key={language.id} 
                style={[styles.languageCard, { borderColor: language.color }]}
                onPress={() => router.push(`/language/${language.id}`)}
              >
                <View style={styles.languageHeader}>
                  <Text style={styles.languageName}>{language.name}</Text>
                  <Text style={styles.languageNative}>{language.nativeName}</Text>
                </View>
                <View style={styles.progressContainer}>
                  <View style={styles.progressBar}>
                    <View 
                      style={[
                        styles.progressFill, 
                        { width: `${language.progress}%`, backgroundColor: language.color }
                      ]} 
                    />
                  </View>
                  <Text style={styles.progressText}>{language.progress}%</Text>
                </View>
                <Text style={styles.lessonsText}>
                  {language.completedLessons}/{language.totalLessons} lessons
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Today's Lessons */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Today's Lessons</Text>
          {todayLessons.map((lesson) => (
            <TouchableOpacity 
              key={lesson.id} 
              style={[styles.lessonCard, lesson.completed && styles.completedLessonCard]}
              onPress={() => navigateToLesson(lesson)}
            >
              <View style={styles.lessonHeader}>
                <View style={styles.lessonTitleContainer}>
                  <Text style={[styles.lessonTitle, lesson.completed && styles.completedText]}>
                    {lesson.title}
                  </Text>
                  <View style={styles.lessonMeta}>
                    <View style={[styles.difficultyBadge, { backgroundColor: getDifficultyColor(lesson.difficulty) }]}>
                      <Text style={styles.difficultyText}>{lesson.difficulty}</Text>
                    </View>
                    <Text style={styles.languageTag}>{lesson.language}</Text>
                  </View>
                </View>
                <TouchableOpacity style={styles.playButton}>
                  {lesson.completed ? (
                    <Star size={24} color="#FFD700" fill="#FFD700" />
                  ) : (
                    <Play size={24} color="#FF7722" />
                  )}
                </TouchableOpacity>
              </View>
              <Text style={[styles.lessonDescription, lesson.completed && styles.completedText]}>
                {lesson.description}
              </Text>
              <View style={styles.lessonFooter}>
                <View style={styles.durationContainer}>
                  <Clock size={16} color="#6B7280" />
                  <Text style={styles.durationText}>{lesson.duration} min</Text>
                </View>
                <TouchableOpacity style={styles.speakButton}>
                  <Volume2 
                    size={16} 
                    color="#6B7280" 
                    onPress={() => handlePlayAudio(lesson.title, lesson.language.toLowerCase())}
                  />
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Practice</Text>
          <View style={styles.quickActions}>
            <TouchableOpacity 
              style={[styles.actionCard, { backgroundColor: '#FFF3E0' }]}
              onPress={() => router.push('/practice/vocabulary')}
            >
              <Text style={styles.actionTitle}>Vocabulary</Text>
              <Text style={styles.actionSubtitle}>Review words</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.actionCard, { backgroundColor: '#E8F5E8' }]}
              onPress={() => router.push('/practice/pronunciation')}
            >
              <Text style={styles.actionTitle}>Pronunciation</Text>
              <Text style={styles.actionSubtitle}>Practice speaking</Text>
            </TouchableOpacity>
          </View>
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
  scrollView: {
    flex: 1,
  },
  header: {
    padding: 20,
    paddingTop: 40,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#6B7280',
  },
  section: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 16,
  },
  languageScroll: {
    marginHorizontal: -5,
  },
  languageCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginHorizontal: 5,
    width: 180,
    borderWidth: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  languageHeader: {
    marginBottom: 16,
  },
  languageName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 4,
  },
  languageNative: {
    fontSize: 24,
    color: '#374151',
    fontWeight: '600',
  },
  progressContainer: {
    marginBottom: 12,
  },
  progressBar: {
    height: 8,
    backgroundColor: '#E5E7EB',
    borderRadius: 4,
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  progressText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    textAlign: 'right',
  },
  lessonsText: {
    fontSize: 12,
    color: '#6B7280',
  },
  lessonCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  completedLessonCard: {
    backgroundColor: '#F9FAFB',
    opacity: 0.8,
  },
  lessonHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  lessonTitleContainer: {
    flex: 1,
    marginRight: 12,
  },
  lessonTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 8,
  },
  completedText: {
    color: '#6B7280',
  },
  lessonMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  difficultyBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  difficultyText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  languageTag: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '500',
  },
  playButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#FFF3E0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  lessonDescription: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
    marginBottom: 16,
  },
  lessonFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  durationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  durationText: {
    fontSize: 12,
    color: '#6B7280',
  },
  speakButton: {
    padding: 8,
  },
  quickActions: {
    flexDirection: 'row',
    gap: 16,
  },
  actionCard: {
    flex: 1,
    padding: 20,
    borderRadius: 16,
    alignItems: 'center',
  },
  actionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 4,
  },
  actionSubtitle: {
    fontSize: 12,
    color: '#6B7280',
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