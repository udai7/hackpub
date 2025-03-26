import { Hackathon, User } from '@/types';

// Keys for localStorage
const HACKATHONS_KEY = 'hackathons';
const CURRENT_USER_KEY = 'currentUser';
const USER_PARTICIPATIONS_KEY = 'userParticipations';

// Get all hackathons from localStorage
export const getHackathons = (): Hackathon[] => {
  if (typeof window === 'undefined') return [];
  
  const hackathonsJSON = localStorage.getItem(HACKATHONS_KEY);
  return hackathonsJSON ? JSON.parse(hackathonsJSON) : [];
};

// Get a specific hackathon by ID
export const getHackathonById = (id: string): Hackathon | null => {
  const hackathons = getHackathons();
  return hackathons.find(h => h.id === id) || null;
};

// Add a new hackathon
export const addHackathon = (hackathon: Hackathon): void => {
  if (typeof window === 'undefined') return;
  
  const hackathons = getHackathons();
  hackathons.push(hackathon);
  localStorage.setItem(HACKATHONS_KEY, JSON.stringify(hackathons));
};

// Update an existing hackathon
export const updateHackathon = (hackathon: Hackathon): void => {
  if (typeof window === 'undefined') return;
  
  const hackathons = getHackathons();
  const index = hackathons.findIndex(h => h.id === hackathon.id);
  if (index !== -1) {
    hackathons[index] = hackathon;
    localStorage.setItem(HACKATHONS_KEY, JSON.stringify(hackathons));
  }
};

// Save current user to localStorage
export const saveCurrentUser = (user: User): void => {
  if (typeof window === 'undefined') return;
  
  localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
};

// Get current user from localStorage
export const getCurrentUser = (): User | null => {
  if (typeof window === 'undefined') return null;
  
  const userJSON = localStorage.getItem(CURRENT_USER_KEY);
  return userJSON ? JSON.parse(userJSON) : null;
};

// Clear current user from localStorage
export const clearCurrentUser = (): void => {
  if (typeof window === 'undefined') return;
  
  localStorage.removeItem(CURRENT_USER_KEY);
};

// Get participations for current user
export const getUserParticipations = (userId: string): string[] => {
  if (typeof window === 'undefined') return [];
  
  const participationsJSON = localStorage.getItem(USER_PARTICIPATIONS_KEY);
  const allParticipations = participationsJSON ? JSON.parse(participationsJSON) : {};
  
  return allParticipations[userId] || [];
};

// Add a hackathon to user's participations
export const addUserParticipation = (userId: string, hackathonId: string): void => {
  if (typeof window === 'undefined') return;
  
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
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    if (user && !hackathon.participants?.some(p => p.id === userId)) {
      hackathon.participants = [...(hackathon.participants || []), user];
      updateHackathon(hackathon);
    }
  }
};

// Remove a hackathon from user's participations
export const removeUserParticipation = (userId: string, hackathonId: string): void => {
  if (typeof window === 'undefined') return;
  
  // Update user participations
  const participationsJSON = localStorage.getItem(USER_PARTICIPATIONS_KEY);
  const allParticipations = participationsJSON ? JSON.parse(participationsJSON) : {};
  const userParticipations = allParticipations[userId] || [];
  
  const index = userParticipations.indexOf(hackathonId);
  if (index !== -1) {
    userParticipations.splice(index, 1);
    allParticipations[userId] = userParticipations;
    localStorage.setItem(USER_PARTICIPATIONS_KEY, JSON.stringify(allParticipations));
  }

  // Update hackathon's participants array
  const hackathon = getHackathonById(hackathonId);
  if (hackathon) {
    hackathon.participants = hackathon.participants?.filter(p => p.id !== userId) || [];
    updateHackathon(hackathon);
  }
};

// Check if user has participated in a hackathon
export const hasUserParticipated = (userId: string, hackathonId: string): boolean => {
  if (typeof window === 'undefined') return false;
  
  const participations = getUserParticipations(userId);
  return participations.includes(hackathonId);
}; 