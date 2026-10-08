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
import { Plus, Trash2, Edit, Loader2, Calendar, Award, Shield, ExternalLink, BookOpen, Medal } from 'lucide-react';
import toast from 'react-hot-toast';
import { cn } from '@/lib/utils';
import { formatDate } from '@/lib/utils';

const credentialSchema = z.object({
  type: z.enum(['degree', 'certification', 'award', 'license', 'publication', 'other']),
  title: z.string().min(1, 'Title is required'),
  issuer: z.string().min(1, 'Issuer is required'),
  issueDate: z.string().min(1, 'Issue date is required'),
  expiryDate: z.string().optional(),
  credentialUrl: z.string().url().optional().or(z.literal('')),
  verificationUrl: z.string().url().optional().or(z.literal('')),
  description: z.string().optional(),
  skills: z.array(z.string()).optional(),
  credentialId: z.string().optional(),
  image: z.string().url().optional().or(z.literal('')),
  order: z.number().default(0),
});

type CredentialForm = z.infer<typeof credentialSchema>;

const typeIcons = {
  degree: BookOpen,
  certification: Award,
  award: Medal,
  license: Shield,
  publication: BookOpen,
  other: Award,
};

const typeColors = {
  degree: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
  certification: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300',
  award: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300',
  license: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300',
  publication: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300',
  other: 'bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-300',
};

interface Credential {
  _id: string;
  type: string;
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
}

