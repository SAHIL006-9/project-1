'use client';

import { motion } from 'framer-motion';
import { ScrollReveal, StaggerContainer, StaggerItem } from '@/components/ui/motion';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';

interface AboutProps {
  description: string;
  skills: Array<{ name: string; category: string; proficiency: number; icon?: string }>;
  interests: Array<{ name: string; icon?: string }>;
  stats: Array<{ label: string; value: string | number; icon?: string }>;
}

const categoryColors: Record<string, string> = {
  frontend: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
  backend: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300',
  database: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300',
  devops: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300',
  tools: 'bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-300',
  other: 'bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-300',
};

const categoryIcons: Record<string, string> = {
  frontend: '🎨',
  backend: '⚙️',
  database: '🗄️',
  devops: '☁️',
  tools: '🔧',
  other: '📦',
};

export function About({ description, skills, interests, stats }: AboutProps) {
  const groupedSkills = skills.reduce((acc, skill) => {
    if (!acc[skill.category]) acc[skill.category] = [];
    acc[skill.category].push(skill);
    return acc;
  }, {} as Record<string, typeof skills>);

  const categoryOrder = ['frontend', 'backend', 'database', 'devops', 'tools', 'other'];

  return (
    <section id="about" className="section bg-white dark:bg-dark-950">
      <div className="container-custom">
        <ScrollReveal>
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="section-title">About Me</h2>
            <p className="section-subtitle mx-auto">
              Get to know me better - my background, skills, and what drives me as a developer.
            </p>
          </div>
        </ScrollReveal>

        <div className="grid lg:grid-cols-3 gap-8">
          <ScrollReveal className="lg:col-span-2">
            <Card className="h-full" padding="lg">
              <h3 className="text-2xl font-bold text-dark-900 dark:text-white mb-6">My Story</h3>
              <div className="prose prose-dark dark:prose-invert max-w-none">
                <p className="text-dark-600 dark:text-dark-300 leading-relaxed whitespace-pre-wrap">{description}</p>
              </div>
            </Card>
          </ScrollReveal>

          <ScrollReveal className="lg:col-span-1">
            <Card className="h-full" padding="lg">
              <h3 className="text-2xl font-bold text-dark-900 dark:text-white mb-6">Key Stats</h3>
              <div className="space-y-6">
                {stats.map((stat, index) => (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 * index }}
                    className="flex items-center gap-4"
                  >
                    <div className="p-3 rounded-xl bg-primary-100 dark:bg-primary-900/30">
                      {stat.icon ? (
                        <span className="text-2xl">{stat.icon}</span>
                      ) : (
                        <span className="text-3xl font-bold text-primary-600 dark:text-primary-400">{stat.value}</span>
                      )}
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-dark-900 dark:text-white">{stat.value}</p>
                      <p className="text-sm text-dark-500 dark:text-dark-400">{stat.label}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </Card>
          </ScrollReveal>
        </div>

        <ScrollReveal className="mt-16">
          <h3 className="text-2xl font-bold text-dark-900 dark:text-white mb-8">Technical Skills</h3>
          <StaggerContainer>
            {categoryOrder.map((category) => {
              const categorySkills = groupedSkills[category];
              if (!categorySkills || categorySkills.length === 0) return null;

              return (
                <StaggerItem key={category}>
                  <Card padding="lg" className="group hover:border-primary-500/50">
                    <div className="flex items-center gap-3 mb-4">
                      <span className="text-2xl">{categoryIcons[category] || '📦'}</span>
                      <h4 className="text-lg font-semibold text-dark-900 dark:text-white capitalize">{category}</h4>
                      <Badge variant="primary" size="sm">{categorySkills.length}</Badge>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {categorySkills
                        .sort((a, b) => b.proficiency - a.proficiency)
                        .map((skill) => (
                          <motion.div
                            key={skill.name}
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            className="group relative"
                          >
                            <Badge
                              variant="default"
                              className={cn(
                                'cursor-default',
                                categoryColors[category] || categoryColors.other
                              )}
                            >
                              {skill.name}
                              <div
                                className="absolute bottom-0 left-0 h-1 bg-current/50 rounded-b"
                                style={{ width: `${skill.proficiency}%` }}
                              />
                            </Badge>
                          </motion.div>
                        ))}
                    </div>
                  </Card>
                </StaggerItem>
              );
            })}
          </StaggerContainer>
        </ScrollReveal>

        {interests.length > 0 && (
          <ScrollReveal className="mt-16">
            <h3 className="text-2xl font-bold text-dark-900 dark:text-white mb-8">Interests & Hobbies</h3>
            <div className="flex flex-wrap gap-3">
              {interests.map((interest, index) => (
                <motion.div
                  key={interest.name}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Badge variant="default" className="gap-1.5">
                    {interest.icon && <span>{interest.icon}</span>}
                    {interest.name}
                  </Badge>
                </motion.div>
              ))}
            </div>
          </ScrollReveal>
        )}
      </div>
    </section>
  );
}