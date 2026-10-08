'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { LayoutDashboard, Briefcase, FolderGit2, Award, BookOpen, Book, Users, TrendingUp, ArrowUpRight, Plus, ExternalLink } from 'lucide-react';
import { formatDate } from '@/lib/utils';
import { cn } from '@/lib/utils';
import { useQuery } from '@tanstack/react-query';
import { api, fetcher } from '@/lib/api';

interface DashboardStats {
  profile: { name: string; title: string } | null;
  about: { skillsCount: number } | null;
  experiences: number;
  projects: { total: number; featured: number; byStatus: Record<string, number> };
  credentials: { total: number; active: number; expired: number };
  certifications: { total: number; active: number; expired: number };
}

const statCards = [
  { key: 'experiences', label: 'Experience', icon: Briefcase, color: 'bg-blue-500', href: '/admin/experience' },
  { key: 'projects.total', label: 'Projects', icon: FolderGit2, color: 'bg-green-500', href: '/admin/projects' },
  { key: 'credentials.active', label: 'Active Credentials', icon: Award, color: 'bg-purple-500', href: '/admin/credentials' },
  { key: 'certifications.active', label: 'Active Certifications', icon: BookOpen, color: 'bg-orange-500', href: '/admin/certifications' },
];

function getNestedValue(obj: any, path: string) {
  return path.split('.').reduce((o, k) => o?.[k], obj);
}

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['dashboardStats'],
    queryFn: () => fetcher<DashboardStats>('/api/backend/profile'),
    // We'll fetch from multiple endpoints
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [profileRes, aboutRes, expRes, projRes, credRes, certRes] = await Promise.all([
          fetch('/api/backend/profile').then(r => r.json()),
          fetch('/api/backend/about').then(r => r.json()),
          fetch('/api/backend/experience?limit=100').then(r => r.json()),
          fetch('/api/backend/projects?limit=100').then(r => r.json()),
          fetch('/api/backend/credentials?limit=100').then(r => r.json()),
          fetch('/api/backend/certifications?limit=100').then(r => r.json()),
        ]);

        const projects = projRes.data || [];
        const credentials = credRes.data || [];
        const certifications = certRes.data || [];

        setStats({
          profile: profileRes.data,
          about: aboutRes.data,
          experiences: expRes.data?.length || expRes.meta?.total || 0,
          projects: {
            total: projects.length,
            featured: projects.filter((p: any) => p.featured).length,
            byStatus: projects.reduce((acc: any, p: any) => {
              acc[p.status] = (acc[p.status] || 0) + 1;
              return acc;
            }, {}),
          },
          credentials: {
            total: credentials.length,
            active: credentials.filter((c: any) => !c.expiryDate || new Date(c.expiryDate) > new Date()).length,
            expired: credentials.filter((c: any) => c.expiryDate && new Date(c.expiryDate) <= new Date()).length,
          },
          certifications: {
            total: certifications.length,
            active: certifications.filter((c: any) => c.isActive && (!c.expiryDate || new Date(c.expiryDate) > new Date())).length,
            expired: certifications.filter((c: any) => !c.isActive || (c.expiryDate && new Date(c.expiryDate) <= new Date())).length,
          },
        });
      } catch (err) {
        console.error('Failed to fetch dashboard stats:', err);
      }
    };

    fetchStats();
  }, []);

  if (isLoading && !stats) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-dark-900 dark:text-white">Dashboard</h1>
            <p className="text-dark-600 dark:text-dark-400">Welcome back! Here's an overview of your portfolio.</p>
          </div>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map(i => (
            <Card key={i} className="animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
      >
        <div>
          <h1 className="text-2xl font-bold text-dark-900 dark:text-white">Dashboard</h1>
          <p className="text-dark-600 dark:text-dark-400">Welcome back! Here's an overview of your portfolio.</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" asChild>
            <Link href="/">
              <ExternalLink className="w-4 h-4 mr-2" />
              View Site
            </Link>
          </Button>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        {statCards.map((stat, index) => (
          <motion.div key={stat.key} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 * (index + 1) }}>
            <Link href={stat.href} className="block">
              <Card className="h-full hover:border-primary-500/50 transition-colors">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm font-medium text-dark-600 dark:text-dark-400">{stat.label}</p>
                      <p className="text-3xl font-bold text-dark-900 dark:text-white mt-1">
                        {getNestedValue(stats, stat.key) || 0}
                      </p>
                    </div>
                    <div className={cn('p-3 rounded-xl', stat.color)}>
                      <stat.icon className="w-6 h-6 text-white" />
                    </div>
                  </div>
                  <div className="mt-4 flex items-center gap-1 text-sm text-primary-600 dark:text-primary-400">
                    <ArrowUpRight className="w-3.5 h-3.5" />
                    View details
                  </div>
                </CardContent>
              </Card>
            </Link>
          </motion.div>
        ))}
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="grid lg:grid-cols-3 gap-6"
      >
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Link href="/admin/projects/new" className="block">
              <Button variant="outline" className="w-full justify-start gap-3">
                <Plus className="w-4 h-4" />
                Add New Project
              </Button>
            </Link>
            <Link href="/admin/experience/new" className="block">
              <Button variant="outline" className="w-full justify-start gap-3">
                <Plus className="w-4 h-4" />
                Add Experience
              </Button>
            </Link>
            <Link href="/admin/credentials/new" className="block">
              <Button variant="outline" className="w-full justify-start gap-3">
                <Plus className="w-4 h-4" />
                Add Credential
              </Button>
            </Link>
            <Link href="/admin/certifications/new" className="block">
              <Button variant="outline" className="w-full justify-start gap-3">
                <Plus className="w-4 h-4" />
                Add Certification
              </Button>
            </Link>
            <Link href="/admin/about" className="block">
              <Button variant="outline" className="w-full justify-start gap-3">
                <Book className="w-4 h-4" />
                Update About Section
              </Button>
            </Link>
            <Link href="/admin/profile" className="block">
              <Button variant="outline" className="w-full justify-start gap-3">
                <User className="w-4 h-4" />
                Edit Profile
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Recent Projects</CardTitle>
            <Link href="/admin/projects" className="text-sm text-primary-600 hover:text-primary-700">View all</Link>
          </CardHeader>
          <CardContent>
            {stats?.projects.total === 0 ? (
              <div className="text-center py-8">
                <FolderGit2 className="w-12 h-12 mx-auto text-dark-300 dark:text-dark-700 mb-3" />
                <p className="text-dark-600 dark:text-dark-400">No projects yet. Add your first project!</p>
                <Link href="/admin/projects/new" className="mt-4 inline-block">
                  <Button size="sm"><Plus className="w-4 h-4 mr-2" />Add Project</Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {[]} {/* We'd need to fetch recent projects separately */}
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="grid lg:grid-cols-2 gap-6"
      >
        <Card>
          <CardHeader>
            <CardTitle>Project Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Object.entries(stats?.projects.byStatus || {}).map(([status, count]) => {
                const config: Record<string, { label: string; color: string }> = {
                  completed: { label: 'Completed', color: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300' },
                  'in-progress': { label: 'In Progress', color: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300' },
                  planned: { label: 'Planned', color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300' },
                };
                const c = config[status] || { label: status, color: 'bg-gray-100 text-gray-700' };
                return (
                  <div key={status} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Badge variant="default" className={c.color}>{c.label}</Badge>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-2xl font-bold text-dark-900 dark:text-white">{count}</span>
                      <div className="h-2 w-24 bg-dark-200 dark:bg-dark-700 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-primary-600 rounded-full transition-all duration-500"
                          style={{ width: `${(count / Math.max(1, stats?.projects.total || 1)) * 100}%` }}
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
              {Object.keys(stats?.projects.byStatus || {}).length === 0 && (
                <p className="text-center text-dark-500 dark:text-dark-400 py-4">No projects yet</p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Credentials & Certifications</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800">
                <p className="text-sm text-green-700 dark:text-green-300">Active Credentials</p>
                <p className="text-3xl font-bold text-green-600 dark:text-green-400">{stats?.credentials.active || 0}</p>
              </div>
              <div className="p-4 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
                <p className="text-sm text-red-700 dark:text-red-300">Expired Credentials</p>
                <p className="text-3xl font-bold text-red-600 dark:text-red-400">{stats?.credentials.expired || 0}</p>
              </div>
              <div className="p-4 rounded-xl bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
                <p className="text-sm text-blue-700 dark:text-blue-300">Active Certifications</p>
                <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">{stats?.certifications.active || 0}</p>
              </div>
              <div className="p-4 rounded-xl bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800">
                <p className="text-sm text-orange-700 dark:text-orange-300">Expired Certifications</p>
                <p className="text-3xl font-bold text-orange-600 dark:text-orange-400">{stats?.certifications.expired || 0}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}