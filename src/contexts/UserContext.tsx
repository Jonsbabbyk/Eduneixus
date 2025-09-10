import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';

// Define the User and Context types.
interface User {
  id: string;
  name: string;
  email: string;
  role: 'student' | 'teacher';
  grade?: string;
  photo?: string;
  isVerified?: boolean;
}

interface UserContextType {
  user: User | null;
  token: string | null;
  isAuthenticating: boolean; // Add a loading state for initial authentication check
  login: (userData: User, token: string) => void;
  logout: () => void;
}

// Create the context with a default value of undefined to force the useUser hook to be used within the provider.
const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isAuthenticating, setIsAuthenticating] = useState<boolean>(true); // Initial state is true

  // Use useEffect to check for an existing token on mount
  useEffect(() => {
    const storedToken = localStorage.getItem('edunexus_token');
    const storedUser = localStorage.getItem('edunexus_user');

    if (storedToken && storedUser) {
      try {
        const parsedUser: User = JSON.parse(storedUser);
        setUser(parsedUser);
        setToken(storedToken);
      } catch (error) {
        console.error("Failed to parse user data from localStorage", error);
        localStorage.clear();
      }
    }
    // Set authentication to false after the initial check
    setIsAuthenticating(false);
  }, []);

  const login = (userData: User, jwtToken: string) => {
    setUser(userData);
    setToken(jwtToken);
    localStorage.setItem('edunexus_user', JSON.stringify(userData));
    localStorage.setItem('edunexus_token', jwtToken);
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('edunexus_user');
    localStorage.removeItem('edunexus_token');
  };

  const value = {
    user,
    token,
    isAuthenticating,
    login,
    logout,
  };

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}