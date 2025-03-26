'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Hackathon } from '@/types';

interface HackathonCardProps {
  hackathon: Hackathon;
}

export default function HackathonCard({ hackathon }: HackathonCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden transition-transform hover:scale-105">
      <div className="relative h-48 w-full">
        {hackathon.bannerUrl ? (
          <Image
            src={hackathon.bannerUrl}
            alt={hackathon.title}
            className="object-cover"
            fill
          />
        ) : (
          <div className="bg-gradient-to-r from-indigo-500 to-purple-600 h-full w-full flex items-center justify-center">
            <span className="text-white text-xl font-bold">{hackathon.title}</span>
          </div>
        )}
        <div className="absolute top-2 right-2 bg-indigo-600 text-white text-xs px-2 py-1 rounded-full">
          {hackathon.category}
        </div>
      </div>
      
      <div className="p-4">
        <h3 className="text-lg font-bold text-gray-900 mb-2">{hackathon.title}</h3>
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">{hackathon.description}</p>
        
        <Link
          href={`/hackathons/${hackathon.id}`}
          className="inline-block bg-indigo-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-indigo-700"
        >
          View Details
        </Link>
      </div>
    </div>
  );
} 