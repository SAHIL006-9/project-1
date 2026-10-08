export interface Profile {
  name: string;
  title: string;
  bio: string;
  avatar?: string;
  resumeUrl?: string;
  socialLinks: SocialLink[];
  email: string;
  phone?: string;
  location?: string;
}

export interface SocialLink {
  platform: string;
  url: string;
  icon: string;
  order: number;
}

export interface About {
  description: string;
  skills: Skill[];
  interests: Interest[];
  stats: Stat[];
}

export interface Skill {
  _id?: string;
  name: string;
  category: 'frontend' | 'backend' | 'database' | 'devops' | 'tools' | 'other';
  proficiency: number;
  icon?: string;
  order: number;
}

export interface Interest {
  _id?: string;
  name: string;
  icon?: string;
  order: number;
}

export interface Stat {
  _id?: string;
  label: string;
  value: string | number;
  icon?: string;
  order: number;
}

export interface Experience {
  _id: string;
  company: string;
  role: string;
  period: string;
  startDate: string;
  endDate?: string;
  current: boolean;
  description: string[];
  technologies: string[];
  logo?: string;
  location?: string;
  type: 'full-time' | 'part-time' | 'contract' | 'internship' | 'freelance';
  order: number;
  createdAt: string;
  updatedAt: string;
}

export interface Project {
  _id: string;
  title: string;
  slug: string;
  description: string;
  shortDescription: string;
  images: string[];
  thumbnail: string;
  techStack: string[];
  liveUrl?: string;
  repoUrl?: string;
  featured: boolean;
  status: 'completed' | 'in-progress' | 'planned';
  startDate?: string;
  endDate?: string;
  highlights: string[];
  challenges?: string;
  solutions?: string;
  order: number;
  createdAt: string;
  updatedAt: string;
}

export interface Credential {
  _id: string;
  type: 'degree' | 'certification' | 'award' | 'license' | 'publication' | 'other';
  title: string;
  issuer: string;
  issueDate: string;
  expiryDate?: string;
  credentialUrl?: string;
  verificationUrl?: string;
  description?: string;
  skills?: string[];
  credentialId?: string;
  image?: string;
  order: number;
  createdAt: string;
  updatedAt: string;
}

export interface Certification {
  _id: string;
  name: string;
  issuer: string;
  issueDate: string;
  expiryDate?: string;
  credentialId: string;
  verificationUrl?: string;
  pdfUrl?: string;
  skills: string[];
  level: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  category: string;
  isActive: boolean;
  order: number;
  createdAt: string;
  updatedAt: string;
}

export interface User {
  _id: string;
  name: string;
  email: string;
  role: 'admin' | 'editor';
  avatar?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
  meta?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}