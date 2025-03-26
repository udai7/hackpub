import { Suspense } from 'react';
import Image from 'next/image';
import Footer from '@/components/Footer';
import { getHackathonById } from '@/utils/localStorage';
import { Hackathon } from '@/types';
import Link from 'next/link';
import HackathonClient from './HackathonClient';

interface PageProps {
  params: {
    id: string;
  };
}

export default function HackathonDetailPage({ params }: PageProps) {
  const hackathon = getHackathonById(params.id);

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
            
            <Suspense fallback={
              <div className="mt-6 flex justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-orange-500"></div>
              </div>
            }>
              <HackathonClient hackathon={hackathon} />
            </Suspense>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
} 