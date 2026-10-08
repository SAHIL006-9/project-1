'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/Card';
import { Save, Loader2, Palette, Shield, Bell, Moon, Sun, Monitor } from 'lucide-react';
import toast from 'react-hot-toast';
import { useTheme } from 'next-themes';
import { cn } from '@/lib/utils';

const settingsSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  currentPassword: z.string().optional(),
  newPassword: z.string().min(8, 'Password must be at least 8 characters').optional(),
  confirmPassword: z.string().optional(),
}).refine((data) => {
  if (data.newPassword && data.newPassword !== data.confirmPassword) {
    return false;
  }
  return true;
}, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});

type SettingsForm = z.infer<typeof settingsSchema>;

export default function SettingsPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'account' | 'appearance' | 'notifications' | 'security'>('account');
  const { theme, setTheme, resolvedTheme } = useTheme();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors, isDirty },
  } = useForm<SettingsForm>({
    resolver: zodResolver(settingsSchema),
    defaultValues: {
      name: '',
      email: '',
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
  });

  const fetchSettings = async () => {
    try {
      const res = await fetch('/api/backend/auth/me');
      const data = await res.json();
      if (data.success && data.data) {
        setValue('name', data.data.name);
        setValue('email', data.data.email);
      }
    } catch (err) {
      console.error('Failed to fetch settings:', err);
    }
  };

  const onSubmit = async (data: SettingsForm) => {
    setIsLoading(true);
    try {
      // Update profile
      const profileRes = await fetch('/api/backend/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          name: data.name,
          email: data.email,
        }),
      });
      
      if (!profileRes.ok) {
        const error = await profileRes.json();
        throw new Error(error.message);
      }

      // Change password if provided
      if (data.currentPassword && data.newPassword) {
        const passRes = await fetch('/api/backend/auth/password', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({
            currentPassword: data.currentPassword,
            newPassword: data.newPassword,
          }),
        });
        
        if (!passRes.ok) {
          const error = await passRes.json();
          throw new Error(error.message);
        }
      }

      toast.success('Settings saved successfully!');
      reset({ ...data, currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err: any) {
      toast.error(err.message || 'Failed to save settings');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
      >
        <div>
          <h1 className="text-2xl font-bold text-dark-900 dark:text-white">Settings</h1>
          <p className="text-dark-600 dark:text-dark-400">Manage your account settings and preferences.</p>
        </div>
        <Button onClick={handleSubmit(onSubmit)} disabled={!isDirty || isLoading} loading={isLoading}>
          <Save className="w-4 h-4 mr-2" />
          Save Changes
        </Button>
      </motion.div>

      <div className="flex gap-2 border-b border-dark-200 dark:border-dark-800 mb-6">
        {[
          { id: 'account', label: 'Account', icon: Shield },
          { id: 'appearance', label: 'Appearance', icon: Palette },
          { id: 'notifications', label: 'Notifications', icon: Bell },
          { id: 'security', label: 'Security', icon: Shield },
        ].map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id as any)}
            className={cn(
              'flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-t-xl transition-colors',
              activeTab === tab.id
                ? 'bg-primary-50 text-primary-700 dark:bg-primary-900/30 dark:text-primary-300'
                : 'text-dark-600 hover:text-dark-900 dark:text-dark-400 dark:hover:text-white'
            )}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {activeTab === 'account' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <Card>
              <CardHeader>
                <CardTitle>Account Information</CardTitle>
                <CardDescription>Update your profile information</CardDescription>
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
                    label="Email"
                    type="email"
                    {...register('email')}
                    error={errors.email?.message}
                    placeholder="john@example.com"
                  />
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {activeTab === 'appearance' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <Card>
              <CardHeader>
                <CardTitle>Appearance</CardTitle>
                <CardDescription>Customize how the admin panel looks</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <label className="label">Theme</label>
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { value: 'light', label: 'Light', icon: Sun },
                      { value: 'dark', label: 'Dark', icon: Moon },
                      { value: 'system', label: 'System', icon: Monitor },
                    ].map((option) => (
                      <button
                        key={option.value}
                        type="button"
                        onClick={() => setTheme(option.value)}
                        className={cn(
                          'p-4 rounded-xl border-2 transition-all text-center',
                          theme === option.value || (theme === 'system' && resolvedTheme === option.value && option.value !== 'system')
                            ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                            : 'border-dark-200 dark:border-dark-700 hover:border-primary-300'
                        )}
                      >
                        <option.icon className="w-6 h-6 mx-auto mb-2" />
                        <span className="font-medium">{option.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {activeTab === 'notifications' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <Card>
              <CardHeader>
                <CardTitle>Notifications</CardTitle>
                <CardDescription>Configure notification preferences</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  { label: 'Email notifications', description: 'Receive email updates about your portfolio' },
                  { label: 'Admin activity', description: 'Get notified about admin panel changes' },
                  { label: 'Security alerts', description: 'Be alerted about security-related events' },
                  { label: 'Weekly digest', description: 'Receive a weekly summary of portfolio views' },
                ].map((item) => (
                  <div key={item.label} className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-dark-900 dark:text-white">{item.label}</p>
                      <p className="text-sm text-dark-500 dark:text-dark-400">{item.description}</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" defaultChecked />
                      <div className="w-11 h-6 bg-dark-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 dark:peer-focus:ring-primary-800 rounded-full peer dark:bg-dark-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary-600"></div>
                    </label>
                  </div>
                ))}
              </CardContent>
            </Card>
          </motion.div>
        )}

        {activeTab === 'security' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <Card>
              <CardHeader>
                <CardTitle>Security</CardTitle>
                <CardDescription>Manage your password and security settings</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid sm:grid-cols-2 gap-6">
                  <Input
                    label="Current Password"
                    type="password"
                    {...register('currentPassword')}
                    error={errors.currentPassword?.message}
                    placeholder="••••••••"
                  />
                </div>
                <div className="grid sm:grid-cols-2 gap-6">
                  <Input
                    label="New Password"
                    type="password"
                    {...register('newPassword')}
                    error={errors.newPassword?.message}
                    placeholder="••••••••"
                  />
                  <Input
                    label="Confirm New Password"
                    type="password"
                    {...register('confirmPassword')}
                    error={errors.confirmPassword?.message}
                    placeholder="••••••••"
                  />
                </div>
                <p className="text-sm text-dark-500 dark:text-dark-400">
                  Leave password fields blank to keep your current password.
                </p>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </form>
    </div>
  );
}