// src/App.js

import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import StudentDashboard from './pages/StudentDashboard';
import TeacherDashboard from './pages/TeacherDashboard';
import AccessibilityCenter from './pages/AccessibilityCenter';
import StudentLogin from './pages/StudentLogin';
import TeacherLogin from './pages/TeacherLogin';
import { AccessibilityProvider } from './contexts/AccessibilityContext';
import { UserProvider } from './contexts/UserContext';
import VerificationSuccess from './pages/VerificationSuccess'; 
import './i18n'; // <-- NEW: Import the i18n configuration here

function App() {
  return (
    <UserProvider>
      <AccessibilityProvider>
        <Router>
          <div className="min-h-screen bg-gray-50">
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/student-login" element={<StudentLogin />} />
              <Route path="/teacher-login" element={<TeacherLogin />} />
              <Route path="/student" element={<StudentDashboard />} />
              <Route path="/teacher" element={<TeacherDashboard />} />
              <Route path="/accessibility" element={<AccessibilityCenter />} />
              <Route path="/verification-success" element={<VerificationSuccess />} />
            </Routes>
          </div>
        </Router>
      </AccessibilityProvider>
    </UserProvider>
  );
}

export default App;