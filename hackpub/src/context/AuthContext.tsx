'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { toast } from 'react-toastify';

interface User {
  id: string;
  name: string;
  email: string;
  role: "host" | "participant";
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  signIn: (email: string) => Promise<void>;
  signUp: (email: string, password: string, name: string, role: "host" | "participant") => Promise<void>;
  signOut: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Check for existing user in localStorage
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoaded(true);
  }, []);

  const signIn = async (email: string) => {
    try {
      // In a real app, you would validate credentials against a backend
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        const userData = JSON.parse(storedUser);
        if (userData.email === email) {
          setUser(userData);
          toast.success('Signed in successfully');
        } else {
          throw new Error("Invalid credentials");
        }
      } else {
        throw new Error("User not found");
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to sign in');
      throw error;
    }
  };

  const signUp = async (email: string, password: string, name: string, role: "host" | "participant") => {
    try {
      // In a real app, you would create a user in your backend
      const newUser: User = {
        id: Math.random().toString(36).substr(2, 9),
        name,
        email,
        role,
      };
      localStorage.setItem("user", JSON.stringify(newUser));
      setUser(newUser);
      toast.success(`Signed up successfully as ${role}`);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to sign up');
      throw error;
    }
  };

  const signOut = () => {
    localStorage.removeItem("user");
    setUser(null);
    toast.info('Signed out successfully');
  };

  // Don't render until initial user state is loaded
  if (!isLoaded) {
    return null;
  }

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
} 