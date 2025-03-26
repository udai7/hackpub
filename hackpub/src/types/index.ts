export interface Hackathon {
  id: string;
  title: string;
  description: string;
  category: string;
  bannerUrl: string;
  formLink: string;
  createdAt: string;
  hostId: string;
  participants?: User[];
}

export type UserRole = 'host' | 'participant';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

export type HackathonCategory = 
  | 'Web Development'
  | 'Mobile App Development'
  | 'AI/ML'
  | 'Blockchain'
  | 'Game Development'
  | 'IoT'
  | 'Open Innovation'
  | 'Social Good'; 