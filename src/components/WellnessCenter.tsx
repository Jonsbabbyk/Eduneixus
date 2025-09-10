import React, { useState, useEffect, useRef } from 'react';
import { Heart, Smile, Frown, Meh, Brain, Clock, Wind, CheckCircle, Hand, Music, Feather, Sun, Droplet, Puzzle, ArrowLeft, Lightbulb, Grid, Edit, Users, Check, X } from 'lucide-react';
import Card from './Card';
import Button from './Button';
import { useUser } from '../contexts/UserContext';

function WellnessCenter() {
  const { user } = useUser();
  const [currentMood, setCurrentMood] = useState<string>('');
  const [journalEntry, setJournalEntry] = useState('');
  const [breathingActive, setBreathingActive] = useState(false);
  const [breathingTimer, setBreathingTimer] = useState(0);
  const [breathingStage, setBreathingStage] = useState('inhale');
  const [meditationActive, setMeditationActive] = useState(false);
  const [meditationTimer, setMeditationTimer] = useState(0);
  const [activeActivity, setActiveActivity] = useState<string | null>(null);
  const [activePuzzle, setActivePuzzle] = useState<string | null>(null);

  // New state for Riddles game
  const [riddle, setRiddle] = useState<{ question: string, answer: string } | null>(null);
  const [riddleAnswer, setRiddleAnswer] = useState('');
  const [riddleFeedback, setRiddleFeedback] = useState<string | null>(null);
  // New state to control when the answer is revealed
  const [showRiddleAnswer, setShowRiddleAnswer] = useState(false);

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const moods = [
    { emoji: '😊', label: 'Happy', value: 'happy', color: 'green' },
    { emoji: '😐', label: 'Neutral', value: 'neutral', color: 'yellow' },
    { emoji: '😔', label: 'Sad', value: 'sad', color: 'blue' },
    { emoji: '😰', label: 'Stressed', value: 'stressed', color: 'red' },
    { emoji: '😴', label: 'Tired', value: 'tired', color: 'purple' },
    { emoji: '😤', label: 'Frustrated', value: 'frustrated', color: 'orange' }
  ];

  const wellnessActivities = [
    {
      title: 'Breathing Exercise',
      description: '4-7-8 breathing technique for relaxation',
      icon: <Wind className="h-6 w-6" />,
      action: () => startBreathingExercise()
    },
    {
      title: 'Mindful Meditation',
      description: '5-minute guided meditation',
      icon: <Brain className="h-6 w-6" />,
      action: () => startMeditation()
    },
    {
      title: 'Quick Walk',
      description: 'Take a 10-minute break and walk',
      icon: <Clock className="h-6 w-6" />,
      action: () => setActiveActivity('Quick Walk')
    },
    {
      title: 'Guided Stretching',
      description: 'A quick 5-minute stretch to ease tension',
      icon: <Hand className="h-6 w-6" />,
      action: () => setActiveActivity('Guided Stretching')
    },
    {
      title: 'Music Break',
      description: 'Listen to a relaxing song or a favorite tune',
      icon: <Music className="h-6 w-6" />,
      action: () => setActiveActivity('Music Break')
    },
    {
      title: 'Gratitude Practice',
      description: 'Write down three things you are grateful for',
      icon: <Feather className="h-6 w-6" />,
      action: () => setActiveActivity('Gratitude Practice')
    },
    {
      title: 'Hydration Reminder',
      description: 'Time to drink a glass of water',
      icon: <Droplet className="h-6 w-6" />,
      action: () => setActiveActivity('Hydration Reminder')
    },
    {
      title: 'Mind Puzzle',
      description: 'Solve a quick riddle or puzzle',
      icon: <Puzzle className="h-6 w-6" />,
      action: () => setActiveActivity('Mind Puzzle')
    },
    {
      title: 'Visualization',
      description: 'Envision a calm, happy place',
      icon: <Sun className="h-6 w-6" />,
      action: () => setActiveActivity('Visualization')
    },
  ];

  // --- PERSISTENCE LOGIC ---
  useEffect(() => {
    const savedMood = localStorage.getItem(`mood_${user?.id}`);
    const savedJournal = localStorage.getItem(`journal_${user?.id}`);
    if (savedMood) {
      setCurrentMood(savedMood);
    }
    if (savedJournal) {
      setJournalEntry(savedJournal);
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [user]);

  const saveMood = (mood: string) => {
    setCurrentMood(mood);
    localStorage.setItem(`mood_${user?.id}`, mood);
  };

  const saveJournalEntry = () => {
    if (journalEntry.trim()) {
      localStorage.setItem(`journal_${user?.id}`, journalEntry);
      alert('Journal entry saved!');
      setActiveActivity(null); // Go back to activities page
    }
  };

  // --- TIMER LOGIC ---
  const startBreathingExercise = () => {
    setActiveActivity('Breathing Exercise');
    setBreathingActive(true);
    setBreathingTimer(4);
    setBreathingStage('inhale');
    if (timerRef.current) clearInterval(timerRef.current);

    let stage = 'inhale';
    let time = 4;

    timerRef.current = setInterval(() => {
      time--;
      if (time < 0) {
        if (stage === 'inhale') {
          stage = 'hold';
          time = 7;
        } else if (stage === 'hold') {
          stage = 'exhale';
          time = 8;
        } else if (stage === 'exhale') {
          stage = 'inhale';
          time = 4;
        }
      }
      setBreathingStage(stage);
      setBreathingTimer(time);
    }, 1000);
  };

  const stopBreathingExercise = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    setBreathingActive(false);
    setActiveActivity(null);
  };
  
  const startMeditation = () => {
    setActiveActivity('Mindful Meditation');
    const duration = 5 * 60; // 5 minutes in seconds
    setMeditationActive(true);
    setMeditationTimer(duration);
    if (timerRef.current) clearInterval(timerRef.current);

    timerRef.current = setInterval(() => {
      setMeditationTimer(prevTime => {
        if (prevTime <= 1) {
          if (timerRef.current) {
            clearInterval(timerRef.current);
          }
          setMeditationActive(false);
          alert('Meditation session complete!');
          setActiveActivity(null);
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    const formattedSeconds = remainingSeconds < 10 ? `0${remainingSeconds}` : remainingSeconds;
    return `${minutes}:${formattedSeconds}`;
  };

  // --- RIDDLE LOGIC ---
  const riddles = [
    { question: "What has an eye but cannot see?", answer: "A needle" },
    { question: "What is full of holes but still holds water?", answer: "A sponge" },
    { question: "What question can you never answer yes to?", answer: "Are you asleep yet?" },
    { question: "I speak without a mouth and hear without ears. I have no body, but I come alive with wind. What am I?", answer: "An echo" },
    { question: "The more you take, the more you leave behind. What am I?", answer: "Footsteps" },
    { question: "What has to be broken before you can use it?", answer: "An egg" },
    { question: "What is always in front of you but can’t be seen?", answer: "The future" },
    { question: "What is always coming, but never arrives?", answer: "Tomorrow" },
    { question: "What can you hold in your left hand, but not in your right?", answer: "Your right elbow" },
    { question: "What has a head and a tail but no body?", answer: "A coin" },
    { question: "What word is spelled incorrectly in every dictionary?", answer: "Incorrectly" },
    { question: "What is light as a feather, but even the strongest person can't hold it for five minutes?", answer: "Breath" },
    { question: "What belongs to you, but other people use it more than you do?", answer: "Your name" },
    { question: "What is it that lives if it is fed, and dies if you give it a drink?", answer: "Fire" },
    { question: "What is it that has an iron back and a wooden leg?", answer: "A chair" },
    { question: "I have cities, but no houses. I have mountains, but no trees. I have water, but no fish. What am I?", answer: "A map" },
    { question: "What has many teeth, but cannot bite?", answer: "A comb" },
    { question: "What is full of keys but can’t open a single door?", answer: "A piano" },
    { question: "What is it that has a neck but no head?", answer: "A bottle" },
    { question: "What has a thumb and four fingers, but is not alive?", answer: "A glove" }
  ];

  const fetchRiddle = () => {
    // This function now selects a random riddle from the hardcoded list
    setRiddleFeedback(null);
    setRiddleAnswer('');
    setShowRiddleAnswer(false);
    const randomIndex = Math.floor(Math.random() * riddles.length);
    setRiddle(riddles[randomIndex]);
  };

  const checkRiddleAnswer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!riddle) return;
    // Show the answer and feedback after submission
    setShowRiddleAnswer(true);
    if (riddleAnswer.toLowerCase().trim() === riddle.answer.toLowerCase().trim()) {
      setRiddleFeedback('Correct! 🎉');
    } else {
      setRiddleFeedback(`Incorrect. The answer is: ${riddle.answer}`);
    }
  };

  // --- RENDER ACTIVE ACTIVITY PAGE ---
  const renderActivityContent = () => {
    if (!activeActivity) {
      return null;
    }

    const BackButton = () => (
      <Button variant="ghost" onClick={() => {
        setActiveActivity(null);
        if (timerRef.current) clearInterval(timerRef.current);
        setBreathingActive(false);
        setMeditationActive(false);
      }} className="mb-4 text-gray-500 hover:text-gray-700">
        <ArrowLeft className="h-4 w-4 mr-2" /> Back to Activities
      </Button>
    );

    switch (activeActivity) {
      case 'Quick Walk':
        return (
          <div>
            <BackButton />
            <h3 className="text-xl font-bold mb-4">Quick Walk</h3>
            <p className="mb-4">Take a purposeful 10-minute walk. Focus on your posture and breath.</p>
            <ul className="list-disc list-inside space-y-2">
              <li>Keep your head up, shoulders relaxed, and your back straight.</li>
              <li>Gently swing your arms to help propel you forward.</li>
              <li>Walk with a rolling motion from heel to toe.</li>
            </ul>
            <p className="mt-4 italic text-sm text-gray-500">
              Even a short walk can boost your heart rate and clear your mind.
            </p>
          </div>
        );

      case 'Guided Stretching':
        return (
          <div>
            <BackButton />
            <h3 className="text-xl font-bold mb-4">Guided Stretching</h3>
            <p className="mb-4">Ease tension with a 5-minute guided stretch. Move slowly and listen to your body.</p>
            <ul className="list-disc list-inside space-y-2">
              <li>**Shoulder Stretch:** Bring one arm across your chest and gently pull it closer. Hold for 30 seconds.</li>
              <li>**Quad Stretch:** Hold onto a wall for balance, then pull one heel toward your glute. Hold for 30 seconds.</li>
              <li>**Calf Stretch:** Face a wall, place one foot behind the other, and lean forward with your back heel on the floor. Hold for 30 seconds.</li>
            </ul>
            <p className="mt-4 italic text-sm text-gray-500">
              Hold each stretch without bouncing. Breathe deeply as you hold each position.
            </p>
          </div>
        );

      case 'Music Break':
        return (
          <div>
            <BackButton />
            <h3 className="text-xl font-bold mb-4">Music Break</h3>
            <p className="mb-4">Time to relax and reset. Here are some songs to help you unwind:</p>
            <ul className="list-disc list-inside space-y-2">
              <li>**Classical:** "Clair de Lune" by Claude Debussy</li>
              <li>**Modern Classical:** "Nuvole Bianche" by Ludovico Einaudi</li>
              <li>**Ambient:** "Weightless" by Marconi Union</li>
              <li>**Piano:** "River Flows in You" by Yiruma</li>
              <li>**Nature Sounds:** A playlist of ocean waves or gentle rain.</li>
            </ul>
            <p className="mt-4 italic text-sm text-gray-500">
              Focus on the melody and let your thoughts drift away.
            </p>
          </div>
        );
      
      case 'Gratitude Practice':
        return (
          <div>
            <BackButton />
            <h3 className="text-xl font-bold mb-4">Gratitude Practice</h3>
            <p className="mb-4">Take a moment to shift your focus to the positive. Write down three things you are grateful for today.</p>
            <textarea
              placeholder="1. My morning coffee, 2. A beautiful sunset, 3. A call from a friend..."
              rows={4}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              onChange={(e) => setJournalEntry(e.target.value)}
            ></textarea>
            <Button className="mt-4" onClick={saveJournalEntry} disabled={!journalEntry.trim()}>
              Done
            </Button>
            <p className="mt-4 italic text-sm text-gray-500">
              Practicing gratitude can reframe your day and boost your happiness.
            </p>
          </div>
        );

      case 'Hydration Reminder':
        return (
          <div>
            <BackButton />
            <h3 className="text-xl font-bold mb-4">Hydration Reminder</h3>
            <p className="mb-4">A simple reminder to drink water. The general recommendation is 8 to 12 cups a day.</p>
            <p className="mb-4">**How to know if you're hydrated?**</p>
            <p className="mb-4">A simple way to check is by the color of your urine—it should be a clear, pale yellow color. Darker urine can be a sign of dehydration.</p>
            <Button>I've had a glass!</Button>
            <p className="mt-4 italic text-sm text-gray-500">
              Staying hydrated is crucial for mental clarity and physical energy.
            </p>
          </div>
        );

      case 'Mind Puzzle':
        const puzzles = [
          { title: 'Riddles', icon: <Lightbulb />, description: 'Solve a quick, thought-provoking riddle.' },
          { title: 'Sudoku', icon: <Grid />, description: 'A classic number-placement puzzle.' },
          { title: 'Crossword Puzzles', icon: <Edit />, description: 'A classic test of vocabulary.' },
          { title: 'Logic Puzzles', icon: <Users />, description: 'A challenging way to use deductive reasoning.' },
        ];
        
        const puzzleContent = (puzzleTitle: string) => {
          switch (puzzleTitle) {
            case 'Riddles':
              return (
                <div>
                  <h4 className="text-lg font-bold mb-2">Riddle Me This...</h4>
                  {riddle ? (
                    <form onSubmit={checkRiddleAnswer}>
                      <p className="mb-4 font-semibold">{riddle.question}</p>
                      <input
                        type="text"
                        placeholder="Your Answer"
                        value={riddleAnswer}
                        onChange={(e) => setRiddleAnswer(e.target.value)}
                        className="w-full p-2 border rounded-lg mb-2"
                      />
                      <Button type="submit" disabled={!riddleAnswer.trim()}>Submit Answer</Button>
                      {showRiddleAnswer && (
                        <div className={`mt-2 p-2 rounded-lg text-sm flex items-center gap-2 ${riddleFeedback?.includes('Correct') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                          {riddleFeedback?.includes('Correct') ? <Check className="h-4 w-4" /> : <X className="h-4 w-4" />}
                          {riddleFeedback}
                        </div>
                      )}
                      <Button onClick={fetchRiddle} variant="ghost" className="mt-2 w-full" disabled={!showRiddleAnswer}>
                        Next Riddle
                      </Button>
                    </form>
                  ) : (
                    <Button onClick={fetchRiddle} className="mt-4">Start Riddle</Button>
                  )}
                </div>
              );
            case 'Sudoku':
              return (
                <div>
                  <h4 className="text-lg font-bold mb-2">Sudoku Puzzle</h4>
                  <p className="mb-4">This feature is still in development. Come back soon!</p>
                </div>
              );
            case 'Crossword Puzzles':
              return (
                <div>
                  <h4 className="text-lg font-bold mb-2">Crossword Puzzle</h4>
                  <p className="mb-4">This feature is still in development. Come back soon!</p>
                </div>
              );
            case 'Logic Puzzles':
              return (
                <div>
                  <h4 className="text-lg font-bold mb-2">Logic Puzzle</h4>
                  <p className="mb-4">This feature is still in development. Come back soon!</p>
                </div>
              );
            default:
              return null;
          }
        };

        return (
          <div>
            <BackButton />
            <h3 className="text-xl font-bold mb-4">Mind Puzzle</h3>
            {activePuzzle ? (
              <>
                <Button variant="ghost" onClick={() => setActivePuzzle(null)} className="mb-4 text-gray-500 hover:text-gray-700">
                  <ArrowLeft className="h-4 w-4 mr-2" /> Back to Puzzles
                </Button>
                {puzzleContent(activePuzzle)}
              </>
            ) : (
              <div className="grid md:grid-cols-2 gap-4">
                {puzzles.map((puzzle, index) => (
                  <div key={index} className="p-4 bg-gray-100 rounded-lg hover:bg-gray-200 cursor-pointer" onClick={() => setActivePuzzle(puzzle.title)}>
                    <div className="text-blue-600 mb-3">{puzzle.icon}</div>
                    <h4 className="font-semibold mb-2">{puzzle.title}</h4>
                    <p className="text-sm text-gray-600">{puzzle.description}</p>
                  </div>
                ))}
              </div>
            )}
            <p className="mt-4 italic text-sm text-gray-500">
              Engaging in puzzles can reduce mental fatigue and improve concentration.
            </p>
          </div>
        );

      case 'Visualization':
        return (
          <div>
            <BackButton />
            <h3 className="text-xl font-bold mb-4">Visualization</h3>
            <p className="mb-4">Find a quiet spot, close your eyes, and visualize a peaceful place. Engage all your senses to make the image vivid.</p>
            <ul className="list-disc list-inside space-y-2">
              <li>What do you see in this peaceful place?</li>
              <li>What sounds can you hear?</li>
              <li>What scents are present?</li>
              <li>What do you feel (e.g., the warmth of the sun, a gentle breeze)?</li>
            </ul>
            <p className="mt-4 italic text-sm text-gray-500">
              This practice helps train your mind to focus on calming images and sensations.
            </p>
          </div>
        );

      case 'Breathing Exercise':
        return (
          <div>
            <BackButton />
            <h3 className="text-xl font-bold mb-4">Breathing Exercise</h3>
            <p className="mb-4 text-center">Follow the timer below to practice 4-7-8 breathing.</p>
            <div className="text-center">
              <div className="text-xl font-bold text-blue-800 mb-2">{breathingStage.toUpperCase()}</div>
              <div className="text-4xl font-extrabold text-blue-600 animate-pulse">{breathingTimer}</div>
              <Button size="sm" variant="outline" className="mt-3" onClick={stopBreathingExercise}>
                Stop
              </Button>
            </div>
          </div>
        );
      
      case 'Mindful Meditation':
        return (
          <div>
            <BackButton />
            <h3 className="text-xl font-bold mb-4">Mindful Meditation</h3>
            <p className="mb-4 text-center">Focus on your breath and let your thoughts pass by without judgment.</p>
            <div className="text-center">
              <div className="text-lg font-bold text-green-800 mb-2">Session Active</div>
              <div className="text-4xl font-extrabold text-green-600">{formatTime(meditationTimer)}</div>
              <Button size="sm" variant="outline" className="mt-3" onClick={() => {
                  if (timerRef.current) clearInterval(timerRef.current);
                  setMeditationActive(false);
                  setActiveActivity(null);
                }}>
                End Session
              </Button>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  // --- MAIN COMPONENT RENDER ---
  return (
    <div className="space-y-6">
      <Card className="p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-pink-100 rounded-lg">
            <Heart className="h-6 w-6 text-pink-600" />
          </div>
          <h2 className="text-2xl font-bold">Wellness Center</h2>
        </div>

        {activeActivity ? (
          renderActivityContent()
        ) : (
          <>
            <div className="mb-8">
              <h3 className="text-lg font-semibold mb-4">How are you feeling today?</h3>
              <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
                {moods.map((mood) => (
                  <button
                    key={mood.value}
                    onClick={() => saveMood(mood.value)}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      currentMood === mood.value
                        ? `border-${mood.color}-400 bg-${mood.color}-50`
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="text-4xl mb-2">{mood.emoji}</div>
                    <div className="text-sm font-medium">{mood.label}</div>
                  </button>
                ))}
              </div>
              {currentMood && (
                <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                  <p className="text-sm text-blue-800">
                    Thanks for sharing! Remember that all feelings are valid. 
                    {currentMood === 'stressed' || currentMood === 'frustrated' 
                      ? ' Try one of the activities below to help you feel better.'
                      : ' Keep up the positive energy!'
                    }
                  </p>
                </div>
              )}
            </div>

            <div className="mb-8">
              <h3 className="text-lg font-semibold mb-4">Wellness Activities</h3>
              <div className="grid md:grid-cols-3 gap-4">
                {wellnessActivities.map((activity, index) => (
                  <div key={index} className="p-4 bg-gray-50 rounded-lg">
                    <div className="text-blue-600 mb-3">{activity.icon}</div>
                    <h4 className="font-semibold mb-2">{activity.title}</h4>
                    <p className="text-sm text-gray-600 mb-3">{activity.description}</p>
                    <Button size="sm" variant="outline" onClick={activity.action}>
                      Start
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
        
        <div>
          <h3 className="text-lg font-semibold mb-4">Daily Reflection Journal</h3>
          <textarea
            value={journalEntry}
            onChange={(e) => setJournalEntry(e.target.value)}
            placeholder="Write about your thoughts, feelings, or anything on your mind..."
            rows={4}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            maxLength={500}
          />
          <div className="flex justify-between items-center mt-3">
            <div className="text-sm text-gray-500">
              {journalEntry.length}/500 characters
            </div>
            <Button onClick={saveJournalEntry} disabled={!journalEntry.trim()}>
              Save Entry
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}

export default WellnessCenter;