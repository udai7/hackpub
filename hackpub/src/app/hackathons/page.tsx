'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { getHackathons } from '@/utils/localStorage';
import { Hackathon } from '@/types';
import Link from 'next/link';
import Image from 'next/image';

export default function HackathonsPage() {
  const { user, isAuthenticated } = useAuth();
  const [hackathons, setHackathons] = useState<Hackathon[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadHackathons = () => {
      const allHackathons = getHackathons();
      setHackathons(allHackathons);
      setLoading(false);
    };

    loadHackathons();
  }, []);

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
            Browse Hackathons
          </h2>
          <p className="mt-3 max-w-2xl mx-auto text-xl text-gray-500 sm:mt-4">
            Discover exciting hackathons and start building something amazing
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
            <p className="text-gray-500 text-lg">No hackathons found.</p>
            {isAuthenticated && user?.role === 'host' && (
              <Link
                href="/dashboard"
                className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
              >
                Create Your First Hackathon
              </Link>
            )}
          </div>
        )}
      </div>
    </div>
  );
} 