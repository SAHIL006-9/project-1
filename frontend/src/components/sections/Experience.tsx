'use client';

import { motion } from 'framer-motion';
import { ScrollReveal, StaggerContainer, StaggerItem } from '@/components/ui/motion';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { formatDate, formatDateShort } from '@/lib/utils';
import { Building2, Calendar, MapPin, Code, CheckCircle } from 'lucide-react';

interface ExperienceProps {
  experiences: Array<{
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
  }>;
}

const typeLabels: Record<string, string> = {
  'full-time': 'Full-time',
  'part-time': 'Part-time',
  contract: 'Contract',
  internship: 'Internship',
  freelance: 'Freelance',
};

export function Experience({ experiences }: ExperienceProps) {
  const sortedExperiences = [...experiences].sort(
    (a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime()
  );

  return (
    <section id="experience" className="section bg-dark-50 dark:bg-dark-900">
      <div className="container-custom">
        <ScrollReveal>
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="section-title">Experience</h2>
            <p className="section-subtitle mx-auto">
              My professional journey and the impact I've made along the way.
            </p>
          </div>
        </ScrollReveal>

        <div className="relative">
          <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary-500 to-transparent dark:from-primary-500 dark:to-transparent" />
          
          <StaggerContainer>
            {sortedExperiences.map((exp, index) => (
              <StaggerItem key={exp._id} className="relative">
                <motion.div
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: '-50px' }}
                  className="relative pl-16 pb-12 last:pb-0"
                >
                  <div className="absolute left-0 top-2">
                    <div className="w-4 h-4 rounded-full bg-primary-500 border-4 bg-white dark:bg-dark-900 border-dark-200 dark:border-dark-800 z-10" />
                    {exp.current && (
                      <motion.div
                        className="absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-green-500"
                        animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      />
                    )}
                  </div>

                  <Card padding="lg" className="group hover:border-primary-500/50 transition-colors">
                    <div className="flex items-start justify-between gap-4 mb-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="text-xl font-bold text-dark-900 dark:text-white">{exp.role}</h3>
                          {exp.current && (
                            <Badge variant="success" size="sm" dot dotColor="#10b981">
                              Current
                            </Badge>
                          )}
                        </div>
                        <p className="text-lg text-primary-600 dark:text-primary-400 font-medium">{exp.company}</p>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-dark-500 dark:text-dark-400 shrink-0">
                        <Calendar className="w-4 h-4" />
                        <span>
                          {formatDateShort(exp.startDate)} - {exp.current ? 'Present' : formatDateShort(exp.endDate || '')}
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-2 mb-4">
                      <Badge variant="default" className={typeLabels[exp.type] ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300' : ''}>
                        {typeLabels[exp.type] || exp.type}
                      </Badge>
                      {exp.location && (
                        <Badge variant="default" className="gap-1.5">
                          <MapPin className="w-3 h-3" />
                          {exp.location}
                        </Badge>
                      )}
                    </div>

                    {exp.description.length > 0 && (
                      <div className="mb-4">
                        <ul className="space-y-2">
                          {exp.description.map((desc, i) => (
                            <motion.li
                              key={i}
                              initial={{ opacity: 0, x: -10 }}
                              whileInView={{ opacity: 1, x: 0 }}
                              viewport={{ once: true }}
                              transition={{ delay: 0.1 * i }}
                              className="flex items-start gap-2 text-dark-600 dark:text-dark-400"
                            >
                              <CheckCircle className="w-5 h-5 text-primary-500 flex-shrink-0 mt-0.5" />
                              <span>{desc}</span>
                            </motion.li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {exp.technologies.length > 0 && (
                      <div>
                        <p className="text-sm font-medium text-dark-700 dark:text-dark-300 mb-2">Technologies:</p>
                        <div className="flex flex-wrap gap-2">
                          {exp.technologies.map((tech) => (
                            <Badge key={tech} variant="default" size="sm" className="bg-dark-100 text-dark-700 dark:bg-dark-800 dark:text-dark-300">
                              {tech}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </Card>
                </motion.div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </div>
    </section>
  );
}