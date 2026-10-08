'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import { Input, Textarea } from '@/components/ui/Input';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Modal } from '@/components/ui/Modal';
import { Plus, Trash2, Edit, Loader2, Calendar, Award, Shield, Link2, BookOpen } from 'lucide-react';
import toast from 'react-hot-toast';
import { cn } from '@/lib/utils';
import { formatDate } from '@/lib/utils';

const certificationSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  issuer: z.string().min(1, 'Issuer is required'),
  issueDate: z.string().min(1, 'Issue date is required'),
  expiryDate: z.string().optional(),
  credentialId: z.string().min(1, 'Credential ID is required'),
  verificationUrl: z.string().url().optional().or(z.literal('')),
  pdfUrl: z.string().url().optional().or(z.literal('')),
  skills: z.array(z.string()).optional(),
  level: z.enum(['beginner', 'intermediate', 'advanced', 'expert']).default('intermediate'),
  category: z.string().min(1, 'Category is required'),
  isActive: z.boolean().default(true),
  order: z.number().default(0),
});

type CertificationForm = z.infer<typeof certificationSchema>;

const levelColors = {
  beginner: 'bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-300',
  intermediate: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
  advanced: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300',
  expert: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300',
};

interface Certification {
  _id: string;
  name: string;
  issuer: string;
  issueDate: string;
  expiryDate?: string;
  credentialId: string;
  verificationUrl?: string;
  pdfUrl?: string;
  skills: string[];
  level: string;
  category: string;
  isActive: boolean;
  order: number;
}

