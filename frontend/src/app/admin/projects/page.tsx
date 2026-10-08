'use client';

import { useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import { Input, Textarea } from '@/components/ui/Input';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Modal } from '@/components/ui/Modal';
import { Plus, Trash2, Edit, GripVertical, Loader2, Image, Link2, Github, Trash, Check } from 'lucide-react';
import toast from 'react-hot-toast';
import { cn } from '@/lib/utils';
import { formatDate } from '@/lib/utils';

const projectSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  slug: z.string().min(1, 'Slug is required').regex(/^[a-z0-9-]+$/, 'Slug can only contain lowercase letters, numbers, and hyphens'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  shortDescription: z.string().min(10).max(300),
  images: z.array(z.string().url()).optional(),
  thumbnail: z.string().url('Thumbnail must be a valid URL'),
  techStack: z.array(z.string()).optional(),
  liveUrl: z.string().url().optional().or(z.literal('')),
  repoUrl: z.string().url().optional().or(z.literal('')),
  featured: z.boolean().default(false),
  status: z.enum(['completed', 'in-progress', 'planned']).default('completed'),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  highlights: z.array(z.string()).optional(),
  challenges: z.string().optional(),
  solutions: z.string().optional(),
  order: z.number().default(0),
});

type ProjectForm = z.infer<typeof projectSchema>;

