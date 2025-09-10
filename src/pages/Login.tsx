// src/pages/Login.tsx

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { GraduationCap, User, BookOpen, Mail, Lock, UserPlus, LogIn, Upload, Camera, CheckCircle, Link } from 'lucide-react';
import { useUser } from '../contexts/UserContext';
import Button from '../components/Button';
import Card from '../components/Card';

interface LoginProps {
  userType?: 'student' | 'teacher';
}

function Login({ userType }: LoginProps) {
  const navigate = useNavigate();
  const { login } = useUser();
  const [isSignup, setIsSignup] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: (userType || 'student') as 'student' | 'teacher',
    grade: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [photoPreview, setPhotoPreview] = useState('');
  const [photoFile, setPhotoFile] = useState<File | null>(null);

  const grades = [
    'Kindergarten', 'Grade 1', 'Grade 2', 'Grade 3', 'Grade 4', 'Grade 5',
    'Grade 6', 'Grade 7', 'Grade 8', 'Grade 9', 'Grade 10', 'Grade 11', 'Grade 12',
    'College Freshman', 'College Sophomore', 'College Junior', 'College Senior',
    'Graduate Student', 'Adult Learner'
  ];

  const teacherSubjects = [
    'Mathematics', 'Science', 'English', 'History', 'Geography', 'Physics',
    'Chemistry', 'Biology', 'Computer Science', 'Art', 'Music', 'Physical Education',
    'Foreign Languages', 'Social Studies', 'Elementary Education', 'Special Education'
  ];

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPhotoFile(file);
      setPhotoPreview(URL.createObjectURL(file));
    }
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isSignup) {
        // --- Signup Logic ---
        const dataToSend = new FormData();
        dataToSend.append('name', formData.name);
        dataToSend.append('email', formData.email);
        dataToSend.append('password', formData.password);
        dataToSend.append('role', formData.role);
        dataToSend.append('grade', formData.grade);
        if (photoFile) {
          dataToSend.append('photo', photoFile);
        }

        const response = await fetch('http://localhost:5000/api/auth/signup', {
          method: 'POST',
          body: dataToSend,
        });

        if (response.ok) {
          // Instead of just showing a success message, we'll immediately log them in
          // with the data they just provided.
          // This creates a smoother, more realistic demo flow.
          const mockUser = {
            id: 'demo-user-1', // Mock ID
            name: formData.name,
            email: formData.email,
            role: formData.role,
            grade: formData.grade,
            photo: photoPreview,
            isVerified: true
          };
          
          login(mockUser, 'demo-token');
          navigate(mockUser.role === 'student' ? '/student' : '/teacher');
        } else {
          const data = await response.json();
          setError(data.message || 'Registration failed. Please try again.');
        }

      } else {
        // --- Login Logic ---
        const response = await fetch('http://localhost:5000/api/auth/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: formData.email,
            password: formData.password,
            role: formData.role
          }),
        });

        const data = await response.json();

        if (response.ok) {
          login(data.user, data.token);
          navigate(data.user.role === 'student' ? '/student' : '/teacher');
        } else {
          setError(data.message || 'Login failed. Please try again.');
        }
      }
    } catch (err) {
      console.error(err);
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <GraduationCap className="h-10 w-10 text-blue-600" />
            <span className="text-3xl font-bold text-gray-900">EduNexus</span>
          </div>
          <h1 className="text-2xl font-semibold text-gray-900 mb-2">
            {userType === 'student' ? 'Student' : 'Teacher'} {isSignup ? 'Registration' : 'Login'}
          </h1>
          <p className="text-gray-600">
            {isSignup ? 'Create your account to get started' : 'Welcome back! Please sign in to continue'}
          </p>
        </div>

        <Card className="p-8">
          <form onSubmit={handleFormSubmit} className="space-y-6">
            {isSignup && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter your full name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Profile Photo (Optional)</label>
                  <div className="flex items-center space-x-4">
                    <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center overflow-hidden">
                      {photoPreview ? (
                        <img src={photoPreview} alt="Preview" className="w-full h-full object-cover" />
                      ) : (
                        <Camera className="h-6 w-6 text-gray-400" />
                      )}
                    </div>
                    <label className="cursor-pointer">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handlePhotoUpload}
                        className="hidden"
                      />
                      <div className="flex items-center px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors">
                        <Upload className="h-4 w-4 mr-2" />
                        Upload Photo
                      </div>
                    </label>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {userType === 'student' ? 'Grade Level' : 'Subject/Grade You Teach'}
                  </label>
                  <select
                    required
                    value={formData.grade}
                    onChange={(e) => setFormData({ ...formData, grade: e.target.value })}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Select {userType === 'student' ? 'your grade' : 'subject/grade'}</option>
                    {(userType === 'student' ? grades : teacherSubjects).map((option) => (
                      <option key={option} value={option}>{option}</option>
                    ))}
                  </select>
                </div>
              </>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter your email"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
              <input
                type="password"
                required
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter your password"
              />
            </div>

            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                {error}
              </div>
            )}
            
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Please wait...' : (isSignup ? 'Create Account' : 'Sign In')}
            </Button>

            <div className="text-center">
              <Button
                type="button"
                variant="ghost"
                onClick={() => {
                  setIsSignup(!isSignup);
                  setError('');
                }}
              >
                {isSignup ? 'Already have an account? Sign In' : 'Need an account? Sign Up'}
              </Button>
            </div>
          </form>
        </Card>

        <div className="text-center mt-6">
          <Button variant="ghost" onClick={() => navigate('/')}>
            ← Back to Home
          </Button>
        </div>
      </div>
    </div>
  );
}

export default Login;