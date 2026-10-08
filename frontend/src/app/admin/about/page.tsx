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
import { Save, Plus, Trash2, GripVertical, Loader2, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import { cn } from '@/lib/utils';

const aboutSchema = z.object({
  description: z.string().min(10, 'Description must be at least 10 characters'),
  skills: z.array(z.object({
    name: z.string().min(1, 'Skill name is required'),
    category: z.enum(['frontend', 'backend', 'database', 'devops', 'tools', 'other']),
    proficiency: z.number().min(1).max(100),
    icon: z.string().optional(),
    order: z.number(),
  })).optional(),
  interests: z.array(z.object({
    name: z.string().min(1, 'Interest name is required'),
    icon: z.string().optional(),
    order: z.number(),
  })).optional(),
  stats: z.array(z.object({
    label: z.string().min(1, 'Label is required'),
    value: z.union([z.string(), z.number()]),
    icon: z.string().optional(),
    order: z.number(),
  })).optional(),
});

type AboutForm = z.infer<typeof aboutSchema>;

const categories = [
  { value: 'frontend', label: 'Frontend', icon: '🎨' },
  { value: 'backend', label: 'Backend', icon: '⚙️' },
  { value: 'database', label: 'Database', icon: '🗄️' },
  { value: 'devops', label: 'DevOps', icon: '☁️' },
  { value: 'tools', label: 'Tools', icon: '🔧' },
  { value: 'other', label: 'Other', icon: '📦' },
];

export default function AboutPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'main' | 'skills' | 'interests' | 'stats'>('main');

  const {
    register,
    control,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isDirty },
  } = useForm<AboutForm>({
    resolver: zodResolver(aboutSchema),
    defaultValues: {
      description: '',
      skills: [],
      interests: [],
      stats: [],
    },
  });

  const skills = watch('skills') || [];
  const interests = watch('interests') || [];
  const stats = watch('stats') || [];

  const { fields: skillFields, append: appendSkill, remove: removeSkill, move: moveSkill } = useFieldArray({
    control,
    name: 'skills',
  });

  const { fields: interestFields, append: appendInterest, remove: removeInterest } = useFieldArray({
    control,
    name: 'interests',
  });

  const { fields: statFields, append: appendStat, remove: removeStat } = useFieldArray({
    control,
    name: 'stats',
  });

  const fetchAbout = async () => {
    try {
      const res = await fetch('/api/backend/about');
      const data = await res.json();
      if (data.success && data.data) {
        const about = data.data;
        setValue('description', about.description || '');
        if (about.skills?.length) setValue('skills', about.skills);
        if (about.interests?.length) setValue('interests', about.interests);
        if (about.stats?.length) setValue('stats', about.stats);
      }
    } catch (err) {
      console.error('Failed to fetch about:', err);
    }
  };

  const onSubmit = async (data: AboutForm) => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/backend/about', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(data),
      });
      const result = await res.json();
      if (!res.ok) throw new Error(result.message);
      toast.success('About section saved!');
    } catch (err: any) {
      toast.error(err.message || 'Failed to save');
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
          <h1 className="text-2xl font-bold text-dark-900 dark:text-white">About Section</h1>
          <p className="text-dark-600 dark:text-dark-400">Manage your about section, skills, interests, and stats.</p>
        </div>
        <Button onClick={handleSubmit(onSubmit)} disabled={!isDirty || isLoading} loading={isLoading}>
          <Save className="w-4 h-4 mr-2" />
          Save Changes
        </Button>
      </motion.div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="flex gap-2 border-b border-dark-200 dark:border-dark-800">
          {[
            { id: 'main', label: 'Description' },
            { id: 'skills', label: 'Skills' },
            { id: 'interests', label: 'Interests' },
            { id: 'stats', label: 'Stats' },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id as any)}
              className={cn(
                'px-4 py-2 text-sm font-medium rounded-t-xl transition-colors',
                activeTab === tab.id
                  ? 'bg-primary-50 text-primary-700 dark:bg-primary-900/30 dark:text-primary-300'
                  : 'text-dark-600 hover:text-dark-900 dark:text-dark-400 dark:hover:text-white'
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {activeTab === 'main' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <Card>
              <CardHeader>
                <CardTitle>Description</CardTitle>
              </CardHeader>
              <CardContent>
                <Textarea
                  label="About Description"
                  {...register('description')}
                  error={errors.description?.message}
                  rows={8}
                  placeholder="Write a detailed description about yourself..."
                />
              </CardContent>
            </Card>
          </motion.div>
        )}

        {activeTab === 'skills' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Technical Skills</CardTitle>
                <Button variant="ghost" size="sm" type="button" onClick={() => appendSkill({ name: '', category: 'frontend', proficiency: 50, order: skills.length })}>
                  <Plus className="w-4 h-4 mr-1" />
                  Add Skill
                </Button>
              </CardHeader>
              <CardContent>
                {skillFields.length === 0 ? (
                  <p className="text-center text-dark-500 dark:text-dark-400 py-8">No skills added yet</p>
                ) : (
                  <div className="space-y-4">
                    {skillFields.map((field, index) => (
                      <motion.div
                        key={field.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="flex items-center gap-3 p-4 rounded-xl bg-dark-50 dark:bg-dark-900 border border-dark-200 dark:border-dark-800"
                      >
                        <button
                          type="button"
                          className="p-2 text-dark-400 hover:text-dark-600 dark:hover:text-dark-300 cursor-grab active:cursor-grabbing"
                          onMouseDown={(e) => e.preventDefault()}
                        >
                          <GripVertical className="w-5 h-5" />
                        </button>
                        <div className="w-1/4">
                          <Input
                            {...register(`skills.${index}.name`)}
                            placeholder="Skill name"
                            error={errors.skills?.[index]?.name?.message}
                          />
                        </div>
                        <div className="w-1/5">
                          <select
                            {...register(`skills.${index}.category`)}
                            className="input appearance-none"
                          >
                            {categories.map((cat) => (
                              <option key={cat.value} value={cat.value}>{cat.icon} {cat.label}</option>
                            ))}
                          </select>
                        </div>
                        <div className="w-1/5">
                          <Input
                            type="number"
                            min="1"
                            max="100"
                            {...register(`skills.${index}.proficiency`, { valueAsNumber: true })}
                            placeholder="Proficiency (1-100)"
                            error={errors.skills?.[index]?.proficiency?.message}
                          />
                        </div>
                        <div className="w-1/5">
                          <Input
                            {...register(`skills.${index}.icon`)}
                            placeholder="Emoji/icon (optional)"
                          />
                        </div>
                        <div className="w-1/6">
                          <Input
                            type="number"
                            {...register(`skills.${index}.order`, { valueAsNumber: true })}
                            placeholder="Order"
                          />
                        </div>
                        <button
                          type="button"
                          onClick={() => removeSkill(index)}
                          className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-colors"
                          aria-label="Remove skill"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </motion.div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        )}

        {activeTab === 'interests' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Interests</CardTitle>
                <Button variant="ghost" size="sm" type="button" onClick={() => appendInterest({ name: '', icon: '', order: interests.length })}>
                  <Plus className="w-4 h-4 mr-1" />
                  Add Interest
                </Button>
              </CardHeader>
              <CardContent>
                {interestFields.length === 0 ? (
                  <p className="text-center text-dark-500 dark:text-dark-400 py-8">No interests added yet</p>
                ) : (
                  <div className="space-y-4">
                    {interestFields.map((field, index) => (
                      <motion.div
                        key={field.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="flex items-center gap-3 p-4 rounded-xl bg-dark-50 dark:bg-dark-900 border border-dark-200 dark:border-dark-800"
                      >
                        <div className="flex-1">
                          <Input
                            {...register(`interests.${index}.name`)}
                            placeholder="Interest name"
                            error={errors.interests?.[index]?.name?.message}
                          />
                        </div>
                        <div className="w-1/4">
                          <Input
                            {...register(`interests.${index}.icon`)}
                            placeholder="Emoji (optional)"
                          />
                        </div>
                        <div className="w-1/6">
                          <Input
                            type="number"
                            {...register(`interests.${index}.order`, { valueAsNumber: true })}
                            placeholder="Order"
                          />
                        </div>
                        <button
                          type="button"
                          onClick={() => removeInterest(index)}
                          className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-colors"
                          aria-label="Remove interest"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </motion.div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        )}

        {activeTab === 'stats' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Statistics</CardTitle>
                <Button variant="ghost" size="sm" type="button" onClick={() => appendStat({ label: '', value: 0, icon: '', order: stats.length })}>
                  <Plus className="w-4 h-4 mr-1" />
                  Add Stat
                </Button>
              </CardHeader>
              <CardContent>
                {statFields.length === 0 ? (
                  <p className="text-center text-dark-500 dark:text-dark-400 py-8">No stats added yet</p>
                ) : (
                  <div className="space-y-4">
                    {statFields.map((field, index) => (
                      <motion.div
                        key={field.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="flex items-center gap-3 p-4 rounded-xl bg-dark-50 dark:bg-dark-900 border border-dark-200 dark:border-dark-800"
                      >
                        <div className="w-1/3">
                          <Input
                            {...register(`stats.${index}.label`)}
                            placeholder="Label (e.g., Years Experience)"
                            error={errors.stats?.[index]?.label?.message}
                          />
                        </div>
                        <div className="w-1/4">
                          <Input
                            {...register(`stats.${index}.value`)}
                            placeholder="Value (e.g., 5+)"
                            error={errors.stats?.[index]?.value?.message}
                          />
                        </div>
                        <div className="w-1/5">
                          <Input
                            {...register(`stats.${index}.icon`)}
                            placeholder="Emoji (optional)"
                          />
                        </div>
                        <div className="w-1/6">
                          <Input
                            type="number"
                            {...register(`stats.${index}.order`, { valueAsNumber: true })}
                            placeholder="Order"
                          />
                        </div>
                        <button
                          type="button"
                          onClick={() => removeStat(index)}
                          className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-colors"
                          aria-label="Remove stat"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </motion.div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        )}
      </form>
    </div>
  );
}