const statusConfig = {
  completed: { label: 'Completed', color: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300' },
  'in-progress': { label: 'In Progress', color: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300' },
  planned: { label: 'Planned', color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300' },
};

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
  order: number;
}

export default function ProjectsPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [projects, setProjects] = useState<Project[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState<string>('all');

  const {
    register,
    control,
    handleSubmit,
    setValue,
    reset,
    watch,
    formState: { errors, isDirty },
  } = useForm<ProjectForm>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      title: '',
      slug: '',
      description: '',
      shortDescription: '',
      images: [],
      thumbnail: '',
      techStack: [],
      liveUrl: '',
      repoUrl: '',
      featured: false,
      status: 'completed',
      startDate: '',
      endDate: '',
      highlights: [],
      challenges: '',
      solutions: '',
      order: 0,
    },
  });

  const highlights = watch('highlights') || [];
  const techStack = watch('techStack') || [];
  const images = watch('images') || [];

  const { fields: highlightFields, append: appendHighlight, remove: removeHighlight } = useFieldArray({
    control,
    name: 'highlights',
  });

  const { fields: techFields, append: appendTech, remove: removeTech } = useFieldArray({
    control,
    name: 'techStack',
  });

  const { fields: imageFields, append: appendImage, remove: removeImage } = useFieldArray({
    control,
    name: 'images',
  });

  const fetchProjects = async () => {
    try {
      const res = await fetch('/api/backend/projects?limit=100');
      const data = await res.json();
      if (data.success && data.data) {
        setProjects(data.data);
      }
    } catch (err) {
      console.error('Failed to fetch projects:', err);
    }
  };

  const handleEdit = (project: Project) => {
    setEditingId(project._id);
    reset({
      title: project.title,
      slug: project.slug,
      description: project.description,
      shortDescription: project.shortDescription,
      images: project.images || [],
      thumbnail: project.thumbnail,
      techStack: project.techStack || [],
      liveUrl: project.liveUrl || '',
      repoUrl: project.repoUrl || '',
      featured: project.featured,
      status: project.status,
      startDate: project.startDate?.split('T')[0] || '',
      endDate: project.endDate?.split('T')[0] || '',
      highlights: project.highlights || [],
      challenges: project.challenges || '',
      solutions: project.solutions || '',
      order: project.order,
    });
    setShowModal(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this project?')) return;
    try {
      const res = await fetch(`/api/backend/projects/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      toast.success('Project deleted');
      fetchProjects();
    } catch (err: any) {
      toast.error(err.message || 'Failed to delete');
    }
  };

  const onSubmit = async (data: ProjectForm) => {
    setIsLoading(true);
    try {
      const url = editingId ? `/api/backend/projects/${editingId}` : '/api/backend/projects';
      const method = editingId ? 'PUT' : 'POST';
      
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(data),
      });
      const result = await res.json();
      if (!res.ok) throw new Error(result.message);
      toast.success(editingId ? 'Project updated' : 'Project created');
      setShowModal(false);
      setEditingId(null);
      reset();
      fetchProjects();
    } catch (err: any) {
      toast.error(err.message || 'Failed to save');
    } finally {
      setIsLoading(false);
    }
  };

  const openCreateModal = () => {
    setEditingId(null);
    reset({
      title: '',
      slug: '',
      description: '',
      shortDescription: '',
      images: [],
      thumbnail: '',
      techStack: [],
      liveUrl: '',
      repoUrl: '',
      featured: false,
      status: 'completed',
      startDate: '',
      endDate: '',
      highlights: [],
      challenges: '',
      solutions: '',
      order: projects.length,
    });
    setShowModal(true);
  };

  const filteredProjects = activeFilter === 'all' 
    ? projects 
    : projects.filter(p => p.status === activeFilter);

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
      >
        <div>
          <h1 className="text-2xl font-bold text-dark-900 dark:text-white">Projects</h1>
          <p className="text-dark-600 dark:text-dark-400">Manage your portfolio projects.</p>
        </div>
        <Button onClick={openCreateModal}>
          <Plus className="w-4 h-4 mr-2" />
          Add Project
        </Button>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <div className="flex flex-wrap gap-2 mb-6">
          {['all', 'completed', 'in-progress', 'planned'].map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={cn(
                'px-3 py-1.5 rounded-full text-sm font-medium transition-colors',
                activeFilter === filter
                  ? 'bg-primary-600 text-white'
                  : 'bg-dark-100 text-dark-700 hover:bg-dark-200 dark:bg-dark-800 dark:text-dark-300 dark:hover:bg-dark-700'
              )}
            >
              {filter === 'all' ? 'All' : filter.charAt(0).toUpperCase() + filter.slice(1)}
            </button>
          ))}
        </div>

        {filteredProjects.length === 0 ? (
          <Card className="text-center py-16">
            <CardContent>
              <Github className="w-16 h-16 mx-auto text-dark-300 dark:text-dark-700 mb-4" />
              <h3 className="text-lg font-medium text-dark-900 dark:text-white mb-2">No projects yet</h3>
              <p className="text-dark-600 dark:text-dark-400 mb-6">Add your first project to showcase your work.</p>
              <Button onClick={openCreateModal}>
                <Plus className="w-4 h-4 mr-2" />
                Add Project
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProjects.map((project) => (
              <motion.div
                key={project._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="group"
              >
                <Card className="overflow-hidden hover:border-primary-500/50 transition-colors">
                  <div className="relative aspect-video overflow-hidden">
                    <img
                      src={project.thumbnail}
                      alt={project.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-3 right-3 flex gap-2">
                      <Badge className={statusConfig[project.status].color}>
                        {statusConfig[project.status].label}
                      </Badge>
                      {project.featured && (
                        <Badge variant="default" className="bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300">
                          Featured
                        </Badge>
                      )}
                    </div>
                  </div>
                  <CardContent className="p-4 space-y-3">
                    <h3 className="font-bold text-dark-900 dark:text-white truncate">{project.title}</h3>
                    <p className="text-sm text-dark-600 dark:text-dark-400 line-clamp-2">{project.shortDescription}</p>
                    <div className="flex flex-wrap gap-1">
                      {project.techStack.slice(0, 4).map((tech) => (
                        <Badge key={tech} variant="default" size="sm" className="bg-dark-100 text-dark-700 dark:bg-dark-800 dark:text-dark-300">
                          {tech}
                        </Badge>
                      ))}
                      {project.techStack.length > 4 && (
                        <Badge variant="default" size="sm" className="bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-300">
                          +{project.techStack.length - 4}
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center justify-between pt-2 border-t border-dark-200 dark:border-dark-800">
                      <div className="flex gap-2">
                        {project.liveUrl && (
                          <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" className="text-sm text-primary-600 hover:text-primary-700 flex items-center gap-1">
                            <Link2 className="w-3.5 h-3.5" />
                            Live
                          </a>
                        )}
                        {project.repoUrl && (
                          <a href={project.repoUrl} target="_blank" rel="noopener noreferrer" className="text-sm text-dark-600 hover:text-dark-900 dark:text-dark-400 dark:hover:text-white flex items-center gap-1">
                            <Github className="w-3.5 h-3.5" />
                            Code
                          </a>
                        )}
                      </div>
                      <div className="flex gap-1">
                        <Button variant="ghost" size="sm" onClick={() => handleEdit(project)}>
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => handleDelete(project._id)}>
                          <Trash className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>

      <Modal
        isOpen={showModal}
        onClose={() => { setShowModal(false); setEditingId(null); reset(); }}
        title={editingId ? 'Edit Project' : 'Add Project'}
        size="xl"
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 max-h-[80vh] overflow-y-auto">
          <div className="grid sm:grid-cols-2 gap-6">
            <Input label="Title" {...register('title')} error={errors.title?.message} placeholder="My Awesome Project" />
            <Input label="Slug" {...register('slug')} error={errors.slug?.message} placeholder="my-awesome-project" />
          </div>
          
          <div className="grid sm:grid-cols-2 gap-6">
            <Input label="Thumbnail URL" {...register('thumbnail')} error={errors.thumbnail?.message} placeholder="https://example.com/thumb.jpg" />
            <Input type="url" label="Live URL (optional)" {...register('liveUrl')} placeholder="https://myproject.com" />
          </div>
          
          <Input type="url" label="Repo URL (optional)" {...register('repoUrl')} placeholder="https://github.com/user/repo" />
          
          <Textarea
            label="Short Description (max 300 chars)"
            {...register('shortDescription')}
            error={errors.shortDescription?.message}
            rows={3}
            placeholder="A brief summary for project cards..."
          />
          
          <Textarea
            label="Full Description"
            {...register('description')}
            error={errors.description?.message}
            rows={6}
            placeholder="Detailed description of the project..."
          />

          <div className="grid sm:grid-cols-3 gap-6">
            <select {...register('status')} className="input">
              <option value="completed">Completed</option>
              <option value="in-progress">In Progress</option>
              <option value="planned">Planned</option>
            </select>
            <Input type="date" label="Start Date (optional)" {...register('startDate')} />
            <Input type="date" label="End Date (optional)" {...register('endDate')} />
          </div>

          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" {...register('featured')} className="w-4 h-4 rounded border-dark-300 text-primary-600 focus:ring-primary-500" />
              <span className="text-sm text-dark-600 dark:text-dark-400">Featured Project</span>
            </label>
            <Input type="number" label="Display Order" {...register('order', { valueAsNumber: true })} className="w-32" />
          </div>

          <div>
            <label className="label flex items-center justify-between">
              Technologies
              <Button type="button" variant="ghost" size="sm" onClick={() => appendTech('')}>
                <Plus className="w-4 h-4 mr-1" />
                Add
              </Button>
            </label>
            <div className="flex flex-wrap gap-2 mt-2">
              {techFields.map((field, index) => (
                <div key={field.id} className="flex gap-2">
                  <Input
                    {...register(`techStack.${index}`)}
                    placeholder={`Tech ${index + 1}`}
                    className="w-40"
                  />
                  <button type="button" onClick={() => removeTech(index)} className="mt-10 p-1.5 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg">
                    <Trash className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div>
            <label className="label flex items-center justify-between">
              Images
              <Button type="button" variant="ghost" size="sm" onClick={() => appendImage('')}>
                <Plus className="w-4 h-4 mr-1" />
                Add
              </Button>
            </label>
            <div className="flex flex-wrap gap-2 mt-2">
              {imageFields.map((field, index) => (
                <div key={field.id} className="flex gap-2">
                  <Input
                    {...register(`images.${index}`)}
                    type="url"
                    placeholder={`Image URL ${index + 1}`}
                    className="w-64"
                  />
                  <button type="button" onClick={() => removeImage(index)} className="mt-10 p-1.5 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg">
                    <Trash className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div>
            <label className="label flex items-center justify-between">
              Highlights
              <Button type="button" variant="ghost" size="sm" onClick={() => appendHighlight('')}>
                <Plus className="w-4 h-4 mr-1" />
                Add
              </Button>
            </label>
            <div className="space-y-2 mt-2">
              {highlightFields.map((field, index) => (
                <div key={field.id} className="flex gap-2">
                  <Input
                    {...register(`highlights.${index}`)}
                    placeholder={`Highlight ${index + 1}`}
                  />
                  <button type="button" onClick={() => removeHighlight(index)} className="mt-10 p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl">
                    <Trash className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-6">
            <Textarea
              label="Challenges (optional)"
              {...register('challenges')}
              rows={4}
              placeholder="What challenges did you face?"
            />
            <Textarea
              label="Solutions (optional)"
              {...register('solutions')}
              rows={4}
              placeholder="How did you solve them?"
            />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-dark-200 dark:border-dark-800">
            <Button type="button" variant="secondary" onClick={() => { setShowModal(false); setEditingId(null); reset(); }}>
              Cancel
            </Button>
            <Button type="submit" loading={isLoading}>
              {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Save'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}