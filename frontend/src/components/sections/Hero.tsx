'use client';

import { motion } from 'framer-motion';
import { ArrowRight, Github, Linkedin, Mail, Code, Terminal, Database, Server } from 'lucide-react';
import { ScrollReveal } from '@/components/ui/motion';
import { cn } from '@/lib/utils';

interface HeroProps {
  name: string;
  title: string;
  bio: string;
  avatar?: string;
  socialLinks: Array<{ platform: string; url: string; icon: string }>;
}

const techIcons = [
  { icon: Code, color: 'text-primary-500', label: 'Frontend' },
  { icon: Terminal, color: 'text-green-500', label: 'Backend' },
  { icon: Database, color: 'text-orange-500', label: 'Database' },
  { icon: Server, color: 'text-purple-500', label: 'DevOps' },
];

export function Hero({ name, title, bio, avatar, socialLinks }: HeroProps) {
  const socialIcons: Record<string, React.ComponentType<any>> = {
    github: Github,
    linkedin: Linkedin,
    twitter: Twitter,
    mail: Mail,
  };

  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center pt-16 overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary-500/10 via-transparent to-transparent dark:from-primary-500/20" />
      <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-5 dark:opacity-10" />
      
      <div className="container-custom relative z-10 py-20 lg:py-32">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <div>
            <ScrollReveal variant={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6 } } }}>
              <motion.span
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
                className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-300 text-sm font-medium mb-6"
              >
                <span className="w-2 h-2 rounded-full bg-primary-500 animate-pulse" />
                Open to opportunities
              </motion.span>
            </ScrollReveal>

            <ScrollReveal variant={{ hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0, transition: { duration: 0.8, delay: 0.1 } } }}>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-dark-900 dark:text-white leading-tight mb-6">
                Hi, I&apos;m <span className="text-primary-600 dark:text-primary-400">{name}</span>
              </h1>
            </ScrollReveal>

            <ScrollReveal variant={{ hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0, transition: { duration: 0.8, delay: 0.2 } } }}>
              <p className="text-xl sm:text-2xl text-dark-600 dark:text-dark-300 font-medium mb-6 min-h-[2.5rem]">
                {title}
              </p>
            </ScrollReveal>

            <ScrollReveal variant={{ hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0, transition: { duration: 0.8, delay: 0.3 } } }}>
              <p className="text-lg text-dark-600 dark:text-dark-400 max-w-xl mb-8 leading-relaxed">
                {bio}
              </p>
            </ScrollReveal>

            <ScrollReveal variant={{ hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0, transition: { duration: 0.8, delay: 0.4 } } }}>
              <div className="flex flex-wrap items-center gap-4 mb-12">
                <a
                  href="#projects"
                  className="group inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary-600 text-white font-medium hover:bg-primary-700 transition-colors"
                >
                  View Projects
                  <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                </a>
                <a
                  href="#contact"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border-2 border-dark-300 text-dark-700 font-medium hover:bg-dark-100 dark:border-dark-600 dark:text-dark-300 dark:hover:bg-dark-800 transition-colors"
                >
                  Get In Touch
                </a>
              </div>
            </ScrollReveal>

            <ScrollReveal variant={{ hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0, transition: { duration: 0.8, delay: 0.5 } } }}>
              <div className="flex flex-wrap items-center gap-3">
                {socialLinks.map((social, index) => {
                  const Icon = socialIcons[social.platform.toLowerCase()] || Github;
                  return (
                    <a
                      key={social.platform}
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={cn(
                        'p-3 rounded-xl bg-white dark:bg-dark-900 border border-dark-200 dark:border-dark-800',
                        'text-dark-600 hover:text-primary-600 dark:text-dark-400 dark:hover:text-primary-400',
                        'hover:border-primary-500/50 transition-all duration-200',
                        'group'
                      )}
                      aria-label={social.platform}
                    >
                      <Icon className="w-5 h-5" />
                    </a>
                  );
                })}
              </div>
            </ScrollReveal>
          </div>

          <div className="relative">
            <ScrollReveal variant={{ hidden: { opacity: 0, x: 30 }, visible: { opacity: 1, x: 0, transition: { duration: 0.8, delay: 0.3 } } }}>
              <div className="relative">
                <div className="absolute -inset-4 bg-gradient-to-r from-primary-500/20 to-purple-500/20 rounded-3xl blur-2xl" />
                <div className="relative bg-white dark:bg-dark-900 rounded-3xl border border-dark-200 dark:border-dark-800 p-2 shadow-2xl">
                  {avatar ? (
                    <img
                      src={avatar}
                      alt={name}
                      className="w-full h-[400px] sm:h-[500px] object-cover rounded-2xl"
                    />
                  ) : (
                    <div className="w-full h-[400px] sm:h-[500px] rounded-2xl bg-gradient-to-br from-primary-500/20 to-purple-500/20 flex items-center justify-center">
                      <div className="text-center p-8">
                        <Code className="w-16 h-16 mx-auto text-primary-500/50 mb-4" />
                        <p className="text-dark-500 dark:text-dark-400">Add your avatar in admin panel</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </ScrollReveal>

            <ScrollReveal variant={{ hidden: { opacity: 0 }, visible: { opacity: 1, transition: { delay: 0.8 } } }}>
              <div className="absolute -bottom-8 -left-8 lg:-left-12 flex flex-wrap gap-3">
                {techIcons.map((tech, index) => (
                  <motion.div
                    key={tech.label}
                    initial={{ opacity: 0, scale: 0.8, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    transition={{ delay: 0.9 + index * 0.1, type: 'spring', stiffness: 100 }}
                    className="p-4 rounded-2xl bg-white/80 dark:bg-dark-900/80 backdrop-blur-sm border border-dark-200 dark:border-dark-800 shadow-lg"
                  >
                    <div className="flex items-center gap-3">
                      <tech.icon className={cn('w-6 h-6', tech.color)} />
                      <span className="text-sm font-medium text-dark-700 dark:text-dark-300">{tech.label}</span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </ScrollReveal>
          </div>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 0.5 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce"
        aria-hidden="true"
      >
        <svg className="w-6 h-6 text-dark-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
        </svg>
      </motion.div>
    </section>
  );
}