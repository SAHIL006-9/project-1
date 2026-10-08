'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { ScrollReveal } from '@/components/ui/motion';
import { Input, Textarea, Button } from '@/components/ui';
import { Mail, MapPin, Phone, MessageSquare, Send, CheckCircle, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { cn } from '@/lib/utils';

interface ContactProps {
  email: string;
  phone?: string;
  location?: string;
}

export function Contact({ email, phone, location }: ContactProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      // Replace with your actual API endpoint
      // const response = await fetch('/api/contact', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(formData),
      // });
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setSubmitStatus('success');
      toast.success('Message sent successfully!');
      setFormData({ name: '', email: '', subject: '', message: '' });
    } catch {
      setSubmitStatus('error');
      toast.error('Failed to send message. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    if (submitStatus !== 'idle') setSubmitStatus('idle');
  };

  return (
    <section id="contact" className="section bg-white dark:bg-dark-950">
      <div className="container-custom">
        <ScrollReveal>
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="section-title">Get In Touch</h2>
            <p className="section-subtitle mx-auto">
              Have a project in mind or just want to say hi? I'd love to hear from you.
            </p>
          </div>
        </ScrollReveal>

        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16">
          <ScrollReveal className="lg:order-2">
            <form onSubmit={handleSubmit} className="space-y-6" noValidate>
              <div className="grid sm:grid-cols-2 gap-6">
                <Input
                  label="Name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  placeholder="John Doe"
                  autoComplete="name"
                />
                <Input
                  label="Email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder="john@example.com"
                  autoComplete="email"
                />
              </div>
              <Input
                label="Subject"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                required
                placeholder="Project inquiry / Collaboration / Just saying hi"
              />
              <Textarea
                label="Message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                required
                rows={6}
                placeholder="Tell me about your project, ideas, or just say hello..."
                minLength={20}
              />
              <Button type="submit" size="xl" className="w-full sm:w-auto" loading={isSubmitting}>
                {submitStatus === 'success' ? (
                  <>
                    <CheckCircle className="w-5 h-5" />
                    Message Sent!
                  </>
                ) : isSubmitting ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5" />
                    Send Message
                  </>
                )}
              </Button>
              {submitStatus === 'success' && (
                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-green-600 dark:text-green-400 text-sm"
                >
                  Thanks for reaching out! I'll get back to you soon.
                </motion.p>
              )}
            </form>
          </ScrollReveal>

          <ScrollReveal>
            <div className="space-y-8">
              <div className="bg-dark-50 dark:bg-dark-900 rounded-2xl p-8 border border-dark-200 dark:border-dark-800">
                <h3 className="text-xl font-bold text-dark-900 dark:text-white mb-6">Let's Connect</h3>
                <p className="text-dark-600 dark:text-dark-400 mb-8">
                  I'm always open to discussing new projects, creative ideas, or opportunities to be part of your vision.
                </p>
                
                <div className="space-y-4">
                  <a
                    href={`mailto:${email}`}
                    className="flex items-center gap-4 p-4 rounded-xl bg-white dark:bg-dark-950 border border-dark-200 dark:border-dark-800 hover:border-primary-500/50 transition-colors group"
                  >
                    <div className="p-3 rounded-xl bg-primary-100 text-primary-600 dark:bg-primary-900/30 dark:text-primary-400 group-hover:scale-110 transition-transform">
                      <Mail className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-sm text-dark-500 dark:text-dark-400">Email</p>
                      <p className="font-medium text-dark-900 dark:text-white">{email}</p>
                    </div>
                  </a>

                  {phone && (
                    <a
                      href={`tel:${phone}`}
                      className="flex items-center gap-4 p-4 rounded-xl bg-white dark:bg-dark-950 border border-dark-200 dark:border-dark-800 hover:border-primary-500/50 transition-colors group"
                    >
                      <div className="p-3 rounded-xl bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400 group-hover:scale-110 transition-transform">
                        <Phone className="w-6 h-6" />
                      </div>
                      <div>
                        <p className="text-sm text-dark-500 dark:text-dark-400">Phone</p>
                        <p className="font-medium text-dark-900 dark:text-white">{phone}</p>
                      </div>
                    </a>
                  )}

                  {location && (
                    <div className="flex items-center gap-4 p-4 rounded-xl bg-white dark:bg-dark-950 border border-dark-200 dark:border-dark-800">
                      <div className="p-3 rounded-xl bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">
                        <MapPin className="w-6 h-6" />
                      </div>
                      <div>
                        <p className="text-sm text-dark-500 dark:text-dark-400">Location</p>
                        <p className="font-medium text-dark-900 dark:text-white">{location}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="bg-gradient-to-br from-primary-600 to-purple-600 rounded-2xl p-8 text-white">
                <h3 className="text-xl font-bold mb-3">Prefer a quick chat?</h3>
                <p className="text-primary-100 mb-6">
                  Schedule a 15-minute call to discuss your project. No commitment, just a friendly conversation.
                </p>
                <Button
                  variant="secondary"
                  size="lg"
                  className="bg-white text-primary-600 hover:bg-primary-50"
                  onClick={() => window.open('https://calendly.com', '_blank')}
                >
                  <MessageSquare className="w-5 h-5 mr-2" />
                  Schedule a Call
                </Button>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}