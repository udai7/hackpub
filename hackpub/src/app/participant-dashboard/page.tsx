'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { getHackathons } from '@/utils/localStorage';
import { Hackathon } from '@/types';
import Link from 'next/link';
import Image from 'next/image';

export default function ParticipantDashboard() {
  const { user, isAuthenticated } = useAuth();
  const [hackathons, setHackathons] = useState<Hackathon[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadHackathons = () => {
      const allHackathons = getHackathons();
      // Filter hackathons to only show ones where the user is a participant
      const participatedHackathons = allHackathons.filter(hackathon => 
        hackathon.participants?.some(participant => participant.id === user?.id)
      );
      setHackathons(participatedHackathons);
      setLoading(false);
    };

    if (isAuthenticated) {
      loadHackathons();
    }
  }, [isAuthenticated, user?.id]);

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900">Please sign in to access the dashboard</h1>
          <Link
            href="/sign-in"
            className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
          >
            Sign In
          </Link>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            My Participated Hackathons
          </h2>
          <p className="mt-3 max-w-2xl mx-auto text-xl text-gray-500 sm:mt-4">
            Track and manage your hackathon participations
          </p>
        </div>

        <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {hackathons.map((hackathon) => (
            <div
              key={hackathon.id}
              className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
            >
              <div className="relative h-48">
                <Image
                  src={hackathon.bannerUrl}
                  alt={hackathon.title}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-6">
                <div className="flex items-center justify-between">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-orange-100 text-orange-800">
                    {hackathon.category}
                  </span>
                  <span className="text-sm text-gray-500">
                    {new Date(hackathon.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <h3 className="mt-4 text-xl font-semibold text-gray-900">
                  {hackathon.title}
                </h3>
                <p className="mt-2 text-gray-600 line-clamp-2">
                  {hackathon.description}
                </p>
                <div className="mt-6">
                  <Link
                    href={`/hackathons/${hackathon.id}`}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        {hackathons.length === 0 && (
          <div className="text-center mt-12">
            <p className="text-gray-500 text-lg">You haven&apos;t participated in any hackathons yet.</p>
            <Link
              href="/hackathons"
              className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
            >
              Browse Hackathons
            </Link>
          </div>
        )}
      </div>
    </div>
  );
} 