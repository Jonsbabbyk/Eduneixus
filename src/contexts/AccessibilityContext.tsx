// src/contexts/AccessibilityContext.tsx

import React, { createContext, useContext, useState, ReactNode } from 'react';

// Define the AccessibilitySettings interface
interface AccessibilitySettings {
  textToSpeech: boolean;
  speechToText: boolean;
  highContrast: boolean;
  dyslexiaFont: boolean;
  language: string;
  fontSize: 'small' | 'medium' | 'large';
}

// Define the context type with all methods and state
interface AccessibilityContextType {
  settings: AccessibilitySettings;
  updateSettings: (newSettings: Partial<AccessibilitySettings>) => void;
  speak: (text: string) => void;
  // Add a listen function for speech-to-text
  listen: (onResult: (result: string) => void, onEnd: () => void) => void;
}

// Create the context
const AccessibilityContext = createContext<AccessibilityContextType | undefined>(undefined);

// Define the provider component
export function AccessibilityProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<AccessibilitySettings>({
    textToSpeech: false,
    speechToText: false,
    highContrast: false,
    dyslexiaFont: false,
    language: 'en',
    fontSize: 'medium',
  });

  const updateSettings = (newSettings: Partial<AccessibilitySettings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  };

  // Function to handle Text-to-Speech
  const speak = (text: string) => {
    if ('speechSynthesis' in window && settings.textToSpeech) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = settings.language;
      utterance.rate = 0.9;
      utterance.pitch = 1;
      speechSynthesis.speak(utterance);
    }
  };

  // Function to handle Speech-to-Text
  const listen = (onResult: (result: string) => void, onEnd: () => void) => {
    // Check if SpeechRecognition API is available in the browser
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

    if (SpeechRecognition && settings.speechToText) {
      const recognition = new SpeechRecognition();
      recognition.lang = settings.language;
      recognition.continuous = false;
      recognition.interimResults = false;

      recognition.onresult = (event: SpeechRecognitionEvent) => {
        const transcript = event.results[0][0].transcript;
        onResult(transcript);
      };

      recognition.onend = () => {
        onEnd();
      };
      
      recognition.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
      };

      recognition.start();
    }
  };

  // Helper function to get the correct font size class
  const getFontSizeClass = () => {
    switch (settings.fontSize) {
      case 'small':
        return 'text-sm';
      case 'large':
        return 'text-lg';
      default: // medium
        return 'text-base';
    }
  };

  // Helper function to get the correct font family class
  const getDyslexiaFontClass = () => {
    return settings.dyslexiaFont ? 'font-dyslexia' : '';
  };

  return (
    <AccessibilityContext.Provider value={{ settings, updateSettings, speak, listen }}>
      <div
        className={`
          ${settings.highContrast ? 'filter contrast-150 brightness-110' : ''} 
          ${getDyslexiaFontClass()}
          ${getFontSizeClass()}
        `}
      >
        {children}
      </div>
    </AccessibilityContext.Provider>
  );
}

// Export the useAccessibility hook
export function useAccessibility() {
  const context = useContext(AccessibilityContext);
  if (context === undefined) {
    throw new Error('useAccessibility must be used within an AccessibilityProvider');
  }
  return context;
}