export default function CertificationsPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [certifications, setCertifications] = useState<Certification[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    watch,
    formState: { errors, isDirty },
  } = useForm<CertificationForm>({
    resolver: zodResolver(certificationSchema),
    defaultValues: {
      name: '',
      issuer: '',
      issueDate: new Date().toISOString().split('T')[0],
      expiryDate: '',
      credentialId: '',
      verificationUrl: '',
      pdfUrl: '',
      skills: [],
      level: 'intermediate',
      category: '',
      isActive: true,
      order: 0,
    },
  });

  const skills = watch('skills') || [];

  const fetchCertifications = async () => {
    try {
      const res = await fetch('/api/backend/certifications?limit=100');
      const data = await res.json();
      if (data.success && data.data) {
        setCertifications(data.data);
      }
    } catch (err) {
      console.error('Failed to fetch certifications:', err);
    }
  };

  const handleEdit = (cert: Certification) => {
    setEditingId(cert._id);
    reset({
      name: cert.name,
      issuer: cert.issuer,
      issueDate: cert.issueDate.split('T')[0],
      expiryDate: cert.expiryDate?.split('T')[0] || '',
      credentialId: cert.credentialId,
      verificationUrl: cert.verificationUrl || '',
      pdfUrl: cert.pdfUrl || '',
      skills: cert.skills || [],
      level: cert.level,
      category: cert.category,
      isActive: cert.isActive,
      order: cert.order,
    });
    setShowModal(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this certification?')) return;
    try {
      const res = await fetch(`/api/backend/certifications/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      toast.success('Certification deleted');
      fetchCertifications();
    } catch (err: any) {
      toast.error(err.message || 'Failed to delete');
    }
  };

  const onSubmit = async (data: CertificationForm) => {
    setIsLoading(true);
    try {
      const url = editingId ? `/api/backend/certifications/${editingId}` : '/api/backend/certifications';
      const method = editingId ? 'PUT' : 'POST';
      
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(data),
      });
      const result = await res.json();
      if (!res.ok) throw new Error(result.message);
      toast.success(editingId ? 'Certification updated' : 'Certification created');
      setShowModal(false);
      setEditingId(null);
      reset();
      fetchCertifications();
    } catch (err: any) {
      toast.error(err.message || 'Failed to save');
    } finally {
      setIsLoading(false);
    }
  };

  const openCreateModal = () => {
    setEditingId(null);
    reset({
      name: '',
      issuer: '',
      issueDate: new Date().toISOString().split('T')[0],
      expiryDate: '',
      credentialId: '',
      verificationUrl: '',
      pdfUrl: '',
      skills: [],
      level: 'intermediate',
      category: '',
      isActive: true,
      order: certifications.length,
    });
    setShowModal(true);
  };

  const isExpired = (date?: string) => date && new Date(date) <= new Date();

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
      >
        <div>
          <h1 className="text-2xl font-bold text-dark-900 dark:text-white">Certifications</h1>
          <p className="text-dark-600 dark:text-dark-400">Manage your professional certifications.</p>
        </div>
        <Button onClick={openCreateModal}>
          <Plus className="w-4 h-4 mr-2" />
          Add Certification
        </Button>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        {certifications.length === 0 ? (
          <Card className="text-center py-16">
            <CardContent>
              <Award className="w-16 h-16 mx-auto text-dark-300 dark:text-dark-700 mb-4" />
              <h3 className="text-lg font-medium text-dark-900 dark:text-white mb-2">No certifications yet</h3>
              <p className="text-dark-600 dark:text-dark-400 mb-6">Add your professional certifications to showcase your expertise.</p>
              <Button onClick={openCreateModal}>
                <Plus className="w-4 h-4 mr-2" />
                Add Certification
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {certifications.map((cert) => {
              const expired = !cert.isActive || isExpired(cert.expiryDate);
              return (
                <motion.div
                  key={cert._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={cn('group', expired && 'opacity-60')}
                >
                  <Card className="hover:border-primary-500/50 transition-colors">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex items-start gap-4 flex-1 min-w-0">
                          <div className="p-3 rounded-xl bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-300">
                            <Award className="w-6 h-6" />
                          </div>
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="text-lg font-semibold text-dark-900 dark:text-white">{cert.name}</h3>
                              <Badge className={levelColors[cert.level as keyof typeof levelColors] || levelColors.intermediate}>
                                {cert.level.charAt(0).toUpperCase() + cert.level.slice(1)}
                              </Badge>
                              {!cert.isActive && (
                                <Badge variant="danger" size="sm">Inactive</Badge>
                              )}
                              {cert.isActive && expired && (
                                <Badge variant="danger" size="sm">Expired</Badge>
                              )}
                            </div>
                            <p className="text-dark-600 dark:text-dark-400">{cert.issuer}</p>
                            <p className="text-sm text-dark-500 dark:text-dark-400">{cert.category}</p>
                            <div className="mt-2 flex flex-wrap items-center gap-4 text-sm text-dark-500 dark:text-dark-400">
                              <span className="flex items-center gap-1">
                                <Calendar className="w-3.5 h-3.5" />
                                Issued: {formatDate(cert.issueDate)}
                              </span>
                              {cert.expiryDate && (
                                <span className={cn('flex items-center gap-1', isExpired(cert.expiryDate) ? 'text-red-500' : '')}>
                                  <Calendar className="w-3.5 h-3.5" />
                                  Expires: {formatDate(cert.expiryDate)}
                                </span>
                              )}
                              <span className="font-mono text-xs bg-dark-100 dark:bg-dark-800 px-2 py-1 rounded">
                                {cert.credentialId}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          {cert.verificationUrl && (
                            <a
                              href={cert.verificationUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-2 text-dark-400 hover:text-green-600 dark:hover:text-green-400 transition-colors"
                              aria-label="Verify certification"
                            >
                              <Shield className="w-4 h-4" />
                            </a>
                          )}
                          {cert.pdfUrl && (
                            <a
                              href={cert.pdfUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-2 text-dark-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                              aria-label="View PDF"
                            >
                              <Link2 className="w-4 h-4" />
                            </a>
                          )}
                          <Button variant="ghost" size="sm" onClick={() => handleEdit(cert)}>
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => handleDelete(cert._id)}>
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                      
                      {cert.skills.length > 0 && (
                        <div className="mt-4 pt-4 border-t border-dark-200 dark:border-dark-800">
                          <div className="flex flex-wrap gap-1.5">
                            {cert.skills.slice(0, 6).map((skill) => (
                              <Badge key={skill} variant="default" size="sm" className="bg-dark-100 text-dark-700 dark:bg-dark-800 dark:text-dark-300">
                                {skill}
                              </Badge>
                            ))}
                            {cert.skills.length > 6 && (
                              <Badge variant="default" size="sm" className="bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-300">
                                +{cert.skills.length - 6}
                              </Badge>
                            )}
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        )}
      </motion.div>

      <Modal
        isOpen={showModal}
        onClose={() => { setShowModal(false); setEditingId(null); reset(); }}
        title={editingId ? 'Edit Certification' : 'Add Certification'}
        size="lg"
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid sm:grid-cols-2 gap-6">
            <Input label="Name" {...register('name')} error={errors.name?.message} placeholder="AWS Certified Solutions Architect" />
            <Input label="Issuer" {...register('issuer')} error={errors.issuer?.message} placeholder="Amazon Web Services" />
          </div>
          
          <div className="grid sm:grid-cols-2 gap-6">
            <Input type="date" label="Issue Date" {...register('issueDate')} error={errors.issueDate?.message} />
            <Input type="date" label="Expiry Date (optional)" {...register('expiryDate')} />
          </div>
          
          <div className="grid sm:grid-cols-2 gap-6">
            <Input label="Credential ID" {...register('credentialId')} error={errors.credentialId?.message} placeholder="CERT-ABC123" />
            <Input label="Category" {...register('category')} error={errors.category?.message} placeholder="Cloud Computing" />
          </div>
          
          <div className="grid sm:grid-cols-2 gap-6">
            <Input type="url" label="Verification URL (optional)" {...register('verificationUrl')} placeholder="https://verify.example.com" />
            <Input type="url" label="PDF URL (optional)" {...register('pdfUrl')} placeholder="https://example.com/cert.pdf" />
          </div>
          
          <div className="grid sm:grid-cols-3 gap-6">
            <select {...register('level')} className="input">
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
              <option value="expert">Expert</option>
            </select>
            <div className="flex items-end">
              <label className="flex items-center gap-2 cursor-pointer w-full">
                <input type="checkbox" {...register('isActive')} className="w-4 h-4 rounded border-dark-300 text-primary-600 focus:ring-primary-500" />
                <span className="text-sm text-dark-600 dark:text-dark-400">Active</span>
              </label>
            </div>
            <Input type="number" label="Display Order" {...register('order', { valueAsNumber: true })} />
          </div>

          <Textarea
            label="Skills (comma-separated)"
            {...register('skills', {
              setValueAs: (value: string) => value.split(',').map(s => s.trim()).filter(Boolean),
              valueAsObject: (value: string[]) => value.join(', '),
            })}
            rows={3}
            placeholder="AWS, Cloud Architecture, System Design, DevOps"
          />

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