import { z } from 'zod';

// User validators
export const registerSchema = z.object({
  body: z.object({
    email: z.string().email('Invalid email format'),
    password: z.string().min(8, 'Password must be at least 8 characters'),
    name: z.string().min(2, 'Name must be at least 2 characters').max(100),
  }),
});

export const loginSchema = z.object({
  body: z.object({
    email: z.string().email('Invalid email format'),
    password: z.string().min(1, 'Password is required'),
  }),
});

export const refreshTokenSchema = z.object({
  body: z.object({
    refreshToken: z.string().min(1, 'Refresh token is required'),
  }),
});

export const updateProfileSchema = z.object({
  body: z.object({
    name: z.string().min(2).max(100).optional(),
    avatar: z.string().url().optional().or(z.literal('')),
  }),
});

export const changePasswordSchema = z.object({
  body: z.object({
    currentPassword: z.string().min(1, 'Current password is required'),
    newPassword: z.string().min(8, 'New password must be at least 8 characters'),
  }),
});

// Profile validators
export const profileSchema = z.object({
  body: z.object({
    name: z.string().min(2, 'Name must be at least 2 characters').max(100),
    title: z.string().min(2, 'Title must be at least 2 characters').max(200),
    bio: z.string().min(10, 'Bio must be at least 10 characters').max(2000),
    email: z.string().email('Invalid email format'),
    phone: z.string().optional(),
    location: z.string().optional(),
    socialLinks: z.array(z.object({
      platform: z.string(),
      url: z.string().url('Invalid URL'),
      icon: z.string(),
      order: z.number().default(0),
    })).optional(),
  }),
});

// About validators
export const aboutSchema = z.object({
  body: z.object({
    description: z.string().min(10, 'Description must be at least 10 characters').max(5000),
    skills: z.array(z.object({
      name: z.string(),
      category: z.enum(['frontend', 'backend', 'database', 'devops', 'tools', 'other']),
      proficiency: z.number().min(1).max(100),
      icon: z.string().optional(),
      order: z.number().default(0),
    })).optional(),
    interests: z.array(z.object({
      name: z.string(),
      icon: z.string().optional(),
      order: z.number().default(0),
    })).optional(),
    stats: z.array(z.object({
      label: z.string(),
      value: z.union([z.string(), z.number()]),
      icon: z.string().optional(),
      order: z.number().default(0),
    })).optional(),
  }),
});

// Experience validators
export const experienceSchema = z.object({
  body: z.object({
    company: z.string().min(1, 'Company is required').max(100),
    role: z.string().min(1, 'Role is required').max(100),
    period: z.string().min(1, 'Period is required').max(50),
    startDate: z.string().datetime(),
    endDate: z.string().datetime().optional(),
    current: z.boolean().default(false),
    description: z.array(z.string()).optional(),
    technologies: z.array(z.string()).optional(),
    logo: z.string().url().optional().or(z.literal('')),
    location: z.string().optional(),
    type: z.enum(['full-time', 'part-time', 'contract', 'internship', 'freelance']).default('full-time'),
    order: z.number().default(0),
  }),
});

// Project validators
export const projectSchema = z.object({
  body: z.object({
    title: z.string().min(1, 'Title is required').max(100),
    slug: z.string().min(1, 'Slug is required').max(100).regex(/^[a-z0-9-]+$/),
    description: z.string().min(10, 'Description must be at least 10 characters'),
    shortDescription: z.string().min(10).max(300),
    images: z.array(z.string().url()).optional(),
    thumbnail: z.string().url('Thumbnail must be a valid URL'),
    techStack: z.array(z.string()).optional(),
    liveUrl: z.string().url().optional().or(z.literal('')),
    repoUrl: z.string().url().optional().or(z.literal('')),
    featured: z.boolean().default(false),
    status: z.enum(['completed', 'in-progress', 'planned']).default('completed'),
    startDate: z.string().datetime().optional(),
    endDate: z.string().datetime().optional(),
    highlights: z.array(z.string()).optional(),
    challenges: z.string().optional(),
    solutions: z.string().optional(),
    order: z.number().default(0),
  }),
});

// Credential validators
export const credentialSchema = z.object({
  body: z.object({
    type: z.enum(['degree', 'certification', 'award', 'license', 'publication', 'other']),
    title: z.string().min(1, 'Title is required').max(200),
    issuer: z.string().min(1, 'Issuer is required').max(200),
    issueDate: z.string().datetime(),
    expiryDate: z.string().datetime().optional(),
    credentialUrl: z.string().url().optional().or(z.literal('')),
    verificationUrl: z.string().url().optional().or(z.literal('')),
    description: z.string().optional(),
    skills: z.array(z.string()).optional(),
    credentialId: z.string().optional(),
    image: z.string().url().optional().or(z.literal('')),
    order: z.number().default(0),
  }),
});

// Certification validators
export const certificationSchema = z.object({
  body: z.object({
    name: z.string().min(1, 'Name is required').max(200),
    issuer: z.string().min(1, 'Issuer is required').max(200),
    issueDate: z.string().datetime(),
    expiryDate: z.string().datetime().optional(),
    credentialId: z.string().min(1, 'Credential ID is required').max(100),
    verificationUrl: z.string().url().optional().or(z.literal('')),
    pdfUrl: z.string().url().optional().or(z.literal('')),
    skills: z.array(z.string()).optional(),
    level: z.enum(['beginner', 'intermediate', 'advanced', 'expert']).default('intermediate'),
    category: z.string().min(1, 'Category is required').max(100),
    isActive: z.boolean().default(true),
    order: z.number().default(0),
  }),
});

// Query validators
export const paginationSchema = z.object({
  query: z.object({
    page: z.coerce.number().min(1).default(1),
    limit: z.coerce.number().min(1).max(100).default(10),
    sort: z.string().optional(),
    order: z.enum(['asc', 'desc']).default('desc'),
    search: z.string().optional(),
  }),
});

export const idParamSchema = z.object({
  params: z.object({
    id: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid ID format'),
  }),
});

export const slugParamSchema = z.object({
  params: z.object({
    slug: z.string().min(1),
  }),
});