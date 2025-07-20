import { Audio } from 'expo-av';
import * as Speech from 'expo-speech';

export class AudioService {
  private static sound: Audio.Sound | null = null;

  static async initializeAudio() {
    try {
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: false,
        staysActiveInBackground: false,
        playsInSilentModeIOS: true,
        shouldDuckAndroid: true,
        playThroughEarpieceAndroid: false,
      });
    } catch (error) {
      console.error('Failed to initialize audio:', error);
    }
  }

  static async playText(text: string, language: string = 'hi-IN') {
    try {
      const options = {
        language: language,
        pitch: 1.0,
        rate: 0.8,
        voice: undefined,
      };

      await Speech.speak(text, options);
    } catch (error) {
      console.error('Failed to play text:', error);
    }
  }

  static async playSuccessSound() {
    try {
      if (this.sound) {
        await this.sound.unloadAsync();
      }
      
      // Create a simple success sound using Speech
      await Speech.speak('Correct!', {
        language: 'en-US',
        pitch: 1.2,
        rate: 1.0,
      });
    } catch (error) {
      console.error('Failed to play success sound:', error);
    }
  }

  static async playErrorSound() {
    try {
      if (this.sound) {
        await this.sound.unloadAsync();
      }
      
      // Create a simple error sound using Speech
      await Speech.speak('Try again', {
        language: 'en-US',
        pitch: 0.8,
        rate: 1.0,
      });
    } catch (error) {
      console.error('Failed to play error sound:', error);
    }
  }

  static stopSpeech() {
    Speech.stop();
  }
}