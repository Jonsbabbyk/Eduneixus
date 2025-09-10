// src/pages/StudentDashboard.tsx

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
    Brain, 
    Trophy, 
    Calendar, 
    Heart, 
    BookOpen,
    Award,
    Target,
    Clock,
    TrendingUp,
    MessageCircle,
    ChevronRight,
    Star,
    Zap,
    CheckCircle,
    Search,
    UserX,
    AlertTriangle,
} from 'lucide-react';
import { useUser } from '../contexts/UserContext';
import DashboardLayout from '../components/DashboardLayout';
import Card from '../components/Card';
import Button from '../components/Button';
import ProgressRing from '../components/ProgressRing';
import AITutorChat from '../components/AITutorChat';
import WellnessCenter from '../components/WellnessCenter';
import GamifiedLearning from '../components/GamifiedLearning';
import StudyPlanner from '../components/StudyPlanner';
import { 
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from '../components/ui/alert-dialog'; 

// Define the type for a lesson object
interface Lesson {
    title: string;
    subject: string;
    grade: string;
    description: string;
    xp: number;
    time: number;
}

function StudentDashboard() {
    // Get both user and token from the context
    const { user, logout, token } = useUser();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('overview');
    const [searchQuery, setSearchQuery] = useState('');
    const [filteredLessons, setFilteredLessons] = useState<Lesson[]>([]);

    // Redirect to login if not authenticated
    useEffect(() => {
        if (!user) {
            navigate('/student-login');
        }
    }, [user, navigate]);

    // Dummy data for the dashboard
    const motivationalQuotes = [
        "Every expert was once a beginner. Keep pushing forward! 🚀",
        "The future belongs to those who learn today. You're on the right path! ✨",
        "Progress, not perfection. Every step counts! 💪",
        "Your potential is limitless. Today's efforts shape tomorrow's success! 🌟"
    ];
    const todaysQuote = motivationalQuotes[new Date().getDay() % motivationalQuotes.length];
    const studentStats = {
        xp: 1250,
        level: 8,
        streakDays: 12,
        completedLessons: 48,
        totalBadges: 15,
        weeklyProgress: 68
    };
    const recentBadges = [
        { name: "Streak Master", icon: "🔥", description: "7 days in a row!" },
        { name: "Quiz Champion", icon: "🏆", description: "Perfect score on 5 quizzes" },
        { name: "Speed Learner", icon: "⚡", description: "Completed lesson in under 10 min" },
        { name: "Helper", icon: "🤝", description: "Helped 3 classmates" }
    ];
    const upcomingTasks = [
        { title: "Math Quiz: Quadratic Equations", due: "Today, 3:00 PM", subject: "Mathematics", urgent: true },
        { title: "Science Project: Solar System", due: "Tomorrow", subject: "Physics", urgent: false },
        { title: "Essay: Climate Change", due: "Friday", subject: "Environmental Science", urgent: false },
        { title: "Programming Lab", due: "Next Monday", subject: "Computer Science", urgent: false }
    ];
    const learningModules = [
        { title: "AI Tutor", description: "Get personalized help with any subject", icon: <Brain className="h-6 w-6" />, color: "blue", action: () => setActiveTab('tutor') },
        { title: "Gamified Lessons", description: "Learn through interactive games and challenges", icon: <Trophy className="h-6 w-6" />, color: "yellow", action: () => setActiveTab('gamified') },
        { title: "Study Planner", description: "AI-powered scheduling and productivity tools", icon: <Calendar className="h-6 w-6" />, color: "green", action: () => setActiveTab('planner') },
        { title: "Wellness Center", description: "Mood tracking and stress relief exercises", icon: <Heart className="h-6 w-6" />, color: "red", action: () => setActiveTab('wellness') }
    ];
    const availableLessons: Lesson[] = [
        { title: "Introduction to Quadratic Equations", subject: "Mathematics", grade: "Grade 10", description: "Learn the basics of quadratic equations and how to solve them.", xp: 50, time: 15, },
        { title: "Photosynthesis Process", subject: "Biology", grade: "Grade 9", description: "Understand how plants convert sunlight into energy.", xp: 40, time: 12, },
        { title: "World War II Timeline", subject: "History", grade: "Grade 11", description: "Key events and dates of World War II.", xp: 35, time: 18, },
        { title: "Introduction to Chemistry", subject: "Chemistry", grade: "Grade 9", description: "Learn the basic principles of chemistry, including atoms, elements, and the periodic table.", xp: 45, time: 10, },
        { title: "Python Programming Basics", subject: "Computer Science", grade: "Beginner", description: "Learn the very first steps in Python, including variables, data types, and printing output.", xp: 60, time: 20, },
        { title: "The Solar System", subject: "Astronomy", grade: "Grade 7", description: "Explore the planets, moons, and other celestial bodies that make up our solar system.", xp: 30, time: 10, },
    ];

    // Update filtered lessons on search query change
    useEffect(() => {
        if (searchQuery.trim() === '') {
            setFilteredLessons(availableLessons);
        } else {
            const lowercasedQuery = searchQuery.toLowerCase();
            const newFilteredLessons = availableLessons.filter(lesson =>
                lesson.title.toLowerCase().includes(lowercasedQuery) ||
                lesson.description.toLowerCase().includes(lowercasedQuery) ||
                lesson.subject.toLowerCase().includes(lowercasedQuery)
            );
            setFilteredLessons(newFilteredLessons);
        }
    }, [searchQuery]);

    // Account deletion logic using token from context
    const handleDeleteAccount = async () => {
        if (!token) {
            console.error("No token found. User not authenticated.");
            alert("You are not authenticated. Please log in again.");
            logout(); 
            navigate('/student-login'); 
            return;
        }

        try {
            const response = await fetch('http://127.0.0.1:5000/api/auth/delete_account', {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (response.ok) {
                alert("Your account has been successfully deleted.");
                logout(); 
                navigate('/register'); 
            } else {
                const errorData = await response.json();
                alert(`Failed to delete account: ${errorData.error}`);
            }
        } catch (error) {
            console.error("Error deleting account:", error);
            alert("An error occurred. Please try again.");
        }
    };

    // Render function for the active tab
    const renderActiveTab = () => {
        switch (activeTab) {
            case 'tutor': return <AITutorChat />;
            case 'gamified': return <GamifiedLearning />;
            case 'planner': return <StudyPlanner />;
            case 'wellness': return <WellnessCenter />;
            default:
                return (
                    <>
                        {/* Progress Overview */}
                        <div className="grid md:grid-cols-4 gap-6">
                            <Card className="p-6 text-center">
                                <ProgressRing progress={studentStats.weeklyProgress} size={80} />
                                <div className="mt-4">
                                    <div className="text-2xl font-bold text-blue-600">{studentStats.weeklyProgress}%</div>
                                    <div className="text-gray-600">Weekly Goal</div>
                                </div>
                            </Card>
                            <Card className="p-6">
                                <div className="flex items-center justify-between mb-4">
                                    <Zap className="h-8 w-8 text-orange-500" />
                                    <span className="text-2xl font-bold">{studentStats.streakDays}</span>
                                </div>
                                <div className="text-gray-600">Day Streak</div>
                                <div className="text-sm text-green-600 mt-1">+2 from yesterday!</div>
                            </Card>
                            <Card className="p-6">
                                <div className="flex items-center justify-between mb-4">
                                    <BookOpen className="h-8 w-8 text-green-500" />
                                    <span className="text-2xl font-bold">{studentStats.completedLessons}</span>
                                </div>
                                <div className="text-gray-600">Lessons Completed</div>
                                <div className="text-sm text-blue-600 mt-1">This month</div>
                            </Card>
                            <Card className="p-6">
                                <div className="flex items-center justify-between mb-4">
                                    <Award className="h-8 w-8 text-yellow-500" />
                                    <span className="text-2xl font-bold">{studentStats.totalBadges}</span>
                                </div>
                                <div className="text-gray-600">Badges Earned</div>
                                <div className="text-sm text-purple-600 mt-1">All time</div>
                            </Card>
                        </div>
                        <hr className="my-6 border-gray-200" />

                        {/* Learning Modules */}
                        <Card className="p-6">
                            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                                <Target className="h-6 w-6 text-blue-600" />
                                Your Learning Hub
                            </h2>
                            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                                {learningModules.map((module, index) => (
                                    <div 
                                        key={index}
                                        className={`p-6 rounded-xl cursor-pointer transition-all hover:scale-105 bg-${module.color}-50 border-2 border-${module.color}-200 hover:border-${module.color}-400`}
                                        onClick={module.action}
                                    >
                                        <div className={`text-${module.color}-600 mb-4`}>
                                            {module.icon}
                                        </div>
                                        <h3 className="font-semibold text-gray-900 mb-2">{module.title}</h3>
                                        <p className="text-sm text-gray-600 mb-4">{module.description}</p>
                                        <div className="flex items-center text-blue-600 text-sm font-medium">
                                            Open <ChevronRight className="h-4 w-4 ml-1" />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </Card>
                        <hr className="my-6 border-gray-200" />

                        {/* Available Lessons Section - Now filtered */}
                        <div className="space-y-6">
                            <h2 className="text-2xl font-bold flex items-center gap-2">
                                <BookOpen className="h-6 w-6 text-blue-600" />
                                Available Lessons
                            </h2>
                            {filteredLessons.length > 0 ? (
                                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {filteredLessons.map((lesson, index) => (
                                        <Card key={index} className="p-6 flex flex-col justify-between">
                                            <div>
                                                <div className="flex items-center justify-between mb-2">
                                                    <h3 className="text-xl font-bold">{lesson.title}</h3>
                                                    <div className="text-sm text-gray-500">{lesson.grade}</div>
                                                </div>
                                                <p className="text-gray-600 mb-4 line-clamp-3">{lesson.description}</p>
                                            </div>
                                            <div className="flex items-center justify-between text-sm text-gray-500">
                                                <div className="flex items-center gap-1">
                                                    <Zap className="h-4 w-4 text-yellow-500" /> {lesson.xp} XP
                                                </div>
                                                <div className="flex items-center gap-1">
                                                    <Clock className="h-4 w-4 text-blue-500" /> {lesson.time} minutes
                                                </div>
                                            </div>
                                            <Button className="mt-4 w-full">Start</Button>
                                        </Card>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center p-8 bg-gray-100 rounded-lg">
                                    <Search className="h-10 w-10 mx-auto text-gray-400 mb-4" />
                                    <p className="text-lg text-gray-600">No lessons found for "{searchQuery}". Try a different keyword!</p>
                                </div>
                            )}
                        </div>
                        <hr className="my-6 border-gray-200" />

                        {/* Recent Badges and Tasks */}
                        <div className="grid md:grid-cols-2 gap-6">
                            <Card className="p-6">
                                <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                                    <Star className="h-6 w-6 text-yellow-500" />
                                    Recent Badges
                                </h3>
                                <div className="space-y-3">
                                    {recentBadges.map((badge, index) => (
                                        <div key={index} className="flex items-center gap-4 p-3 bg-yellow-50 rounded-lg">
                                            <div className="text-2xl">{badge.icon}</div>
                                            <div>
                                                <div className="font-semibold text-gray-900">{badge.name}</div>
                                                <div className="text-sm text-gray-600">{badge.description}</div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </Card>
                            <Card className="p-6">
                                <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                                    <Clock className="h-6 w-6 text-blue-500" />
                                    Upcoming Tasks
                                </h3>
                                <div className="space-y-3">
                                    {upcomingTasks.map((task, index) => (
                                        <div key={index} className={`p-3 rounded-lg border-l-4 ${task.urgent ? 'border-red-400 bg-red-50' : 'border-blue-400 bg-blue-50'}`}>
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <div className="font-semibold text-gray-900">{task.title}</div>
                                                    <div className="text-sm text-gray-600">{task.subject}</div>
                                                </div>
                                                <div className={`text-sm font-medium ${task.urgent ? 'text-red-600' : 'text-blue-600'}`}>
                                                    {task.due}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </Card>
                        </div>
                    </>
                );
        }
    };

    return (
        <DashboardLayout searchQuery={searchQuery} setSearchQuery={setSearchQuery}>
            <div className="space-y-6">
                {/* Welcome Header */}
                <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl p-8 text-white">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold mb-2">Welcome back, {user?.name}!</h1>
                            <p className="text-blue-100 text-lg">{todaysQuote}</p>
                        </div>
                        <div className="text-right">
                            <div className="text-2xl font-bold">Level {studentStats.level}</div>
                            <div className="text-blue-100">{studentStats.xp} XP</div>
                        </div>
                    </div>
                </div>
                
                {/* Tab Navigation */}
                <div className="flex flex-wrap gap-2 bg-white p-2 rounded-xl shadow-sm justify-between">
                    <Button 
                        variant={activeTab === 'overview' ? 'primary' : 'ghost'}
                        onClick={() => setActiveTab('overview')}
                        className="flex-1 min-w-[100px]"
                    >
                        Overview
                    </Button>
                    <Button 
                        variant={activeTab === 'tutor' ? 'primary' : 'ghost'}
                        onClick={() => setActiveTab('tutor')}
                        className="flex-1 min-w-[100px]"
                    >
                        AI Tutor
                    </Button>
                    <Button 
                        variant={activeTab === 'gamified' ? 'primary' : 'ghost'}
                        onClick={() => setActiveTab('gamified')}
                        className="flex-1 min-w-[100px]"
                    >
                        Games
                    </Button>
                    <Button 
                        variant={activeTab === 'planner' ? 'primary' : 'ghost'}
                        onClick={() => setActiveTab('planner')}
                        className="flex-1 min-w-[100px]"
                    >
                        Planner
                    </Button>
                    <Button 
                        variant={activeTab === 'wellness' ? 'primary' : 'ghost'}
                        onClick={() => setActiveTab('wellness')}
                        className="flex-1 min-w-[100px]"
                    >
                        Wellness
                    </Button>
                </div>
                
                {renderActiveTab()}

                {/* Delete Account Button and Dialog */}
                <div className="mt-8 text-center">
                    <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <Button variant="danger" className="w-full max-w-sm">
                                <UserX className="h-5 w-5 mr-2" />
                                Delete Account
                            </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle className="flex items-center text-red-600">
                                    <AlertTriangle className="h-5 w-5 mr-2" /> Are you absolutely sure?
                                </AlertDialogTitle>
                                <AlertDialogDescription>
                                    This action cannot be undone. This will permanently delete your account and all associated data from our servers.
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction onClick={handleDeleteAccount} className="bg-red-500 hover:bg-red-600">
                                    Delete
                                </AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                </div>
            </div>
        </DashboardLayout>
    );
}

export default StudentDashboard;