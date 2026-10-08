'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Input';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Upload, Save, Image, FileText, Trash2, CheckCircle, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { cn } from '@/lib/utils';
import { api } from '@/lib/api';

const profileSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  title: z.string().min(2, 'Title must be at least 2 characters'),
  bio: z.string().min(10, 'Bio must be at least 10 characters'),
  email: z.string().email('Invalid email address'),
  phone: z.string().optional(),
  location: z.string().optional(),
  socialLinks: z.array(z.object({
    platform: z.string(),
    url: z.string().url('Invalid URL'),
    icon: z.string(),
    order: z.number(),
  })).optional(),
});

type ProfileForm = z.infer<typeof profileSchema>;

const defaultSocialLinks = [
  { platform: 'github', url: '', icon: 'github', order: 0 },
  { platform: 'linkedin', url: '', icon: 'linkedin', order: 1 },
  { platform: 'twitter', url: '', icon: 'twitter', order: 2 },
  { platform: 'email', url: '', icon: 'mail', order: 3 },
];

export default function ProfilePage() {
  const [isLoading, setIsLoading] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState<string>('');
  const [resumeUrl, setResumeUrl] = useState<string>('');
  const [avatarUploading, setAvatarUploading] = useState(false);
  const [resumeUploading, setResumeUploading] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    control,
    formState: { errors, isDirty },
  } = useForm<ProfileForm>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: '',
      title: '',
      bio: '',
      email: '',
      phone: '',
      location: '',
      socialLinks: defaultSocialLinks,
    },
  });

  const socialLinks = watch('socialLinks') || defaultSocialLinks;

  const fetchProfile = async () => {
    try {
      const res = await fetch('/api/backend/profile');
      const data = await res.json();
      if (data.success && data.data) {
        const profile = data.data;
        setValue('name', profile.name);
        setValue('title', profile.title);
        setValue('bio', profile.bio);
        setValue('email', profile.email);
        setValue('phone', profile.phone || '');
        setValue('location', profile.location || '');
        if (profile.socialLinks?.length) {
          setValue('socialLinks', profile.socialLinks);
        }
        if (profile.avatar) setAvatarUrl(profile.avatar);
        if (profile.resumeUrl) setResumeUrl(profile.resumeUrl);
      }
    } catch (err) {
      console.error('Failed to fetch profile:', err);
    }
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setAvatarUploading(true);
    try {
      const formData = new FormData();
      formData.append('image', file);
      formData.append('folder', 'portfolio/avatar');

      const res = await fetch('/api/backend/upload/image', {
        method: 'POST',
        credentials: 'include',
        body: formData,
      });
      const data = await res.json();
      if (data.success) {
        setAvatarUrl(data.data.url);
        toast.success('Avatar uploaded');
      } else {
        throw new Error(data.message);
      }
    } catch (err: any) {
      toast.error(err.message || 'Upload failed');
    } finally {
      setAvatarUploading(false);
      e.target.value = '';
    }
  };

  const handleResumeUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setResumeUploading(true);
    try {
      const formData = new FormData();
      formData.append('image', file);
      formData.append('folder', 'portfolio/resume');

      const res = await fetch('/api/backend/upload/image', {
        method: 'POST',
        credentials: 'include',
        body: formData,
      });
      const data = await res.json();
      if (data.success) {
        setResumeUrl(data.data.url);
        toast.success('Resume uploaded');
      } else {
        throw new Error(data.message);
      }
    } catch (err: any) {
      toast.error(err.message || 'Upload failed');
    } finally {
      setResumeUploading(false);
      e.target.value = '';
    }
  };

  const onSubmit = async (data: ProfileForm) => {
    setIsLoading(true);
    try {
      const payload = {
        ...data,
        avatar: avatarUrl,
        resumeUrl: resumeUrl,
      };

      const res = await fetch('/api/backend/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(payload),
      });

      const result = await res.json();
      if (!res.ok) throw new Error(result.message);
      toast.success('Profile saved successfully!');
    } catch (err: any) {
      toast.error(err.message || 'Failed to save profile');
    } finally {
      setIsLoading(false);
    }
  };

  const addSocialLink = () => {
    setValue('socialLinks', [...socialLinks, { platform: '', url: '', icon: '', order: socialLinks.length }]);
  };

  const removeSocialLink = (index: number) => {
    setValue('socialLinks', socialLinks.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
      >
        <div>
          <h1 className="text-2xl font-bold text-dark-900 dark:text-white">Profile Settings</h1>
          <p className="text-dark-600 dark:text-dark-400">Manage your profile information and social links.</p>
        </div>
        <Button onClick={handleSubmit(onSubmit)} disabled={!isDirty || isLoading} loading={isLoading}>
          <Save className="w-4 h-4 mr-2" />
          Save Changes
        </Button>
      </motion.div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="grid lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle>Avatar & Resume</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="text-center">
                <div className="relative w-32 h-32 mx-auto mb-4">
                  {avatarUrl ? (
                    <img src={avatarUrl} alt="Avatar" className="w-full h-full rounded-2xl object-cover" />
                  ) : (
                    <div className="w-full h-full rounded-2xl bg-dark-100 dark:bg-dark-800 flex items-center justify-center">
                      <Image className="w-12 h-12 text-dark-400" />
                    </div>
                  )}
                  <label className="absolute bottom-0 right-0">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleAvatarUpload}
                      className="sr-only"
                    />
                    <button
                      type="button"
                      className={cn(
                        'p-2 rounded-full bg-primary-600 text-white shadow-lg hover:bg-primary-700 transition-colors',
                        avatarUploading && 'opacity-50 cursor-not-allowed'
                      )}
                      disabled={avatarUploading}
                    >
                      {avatarUploading ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                      ) : (
                        <Upload className="w-5 h-5" />
                      )}
                    </button>
                  </label>
                </div>
                <p className="text-sm text-dark-500 dark:text-dark-400">Click to upload avatar</p>
              </div>

              <div>
                <label className="label">Resume</label>
                {resumeUrl ? (
                  <div className="flex items-center justify-between p-3 rounded-xl bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800">
                    <div className="flex items-center gap-3">
                      <FileText className="w-5 h-5 text-green-600 dark:text-green-400" />
                      <span className="text-sm text-green-700 dark:text-green-300">Resume uploaded</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setResumeUrl('')}
                      className="text-red-600 hover:text-red-700 text-sm"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <label className="cursor-pointer">
                    <input
                      type="file"
                      accept=".pdf"
                      onChange={handleResumeUpload}
                      className="sr-only"
                    />
                    <div className="p-6 rounded-xl border-2 border-dashed border-dark-300 dark:border-dark-600 text-center hover:border-primary-500 transition-colors">
                      <FileText className="w-10 h-10 mx-auto text-dark-400 mb-2" />
                      <p className="text-dark-600 dark:text-dark-400">Upload PDF resume</p>
                      <p className="text-xs text-dark-500 mt-1">Max 10MB</p>
                    </div>
                  </label>
                )}
              </div>
            </CardContent>
          </Card>

          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid sm:grid-cols-2 gap-6">
                <Input
                  label="Full Name"
                  {...register('name')}
                  error={errors.name?.message}
                  placeholder="John Doe"
                />
                <Input
                  label="Professional Title"
                  {...register('title')}
                  error={errors.title?.message}
                  placeholder="Full Stack Developer"
                />
              </div>
              <div className="grid sm:grid-cols-2 gap-6">
                <Input
                  label="Email"
                  type="email"
                  {...register('email')}
                  error={errors.email?.message}
                  placeholder="john@example.com"
                />
                <Input
                  label="Phone (optional)"
                  {...register('phone')}
                  placeholder="+1 (555) 000-0000"
                />
              </div>
              <Input
                label="Location (optional)"
                {...register('location')}
                placeholder="San Francisco, CA"
              />
              <Textarea
                label="Bio"
                {...register('bio')}
                error={errors.bio?.message}
                rows={5}
                placeholder="Tell visitors about yourself..."
              />
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Social Links</CardTitle>
              <Button variant="ghost" size="sm" type="button" onClick={addSocialLink}>
                <Plus className="w-4 h-4 mr-1" />
                Add Link
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {socialLinks.map((link, index) => (
                  <motion.div key={index} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="flex gap-3">
                    <div className="w-1/4">
                      <Input
                        label="Platform"
                        value={link.platform}
                        onChange={(e) => {
                          const updated = [...socialLinks];
                          updated[index] = { ...updated[index], platform: e.target.value };
                          setValue('socialLinks', updated);
                        }}
                        placeholder="github"
                      />
                    </div>
                    <div className="w-1/2">
                      <Input
                        label="URL"
                        type="url"
                        value={link.url}
                        onChange={(e) => {
                          const updated = [...socialLinks];
                          updated[index] = { ...updated[index], url: e.target.value };
                          setValue('socialLinks', updated);
                        }}
                        placeholder="https://github.com/username"
                      />
                    </div>
                    <div className="w-1/4">
                      <Input
                        label="Icon"
                        value={link.icon}
                        onChange={(e) => {
                          const updated = [...socialLinks];
                          updated[index] = { ...updated[index], icon: e.target.value };
                          setValue('socialLinks', updated);
                        }}
                        placeholder="github"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => removeSocialLink(index)}
                      className="mt-10 p-2 rounded-xl text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                      aria-label="Remove social link"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </motion.div>
                ))}
                {socialLinks.length === 0 && (
                  <p className="text-center text-dark-500 dark:text-dark-400 py-4">No social links added yet</p>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </form>
    </div>
  );
}