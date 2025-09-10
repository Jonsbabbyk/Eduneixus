import React, { useState, useEffect } from 'react';
import { Trophy, Star, Zap, BookOpen, Play, CheckCircle, Award } from 'lucide-react';
import Card from './Card';
import Button from './Button';
import { useUser } from '../contexts/UserContext';
import lessonsData from '../data/lessons.json';
import leaderboardData from '../data/leaderboard.json';

function GamifiedLearning() {
  const { user, updateUser } = useUser();
  const [activeLesson, setActiveLesson] = useState<any>(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [quizComplete, setQuizComplete] = useState(false);
  const [score, setScore] = useState(0);
  const [completedLessons, setCompletedLessons] = useState<string[]>([]);

  useEffect(() => {
    const completed = JSON.parse(localStorage.getItem(`completed_lessons_${user?.id}`) || '[]');
    setCompletedLessons(completed);
  }, [user]);

  const startLesson = (lesson: any) => {
    setActiveLesson(lesson);
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setShowResult(false);
    setQuizComplete(false);
    setScore(0);
  };

  const handleAnswerSelect = (answerIndex: number) => {
    setSelectedAnswer(answerIndex);
  };

  const submitAnswer = () => {
    if (selectedAnswer === null) return;
    
    const isCorrect = selectedAnswer === activeLesson.quiz.questions[currentQuestion].correct;
    if (isCorrect) {
      setScore(score + 1);
    }
    setShowResult(true);
  };

  const nextQuestion = () => {
    if (currentQuestion < activeLesson.quiz.questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
      setShowResult(false);
    } else {
      completeLesson();
    }
  };

  const completeLesson = () => {
    setQuizComplete(true);
    
    // Update user progress
    const newXP = (user?.xp || 0) + activeLesson.xp;
    const newLevel = Math.floor(newXP / 200) + 1;
    const newBadges = [...(user?.badges || [])];
    
    // Award badges based on performance
    if (score === activeLesson.quiz.questions.length) {
      newBadges.push('Perfect Score');
    }
    if (score >= activeLesson.quiz.questions.length * 0.8) {
      newBadges.push('High Achiever');
    }
    
    updateUser({
      xp: newXP,
      level: newLevel,
      badges: [...new Set(newBadges)] // Remove duplicates
    });

    // Mark lesson as completed
    const newCompleted = [...completedLessons, activeLesson.id];
    setCompletedLessons(newCompleted);
    localStorage.setItem(`completed_lessons_${user?.id}`, JSON.stringify(newCompleted));
  };

  const closeLesson = () => {
    setActiveLesson(null);
  };

  if (activeLesson) {
    return (
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">{activeLesson.title}</h2>
          <Button variant="ghost" onClick={closeLesson}>✕</Button>
        </div>

        {!quizComplete ? (
          <div>
            {/* Lesson Content */}
            {currentQuestion === 0 && !showResult && (
              <div className="mb-6">
                <div className="bg-blue-50 p-6 rounded-lg mb-4">
                  <h3 className="text-lg font-semibold mb-3">Lesson Overview</h3>
                  <p className="text-gray-700 mb-4">{activeLesson.content.theory}</p>
                  {activeLesson.content.equation && (
                    <div className="bg-white p-3 rounded border text-center font-mono">
                      {activeLesson.content.equation}
                    </div>
                  )}
                  {activeLesson.content.examples && (
                    <div className="mt-4">
                      <h4 className="font-semibold mb-2">Examples:</h4>
                      <ul className="list-disc list-inside">
                        {activeLesson.content.examples.map((example: string, index: number) => (
                          <li key={index} className="text-gray-700">{example}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
                <Button onClick={() => setCurrentQuestion(0)} className="w-full">
                  Start Quiz
                </Button>
              </div>
            )}

            {/* Quiz Questions */}
            {currentQuestion >= 0 && (
              <div>
                <div className="mb-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-gray-600">
                      Question {currentQuestion + 1} of {activeLesson.quiz.questions.length}
                    </span>
                    <span className="text-sm text-blue-600">Score: {score}/{currentQuestion + (showResult ? 1 : 0)}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full transition-all"
                      style={{ width: `${((currentQuestion + (showResult ? 1 : 0)) / activeLesson.quiz.questions.length) * 100}%` }}
                    />
                  </div>
                </div>

                <div className="bg-gray-50 p-6 rounded-lg mb-6">
                  <h3 className="text-lg font-semibold mb-4">
                    {activeLesson.quiz.questions[currentQuestion].question}
                  </h3>
                  <div className="space-y-3">
                    {activeLesson.quiz.questions[currentQuestion].options.map((option: string, index: number) => (
                      <button
                        key={index}
                        onClick={() => handleAnswerSelect(index)}
                        disabled={showResult}
                        className={`w-full p-3 text-left rounded-lg border-2 transition-all ${
                          selectedAnswer === index
                            ? showResult
                              ? index === activeLesson.quiz.questions[currentQuestion].correct
                                ? 'border-green-500 bg-green-50'
                                : 'border-red-500 bg-red-50'
                              : 'border-blue-500 bg-blue-50'
                            : showResult && index === activeLesson.quiz.questions[currentQuestion].correct
                              ? 'border-green-500 bg-green-50'
                              : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                </div>

                {showResult && (
                  <div className={`p-4 rounded-lg mb-4 ${
                    selectedAnswer === activeLesson.quiz.questions[currentQuestion].correct
                      ? 'bg-green-50 border border-green-200'
                      : 'bg-red-50 border border-red-200'
                  }`}>
                    <div className="flex items-center gap-2 mb-2">
                      {selectedAnswer === activeLesson.quiz.questions[currentQuestion].correct ? (
                        <CheckCircle className="h-5 w-5 text-green-600" />
                      ) : (
                        <span className="text-red-600">✗</span>
                      )}
                      <span className="font-semibold">
                        {selectedAnswer === activeLesson.quiz.questions[currentQuestion].correct ? 'Correct!' : 'Incorrect'}
                      </span>
                    </div>
                    <p className="text-sm text-gray-700">
                      {activeLesson.quiz.questions[currentQuestion].explanation}
                    </p>
                  </div>
                )}

                <div className="flex gap-3">
                  {!showResult ? (
                    <Button 
                      onClick={submitAnswer} 
                      disabled={selectedAnswer === null}
                      className="flex-1"
                    >
                      Submit Answer
                    </Button>
                  ) : (
                    <Button onClick={nextQuestion} className="flex-1">
                      {currentQuestion < activeLesson.quiz.questions.length - 1 ? 'Next Question' : 'Complete Lesson'}
                    </Button>
                  )}
                </div>
              </div>
            )}
          </div>
        ) : (
          /* Completion Screen */
          <div className="text-center">
            <div className="mb-6">
              <Trophy className="h-16 w-16 text-yellow-500 mx-auto mb-4" />
              <h3 className="text-2xl font-bold mb-2">Lesson Complete!</h3>
              <p className="text-gray-600 mb-4">
                You scored {score} out of {activeLesson.quiz.questions.length}
              </p>
              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="text-lg font-semibold text-blue-600">+{activeLesson.xp} XP Earned!</div>
                <div className="text-sm text-gray-600">Level {user?.level}</div>
              </div>
            </div>
            <Button onClick={closeLesson} className="w-full">
              Continue Learning
            </Button>
          </div>
        )}
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Available Lessons */}
      <Card className="p-6">
        <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
          <BookOpen className="h-6 w-6 text-blue-600" />
          Available Lessons
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {lessonsData.map((lesson) => (
            <div 
              key={lesson.id}
              className={`p-4 rounded-lg border-2 transition-all ${
                completedLessons.includes(lesson.id)
                  ? 'border-green-200 bg-green-50'
                  : 'border-gray-200 hover:border-blue-300'
              }`}
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="font-semibold text-gray-900">{lesson.title}</h3>
                  <p className="text-sm text-gray-600">{lesson.subject} • {lesson.level}</p>
                </div>
                {completedLessons.includes(lesson.id) && (
                  <CheckCircle className="h-5 w-5 text-green-600" />
                )}
              </div>
              <p className="text-sm text-gray-700 mb-4">{lesson.description}</p>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <span className="flex items-center gap-1">
                    <Zap className="h-4 w-4" />
                    {lesson.xp} XP
                  </span>
                  <span>{lesson.duration}</span>
                </div>
                <Button 
                  size="sm" 
                  onClick={() => startLesson(lesson)}
                  variant={completedLessons.includes(lesson.id) ? 'outline' : 'primary'}
                >
                  <Play className="h-4 w-4 mr-1" />
                  {completedLessons.includes(lesson.id) ? 'Review' : 'Start'}
                </Button>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Leaderboard */}
      <Card className="p-6">
        <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
          <Trophy className="h-6 w-6 text-yellow-600" />
          Global Leaderboard
        </h2>
        <div className="space-y-3">
          {leaderboardData.map((student, index) => (
            <div 
              key={student.id}
              className={`flex items-center gap-4 p-4 rounded-lg ${
                student.name === user?.name ? 'bg-blue-50 border border-blue-200' : 'bg-gray-50'
              }`}
            >
              <div className="text-2xl font-bold text-gray-400">#{index + 1}</div>
              <img 
                src={student.avatar} 
                alt={student.name}
                className="w-12 h-12 rounded-full"
              />
              <div className="flex-1">
                <div className="font-semibold">{student.name}</div>
                <div className="text-sm text-gray-600">Level {student.level}</div>
              </div>
              <div className="text-right">
                <div className="font-semibold text-blue-600">{student.xp} XP</div>
                <div className="text-sm text-gray-600">{student.badges} badges</div>
              </div>
              <div className="flex items-center gap-1 text-orange-600">
                <Zap className="h-4 w-4" />
                <span className="text-sm font-medium">{student.streak}</span>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

export default GamifiedLearning;