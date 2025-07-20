import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView } from 'react-native';
import { Trophy, Calendar, TrendingUp, Award, Flame, Target } from 'lucide-react-native';
import { useProgress } from '@/hooks/useProgress';

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  earned: boolean;
  earnedDate?: string;
}

interface WeeklyProgress {
  day: string;
  completed: boolean;
  lessonsCount: number;
}

export default function ProgressScreen() {
  const { progress, loading } = useProgress();
  
  const [weeklyGoal] = useState(5);
  const [completedThisWeek] = useState(3);

  const [achievements] = useState<Achievement[]>([
    {
      id: '1',
      title: 'First Steps',
      description: 'Complete your first lesson',
      icon: '🚀',
      earned: true,
      earnedDate: '2024-01-15'
    },
    {
      id: '2',
      title: 'Week Warrior',
      description: 'Complete 7 lessons in a week',
      icon: '⚡',
      earned: true,
      earnedDate: '2024-01-20'
    },
    {
      id: '3',
      title: 'Pronunciation Pro',
      description: 'Get 10 perfect pronunciation scores',
      icon: '🎯',
      earned: false
    },
    {
      id: '4',
      title: 'Community Helper',
      description: 'Help 5 learners in community',
      icon: '🤝',
      earned: false
    }
  ]);

  const [weeklyProgress] = useState<WeeklyProgress[]>([
    { day: 'Mon', completed: true, lessonsCount: 2 },
    { day: 'Tue', completed: true, lessonsCount: 1 },
    { day: 'Wed', completed: true, lessonsCount: 1 },
    { day: 'Thu', completed: false, lessonsCount: 0 },
    { day: 'Fri', completed: false, lessonsCount: 0 },
    { day: 'Sat', completed: false, lessonsCount: 0 },
    { day: 'Sun', completed: false, lessonsCount: 0 }
  ]);

  if (loading || !progress) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading your progress...</Text>
        </View>
      </SafeAreaView>
    );
  }

  const totalXP = progress.totalXP;
  const currentLevel = progress.currentLevel;
  const streakDays = progress.streakDays;
  const progressPercentage = (completedThisWeek / weeklyGoal) * 100;
  const nextLevelXP = (currentLevel + 1) * 300;
  const currentLevelXP = currentLevel * 300;
  const levelProgress = ((totalXP - currentLevelXP) / (nextLevelXP - currentLevelXP)) * 100;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Your Progress</Text>
          <Text style={styles.headerSubtitle}>Keep up the great work!</Text>
        </View>

        {/* Stats Overview */}
        <View style={styles.section}>
          <View style={styles.statsGrid}>
            <View style={[styles.statCard, { backgroundColor: '#FFF3E0' }]}>
              <Trophy size={24} color="#FF7722" />
              <Text style={styles.statNumber}>{totalXP}</Text>
              <Text style={styles.statLabel}>Total XP</Text>
            </View>
            <View style={[styles.statCard, { backgroundColor: '#E8F5E8' }]}>
              <Flame size={24} color="#DC2626" />
              <Text style={styles.statNumber}>{streakDays}</Text>
              <Text style={styles.statLabel}>Day Streak</Text>
            </View>
            <View style={[styles.statCard, { backgroundColor: '#EEF2FF' }]}>
              <TrendingUp size={24} color="#1E3A8A" />
              <Text style={styles.statNumber}>{currentLevel}</Text>
              <Text style={styles.statLabel}>Level</Text>
            </View>
            <View style={[styles.statCard, { backgroundColor: '#F0FDF4' }]}>
              <Target size={24} color="#059669" />
              <Text style={styles.statNumber}>{completedThisWeek}/{weeklyGoal}</Text>
              <Text style={styles.statLabel}>Weekly Goal</Text>
            </View>
          </View>
        </View>

        {/* Level Progress */}
        <View style={styles.section}>
          <View style={styles.levelCard}>
            <View style={styles.levelHeader}>
              <Text style={styles.levelTitle}>Level {currentLevel}</Text>
              <Text style={styles.levelSubtitle}>{totalXP - currentLevelXP} / {nextLevelXP - currentLevelXP} XP</Text>
            </View>
            <View style={styles.levelProgressBar}>
              <View style={[styles.levelProgressFill, { width: `${levelProgress}%` }]} />
            </View>
            <Text style={styles.levelNext}>Next: Level {currentLevel + 1}</Text>
          </View>
        </View>

        {/* Weekly Progress */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>This Week</Text>
          <View style={styles.weeklyCard}>
            <View style={styles.weeklyHeader}>
              <Text style={styles.weeklyTitle}>Weekly Goal Progress</Text>
              <Text style={styles.weeklyPercentage}>{Math.round(progressPercentage)}%</Text>
            </View>
            <View style={styles.weeklyProgressBar}>
              <View style={[styles.weeklyProgressFill, { width: `${progressPercentage}%` }]} />
            </View>
            <View style={styles.weekDays}>
              {weeklyProgress.map((day, index) => (
                <View key={index} style={styles.dayContainer}>
                  <View style={[
                    styles.dayCircle,
                    day.completed ? styles.dayCompleted : styles.dayIncomplete
                  ]}>
                    <Text style={[
                      styles.dayText,
                      day.completed ? styles.dayCompletedText : styles.dayIncompleteText
                    ]}>
                      {day.lessonsCount}
                    </Text>
                  </View>
                  <Text style={styles.dayLabel}>{day.day}</Text>
                </View>
              ))}
            </View>
          </View>
        </View>

        {/* Achievements */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Achievements</Text>
          <View style={styles.achievementsGrid}>
            {achievements.map((achievement) => (
              <View 
                key={achievement.id} 
                style={[
                  styles.achievementCard,
                  achievement.earned ? styles.achievementEarned : styles.achievementLocked
                ]}
              >
                <Text style={styles.achievementIcon}>{achievement.icon}</Text>
                <Text style={[
                  styles.achievementTitle,
                  !achievement.earned && styles.achievementLockedText
                ]}>
                  {achievement.title}
                </Text>
                <Text style={[
                  styles.achievementDescription,
                  !achievement.earned && styles.achievementLockedText
                ]}>
                  {achievement.description}
                </Text>
                {achievement.earned && achievement.earnedDate && (
                  <Text style={styles.achievementDate}>
                    Earned {new Date(achievement.earnedDate).toLocaleDateString()}
                  </Text>
                )}
              </View>
            ))}
          </View>
        </View>

        {/* Study Time Chart */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Study Time (Last 7 Days)</Text>
          <View style={styles.chartCard}>
            <View style={styles.chartContainer}>
              {[25, 30, 15, 40, 35, 20, 45].map((minutes, index) => (
                <View key={index} style={styles.chartBarContainer}>
                  <View style={styles.chartBar}>
                    <View 
                      style={[
                        styles.chartBarFill,
                        { height: `${(minutes / 60) * 100}%` }
                      ]} 
                    />
                  </View>
                  <Text style={styles.chartLabel}>
                    {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][index]}
                  </Text>
                  <Text style={styles.chartValue}>{minutes}m</Text>
                </View>
              ))}
            </View>
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
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  statCard: {
    flex: 1,
    minWidth: '45%',
    padding: 16,
    borderRadius: 16,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1F2937',
    marginTop: 8,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '500',
  },
  levelCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  levelHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  levelTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  levelSubtitle: {
    fontSize: 14,
    color: '#6B7280',
  },
  levelProgressBar: {
    height: 12,
    backgroundColor: '#E5E7EB',
    borderRadius: 6,
    marginBottom: 12,
  },
  levelProgressFill: {
    height: '100%',
    backgroundColor: '#FF7722',
    borderRadius: 6,
  },
  levelNext: {
    fontSize: 12,
    color: '#6B7280',
    textAlign: 'center',
  },
  weeklyCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  weeklyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  weeklyTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  weeklyPercentage: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#059669',
  },
  weeklyProgressBar: {
    height: 8,
    backgroundColor: '#E5E7EB',
    borderRadius: 4,
    marginBottom: 20,
  },
  weeklyProgressFill: {
    height: '100%',
    backgroundColor: '#059669',
    borderRadius: 4,
  },
  weekDays: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  dayContainer: {
    alignItems: 'center',
  },
  dayCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 4,
  },
  dayCompleted: {
    backgroundColor: '#059669',
  },
  dayIncomplete: {
    backgroundColor: '#E5E7EB',
  },
  dayText: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  dayCompletedText: {
    color: '#FFFFFF',
  },
  dayIncompleteText: {
    color: '#6B7280',
  },
  dayLabel: {
    fontSize: 10,
    color: '#6B7280',
  },
  achievementsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  achievementCard: {
    flex: 1,
    minWidth: '45%',
    padding: 16,
    borderRadius: 16,
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  achievementEarned: {
    backgroundColor: '#FFFFFF',
  },
  achievementLocked: {
    backgroundColor: '#F9FAFB',
    opacity: 0.6,
  },
  achievementIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  achievementTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 4,
    textAlign: 'center',
  },
  achievementDescription: {
    fontSize: 10,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 4,
  },
  achievementLockedText: {
    color: '#9CA3AF',
  },
  achievementDate: {
    fontSize: 8,
    color: '#059669',
    fontWeight: '500',
  },
  chartCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  chartContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'flex-end',
    height: 120,
  },
  chartBarContainer: {
    alignItems: 'center',
    flex: 1,
  },
  chartBar: {
    width: 20,
    height: 80,
    backgroundColor: '#E5E7EB',
    borderRadius: 10,
    justifyContent: 'flex-end',
    marginBottom: 8,
  },
  chartBarFill: {
    width: '100%',
    backgroundColor: '#FF7722',
    borderRadius: 10,
    minHeight: 4,
  },
  chartLabel: {
    fontSize: 10,
    color: '#6B7280',
    marginBottom: 2,
  },
  chartValue: {
    fontSize: 8,
    color: '#374151',
    fontWeight: '500',
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