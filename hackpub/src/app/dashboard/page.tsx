'use client';

import { useState, useEffect, useRef, ChangeEvent } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Navbar } from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useAuth } from '@/context/AuthContext';
import { getHackathons, addHackathon } from '@/utils/localStorage';
import { Hackathon, HackathonCategory } from '@/types';
import { toast } from 'react-toastify';

export default function Dashboard() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();
  const [hackathons, setHackathons] = useState<Hackathon[]>([]);
  const [isCreating, setIsCreating] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Form states
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<string>('Web Development');
  const [formLink, setFormLink] = useState('');
  const [bannerUrl, setBannerUrl] = useState('');
  const [bannerFile, setBannerFile] = useState<File | null>(null);
  const [bannerPreview, setBannerPreview] = useState<string>('');
  
  const categories: string[] = [
    'Web Development', 
    'Mobile App Development', 
    'AI/ML', 
    'Blockchain', 
    'Game Development', 
    'IoT', 
    'Open Innovation', 
    'Social Good'
  ];

  useEffect(() => {
    if (!isAuthenticated || user?.role !== 'host') {
      router.push('/');
      return;
    }

    const loadHackathons = () => {
      const allHackathons = getHackathons();
      const hostHackathons = allHackathons.filter(h => h.hostId === user.id);
      setHackathons(hostHackathons);
    };

    loadHackathons();
  }, [isAuthenticated, user, router]);

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image size must be less than 5MB');
      return;
    }
    
    // Check file type
    if (!file.type.startsWith('image/')) {
      toast.error('File must be an image');
      return;
    }
    
    setBannerFile(file);
    
    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setBannerPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveImage = () => {
    setBannerFile(null);
    setBannerPreview('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title || !description || !formLink) {
      toast.error('Please fill in all required fields');
      return;
    }
    
    // Determine banner URL - use uploaded image if available, otherwise generate placeholder
    let finalBannerUrl = '';
    
    if (bannerFile) {
      // Use the image preview URL for the uploaded file
      finalBannerUrl = bannerPreview;
    } else {
      // Generate a placeholder
      finalBannerUrl = `/api/placeholder?seed=${Date.now()}&title=${encodeURIComponent(title)}`;
    }
    
    // Create new hackathon
    const newHackathon: Hackathon = {
      id: `hack_${Date.now()}`,
      title,
      description,
      category,
      bannerUrl: finalBannerUrl,
      formLink,
      createdAt: new Date().toISOString(),
      hostId: user?.id || '',
    };
    
    // Add to localStorage
    addHackathon(newHackathon);
    
    // Update local state
    setHackathons([...hackathons, newHackathon]);
    
    // Show success message
    toast.success('Hackathon created successfully!');
    
    // Reset form
    setTitle('');
    setDescription('');
    setCategory('Web Development');
    setFormLink('');
    setBannerUrl('');
    setBannerFile(null);
    setBannerPreview('');
    
    // Close form
    setIsCreating(false);
  };

  const handleDelete = (id: string) => {
    // In a real app, you would call an API to delete the hackathon
    const updatedHackathons = hackathons.filter(h => h.id !== id);
    setHackathons(updatedHackathons);
    toast.success('Hackathon deleted successfully');
  };

  if (!isAuthenticated || user?.role !== 'host') {
    return null;
  }

  return (
    <div className="bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">My Hackathons</h1>
          <button
            onClick={() => setIsCreating(true)}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
          >
            Create New Hackathon
          </button>
        </div>

        {isCreating && (
          <div className="bg-white shadow sm:rounded-lg mb-8">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900">Create New Hackathon</h3>
              
              <form onSubmit={handleSubmit} className="mt-5">
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <div className="col-span-2">
                    <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                      Title *
                    </label>
                    <input
                      type="text"
                      id="title"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 text-gray-900 focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
                      required
                    />
                  </div>
                  
                  <div className="col-span-2">
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                      Description *
                    </label>
                    <textarea
                      id="description"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      rows={3}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 text-gray-900 focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
                      required
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="category" className="block text-sm font-medium text-gray-700">
                      Category
                    </label>
                    <select
                      id="category"
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="mt-1 block w-full pl-3 pr-10 py-2 text-base text-gray-900 border-gray-300 focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm rounded-md"
                    >
                      {categories.map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Banner Image
                    </label>
                    <div className="mt-1 flex flex-col items-center">
                      {bannerPreview ? (
                        <div className="relative w-full h-40 mb-4">
                          <Image
                            src={bannerPreview}
                            alt="Banner preview"
                            fill
                            className="object-cover rounded-md"
                          />
                          <button
                            type="button"
                            onClick={handleRemoveImage}
                            className="absolute top-2 right-2 bg-red-600 text-white p-1 rounded-full"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                            </svg>
                          </button>
                        </div>
                      ) : (
                        <div 
                          className="flex justify-center items-center w-full h-40 border-2 border-dashed border-gray-300 bg-gray-50 rounded-md"
                          onClick={() => fileInputRef.current?.click()}
                        >
                          <div className="text-center">
                            <svg className="mx-auto h-12 w-12 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            <p className="mt-1 text-sm text-gray-600">
                              Click to upload a banner image
                            </p>
                            <p className="text-xs text-gray-500">
                              PNG, JPG, GIF up to 5MB
                            </p>
                          </div>
                        </div>
                      )}
                      <input
                        ref={fileInputRef}
                        type="file"
                        id="bannerFile"
                        onChange={handleImageChange}
                        accept="image/*"
                        className="hidden"
                      />
                    </div>
                  </div>
                  
                  <div className="col-span-2">
                    <label htmlFor="formLink" className="block text-sm font-medium text-gray-700">
                      Google Form Link *
                    </label>
                    <div className="mt-1 flex rounded-md shadow-sm">
                      <input
                        type="url"
                        id="formLink"
                        value={formLink}
                        onChange={(e) => setFormLink(e.target.value)}
                        className="flex-grow block w-full border border-gray-300 rounded-l-md shadow-sm py-2 px-3 text-gray-900 focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
                        placeholder="https://forms.google.com/..."
                        required
                      />
                      <a
                        href="https://docs.google.com/forms/u/0/create"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center px-3 py-2 border border-l-0 border-gray-300 rounded-r-md bg-gray-50 text-gray-500 hover:bg-gray-100 hover:text-gray-700"
                        title="Create a new Google Form"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                        </svg>
                      </a>
                    </div>
                    <p className="mt-1 text-sm text-gray-500 flex items-center">
                      <span>Link to the Google Form where participants will submit their applications</span>
                      <a 
                        href="https://docs.google.com/forms/u/0/create" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="ml-2 text-orange-600 hover:text-orange-500"
                      >
                        Create a new form
                      </a>
                    </p>
                  </div>
                </div>
                
                <div className="mt-5 flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => setIsCreating(false)}
                    className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-orange-600 hover:bg-orange-700 focus:outline-none"
                  >
                    Create
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
        
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6">
            <h2 className="text-lg font-medium text-gray-900">Your Hackathons</h2>
          </div>
          
          {hackathons.length === 0 ? (
            <div className="px-4 py-5 sm:p-6 text-center">
              <p className="text-gray-500">You haven't created any hackathons yet.</p>
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {hackathons.map((hackathon) => (
                <div
                  key={hackathon.id}
                  className="bg-white overflow-hidden shadow rounded-lg divide-y divide-gray-200"
                >
                  <div className="relative h-48">
                    <img
                      src={hackathon.bannerUrl}
                      alt={hackathon.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-2 right-2">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                        {hackathon.category}
                      </span>
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="text-lg font-medium text-gray-900">{hackathon.title}</h3>
                    <p className="mt-2 text-sm text-gray-500 line-clamp-2">{hackathon.description}</p>
                    <div className="mt-4 flex justify-between items-center">
                      <span className="text-sm text-gray-500">
                        Created {new Date(hackathon.createdAt).toLocaleDateString()}
                      </span>
                      <div className="flex space-x-2">
                        <Link
                          href={`/hackathons/${hackathon.id}`}
                          className="text-orange-600 hover:text-orange-900"
                        >
                          View
                        </Link>
                        <Link
                          href={`/dashboard/edit/${hackathon.id}`}
                          className="text-orange-600 hover:text-orange-900"
                        >
                          Edit
                        </Link>
                        <button
                          onClick={() => handleDelete(hackathon.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
} 