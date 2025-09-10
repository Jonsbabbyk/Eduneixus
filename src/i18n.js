// src/i18n.js
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Define your translation resources here
const resources = {
  en: {
    translation: {
      tutor: {
        title: "AI Tutor",
        initialMessage: "Hi! I'm your AI tutor. I can help you with any subject - math, science, history, and more. What would you like to learn today?",
        errorResponse: "Sorry, I'm having trouble connecting right now. Please try again later.",
        suggestedQuestions: "Suggested questions",
        placeholder: "Ask me anything about any subject...",
        settings: "Tutor Settings",
        language: "Language",
      },
      languages: {
        en: "English",
        es: "Spanish",
        fr: "French",
        de: "German",
        it: "Italian",
      },
      settings: {
        highContrast: "High Contrast",
        dyslexiaFont: "Dyslexia-Friendly Font",
        speechToText: "Speech-to-Text",
      },
      questions: {
        quadratic: "Explain quadratic equations",
        photosynthesis: "Help with photosynthesis",
        wwii: "World War II timeline",
        python: "Python programming basics",
      },
      quickActions: {
        homeworkHelp: "Homework Help",
        conceptExplanation: "Concept Explanation",
        practiceProblems: "Practice Questions",
      },
    },
  },
  es: {
    translation: {
      tutor: {
        title: "Tutor de IA",
        initialMessage: "¡Hola! Soy tu tutor de IA. Puedo ayudarte con cualquier materia: matemáticas, ciencias, historia y más. ¿Qué te gustaría aprender hoy?",
        errorResponse: "Lo siento, tengo problemas para conectarme en este momento. Por favor, inténtalo de nuevo más tarde.",
        suggestedQuestions: "Preguntas sugeridas",
        placeholder: "Pregúntame cualquier cosa sobre cualquier materia...",
        settings: "Configuración del Tutor",
        language: "Idioma",
      },
      languages: {
        en: "Inglés",
        es: "Español",
        fr: "Francés",
        de: "Alemán",
        it: "Italiano",
      },
      settings: {
        highContrast: "Alto Contraste",
        dyslexiaFont: "Fuente para dislexia",
        speechToText: "Voz a texto",
      },
      questions: {
        quadratic: "Explicar ecuaciones cuadráticas",
        photosynthesis: "Ayuda con la fotosíntesis",
        wwii: "Línea de tiempo de la Segunda Guerra Mundial",
        python: "Conceptos básicos de programación en Python",
      },
      quickActions: {
        homeworkHelp: "Ayuda con la tarea",
        conceptExplanation: "Explicación de conceptos",
        practiceProblems: "Preguntas de práctica",
      },
    },
  },
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en', // Set a default language
    interpolation: {
      escapeValue: false, // React already protects from xss
    },
  });

export default i18n;