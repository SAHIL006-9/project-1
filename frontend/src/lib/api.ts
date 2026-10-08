import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import { getSession, signOut } from 'next-auth/react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

api.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    if (error.response?.status === 401) {
      if (typeof window !== 'undefined') {
        await signOut({ callbackUrl: '/admin/login' });
      }
    }
    return Promise.reject(error);
  }
);

export default api;

export const fetcher = async <T>(url: string): Promise<T> => {
  const response = await api.get<T>(url);
  return response.data.data;
};

export const apiEndpoints = {
  auth: {
    me: '/auth/me',
    login: '/auth/login',
    register: '/auth/register',
    logout: '/auth/logout',
    refresh: '/auth/refresh',
  },
  profile: {
    base: '/profile',
    avatar: '/profile/avatar',
    resume: '/profile/resume',
  },
  about: {
    base: '/about',
    skills: '/about/skills',
  },
  experience: {
    base: '/experience',
    reorder: '/experience/reorder',
  },
  projects: {
    base: '/projects',
    featured: '/projects/featured',
    techStack: '/projects/tech-stack',
    reorder: '/projects/reorder',
  },
  credentials: {
    base: '/credentials',
    reorder: '/credentials/reorder',
  },
  certifications: {
    base: '/certifications',
    active: '/certifications/active',
    reorder: '/certifications/reorder',
  },
  upload: {
    image: '/upload/image',
    images: '/upload/images',
    delete: '/upload/image',
  },
};