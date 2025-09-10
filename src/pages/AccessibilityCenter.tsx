import React from 'react';
import { useState, useEffect } from 'react';
import { 
  Volume2, 
  Mic, 
  Eye, 
  Type, 
  Globe,
  Palette,
  Settings,
  CheckCircle,
  Hand
} from 'lucide-react';
import { useAccessibility } from '../contexts/AccessibilityContext';
import DashboardLayout from '../components/DashboardLayout';
import Card from '../components/Card';
import Button from '../components/Button';

function AccessibilityCenter() {
  const { settings, updateSettings, speak } = useAccessibility();
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [recognition, setRecognition] = useState<any>(null);

  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
      const recognitionInstance = new SpeechRecognition();
      recognitionInstance.continuous = true;
      recognitionInstance.interimResults = true;
      recognitionInstance.lang = settings.language || 'en-US';
      
      recognitionInstance.onresult = (event: any) => {
        let finalTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript;
          }
        }
        if (finalTranscript) {
          setTranscript(prev => prev + ' ' + finalTranscript);
        }
      };
      
      recognitionInstance.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
      };
      
      recognitionInstance.onend = () => {
        setIsListening(false);
      };
      
      setRecognition(recognitionInstance);
    }
  }, [settings.language]);

  const startListening = () => {
    if (recognition && settings.speechToText) {
      setIsListening(true);
      recognition.start();
    }
  };

  const stopListening = () => {
    if (recognition) {
      setIsListening(false);
      recognition.stop();
    }
  };

  const accessibilityFeatures = [
    {
      id: 'textToSpeech',
      title: 'Text-to-Speech',
      description: 'Have content read aloud to you',
      icon: <Volume2 className="h-6 w-6" />,
      active: settings.textToSpeech,
      demo: () => speak("This is a demonstration of text-to-speech functionality.")
    },
    {
      id: 'speechToText',
      title: 'Speech-to-Text',
      description: 'Use voice commands for input',
      icon: <Mic className="h-6 w-6" />,
      active: settings.speechToText,
      demo: () => {
        if (settings.speechToText) {
          isListening ? stopListening() : startListening();
        } else {
          alert('Please enable Speech-to-Text first');
        }
      }
    },
    {
      id: 'highContrast',
      title: 'High Contrast Mode',
      description: 'Increase visibility with enhanced contrast',
      icon: <Palette className="h-6 w-6" />,
      active: settings.highContrast
    },
    {
      id: 'dyslexiaFont',
      title: 'Dyslexia-Friendly Font',
      description: 'Use fonts optimized for dyslexia',
      icon: <Type className="h-6 w-6" />,
      active: settings.dyslexiaFont
    }
  ];

  const languages = [
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'es', name: 'Español', flag: '🇪🇸' },
    { code: 'fr', name: 'Français', flag: '🇫🇷' },
    { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
    { code: 'it', name: 'Italiano', flag: '🇮🇹' },
    { code: 'pt', name: 'Português', flag: '🇧🇷' },
    { code: 'zh', name: '中文', flag: '🇨🇳' },
    { code: 'ja', name: '日本語', flag: '🇯🇵' }
  ];

  const signLanguageWords = [
    { word: 'Hello', animation: '👋' },
    { word: 'Thank you', animation: '🙏' },
    { word: 'Yes', animation: '👍' },
    { word: 'No', animation: '👎' },
    { word: 'Help', animation: '🤝' },
    { word: 'Good', animation: '✅' },
    { word: 'Learn', animation: '📚' },
    { word: 'Study', animation: '📖' }
  ];

  const toggleFeature = (featureId: keyof typeof settings) => {
    updateSettings({ [featureId]: !settings[featureId] });
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <Card className="p-8 bg-gradient-to-r from-indigo-500 to-purple-600 text-white">
          <div className="flex items-center gap-4">
            <Eye className="h-12 w-12" />
            <div>
              <h1 className="text-3xl font-bold mb-2">Accessibility Center</h1>
              <p className="text-indigo-100">
                Customize your learning experience for optimal accessibility and comfort
              </p>
            </div>
          </div>
        </Card>

        {/* Main Features */}
        <Card className="p-6">
          <h2 className="text-2xl font-bold mb-6">Accessibility Features</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {accessibilityFeatures.map((feature) => (
              <div 
                key={feature.id}
                className={`p-6 rounded-xl border-2 transition-all ${
                  feature.active 
                    ? 'border-green-400 bg-green-50' 
                    : 'border-gray-200 bg-gray-50'
                }`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className={`text-${feature.active ? 'green' : 'gray'}-600`}>
                      {feature.icon}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{feature.title}</h3>
                      <p className="text-sm text-gray-600">{feature.description}</p>
                    </div>
                  </div>
                  {feature.active && <CheckCircle className="h-6 w-6 text-green-600" />}
                </div>
                <div className="flex gap-3">
                  <Button
                    variant={feature.active ? 'primary' : 'outline'}
                    onClick={() => toggleFeature(feature.id as keyof typeof settings)}
                    size="sm"
                  >
                    {feature.active ? 'Enabled' : 'Enable'}
                  </Button>
                  {feature.demo && (
                    <Button variant="ghost" size="sm" onClick={feature.demo}>
                      Demo
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Language Settings */}
        <Card className="p-6">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <Globe className="h-6 w-6" />
            Language Settings
          </h2>
          <div className="grid md:grid-cols-4 gap-4">
            {languages.map((lang) => (
              <Button
                key={lang.code}
                variant={settings.language === lang.code ? 'primary' : 'outline'}
                onClick={() => updateSettings({ language: lang.code })}
                className="flex items-center gap-2 justify-start"
              >
                <span className="text-lg">{lang.flag}</span>
                {lang.name}
              </Button>
            ))}
          </div>
        </Card>

        {/* Font Size */}
        <Card className="p-6">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <Type className="h-6 w-6" />
            Font Size
          </h2>
          <div className="flex gap-4">
            {(['small', 'medium', 'large'] as const).map((size) => (
              <Button
                key={size}
                variant={settings.fontSize === size ? 'primary' : 'outline'}
                onClick={() => updateSettings({ fontSize: size })}
                className="capitalize"
              >
                {size}
              </Button>
            ))}
          </div>
        </Card>

        {/* Sign Language Helper */}
        <Card className="p-6">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <Hand className="h-6 w-6" />
            Sign Language Helper
          </h2>
          <p className="text-gray-600 mb-4">
            Common words and phrases with visual representations
          </p>
          <div className="grid md:grid-cols-4 gap-4">
            {signLanguageWords.map((item, index) => (
              <div 
                key={index}
                className="p-4 bg-gray-50 rounded-lg text-center cursor-pointer hover:bg-gray-100 transition-colors"
                onClick={() => speak(item.word)}
              >
                <div className="text-4xl mb-2">{item.animation}</div>
                <div className="font-medium text-gray-900">{item.word}</div>
              </div>
            ))}
          </div>
        </Card>

        {/* Speech-to-Text Demo */}
        {settings.speechToText && (
          <Card className="p-6">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <Mic className="h-6 w-6" />
              Speech-to-Text Demo
            </h2>
            <div className="space-y-4">
              <div className="flex gap-4">
                <Button 
                  onClick={isListening ? stopListening : startListening}
                  variant={isListening ? 'secondary' : 'primary'}
                  disabled={!recognition}
                >
                  <Mic className="h-4 w-4 mr-2" />
                  {isListening ? 'Stop Listening' : 'Start Listening'}
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => setTranscript('')}
                >
                  Clear
                </Button>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg min-h-[100px]">
                <div className="text-sm text-gray-600 mb-2">Transcript:</div>
                <div className="text-gray-900">
                  {transcript || (isListening ? 'Listening...' : 'Click "Start Listening" and speak')}
                </div>
              </div>
            </div>
          </Card>
        )}

        {/* Quick Settings */}
        <Card className="p-6">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <Settings className="h-6 w-6" />
            Quick Actions
          </h2>
          <div className="grid md:grid-cols-3 gap-4">
            <Button 
              variant="outline" 
              className="p-4 h-auto flex-col gap-2"
              onClick={() => {
                updateSettings({
                  textToSpeech: false,
                  speechToText: false,
                  highContrast: false,
                  dyslexiaFont: false,
                  fontSize: 'medium'
                });
              }}
            >
              <Settings className="h-6 w-6" />
              <span>Reset All Settings</span>
            </Button>
            <Button 
              variant="outline" 
              className="p-4 h-auto flex-col gap-2"
              onClick={() => {
                updateSettings({
                  textToSpeech: true,
                  highContrast: true,
                  fontSize: 'large'
                });
              }}
            >
              <Eye className="h-6 w-6" />
              <span>Visual Assistance Mode</span>
            </Button>
            <Button 
              variant="outline" 
              className="p-4 h-auto flex-col gap-2"
              onClick={() => {
                updateSettings({
                  textToSpeech: true,
                  speechToText: true
                });
              }}
            >
              <Volume2 className="h-6 w-6" />
              <span>Audio Assistance Mode</span>
            </Button>
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
}

export default AccessibilityCenter;