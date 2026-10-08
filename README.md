# Portfolio Website

A modern, full-stack portfolio website with a powerful admin panel to manage all your content.

## Features

- **Modern Design**: Clean, responsive design with dark mode support and smooth animations
- **Admin Panel**: Secure JWT-based authentication with role-based access control
- **Content Management**: Manage profile, about, experience, projects, credentials, and certifications
- **Image Upload**: Cloudinary integration for optimized image delivery
- **Full-Stack**: Next.js 14 frontend + Express.js backend + MongoDB
- **TypeScript**: Full type safety across the entire stack

## Tech Stack

### Frontend
- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- Framer Motion (animations)
- TanStack Query (data fetching)
- React Hook Form + Zod (forms & validation)
- Lucide React (icons)

### Backend
- Express.js
- TypeScript
- MongoDB + Mongoose
- JWT Authentication (access + refresh tokens)
- Cloudinary (image storage)
- Zod (validation)

### Deployment
- Frontend: Vercel
- Backend: Railway/Render
- Database: MongoDB Atlas
- Images: Cloudinary

## Project Structure

```
portfolio-website/
├── frontend/                 # Next.js 14 application
│   ├── src/
│   │   ├── app/             # App Router pages
│   │   │   ├── (public)/    # Public pages
│   │   │   ├── admin/       # Admin panel pages
│   │   │   └── api/         # API routes (proxy to backend)
│   │   ├── components/      # Reusable UI components
│   │   ├── lib/             # Utilities, API client
│   │   ├── hooks/           # Custom React hooks
│   │   ├── types/           # TypeScript types
│   │   └── context/         # React context providers
│   └── public/              # Static assets
├── backend/                  # Express.js API
│   ├── src/
│   │   ├── config/          # Configuration
│   │   ├── controllers/     # Route handlers
│   │   ├── middleware/      # Express middleware
│   │   ├── models/          # Mongoose models
│   │   ├── routes/          # API routes
│   │   ├── utils/           # Utilities
│   │   └── validators/      # Zod validation schemas
│   └── dist/                # Compiled output
├── docker-compose.yml        # Local development
└── README.md
```

## Getting Started

### Prerequisites
- Node.js 20+
- MongoDB (local or Atlas)
- Cloudinary account (for image uploads)

### Local Development

1. **Clone and install dependencies**
```bash
# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
```

2. **Configure environment variables**

Backend (`backend/.env`):
```env
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
MONGODB_URI=mongodb://localhost:27017/portfolio
JWT_SECRET=your-super-secret-jwt-key-min-32-chars
JWT_REFRESH_SECRET=your-super-secret-refresh-key-min-32-chars
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
```

Frontend (`frontend/.env.local`):
```env
NEXT_PUBLIC_API_URL=http://localhost:5000
```

3. **Start development servers**

Using Docker Compose (recommended):
```bash
docker-compose up -d
```

Or manually:
```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend
cd frontend
npm run dev
```

4. **Access the application**
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000
- Admin Panel: http://localhost:3000/admin/login

### Creating an Admin User

```bash
cd backend
npm run dev
# Then use the /api/auth/register endpoint or create directly in MongoDB
```

## Admin Panel Features

- **Dashboard**: Overview stats and quick actions
- **Profile**: Manage name, title, bio, avatar, resume, social links
- **About**: Description, skills (categorized), interests, stats
- **Experience**: Full CRUD with drag-and-drop reordering
- **Projects**: Full CRUD with featured status, tech stack filtering, image galleries
- **Credentials**: Degrees, certifications, awards, licenses, publications
- **Certifications**: Professional certifications with levels and categories
- **Settings**: Theme, notifications, account management

## Deployment

### Frontend (Vercel)
1. Connect your repository to Vercel
2. Add environment variables
3. Deploy

### Backend (Railway/Render)
1. Connect your repository
2. Add environment variables
3. Set build command: `npm run build`
4. Set start command: `npm start`
5. Deploy

### Database (MongoDB Atlas)
1. Create a free cluster
2. Add connection string to backend env
3. Whitelist deployment IPs

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new admin
- `POST /api/auth/login` - Login
- `POST /api/auth/refresh` - Refresh access token
- `POST /api/auth/logout` - Logout
- `GET /api/auth/me` - Get current user

### Profile
- `GET /api/profile` - Get profile
- `PUT /api/profile` - Update profile
- `POST /api/profile/avatar` - Upload avatar
- `POST /api/profile/resume` - Upload resume

### About
- `GET /api/about` - Get about data
- `PUT /api/about` - Update about
- `POST /api/about/skills` - Add skill
- `PUT /api/about/skills/:id` - Update skill
- `DELETE /api/about/skills/:id` - Delete skill

### Experience
- `GET /api/experience` - List experiences
- `GET /api/experience/:id` - Get experience
- `POST /api/experience` - Create experience
- `PUT /api/experience/:id` - Update experience
- `DELETE /api/experience/:id` - Delete experience
- `PUT /api/experience/reorder` - Reorder experiences

### Projects
- `GET /api/projects` - List projects (paginated, filterable)
- `GET /api/projects/featured` - Get featured projects
- `GET /api/projects/tech-stack` - Get all tech stack
- `GET /api/projects/slug/:slug` - Get project by slug
- `GET /api/projects/:id` - Get project by ID
- `POST /api/projects` - Create project
- `PUT /api/projects/:id` - Update project
- `DELETE /api/projects/:id` - Delete project
- `PUT /api/projects/reorder` - Reorder projects

### Credentials
- `GET /api/credentials` - List credentials
- `GET /api/credentials/:id` - Get credential
- `POST /api/credentials` - Create credential
- `PUT /api/credentials/:id` - Update credential
- `DELETE /api/credentials/:id` - Delete credential
- `PUT /api/credentials/reorder` - Reorder credentials

### Certifications
- `GET /api/certifications` - List certifications
- `GET /api/certifications/active` - Get active certifications
- `GET /api/certifications/:id` - Get certification
- `POST /api/certifications` - Create certification
- `PUT /api/certifications/:id` - Update certification
- `DELETE /api/certifications/:id` - Delete certification
- `PUT /api/certifications/reorder` - Reorder certifications

### Upload
- `POST /api/upload/image` - Upload single image
- `POST /api/upload/images` - Upload multiple images
- `DELETE /api/upload/image` - Delete image

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and linting
5. Submit a pull request

## License

MIT License - feel free to use this for your own portfolio!