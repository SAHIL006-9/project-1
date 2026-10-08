'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ScrollReveal, StaggerContainer, StaggerItem } from '@/components/ui/motion';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { cn } from '@/lib/utils';
import { Github, ExternalLink, X, ChevronLeft, ChevronRight, Star, Code, Database, Server, Globe } from 'lucide-react';

interface Project {
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
}

interface ProjectsProps {
  projects: Project[];
}

const statusConfig = {
  completed: { label: 'Completed', color: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300', icon: '✓' },
  'in-progress': { label: 'In Progress', color: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300', icon: '⟳' },
  planned: { label: 'Planned', color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300', icon: '★' },
};

export function Projects({ projects }: ProjectsProps) {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [activeFilter, setActiveFilter] = useState<string>('all');
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const allTechStack = useMemo(() => {
    const tech = new Set<string>();
    projects.forEach(p => p.techStack.forEach(t => tech.add(t)));
    return Array.from(tech).sort();
  }, [projects]);

  const filteredProjects = useMemo(() => {
    if (activeFilter === 'all') return projects;
    return projects.filter(p => p.techStack.includes(activeFilter));
  }, [projects, activeFilter]);

  const featuredProjects = projects.filter(p => p.featured).slice(0, 3);

  const openModal = (project: Project) => {
    setSelectedProject(project);
    setCurrentImageIndex(0);
  };

  const closeModal = () => {
    setSelectedProject(null);
  };

  return (
    <section id="projects" className="section bg-white dark:bg-dark-950">
      <div className="container-custom">
        <ScrollReveal>
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="section-title">Projects</h2>
            <p className="section-subtitle mx-auto mb-8">
              A collection of my work showcasing problem-solving and technical expertise.
            </p>
            
            <div className="flex flex-wrap justify-center gap-2">
              <Button
                variant={activeFilter === 'all' ? 'primary' : 'outline'}
                size="sm"
                onClick={() => setActiveFilter('all')}
              >
                All
              </Button>
              {allTechStack.slice(0, 8).map((tech) => (
                <Button
                  key={tech}
                  variant={activeFilter === tech ? 'primary' : 'outline'}
                  size="sm"
                  onClick={() => setActiveFilter(tech)}
                >
                  {tech}
                </Button>
              ))}
            </div>
          </div>
        </ScrollReveal>

        {featuredProjects.length > 0 && (
          <ScrollReveal className="mb-16">
            <h3 className="text-xl font-bold text-dark-900 dark:text-white mb-6">Featured Projects</h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredProjects.map((project, index) => (
                <StaggerItem key={project._id} className="group">
                  <ProjectCard project={project} onClick={openModal} featured />
                </StaggerItem>
              ))}
            </div>
          </ScrollReveal>
        )}

        <ScrollReveal>
          <h3 className="text-xl font-bold text-dark-900 dark:text-white mb-6">All Projects</h3>
        </ScrollReveal>

        <ScrollReveal>
          <StaggerContainer>
            {filteredProjects.map((project) => (
              <StaggerItem key={project._id}>
                <ProjectCard project={project} onClick={openModal} />
              </StaggerItem>
            ))}
          </StaggerContainer>
        </ScrollReveal>

        {filteredProjects.length === 0 && (
          <ScrollReveal>
            <div className="text-center py-16">
              <Code className="w-16 h-16 mx-auto text-dark-300 dark:text-dark-700 mb-4" />
              <p className="text-dark-600 dark:text-dark-400">
                No projects found matching "{activeFilter}"
              </p>
            </div>
          </ScrollReveal>
        )}

        <Modal
          isOpen={!!selectedProject}
          onClose={closeModal}
          size="xl"
          title={selectedProject?.title}
        >
          {selectedProject && (
            <ProjectModal
              project={selectedProject}
              currentImageIndex={currentImageIndex}
              setCurrentImageIndex={setCurrentImageIndex}
              onClose={closeModal}
            />
          )}
        </Modal>
      </div>
    </section>
  );
}

function ProjectCard({ project, onClick, featured = false }: { project: Project; onClick: () => void; featured?: boolean }) {
  const config = statusConfig[project.status];

  return (
    <Card
      className="group cursor-pointer h-full overflow-hidden"
      onClick={onClick}
      hover
      padding="none"
    >
      <div className="relative aspect-video overflow-hidden">
        <img
          src={project.thumbnail}
          alt={project.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
        <div className="absolute top-3 right-3 flex gap-2">
          <span className={cn('px-2 py-1 rounded-full text-xs font-medium', config.color)}>
            {config.label}
          </span>
          {project.featured && (
            <span className="px-2 py-1 rounded-full bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300 text-xs font-medium flex items-center gap-1">
              <Star className="w-3 h-3" />
              Featured
            </span>
          )}
        </div>
      </div>
      <div className="p-6">
        <h3 className="text-xl font-bold text-dark-900 dark:text-white mb-2 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
          {project.title}
        </h3>
        <p className="text-dark-600 dark:text-dark-400 mb-4 line-clamp-2">{project.shortDescription}</p>
        <div className="flex flex-wrap gap-2 mb-4">
          {project.techStack.slice(0, 5).map((tech) => (
            <Badge key={tech} variant="default" size="sm" className="bg-dark-100 text-dark-700 dark:bg-dark-800 dark:text-dark-300">
              {tech}
            </Badge>
          ))}
          {project.techStack.length > 5 && (
            <Badge variant="default" size="sm" className="bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-300">
              +{project.techStack.length - 5}
            </Badge>
          )}
        </div>
        <div className="flex items-center gap-3 pt-4 border-t border-dark-200 dark:border-dark-800">
          {project.liveUrl && (
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-sm text-dark-600 dark:text-dark-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
              onClick={(e) => e.stopPropagation()}
            >
              <ExternalLink className="w-4 h-4" />
              Live
            </a>
          )}
          {project.repoUrl && (
            <a
              href={project.repoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-sm text-dark-600 dark:text-dark-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
              onClick={(e) => e.stopPropagation()}
            >
              <Github className="w-4 h-4" />
              Code
            </a>
          )}
        </div>
      </div>
    </Card>
  );
}

function ProjectModal({
  project,
  currentImageIndex,
  setCurrentImageIndex,
  onClose,
}: {
  project: Project;
  currentImageIndex: number;
  setCurrentImageIndex: (index: number) => void;
  onClose: () => void;
}) {
  const config = statusConfig[project.status];
  const images = project.images.length > 0 ? project.images : [project.thumbnail];

  return (
    <div className="max-h-[90vh] overflow-y-auto">
      <div className="relative aspect-video rounded-xl overflow-hidden mb-6">
        <AnimatePresence mode="wait">
          <motion.img
            key={currentImageIndex}
            src={images[currentImageIndex]}
            alt={`${project.title} - screenshot ${currentImageIndex + 1}`}
            className="w-full h-full object-cover"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            transition={{ duration: 0.3 }}
          />
        </AnimatePresence>
        
        {images.length > 1 && (
          <>
            <button
              onClick={() => setCurrentImageIndex((currentImageIndex - 1 + images.length) % images.length)}
              className="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/90 dark:bg-dark-900/90 backdrop-blur shadow-lg hover:bg-white dark:hover:bg-dark-800 transition-colors"
              aria-label="Previous image"
            >
              <ChevronLeft className="w-5 h-5 text-dark-700 dark:text-dark-300" />
            </button>
            <button
              onClick={() => setCurrentImageIndex((currentImageIndex + 1) % images.length)}
              className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/90 dark:bg-dark-900/90 backdrop-blur shadow-lg hover:bg-white dark:hover:bg-dark-800 transition-colors"
              aria-label="Next image"
            >
              <ChevronRight className="w-5 h-5 text-dark-700 dark:text-dark-300" />
            </button>
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1">
              {images.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentImageIndex(i)}
                  className={cn(
                    'w-2 h-2 rounded-full transition-all',
                    i === currentImageIndex
                      ? 'bg-white w-6'
                      : 'bg-white/50 hover:bg-white/75'
                  )}
                  aria-label={`Go to image ${i + 1}`}
                />
              ))}
            </div>
          </>
        )}
      </div>

      <div className="flex items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-2">
          <span className={cn('px-3 py-1 rounded-full text-sm font-medium', config.color)}>
            {config.icon} {config.label}
          </span>
        </div>
      </div>

      <div className="prose prose-dark dark:prose-invert max-w-none mb-6">
        <p className="text-dark-600 dark:text-dark-300 leading-relaxed whitespace-pre-wrap">{project.description}</p>
      </div>

      {project.highlights.length > 0 && (
        <div className="mb-6">
          <h4 className="text-lg font-semibold text-dark-900 dark:text-white mb-3">Highlights</h4>
          <ul className="space-y-2">
            {project.highlights.map((highlight, i) => (
              <li key={i} className="flex items-start gap-2 text-dark-600 dark:text-dark-400">
                <span className="w-1.5 h-1.5 rounded-full bg-primary-500 mt-2 flex-shrink-0" />
                {highlight}
              </li>
            ))}
          </ul>
        </div>
      )}

      {(project.challenges || project.solutions) && (
        <div className="grid md:grid-cols-2 gap-6 mb-6">
          {project.challenges && (
            <div className="p-4 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
              <h4 className="font-semibold text-red-700 dark:text-red-300 mb-2 flex items-center gap-2">
                <Code className="w-4 h-4" /> Challenges
              </h4>
              <p className="text-red-600 dark:text-red-400 whitespace-pre-wrap">{project.challenges}</p>
            </div>
          )}
          {project.solutions && (
            <div className="p-4 rounded-xl bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800">
              <h4 className="font-semibold text-green-700 dark:text-green-300 mb-2 flex items-center gap-2">
                <Server className="w-4 h-4" /> Solutions
              </h4>
              <p className="text-green-600 dark:text-green-400 whitespace-pre-wrap">{project.solutions}</p>
            </div>
          )}
        </div>
      )}

      <div className="flex flex-wrap items-center gap-4 pt-6 border-t border-dark-200 dark:border-dark-800">
        <div className="flex flex-wrap gap-2">
          {project.techStack.map((tech) => (
            <Badge key={tech} variant="default" size="sm" className="bg-dark-100 text-dark-700 dark:bg-dark-800 dark:text-dark-300">
              {tech}
            </Badge>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-4 mt-6 pt-6 border-t border-dark-200 dark:border-dark-800">
        {project.liveUrl && (
          <a
            href={project.liveUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary"
            onClick={(e) => e.stopPropagation()}
          >
            <Globe className="w-4 h-4" />
            View Live
          </a>
        )}
        {project.repoUrl && (
          <a
            href={project.repoUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-outline"
            onClick={(e) => e.stopPropagation()}
          >
            <Github className="w-4 h-4" />
            View Code
          </a>
        )}
      </div>
    </div>
  );
}