import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Play, Lock, CircleCheck as CheckCircle, Clock, Star } from 'lucide-react-native';

interface LessonCardProps {
  lesson: {
    id: string;
    title: string;
    type: string;
    duration: number;
    difficulty: string;
    isCompleted: boolean;
    isLocked: boolean;
    stars: number;
  };
  onPress: () => void;
  index: number;
}

export function LessonCard({ lesson, onPress, index }: LessonCardProps) {
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
    <TouchableOpacity
      style={[
        styles.lessonCard,
        lesson.isLocked && styles.lockedLessonCard,
        lesson.isCompleted && styles.completedLessonCard
      ]}
      onPress={onPress}
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
            <Play size={20} color="#FF7722" />
          )}
        </View>
      </View>
      {lesson.isCompleted && lesson.stars > 0 && (
        <View style={styles.lessonFooter}>
          {renderStars(lesson.stars)}
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  lessonCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
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
});