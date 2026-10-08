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
import { Plus, Trash2, Edit, GripVertical, Loader2, Calendar, MapPin, Building2, Code } from 'lucide-react';
import toast from 'react-hot-toast';
import { cn } from '@/lib/utils';
import { formatDate } from '@/lib/utils';

const experienceSchema = z.object({
  company: z.string().min(1, 'Company is required'),
  role: z.string().min(1, 'Role is required'),
  period: z.string().min(1, 'Period is required'),
  startDate: z.string().min(1, 'Start date is required'),
  endDate: z.string().optional(),
  current: z.boolean().default(false),
  description: z.array(z.string()).optional(),
  technologies: z.array(z.string()).optional(),
  logo: z.string().url().optional().or(z.literal('')),
  location: z.string().optional(),
  type: z.enum(['full-time', 'part-time', 'contract', 'internship', 'freelance']).default('full-time'),
  order: z.number().default(0),
});

type ExperienceForm = z.infer<typeof experienceSchema>;

const typeLabels: Record<string, string> = {
  'full-time': 'Full-time',
  'part-time': 'Part-time',
  contract: 'Contract',
  internship: 'Internship',
  freelance: 'Freelance',
};

interface Experience {
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
  type: string;
  order: number;
}

export default function ExperiencePage() {
  const [isLoading, setIsLoading] = useState(false);
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const {
    register,
    control,
    handleSubmit,
    setValue,
    reset,
    watch,
    formState: { errors, isDirty },
  } = useForm<ExperienceForm>({
    resolver: zodResolver(experienceSchema),
    defaultValues: {
      company: '',
      role: '',
      period: '',
      startDate: new Date().toISOString().split('T')[0],
      endDate: '',
      current: false,
      description: [],
      technologies: [],
      logo: '',
      location: '',
      type: 'full-time',
      order: 0,
    },
  });

  const description = watch('description') || [];
  const technologies = watch('technologies') || [];

  const { fields: descFields, append: appendDesc, remove: removeDesc } = useFieldArray({
    control,
    name: 'description',
  });

  const { fields: techFields, append: appendTech, remove: removeTech } = useFieldArray({
    control,
    name: 'technologies',
  });

  const fetchExperiences = async () => {
    try {
      const res = await fetch('/api/backend/experience?limit=100');
      const data = await res.json();
      if (data.success && data.data) {
        setExperiences(data.data);
      }
    } catch (err) {
      console.error('Failed to fetch experiences:', err);
    }
  };

  const handleEdit = (exp: Experience) => {
    setEditingId(exp._id);
    reset({
      company: exp.company,
      role: exp.role,
      period: exp.period,
      startDate: exp.startDate.split('T')[0],
      endDate: exp.endDate?.split('T')[0] || '',
      current: exp.current,
      description: exp.description || [],
      technologies: exp.technologies || [],
      logo: exp.logo || '',
      location: exp.location || '',
      type: exp.type,
      order: exp.order,
    });
    setShowModal(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this experience?')) return;
    try {
      const res = await fetch(`/api/backend/experience/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      toast.success('Experience deleted');
      fetchExperiences();
    } catch (err: any) {
      toast.error(err.message || 'Failed to delete');
    }
  };

  const onSubmit = async (data: ExperienceForm) => {
    setIsLoading(true);
    try {
      const url = editingId ? `/api/backend/experience/${editingId}` : '/api/backend/experience';
      const method = editingId ? 'PUT' : 'POST';
      
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(data),
      });
      const result = await res.json();
      if (!res.ok) throw new Error(result.message);
      toast.success(editingId ? 'Experience updated' : 'Experience created');
      setShowModal(false);
      setEditingId(null);
      reset();
      fetchExperiences();
    } catch (err: any) {
      toast.error(err.message || 'Failed to save');
    } finally {
      setIsLoading(false);
    }
  };

  const openCreateModal = () => {
    setEditingId(null);
    reset({
      company: '',
      role: '',
      period: '',
      startDate: new Date().toISOString().split('T')[0],
      endDate: '',
      current: false,
      description: [],
      technologies: [],
      logo: '',
      location: '',
      type: 'full-time',
      order: experiences.length,
    });
    setShowModal(true);
  };

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
      >
        <div>
          <h1 className="text-2xl font-bold text-dark-900 dark:text-white">Experience</h1>
          <p className="text-dark-600 dark:text-dark-400">Manage your work experience and professional history.</p>
        </div>
        <Button onClick={openCreateModal}>
          <Plus className="w-4 h-4 mr-2" />
          Add Experience
        </Button>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        {experiences.length === 0 ? (
          <Card className="text-center py-16">
            <CardContent>
              <Building2 className="w-16 h-16 mx-auto text-dark-300 dark:text-dark-700 mb-4" />
              <h3 className="text-lg font-medium text-dark-900 dark:text-white mb-2">No experience entries yet</h3>
              <p className="text-dark-600 dark:text-dark-400 mb-6">Add your first work experience to showcase your professional journey.</p>
              <Button onClick={openCreateModal}>
                <Plus className="w-4 h-4 mr-2" />
                Add Experience
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {experiences.map((exp) => (
              <motion.div
                key={exp._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="group"
              >
                <Card className="hover:border-primary-500/50 transition-colors">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="text-xl font-bold text-dark-900 dark:text-white">{exp.role}</h3>
                          {exp.current && (
                            <Badge variant="success" size="sm">Current</Badge>
                          )}
                        </div>
                        <p className="text-lg text-primary-600 dark:text-primary-400 font-medium">{exp.company}</p>
                        <div className="mt-2 flex flex-wrap items-center gap-4 text-sm text-dark-500 dark:text-dark-400">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            {formatDate(exp.startDate)} - {exp.current ? 'Present' : exp.endDate ? formatDate(exp.endDate) : 'Present'}
                          </span>
                          {exp.location && (
                            <span className="flex items-center gap-1">
                              <MapPin className="w-4 h-4" />
                              {exp.location}
                            </span>
                          )}
                          <Badge variant="default" className="bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">
                            {typeLabels[exp.type] || exp.type}
                          </Badge>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <Button variant="ghost" size="sm" onClick={() => handleEdit(exp)}>
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => handleDelete(exp._id)}>
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>

                    {(exp.description.length > 0 || exp.technologies.length > 0) && (
                      <div className="mt-4 pt-4 border-t border-dark-200 dark:border-dark-800">
                        {exp.description.length > 0 && (
                          <div className="mb-3">
                            <ul className="space-y-1">
                              {exp.description.map((desc, i) => (
                                <li key={i} className="flex items-start gap-2 text-sm text-dark-600 dark:text-dark-400">
                                  <span className="w-1.5 h-1.5 rounded-full bg-primary-500 mt-1.5 flex-shrink-0" />
                                  {desc}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                        {exp.technologies.length > 0 && (
                          <div className="flex flex-wrap gap-2">
                            {exp.technologies.map((tech) => (
                              <Badge key={tech} variant="default" size="sm" className="bg-dark-100 text-dark-700 dark:bg-dark-800 dark:text-dark-300">
                                {tech}
                              </Badge>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
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
        title={editingId ? 'Edit Experience' : 'Add Experience'}
        size="lg"
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid sm:grid-cols-2 gap-6">
            <Input label="Company" {...register('company')} error={errors.company?.message} placeholder="Google" />
            <Input label="Role" {...register('role')} error={errors.role?.message} placeholder="Software Engineer" />
          </div>
          <div className="grid sm:grid-cols-2 gap-6">
            <Input label="Period" {...register('period')} error={errors.period?.message} placeholder="Jan 2022 - Present" />
            <Input type="date" label="Start Date" {...register('startDate')} error={errors.startDate?.message} />
          </div>
          <div className="grid sm:grid-cols-3 gap-6">
            <Input type="date" label="End Date (optional)" {...register('endDate')} />
            <div className="flex items-end">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" {...register('current')} className="w-4 h-4 rounded border-dark-300 text-primary-600 focus:ring-primary-500" />
                <span className="text-sm text-dark-600 dark:text-dark-400">Currently working here</span>
              </label>
            </div>
            <select {...register('type')} className="input">
              <option value="full-time">Full-time</option>
              <option value="part-time">Part-time</option>
              <option value="contract">Contract</option>
              <option value="internship">Internship</option>
              <option value="freelance">Freelance</option>
            </select>
          </div>
          <Input label="Location (optional)" {...register('location')} placeholder="San Francisco, CA" />
          <Input label="Logo URL (optional)" {...register('logo')} type="url" placeholder="https://example.com/logo.png" />

          <div>
            <label className="label">Description</label>
            <div className="space-y-2">
              {descFields.map((field, index) => (
                <div key={field.id} className="flex gap-2">
                  <Input
                    {...register(`description.${index}`)}
                    placeholder={`Description point ${index + 1}`}
                  />
                  <button type="button" onClick={() => removeDesc(index)} className="mt-10 p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
              {descFields.length === 0 && (
                <div className="flex gap-2">
                  <Input placeholder="Add a description point" {...register('description.0')} />
                </div>
              )}
              <Button type="button" variant="ghost" size="sm" onClick={() => appendDesc('')}>
                <Plus className="w-4 h-4 mr-1" />
                Add Description Point
              </Button>
            </div>
          </div>

          <div>
            <label className="label">Technologies</label>
            <div className="space-y-2">
              {techFields.map((field, index) => (
                <div key={field.id} className="flex gap-2">
                  <Input
                    {...register(`technologies.${index}`)}
                    placeholder={`Technology ${index + 1}`}
                  />
                  <button type="button" onClick={() => removeTech(index)} className="mt-10 p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
              {techFields.length === 0 && (
                <div className="flex gap-2">
                  <Input placeholder="Add a technology" {...register('technologies.0')} />
                </div>
              )}
              <Button type="button" variant="ghost" size="sm" onClick={() => appendTech('')}>
                <Plus className="w-4 h-4 mr-1" />
                Add Technology
              </Button>
            </div>
          </div>

          <Input type="number" label="Display Order" {...register('order', { valueAsNumber: true })} />

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