'use client';

import { useEffect, ReactNode } from 'react';
import { AuthProvider } from '@/context/AuthContext';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface InitialDataLoaderProps {
  children: ReactNode;
}

export function InitialDataLoader({ children }: InitialDataLoaderProps) {
  useEffect(() => {
    // Check if we have any hackathons in localStorage
    const existingHackathons = localStorage.getItem('hackathons');
    if (!existingHackathons) {
      // Initialize with sample hackathons
      const sampleHackathons = [
        {
          id: '1',
          title: 'AI Innovation Challenge',
          description: 'Build the next generation of AI applications',
          category: 'Artificial Intelligence',
          bannerUrl: 'https://images.unsplash.com/photo-1677442136019-21780ecad995',
          formLink: 'https://forms.google.com/sample1',
          createdAt: new Date().toISOString(),
          hostId: 'host_1',
        },
        {
          id: '2',
          title: 'Web3 Development Hackathon',
          description: 'Create decentralized applications for the future',
          category: 'Blockchain',
          bannerUrl: 'https://images.unsplash.com/photo-1620321023374-d1a68fbc720d',
          formLink: 'https://forms.google.com/sample2',
          createdAt: new Date().toISOString(),
          hostId: 'host_2',
        },
        {
          id: '3',
          title: 'Sustainable Tech Solutions',
          description: 'Develop eco-friendly technology solutions',
          category: 'Sustainability',
          bannerUrl: 'https://images.unsplash.com/photo-1497435334941-8c899ee9e8e9',
          formLink: 'https://forms.google.com/sample3',
          createdAt: new Date().toISOString(),
          hostId: 'host_3',
        },
      ];
      localStorage.setItem('hackathons', JSON.stringify(sampleHackathons));
    }
  }, []);

  return (
    <AuthProvider>
      {children}
      <ToastContainer position="top-right" />
    </AuthProvider>
  );
} 