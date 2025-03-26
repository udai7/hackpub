'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Footer from '@/components/Footer';
import { getHackathonById } from '@/utils/localStorage';
import { useAuth } from '@/context/AuthContext';
import { addUserParticipation, hasUserParticipated, removeUserParticipation } from '@/utils/localStorage';
import { Hackathon } from '@/types';
import { toast } from 'react-toastify';
import Link from 'next/link';

type PageProps = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default function HackathonDetailPage({ params }: PageProps) {
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();
  const [hackathon, setHackathon] = useState<Hackathon | null>(null);
  const [loading, setLoading] = useState(true);
  const [hasParticipated, setHasParticipated] = useState(false);

  useEffect(() => {
    const fetchHackathon = async () => {
      try {
        const resolvedParams = await params;
        const id = resolvedParams?.id || '';
        const foundHackathon = getHackathonById(id);
        
        if (foundHackathon) {
          setHackathon(foundHackathon);
        }
      } catch (error) {
        console.error('Error fetching hackathon:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchHackathon();
  }, [params]);

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
    
    if (hackathon) {
      // Show success message
      toast.success('Redirecting to registration form...');
      
      // Open Google Form in a new tab
      window.open(hackathon.formLink, '_blank');
    }
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8 flex justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!hackathon) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8 flex flex-col items-center">
          <h1 className="text-2xl font-bold text-gray-900">Hackathon not found</h1>
          <p className="mt-2 text-gray-600">The hackathon you&apos;re looking for doesn&apos;t exist.</p>
          <Link
            href="/hackathons"
            className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
          >
            Browse Hackathons
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow overflow-hidden rounded-lg">
          <div className="relative h-64 sm:h-80 w-full">
            {hackathon.bannerUrl ? (
              <Image
                src={hackathon.bannerUrl}
                alt={hackathon.title}
                className="object-cover"
                fill
              />
            ) : (
              <div className="bg-black h-full w-full flex items-center justify-center">
                <span className="text-white text-2xl font-bold">{hackathon.title}</span>
              </div>
            )}
            <div className="absolute top-4 right-4 bg-orange-600 text-white px-3 py-1 rounded-full">
              {hackathon.category}
            </div>
          </div>
          
          <div className="px-4 py-5 sm:px-6">
            <h1 className="text-2xl font-bold text-gray-900">{hackathon.title}</h1>
            <p className="mt-1 text-sm text-gray-500">
              Posted on {new Date(hackathon.createdAt).toLocaleDateString()}
            </p>
          </div>
          
          <div className="px-4 py-5 sm:p-6">
            <div className="prose max-w-none">
              <p className="text-gray-700">{hackathon.description}</p>
            </div>
            
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
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
} 