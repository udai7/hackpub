import { Hackathon, User } from '@/types';

// Keys for localStorage
const HACKATHONS_KEY = 'hackathons';
const CURRENT_USER_KEY = 'currentUser';
const USER_PARTICIPATIONS_KEY = 'userParticipations';

// Helper function to check if we're in a browser environment
const isBrowser = () => typeof window !== 'undefined';

// Get all hackathons from localStorage
export const getHackathons = (): Hackathon[] => {
  if (!isBrowser()) return [];
  
  const hackathonsJSON = localStorage.getItem(HACKATHONS_KEY);
  return hackathonsJSON ? JSON.parse(hackathonsJSON) : [];
};

// Get a specific hackathon by ID
export const getHackathonById = (id: string): Hackathon | null => {
  if (!isBrowser()) return null;
  
  const hackathons = getHackathons();
  return hackathons.find(h => h.id === id) || null;
};

// Add a new hackathon
export const addHackathon = (hackathon: Hackathon): void => {
  if (!isBrowser()) return;
  
  const hackathons = getHackathons();
  hackathons.push(hackathon);
  localStorage.setItem(HACKATHONS_KEY, JSON.stringify(hackathons));
};

// Update an existing hackathon
export const updateHackathon = (hackathon: Hackathon): void => {
  if (!isBrowser()) return;
  
  const hackathons = getHackathons();
  const index = hackathons.findIndex(h => h.id === hackathon.id);
  if (index !== -1) {
    hackathons[index] = hackathon;
    localStorage.setItem(HACKATHONS_KEY, JSON.stringify(hackathons));
  }
};

// Delete a hackathon
export const deleteHackathon = (id: string): void => {
  if (!isBrowser()) return;
  
  const hackathons = getHackathons();
  const filteredHackathons = hackathons.filter(h => h.id !== id);
  localStorage.setItem(HACKATHONS_KEY, JSON.stringify(filteredHackathons));
};

// Get current user from localStorage
export const getCurrentUser = (): User | null => {
  if (!isBrowser()) return null;
  
  const userJSON = localStorage.getItem(CURRENT_USER_KEY);
  return userJSON ? JSON.parse(userJSON) : null;
};

// Set current user in localStorage
export const setCurrentUser = (user: User | null): void => {
  if (!isBrowser()) return;
  
  if (user) {
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
  } else {
    localStorage.removeItem(CURRENT_USER_KEY);
  }
};

// Get user's participations
export const getUserParticipations = (userId: string): string[] => {
  if (!isBrowser()) return [];
  
  const participationsJSON = localStorage.getItem(USER_PARTICIPATIONS_KEY);
  const allParticipations = participationsJSON ? JSON.parse(participationsJSON) : {};
  return allParticipations[userId] || [];
};

// Add a hackathon to user's participations
export const addUserParticipation = (userId: string, hackathonId: string): void => {
  if (!isBrowser()) return;
  
  // Update user participations
  const participationsJSON = localStorage.getItem(USER_PARTICIPATIONS_KEY);
  const allParticipations = participationsJSON ? JSON.parse(participationsJSON) : {};
  const userParticipations = allParticipations[userId] || [];
  
  if (!userParticipations.includes(hackathonId)) {
    userParticipations.push(hackathonId);
    allParticipations[userId] = userParticipations;
    localStorage.setItem(USER_PARTICIPATIONS_KEY, JSON.stringify(allParticipations));
  }

  // Update hackathon's participants array
  const hackathon = getHackathonById(hackathonId);
  if (hackathon) {
    const user = getCurrentUser();
    if (user && !hackathon.participants?.some(p => p.id === userId)) {
      hackathon.participants = [...(hackathon.participants || []), user];
      updateHackathon(hackathon);
    }
  }
};

// Remove a hackathon from user's participations
export const removeUserParticipation = (userId: string, hackathonId: string): void => {
  if (!isBrowser()) return;
  
  const participationsJSON = localStorage.getItem(USER_PARTICIPATIONS_KEY);
  const allParticipations = participationsJSON ? JSON.parse(participationsJSON) : {};
  const userParticipations = allParticipations[userId] || [];
  
  const updatedParticipations = userParticipations.filter(id => id !== hackathonId);
  allParticipations[userId] = updatedParticipations;
  localStorage.setItem(USER_PARTICIPATIONS_KEY, JSON.stringify(allParticipations));
};

// Check if user has participated in a hackathon
export const hasUserParticipated = (userId: string, hackathonId: string): boolean => {
  if (!isBrowser()) return false;
  
  const participations = getUserParticipations(userId);
  return participations.includes(hackathonId);
}; 