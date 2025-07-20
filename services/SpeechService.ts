import * as Speech from 'expo-speech';

export interface SpeechRecognitionResult {
  text: string;
  confidence: number;
  isCorrect: boolean;
}

export class SpeechService {
  private static isListening = false;
  private static recognitionTimeout: NodeJS.Timeout | null = null;

  static async startListening(
    expectedText: string,
    onResult: (result: SpeechRecognitionResult) => void,
    onError: (error: string) => void
  ): Promise<void> {
    if (this.isListening) {
      return;
    }

    this.isListening = true;

    try {
      // Simulate speech recognition since we don't have access to real speech recognition
      // In a real app, you would use expo-speech-recognition or similar
      
      // Provide feedback to user
      await Speech.speak('Listening...', {
        language: 'en-US',
        pitch: 1.0,
        rate: 1.2,
      });

      // Simulate recognition delay
      this.recognitionTimeout = setTimeout(() => {
        this.isListening = false;
        
        // Simulate recognition result
        const simulatedResults = [
          { text: expectedText, confidence: 0.95, isCorrect: true },
          { text: expectedText.toLowerCase(), confidence: 0.85, isCorrect: true },
          { text: 'namaste', confidence: 0.70, isCorrect: expectedText.toLowerCase().includes('namaste') },
          { text: 'hello', confidence: 0.60, isCorrect: false },
        ];

        const randomResult = simulatedResults[Math.floor(Math.random() * simulatedResults.length)];
        onResult(randomResult);
      }, 3000);

    } catch (error) {
      this.isListening = false;
      onError('Speech recognition failed');
    }
  }

  static stopListening(): void {
    this.isListening = false;
    if (this.recognitionTimeout) {
      clearTimeout(this.recognitionTimeout);
      this.recognitionTimeout = null;
    }
    Speech.stop();
  }

  static getIsListening(): boolean {
    return this.isListening;
  }

  static async speakText(text: string, language: string = 'hi-IN'): Promise<void> {
    try {
      const languageMap: { [key: string]: string } = {
        marathi: 'hi-IN', // Using Hindi as fallback for Marathi
        hindi: 'hi-IN',
        gujarati: 'hi-IN', // Using Hindi as fallback for Gujarati
        english: 'en-US',
      };

      await Speech.speak(text, {
        language: languageMap[language] || 'hi-IN',
        pitch: 1.0,
        rate: 0.8,
      });
    } catch (error) {
      console.error('Failed to speak text:', error);
    }
  }
}