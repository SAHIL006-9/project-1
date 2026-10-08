'use client';

import { Suspense } from 'react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Hero } from '@/components/sections/Hero';
import { About } from '@/components/sections/About';
import { Experience } from '@/components/sections/Experience';
import { Projects } from '@/components/sections/Projects';
import { Credentials } from '@/components/sections/Credentials';
import { Contact } from '@/components/sections/Contact';
import { Card } from '@/components/ui/Card';

interface HomePageData {
  profile: {
    name: string;
    title: string;
    bio: string;
    avatar?: string;
    socialLinks: Array<{ platform: string; url: string; icon: string }>;
    email: string;
    phone?: string;
    location?: string;
  };
  about: {
    description: string;
    skills: Array<{ name: string; category: string; proficiency: number; icon?: string }>;
    interests: Array<{ name: string; icon?: string }>;
    stats: Array<{ label: string; value: string | number; icon?: string }>;
  };
  experiences: Array<any>;
  projects: Array<any>;
  credentials: Array<any>;
  certifications: Array<any>;
}

function SectionSkeleton({ title }: { title: string }) {
  return (
    <section className="section">
      <div className="container-custom">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="h-8 w-48 mx-auto bg-dark-200 dark:bg-dark-700 rounded animate-pulse mb-4" />
          <div className="h-4 w-64 mx-auto bg-dark-200 dark:bg-dark-700 rounded animate-pulse" />
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map(i => (
            <Card key={i} className="animate-pulse h-64" />
          ))}
        </div>
      </div>
    </section>
  );
}

export default function HomePage({ data }: { data: HomePageData }) {
  const { profile, about, experiences, projects, credentials, certifications } = data;

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <Hero
          name={profile.name}
          title={profile.title}
          bio={profile.bio}
          avatar={profile.avatar}
          socialLinks={profile.socialLinks}
        />
        
        <About
          description={about.description}
          skills={about.skills}
          interests={about.interests}
          stats={about.stats}
        />
        
        <Experience experiences={experiences} />
        
        <Projects projects={projects} />
        
        <Credentials credentials={credentials} certifications={certifications} />
        
        <Contact
          email={profile.email}
          phone={profile.phone}
          location={profile.location}
        />
      </main>
      <Footer />
    </div>
  );
}

export async function generateStaticParams() {
  return [];
}