export default function CredentialsPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [credentials, setCredentials] = useState<Credential[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);

  const {
    register,
    control,
    handleSubmit,
    setValue,
    reset,
    watch,
    formState: { errors, isDirty },
  } = useForm<CredentialForm>({
    resolver: zodResolver(credentialSchema),
    defaultValues: {
      type: 'certification',
      title: '',
      issuer: '',
      issueDate: new Date().toISOString().split('T')[0],
      expiryDate: '',
      credentialUrl: '',
      verificationUrl: '',
      description: '',
      skills: [],
      credentialId: '',
      image: '',
      order: 0,
    },
  });

  const skills = watch('skills') || [];

  const { fields: skillFields, append: appendSkill, remove: removeSkill } = useFieldArray({
    control,
    name: 'skills',
  });

  const fetchCredentials = async () => {
    try {
      const res = await fetch('/api/backend/credentials?limit=100');
      const data = await res.json();
      if (data.success && data.data) {
        setCredentials(data.data);
      }
    } catch (err) {
      console.error('Failed to fetch credentials:', err);
    }
  };

  const handleEdit = (cred: Credential) => {
    setEditingId(cred._id);
    reset({
      type: cred.type,
      title: cred.title,
      issuer: cred.issuer,
      issueDate: cred.issueDate.split('T')[0],
      expiryDate: cred.expiryDate?.split('T')[0] || '',
      credentialUrl: cred.credentialUrl || '',
      verificationUrl: cred.verificationUrl || '',
      description: cred.description || '',
      skills: cred.skills || [],
      credentialId: cred.credentialId || '',
      image: cred.image || '',
      order: cred.order,
    });
    setShowModal(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this credential?')) return;
    try {
      const res = await fetch(`/api/backend/credentials/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      toast.success('Credential deleted');
      fetchCredentials();
    } catch (err: any) {
      toast.error(err.message || 'Failed to delete');
    }
  };

  const onSubmit = async (data: CredentialForm) => {
    setIsLoading(true);
    try {
      const url = editingId ? `/api/backend/credentials/${editingId}` : '/api/backend/credentials';
      const method = editingId ? 'PUT' : 'POST';
      
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(data),
      });
      const result = await res.json();
      if (!res.ok) throw new Error(result.message);
      toast.success(editingId ? 'Credential updated' : 'Credential created');
      setShowModal(false);
      setEditingId(null);
      reset();
      fetchCredentials();
    } catch (err: any) {
      toast.error(err.message || 'Failed to save');
    } finally {
      setIsLoading(false);
    }
  };

  const openCreateModal = () => {
    setEditingId(null);
    reset({
      type: 'certification',
      title: '',
      issuer: '',
      issueDate: new Date().toISOString().split('T')[0],
      expiryDate: '',
      credentialUrl: '',
      verificationUrl: '',
      description: '',
      skills: [],
      credentialId: '',
      image: '',
      order: credentials.length,
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
          <h1 className="text-2xl font-bold text-dark-900 dark:text-white">Credentials</h1>
          <p className="text-dark-600 dark:text-dark-400">Manage your degrees, certifications, awards, and licenses.</p>
        </div>
        <Button onClick={openCreateModal}>
          <Plus className="w-4 h-4 mr-2" />
          Add Credential
        </Button>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        {credentials.length === 0 ? (
          <Card className="text-center py-16">
            <CardContent>
              <Award className="w-16 h-16 mx-auto text-dark-300 dark:text-dark-700 mb-4" />
              <h3 className="text-lg font-medium text-dark-900 dark:text-white mb-2">No credentials yet</h3>
              <p className="text-dark-600 dark:text-dark-400 mb-6">Add your degrees, certifications, awards, and licenses.</p>
              <Button onClick={openCreateModal}>
                <Plus className="w-4 h-4 mr-2" />
                Add Credential
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {credentials.map((cred) => {
              const expired = isExpired(cred.expiryDate);
              const Icon = typeIcons[cred.type as keyof typeof typeIcons] || Award;
              return (
                <motion.div
                  key={cred._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={cn('group', expired && 'opacity-60')}
                >
                  <Card className="hover:border-primary-500/50 transition-colors">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex items-start gap-4 flex-1 min-w-0">
                          <div className={cn('p-3 rounded-xl', typeColors[cred.type as keyof typeof typeColors] || typeColors.other)}>
                            <Icon className="w-6 h-6" />
                          </div>
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="text-lg font-semibold text-dark-900 dark:text-white">{cred.title}</h3>
                              <Badge className={typeColors[cred.type as keyof typeof typeColors] || typeColors.other}>
                                {cred.type.charAt(0).toUpperCase() + cred.type.slice(1)}
                              </Badge>
                              {expired && (
                                <Badge variant="danger" size="sm">Expired</Badge>
                              )}
                            </div>
                            <p className="text-dark-600 dark:text-dark-400">{cred.issuer}</p>
                            {cred.description && (
                              <p className="text-sm text-dark-500 dark:text-dark-400 mt-1 line-clamp-1">{cred.description}</p>
                            )}
                            <div className="mt-2 flex flex-wrap items-center gap-4 text-sm text-dark-500 dark:text-dark-400">
                              <span className="flex items-center gap-1">
                                <Calendar className="w-3.5 h-3.5" />
                                Issued: {formatDate(cred.issueDate)}
                              </span>
                              {cred.expiryDate && (
                                <span className={cn('flex items-center gap-1', expired ? 'text-red-500' : '')}>
                                  <Calendar className="w-3.5 h-3.5" />
                                  Expires: {formatDate(cred.expiryDate)}
                                </span>
                              )}
                              {cred.credentialId && (
                                <span className="font-mono text-xs bg-dark-100 dark:bg-dark-800 px-2 py-1 rounded">
                                  {cred.credentialId}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          {cred.credentialUrl && (
                            <a
                              href={cred.credentialUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-2 text-dark-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                              aria-label="View credential"
                            >
                              <ExternalLink className="w-4 h-4" />
                            </a>
                          )}
                          {cred.verificationUrl && (
                            <a
                              href={cred.verificationUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-2 text-dark-400 hover:text-green-600 dark:hover:text-green-400 transition-colors"
                              aria-label="Verify credential"
                            >
                              <Shield className="w-4 h-4" />
                            </a>
                          )}
                          <Button variant="ghost" size="sm" onClick={() => handleEdit(cred)}>
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => handleDelete(cred._id)}>
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
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
        title={editingId ? 'Edit Credential' : 'Add Credential'}
        size="lg"
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid sm:grid-cols-2 gap-6">
            <select {...register('type')} className="input">
              <option value="degree">Degree</option>
              <option value="certification">Certification</option>
              <option value="award">Award</option>
              <option value="license">License</option>
              <option value="publication">Publication</option>
              <option value="other">Other</option>
            </select>
            <Input type="date" label="Issue Date" {...register('issueDate')} error={errors.issueDate?.message} />
          </div>
          
          <div className="grid sm:grid-cols-2 gap-6">
            <Input label="Title" {...register('title')} error={errors.title?.message} placeholder="AWS Certified Solutions Architect" />
            <Input label="Issuer" {...register('issuer')} error={errors.issuer?.message} placeholder="Amazon Web Services" />
          </div>
          
          <Input type="date" label="Expiry Date (optional)" {...register('expiryDate')} />
          
          <div className="grid sm:grid-cols-2 gap-6">
            <Input type="url" label="Credential URL (optional)" {...register('credentialUrl')} placeholder="https://example.com/credential" />
            <Input type="url" label="Verification URL (optional)" {...register('verificationUrl')} placeholder="https://example.com/verify" />
          </div>
          
          <Input label="Credential ID (optional)" {...register('credentialId')} placeholder="CERT-123456" />
          
          <Input type="url" label="Image URL (optional)" {...register('image')} placeholder="https://example.com/badge.png" />
          
          <Textarea
            label="Description (optional)"
            {...register('description')}
            rows={3}
            placeholder="Additional details about this credential..."
          />
          
          <div>
            <label className="label flex items-center justify-between">
              Skills
              <Button type="button" variant="ghost" size="sm" onClick={() => appendSkill('')}>
                <Plus className="w-4 h-4 mr-1" />
                Add
              </Button>
            </label>
            <div className="flex flex-wrap gap-2 mt-2">
              {skillFields.map((field, index) => (
                <div key={field.id} className="flex gap-2">
                  <Input
                    {...register(`skills.${index}`)}
                    placeholder={`Skill ${index + 1}`}
                    className="w-48"
                  />
                  <button type="button" onClick={() => removeSkill(index)} className="mt-10 p-1.5 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
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