import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  GraduationCap, 
  Home, 
  Accessibility,
  Bell,
  Search,
  LogOut
} from 'lucide-react';
import { useUser } from '../contexts/UserContext';
import { useAccessibility } from '../contexts/AccessibilityContext';
import Button from './Button';

// Define the expected props for this component
interface DashboardLayoutProps {
  children: React.ReactNode;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

function DashboardLayout({ children, searchQuery, setSearchQuery }: DashboardLayoutProps) {
  const navigate = useNavigate();
  const { user, logout } = useUser();
  const { settings } = useAccessibility();
  
  const [showNotifications, setShowNotifications] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      alert(`Searching for: "${searchQuery}". Results are shown below.`);
    }
  };

  const handleToggleNotifications = () => {
    setShowNotifications(!showNotifications);
  };

  return (
    <div className={`min-h-screen bg-gray-50 ${settings.highContrast ? 'high-contrast' : ''}`}>
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <GraduationCap className="h-8 w-8 text-blue-600" />
                <span className="text-2xl font-bold text-gray-900">EduNexus</span>
              </div>
              <div className="hidden md:flex items-center space-x-1">
                <Button variant="ghost" size="sm" onClick={() => navigate('/')}>
                  <Home className="h-4 w-4 mr-2" />
                  Home
                </Button>
                <Button variant="ghost" size="sm" onClick={() => navigate('/accessibility')}>
                  <Accessibility className="h-4 w-4 mr-2" />
                  Accessibility
                </Button>
              </div>
            </div>

            <form onSubmit={handleSearchSubmit} className="hidden md:flex flex-1 max-w-md mx-8">
              <div className="relative w-full">
                <Search className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search lessons, assignments, or resources..."
                  value={searchQuery}
                  onChange={handleSearchChange}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </form>

            <div className="flex items-center space-x-4">
              <div className="relative">
                <Button variant="ghost" size="sm" onClick={handleToggleNotifications}>
                  <Bell className="h-5 w-5" />
                </Button>
                {showNotifications && (
                  <div className="absolute right-0 mt-2 w-64 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                    <div className="p-4">
                      <h4 className="font-bold text-gray-800">Notifications</h4>
                      <ul className="mt-2 space-y-2 text-sm text-gray-600">
                        <li>You completed the "Photosynthesis" lesson. 🎉</li>
                        <li>New badge earned: "Quiz Master"! 🏆</li>
                        <li>Upcoming: Math Quiz due Friday. 🗓️</li>
                      </ul>
                    </div>
                  </div>
                )}
              </div>
              
              <div className="flex items-center space-x-3">
                {user?.avatar && (
                  <img 
                    src={user.avatar} 
                    alt={user.name}
                    className="w-8 h-8 rounded-full"
                  />
                )}
                <div className="hidden md:block">
                  <div className="text-sm font-medium text-gray-900">{user?.name}</div>
                  <div className="text-xs text-gray-500 capitalize">{user?.role}</div>
                </div>
              </div>

              <Button variant="ghost" size="sm" onClick={handleLogout}>
                <LogOut className="h-4 w-4" />
              </Button>
              
              <div className="hidden md:block text-sm text-gray-600">
                Welcome, {user?.name}
              </div>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>

      {(settings.textToSpeech || settings.highContrast || settings.dyslexiaFont) && (
        <div className="fixed bottom-4 right-4 bg-blue-600 text-white p-3 rounded-lg shadow-lg">
          <div className="text-xs font-medium mb-1">Active Accessibility:</div>
          <div className="text-xs space-y-1">
            {settings.textToSpeech && <div>• Text-to-Speech</div>}
            {settings.highContrast && <div>• High Contrast</div>}
            {settings.dyslexiaFont && <div>• Dyslexia Font</div>}
          </div>
        </div>
      )}
    </div>
  );
}

export default DashboardLayout;