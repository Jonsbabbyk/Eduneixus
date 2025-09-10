// src/components/AITutorChat.tsx

import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, BookOpen, Lightbulb, HelpCircle, Mic, Volume2, Settings } from 'lucide-react';
import Card from './Card';
import Button from './Button';
import ReactMarkdown from 'react-markdown';
import { useAccessibility } from '../contexts/AccessibilityContext';
import { useTranslation } from 'react-i18next';

// Define a type for your message objects to ensure type safety
interface Message {
  type: 'bot' | 'user';
  content: string;
  timestamp: Date;
}

function AITutorChat() {
  const { t, i18n } = useTranslation();
  const { settings, updateSettings, speak, listen } = useAccessibility();
  const [messages, setMessages] = useState<Message[]>([
    {
      type: 'bot',
      content: t('tutor.initialMessage'),
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isListening, setIsListening] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const suggestedQuestions = [
    t('questions.quadratic'),
    t('questions.photosynthesis'),
    t('questions.wwii'),
    t('questions.python')
  ];

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    // First, create the full chat history, including the new user message
    const chatHistory = [
      {
        role: 'system',
        content: `You are a helpful AI tutor. Your responses must be in the language corresponding to the user's selected language code: ${settings.language}.`
      },
      ...messages.map(msg => ({
        role: msg.type === 'user' ? 'user' : 'assistant',
        content: msg.content
      })),
      { role: 'user', content: inputMessage }
    ];

    const userMessage: Message = {
      type: 'user', 
      content: inputMessage,
      timestamp: new Date()
    };
    
    // Now, update the UI with the user's message
    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');

    try {
      const response = await fetch(import.meta.env.VITE_API_URL + '/api/groq/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: chatHistory }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      const botResponse: Message = {
        type: 'bot', 
        content: data.content,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, botResponse]);
      
    } catch (error) {
      console.error("Error fetching AI response:", error);
      const errorBotResponse: Message = {
        type: 'bot', 
        content: t('tutor.errorResponse'),
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorBotResponse]);
    }
  };

  const handleSuggestion = (suggestion: string) => { 
    setInputMessage(suggestion);
  };

  const handleSpeechInput = () => {
    if (isListening) return;
    setIsListening(true);
    listen(
      (result) => {
        setInputMessage(result);
      },
      () => {
        setIsListening(false);
      }
    );
  };
  
  const handleLanguageChange = (lng: string) => {
    i18n.changeLanguage(lng);
    updateSettings({ language: lng });
  };
  
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  return (
    <Card className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <Bot className="h-6 w-6 text-blue-600" />
          {t('tutor.title')}
        </h2>
        <div className="relative group">
          <Button variant="ghost" size="icon">
            <Settings className="h-5 w-5 text-gray-500 group-hover:rotate-45 transition-transform" />
          </Button>
          <div className="absolute right-0 top-full mt-2 w-48 p-4 bg-white border border-gray-200 rounded-lg shadow-lg z-10 hidden group-hover:block">
            <h4 className="font-bold mb-2">{t('tutor.settings')}</h4>
            <div className="space-y-2">
              <div>
                <label className="font-medium text-sm">{t('tutor.language')}</label>
                <select
                  value={settings.language}
                  onChange={(e) => handleLanguageChange(e.target.value)}
                  className="block w-full mt-1 p-1 border rounded"
                >
                  <option value="en">🇺🇸 {t('languages.en')}</option>
                  <option value="es">🇪🇸 {t('languages.es')}</option>
                  <option value="fr">🇫🇷 {t('languages.fr')}</option>
                  <option value="de">🇩🇪 {t('languages.de')}</option>
                  <option value="it">🇮🇹 {t('languages.it')}</option>
                </select>
              </div>
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={settings.highContrast}
                  onChange={() => updateSettings({ highContrast: !settings.highContrast })}
                />
                {t('settings.highContrast')}
              </label>
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={settings.dyslexiaFont}
                  onChange={() => updateSettings({ dyslexiaFont: !settings.dyslexiaFont })}
                />
                {t('settings.dyslexiaFont')}
              </label>
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={settings.speechToText}
                  onChange={() => updateSettings({ speechToText: !settings.speechToText })}
                />
                {t('settings.speechToText')}
              </label>
            </div>
          </div>
        </div>
      </div>
      
      {/* Chat Messages */}
      <div className="h-96 overflow-y-auto mb-6 space-y-4 bg-gray-50 rounded-lg p-4">
        {messages.map((message, index) => (
          <div 
            key={index} 
            className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`flex items-start gap-3 max-w-[80%] ${message.type === 'user' ? 'flex-row-reverse' : ''}`}>
              <div className={`p-2 rounded-full ${message.type === 'user' ? 'bg-blue-100' : 'bg-green-100'}`}>
                {message.type === 'user' ? (
                  <User className="h-4 w-4 text-blue-600" />
                ) : (
                  <Bot className="h-4 w-4 text-green-600" />
                )}
              </div>
              <div className={`p-3 rounded-lg ${
                message.type === 'user' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-white border border-gray-200'
              }`}>
                <div className={`text-sm whitespace-pre-wrap ${settings.dyslexiaFont ? 'font-dyslexia' : ''}`}>
                  <ReactMarkdown>{message.content}</ReactMarkdown> 
                </div>
                <div className={`text-xs mt-1 flex items-center justify-between gap-4 ${message.type === 'user' ? 'text-blue-100' : 'text-gray-500'}`}>
                  <span>
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                  {message.type === 'bot' && (
                    <Button variant="ghost" size="icon" onClick={() => speak(message.content)} className="p-0 h-auto w-auto">
                      <Volume2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Questions */}
      <div className="mb-4">
        <div className="text-sm text-gray-600 mb-2">{t('tutor.suggestedQuestions')}:</div>
        <div className="flex flex-wrap gap-2">
          {suggestedQuestions.map((question, index) => (
            <button
              key={index}
              onClick={() => handleSuggestion(question)}
              className="px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded-full text-sm transition-colors"
            >
              {question}
            </button>
          ))}
        </div>
      </div>

      {/* Input Area */}
      <div className="flex gap-3">
        <Button
          type="button"
          variant="secondary"
          size="icon"
          onClick={handleSpeechInput}
          disabled={!settings.speechToText}
          className={`${isListening ? 'text-white bg-red-500 animate-pulse' : ''}`}
        >
          <Mic className="h-5 w-5" />
        </Button>
        <input
          type="text"
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
          placeholder={t('tutor.placeholder')}
          className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        <Button onClick={handleSendMessage} disabled={!inputMessage.trim()}>
          <Send className="h-5 w-5" />
        </Button>
      </div>

      {/* Quick Actions */}
      <div className="flex gap-2 mt-4">
        <Button variant="outline" size="sm" onClick={() => handleSuggestion(t('quickActions.homeworkHelp'))}>
          <BookOpen className="h-4 w-4 mr-2" />
          {t('quickActions.homeworkHelp')}
        </Button>
        <Button variant="outline" size="sm" onClick={() => handleSuggestion(t('quickActions.conceptExplanation'))}>
          <Lightbulb className="h-4 w-4 mr-2" />
          {t('quickActions.conceptExplanation')}
        </Button>
        <Button variant="outline" size="sm" onClick={() => handleSuggestion(t('quickActions.practiceProblems'))}>
          <HelpCircle className="h-4 w-4 mr-2" />
          {t('quickActions.practiceProblems')}
        </Button>
      </div>
    </Card>
  );
}

export default AITutorChat;