'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { UserRole } from '@/types';

export default function LoginPage() {
  const router = useRouter();
  const { signIn } = useAuth();
  const [role, setRole] = useState<UserRole>('participant');
  const [loading, setLoading] = useState(false);

  const handleRoleChange = (newRole: UserRole) => {
    setRole(newRole);
  };

  const handleLogin = async () => {
    setLoading(true);
    try {
      // For demo purposes, we'll use a test email and password
      await signIn('test@example.com');
      router.push(role === 'host' ? '/dashboard' : '/hackathons');
    } catch (error) {
      console.error('Login error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Welcome to HackPub
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Choose your role to continue
          </p>
        </div>
        
        <div className="mt-8 space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <button
              type="button"
              className={`relative w-full py-6 px-4 border ${
                role === 'participant' 
                  ? 'border-orange-600 ring-2 ring-orange-600' 
                  : 'border-gray-300'
              } rounded-lg bg-white shadow-sm flex items-center justify-center hover:border-orange-500 focus:outline-none`}
              onClick={() => handleRoleChange('participant')}
            >
              <div className="text-center">
                <div className="text-lg font-medium text-gray-900">Participant</div>
                <div className="text-sm text-gray-500">Join hackathons</div>
              </div>
            </button>
            
            <button
              type="button"
              className={`relative w-full py-6 px-4 border ${
                role === 'host' 
                  ? 'border-orange-600 ring-2 ring-orange-600' 
                  : 'border-gray-300'
              } rounded-lg bg-white shadow-sm flex items-center justify-center hover:border-orange-500 focus:outline-none`}
              onClick={() => handleRoleChange('host')}
            >
              <div className="text-center">
                <div className="text-lg font-medium text-gray-900">Host</div>
                <div className="text-sm text-gray-500">Create hackathons</div>
              </div>
            </button>
          </div>
          
          <div>
            <button
              type="button"
              onClick={handleLogin}
              disabled={loading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 disabled:opacity-50"
            >
              {loading ? 'Signing in...' : `Continue as ${role === 'host' ? 'Host' : 'Participant'}`}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 