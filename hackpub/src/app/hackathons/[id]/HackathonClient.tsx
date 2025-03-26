'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { addUserParticipation, hasUserParticipated, removeUserParticipation } from '@/utils/localStorage';
import { Hackathon } from '@/types';
import { toast } from 'react-toastify';

interface HackathonClientProps {
  hackathon: Hackathon;
}

export default function HackathonClient({ hackathon }: HackathonClientProps) {
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();
  const [hasParticipated, setHasParticipated] = useState(false);

  useEffect(() => {
    // Check if user has participated in this hackathon
    if (isAuthenticated && user && hackathon) {
      const participated = hasUserParticipated(user.id, hackathon.id);
      setHasParticipated(participated);
    }
  }, [isAuthenticated, user, hackathon]);

  const handleParticipate = () => {
    if (!isAuthenticated) {
      // Redirect to home page to register/login
      router.push('/');
      return;
    }
    
    // Show success message
    toast.success('Redirecting to registration form...');
    
    // Open Google Form in a new tab
    window.open(hackathon.formLink, '_blank');
  };

  const toggleParticipation = () => {
    if (!isAuthenticated || !user || !hackathon) return;

    if (hasParticipated) {
      // Remove participation
      removeUserParticipation(user.id, hackathon.id);
      setHasParticipated(false);
      toast.info('Removed from your participated hackathons');
    } else {
      // Add participation
      addUserParticipation(user.id, hackathon.id);
      setHasParticipated(true);
      toast.success('Added to your participated hackathons');
    }
  };

  return (
    <div className="mt-6">
      {!isAuthenticated ? (
        <div className="space-y-4">
          <div className="bg-orange-50 border border-orange-100 rounded-lg p-4">
            <p className="text-orange-700">
              You need to register as a participant to join this hackathon.
            </p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => router.push('/')}
              className="inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
            >
              Register to Participate
            </button>
            <button
              onClick={() => router.push('/hackathons')}
              className="inline-flex items-center px-4 py-2 border border-gray-300 text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
            >
              Back to Hackathons
            </button>
          </div>
        </div>
      ) : (
        <div className="flex flex-wrap gap-3">
          <button
            onClick={handleParticipate}
            className="inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
          >
            Participate Now
          </button>
          
          <button
            onClick={toggleParticipation}
            className={`inline-flex items-center px-4 py-2 border text-base font-medium rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 ${
              hasParticipated 
                ? 'text-red-700 bg-red-100 border-red-300 hover:bg-red-200 focus:ring-red-500' 
                : 'text-green-700 bg-green-100 border-green-300 hover:bg-green-200 focus:ring-green-500'
            }`}
          >
            {hasParticipated ? 'Remove from Participated' : 'Mark as Participated'}
          </button>
          
          {user?.role === 'participant' && (
            <button
              onClick={() => router.push('/participant-dashboard')}
              className="inline-flex items-center px-4 py-2 border border-gray-300 text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
            >
              View My Hackathons
            </button>
          )}
        </div>
      )}
    </div>
  );
} 