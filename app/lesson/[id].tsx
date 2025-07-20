import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ArrowLeft, Volume2, Mic, Check, X, RotateCcw } from 'lucide-react-native';
import { AudioService } from '@/services/AudioService';
import { SpeechService, SpeechRecognitionResult } from '@/services/SpeechService';
import { useProgress } from '@/hooks/useProgress';

interface LessonContent {
  id: string;
  title: string;
  type: 'vocabulary' | 'pronunciation' | 'translation' | 'listening';
  question: string;
  options?: string[];
  correctAnswer: string;
  audioText?: string;
  explanation?: string;
}

export default function LessonScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { completeLesson } = useProgress();
  
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [startTime] = useState(Date.now());
  const [speechResult, setSpeechResult] = useState<string>('');

  const [lessonContent] = useState<LessonContent[]>([
    {
      id: '1',
      title: 'Basic Greetings',
      type: 'vocabulary',
      question: 'How do you say "Hello" in Marathi?',
      options: ['नमस्कार', 'धन्यवाद', 'माफ करा', 'चला'],
      correctAnswer: 'नमस्कार',
      explanation: 'नमस्कार (Namaskar) is the most common way to greet someone in Marathi.'
    },
    {
      id: '2',
      title: 'Basic Greetings',
      type: 'pronunciation',
      question: 'Say "नमस्कार" (Namaskar)',
      correctAnswer: 'namaskar',
      audioText: 'नमस्कार',
      explanation: 'Break it down: Na-mas-kar. The "r" at the end is soft.'
    },
    {
      id: '3',
      title: 'Basic Greetings',
      type: 'translation',
      question: 'What does "धन्यवाद" mean in English?',
      options: ['Hello', 'Thank you', 'Goodbye', 'Please'],
      correctAnswer: 'Thank you',
      explanation: 'धन्यवाद (Dhanyawad) means "Thank you" in Marathi.'
    },
    {
      id: '4',
      title: 'Basic Greetings',
      type: 'vocabulary',
      question: 'Which word means "Goodbye" in Marathi?',
      options: ['नमस्कार', 'बाय', 'निरोप', 'मिळू या'],
      correctAnswer: 'निरोप',
      explanation: 'निरोप (Nirop) is a formal way to say goodbye in Marathi.'
    }
  ]);

  const currentQuestion = lessonContent[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === lessonContent.length - 1;
  const progress = ((currentQuestionIndex + 1) / lessonContent.length) * 100;

  const handleAnswerSelect = (answer: string) => {
    setSelectedAnswer(answer);
  };

  const handleSubmitAnswer = () => {
    if (!selectedAnswer) return;
    
    setShowResult(true);
    if (selectedAnswer === currentQuestion.correctAnswer) {
      setScore(score + 1);
      AudioService.playSuccessSound();
    } else {
      AudioService.playErrorSound();
    }
  };

  const handleNextQuestion = () => {
    if (isLastQuestion) {
      // Complete lesson
      const finalScore = (score / lessonContent.length) * 100;
      const timeSpent = Math.round((Date.now() - startTime) / 1000);
      
      // Save progress
      completeLesson(id as string, finalScore, timeSpent);
      
      Alert.alert(
        'Lesson Complete!',
        `Your score: ${Math.round(finalScore)}%\n\nGreat job learning Marathi greetings!`,
        [{ text: 'Continue', onPress: () => router.back() }]
      );
    } else {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedAnswer(null);
      setShowResult(false);
    }
  };

  const handleMicPress = () => {
    if (currentQuestion.type === 'pronunciation') {
      if (isRecording) {
        SpeechService.stopListening();
        setIsRecording(false);
      } else {
        setIsRecording(true);
        setSpeechResult('');
        
        SpeechService.startListening(
          currentQuestion.correctAnswer,
          (result: SpeechRecognitionResult) => {
            setIsRecording(false);
            setSpeechResult(result.text);
            setSelectedAnswer(result.text);
            
            if (result.isCorrect) {
              AudioService.playSuccessSound();
            } else {
              AudioService.playErrorSound();
            }
          },
          (error: string) => {
            setIsRecording(false);
            Alert.alert('Speech Recognition Error', error);
          }
        );
      }
    }
  };

  const handlePlayAudio = async () => {
    try {
      const textToSpeak = currentQuestion.audioText || currentQuestion.correctAnswer;
      await SpeechService.speakText(textToSpeak, 'marathi');
    } catch (error) {
      console.error('Failed to play audio:', error);
      Alert.alert('Audio Error', 'Failed to play audio');
    }
  };

  const renderQuestion = () => {
    switch (currentQuestion.type) {
      case 'vocabulary':
      case 'translation':
        return (
          <View style={styles.questionContainer}>
            <Text style={styles.questionText}>{currentQuestion.question}</Text>
            {currentQuestion.options?.map((option, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.optionButton,
                  selectedAnswer === option && styles.selectedOption,
                  showResult && option === currentQuestion.correctAnswer && styles.correctOption,
                  showResult && selectedAnswer === option && option !== currentQuestion.correctAnswer && styles.wrongOption
                ]}
                onPress={() => !showResult && handleAnswerSelect(option)}
                disabled={showResult}
              >
                <Text style={[
                  styles.optionText,
                  selectedAnswer === option && styles.selectedOptionText,
                  showResult && option === currentQuestion.correctAnswer && styles.correctOptionText
                ]}>
                  {option}
                </Text>
                {showResult && option === currentQuestion.correctAnswer && (
                  <Check size={20} color="#FFFFFF" />
                )}
                {showResult && selectedAnswer === option && option !== currentQuestion.correctAnswer && (
                  <X size={20} color="#FFFFFF" />
                )}
              </TouchableOpacity>
            ))}
          </View>
        );

      case 'pronunciation':
        return (
          <View style={styles.questionContainer}>
            <Text style={styles.questionText}>{currentQuestion.question}</Text>
            <View style={styles.pronunciationCard}>
              <Text style={styles.pronunciationText}>{currentQuestion.audioText}</Text>
              <TouchableOpacity style={styles.audioButton} onPress={handlePlayAudio}>
                <Volume2 size={24} color="#FF7722" />
              </TouchableOpacity>
            </View>
            <TouchableOpacity
              style={[styles.micButton, isRecording && styles.micButtonActive]}
              onPress={handleMicPress}
              disabled={showResult}
            >
              <Mic size={32} color={isRecording ? "#FFFFFF" : "#FF7722"} />
            </TouchableOpacity>
            <Text style={styles.micInstruction}>
              {isRecording ? 'Listening...' : showResult ? 'Complete' : 'Tap to speak'}
            </Text>
            {speechResult && (
              <View style={styles.speechResultContainer}>
                <Text style={styles.speechResultLabel}>You said:</Text>
                <Text style={styles.speechResultText}>"{speechResult}"</Text>
              </View>
            )}
          </View>
        );

      default:
        return null;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <ArrowLeft size={24} color="#1F2937" />
        </TouchableOpacity>
        <View style={styles.headerInfo}>
          <Text style={styles.lessonTitle}>{currentQuestion.title}</Text>
          <Text style={styles.questionCounter}>
            {currentQuestionIndex + 1} of {lessonContent.length}
          </Text>
        </View>
        <TouchableOpacity style={styles.resetButton}>
          <RotateCcw size={20} color="#6B7280" />
        </TouchableOpacity>
      </View>

      {/* Progress Bar */}
      <View style={styles.progressContainer}>
        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { width: `${progress}%` }]} />
        </View>
        <Text style={styles.progressText}>{Math.round(progress)}%</Text>
      </View>

      {/* Question Content */}
      <View style={styles.content}>
        <View style={styles.typeIndicator}>
          <Text style={styles.typeText}>{currentQuestion.type.toUpperCase()}</Text>
        </View>
        
        {renderQuestion()}

        {showResult && currentQuestion.explanation && (
          <View style={styles.explanationCard}>
            <Text style={styles.explanationTitle}>Explanation</Text>
            <Text style={styles.explanationText}>{currentQuestion.explanation}</Text>
          </View>
        )}
      </View>

      {/* Action Buttons */}
      <View style={styles.actionContainer}>
        {!showResult ? (
          <TouchableOpacity
            style={[styles.actionButton, !selectedAnswer && styles.actionButtonDisabled]}
            onPress={handleSubmitAnswer}
            disabled={!selectedAnswer}
          >
            <Text style={[styles.actionButtonText, !selectedAnswer && styles.actionButtonTextDisabled]}>
              Check Answer
            </Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity style={styles.actionButton} onPress={handleNextQuestion}>
            <Text style={styles.actionButtonText}>
              {isLastQuestion ? 'Complete Lesson' : 'Next Question'}
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  backButton: {
    padding: 8,
  },
  headerInfo: {
    flex: 1,
    alignItems: 'center',
  },
  lessonTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  questionCounter: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 2,
  },
  resetButton: {
    padding: 8,
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#FFFFFF',
  },
  progressBar: {
    flex: 1,
    height: 8,
    backgroundColor: '#E5E7EB',
    borderRadius: 4,
    marginRight: 12,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#FF7722',
    borderRadius: 4,
  },
  progressText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  typeIndicator: {
    alignSelf: 'center',
    backgroundColor: '#1E3A8A',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 16,
    marginBottom: 32,
  },
  typeText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  questionContainer: {
    flex: 1,
  },
  questionText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1F2937',
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 32,
  },
  optionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 16,
    marginBottom: 16,
    borderWidth: 2,
    borderColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  selectedOption: {
    borderColor: '#FF7722',
    backgroundColor: '#FFF3E0',
  },
  correctOption: {
    borderColor: '#059669',
    backgroundColor: '#059669',
  },
  wrongOption: {
    borderColor: '#DC2626',
    backgroundColor: '#DC2626',
  },
  optionText: {
    fontSize: 18,
    color: '#1F2937',
    fontWeight: '500',
  },
  selectedOptionText: {
    color: '#FF7722',
    fontWeight: 'bold',
  },
  correctOptionText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  pronunciationCard: {
    backgroundColor: '#FFFFFF',
    padding: 32,
    borderRadius: 20,
    alignItems: 'center',
    marginBottom: 32,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  pronunciationText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 16,
  },
  audioButton: {
    backgroundColor: '#FFF3E0',
    padding: 12,
    borderRadius: 24,
  },
  micButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#FFF3E0',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    marginBottom: 16,
    borderWidth: 3,
    borderColor: '#FF7722',
  },
  micButtonActive: {
    backgroundColor: '#FF7722',
  },
  micInstruction: {
    textAlign: 'center',
    fontSize: 16,
    color: '#6B7280',
    fontWeight: '500',
  },
  speechResultContainer: {
    marginTop: 20,
    padding: 16,
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    alignItems: 'center',
  },
  speechResultLabel: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 4,
  },
  speechResultText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  explanationCard: {
    backgroundColor: '#F0F9FF',
    padding: 20,
    borderRadius: 16,
    marginTop: 24,
    borderWidth: 1,
    borderColor: '#BAE6FD',
  },
  explanationTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1E3A8A',
    marginBottom: 8,
  },
  explanationText: {
    fontSize: 14,
    color: '#374151',
    lineHeight: 20,
  },
  actionContainer: {
    padding: 20,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  actionButton: {
    backgroundColor: '#FF7722',
    padding: 16,
    borderRadius: 16,
    alignItems: 'center',
  },
  actionButtonDisabled: {
    backgroundColor: '#E5E7EB',
  },
  actionButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  actionButtonTextDisabled: {
    color: '#9CA3AF',
  },
});