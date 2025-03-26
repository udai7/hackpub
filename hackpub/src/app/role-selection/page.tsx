'use client';

import { useRouter } from 'next/navigation';
import { useAuth, useUser } from '@clerk/nextjs';
import { useState } from 'react';
import { UserRole } from '@/types';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function RoleSelectionPage() {
  const router = useRouter();
  const { isLoaded, isSignedIn, user } = useUser();
  const { signOut } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isLoaded) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (!isSignedIn) {
    router.push('/sign-in');
    return null;
  }

  const handleRoleSelection = async (role: UserRole) => {
    setIsSubmitting(true);
    try {
      // Store role in localStorage for now
      // In a real application, you would store this in your database
      localStorage.setItem(`user_${user.id}_role`, role);
      
      // Set public metadata for the user with their role
      await user.update({
        publicMetadata: {
          role: role
        }
      });

      toast.success(`You are now registered as a ${role}!`);
      
      // Redirect based on role
      setTimeout(() => {
        if (role === 'host') {
          router.push('/dashboard');
        } else {
          router.push('/hackathons');
        }
      }, 1500);
    } catch (error) {
      console.error('Error setting user role:', error);
      toast.error('Failed to set role. Please try again.');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="max-w-md w-full p-8 bg-white shadow-lg rounded-lg">
        <h1 className="text-3xl font-bold text-center text-indigo-600 mb-8">Welcome to HackPub!</h1>
        
        <p className="text-gray-700 text-center mb-6">
          Thanks for signing up, {user?.firstName || 'User'}! Please select your role:
        </p>
        
        <div className="space-y-4">
          <button
            onClick={() => handleRoleSelection('host')}
            disabled={isSubmitting}
            className="w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md transition-colors flex items-center justify-center space-x-2 disabled:opacity-60"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
            </svg>
            <span>I want to host hackathons</span>
          </button>
          
          <button
            onClick={() => handleRoleSelection('participant')}
            disabled={isSubmitting}
            className="w-full py-3 px-4 bg-white hover:bg-gray-50 text-indigo-600 border border-indigo-600 rounded-md transition-colors flex items-center justify-center space-x-2 disabled:opacity-60"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
            </svg>
            <span>I want to participate in hackathons</span>
          </button>
        </div>
        
        <div className="mt-8 text-center">
          <button
            onClick={() => signOut(() => router.push('/'))}
            className="text-gray-500 hover:text-gray-700 text-sm"
          >
            Sign out and choose different account
          </button>
        </div>
      </div>
    </div>
  );
} 