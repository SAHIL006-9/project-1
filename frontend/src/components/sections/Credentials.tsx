'use client';

import { ScrollReveal, StaggerContainer, StaggerItem } from '@/components/ui/motion';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { formatDate } from '@/lib/utils';
import { Award, BookOpen, Medal, Shield, Calendar, Link2, ExternalLink } from 'lucide-react';

interface CredentialsProps {
  credentials: Array<{
    _id: string;
    type: 'degree' | 'certification' | 'award' | 'license' | 'publication' | 'other';
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
  }>;
  certifications: Array<{
    _id: string;
    name: string;
    issuer: string;
    issueDate: string;
    expiryDate?: string;
    credentialId: string;
    verificationUrl?: string;
    pdfUrl?: string;
    skills: string[];
    level: 'beginner' | 'intermediate' | 'advanced' | 'expert';
    category: string;
    isActive: boolean;
  }>;
}

const typeIcons: Record<string, React.ComponentType<any>> = {
  degree: BookOpen,
  certification: Award,
  award: Medal,
  license: Shield,
  publication: BookOpen,
  other: Award,
};

const typeColors: Record<string, string> = {
  degree: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
  certification: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300',
  award: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300',
  license: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300',
  publication: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300',
  other: 'bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-300',
};

const levelColors: Record<string, string> = {
  beginner: 'bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-300',
  intermediate: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
  advanced: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300',
  expert: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300',
};

export function Credentials({ credentials, certifications }: CredentialsProps) {
  const activeCredentials = credentials.filter(c => !c.expiryDate || new Date(c.expiryDate) > new Date());
  const expiredCredentials = credentials.filter(c => c.expiryDate && new Date(c.expiryDate) <= new Date());
  const activeCerts = certifications.filter(c => c.isActive && (!c.expiryDate || new Date(c.expiryDate) > new Date()));
  const expiredCerts = certifications.filter(c => !c.isActive || (c.expiryDate && new Date(c.expiryDate) <= new Date()));

  return (
    <section id="credentials" className="section bg-dark-50 dark:bg-dark-900">
      <div className="container-custom">
        <ScrollReveal>
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="section-title">Credentials & Certifications</h2>
            <p className="section-subtitle mx-auto">
              My educational background, professional certifications, and achievements.
            </p>
          </div>
        </ScrollReveal>

        {(activeCredentials.length > 0 || expiredCredentials.length > 0) && (
          <ScrollReveal className="mb-16">
            <h3 className="text-xl font-bold text-dark-900 dark:text-white mb-6">Credentials</h3>
            <StaggerContainer>
              {activeCredentials.map((cred) => (
                <StaggerItem key={cred._id}>
                  <CredentialCard credential={cred} expired={false} />
                </StaggerItem>
              ))}
              {expiredCredentials.map((cred) => (
                <StaggerItem key={cred._id}>
                  <CredentialCard credential={cred} expired={true} />
                </StaggerItem>
              ))}
            </StaggerContainer>
          </ScrollReveal>
        )}

        {(activeCerts.length > 0 || expiredCerts.length > 0) && (
          <ScrollReveal>
            <h3 className="text-xl font-bold text-dark-900 dark:text-white mb-6">Certifications</h3>
            <StaggerContainer>
              {activeCerts.map((cert) => (
                <StaggerItem key={cert._id}>
                  <CertificationCard certification={cert} expired={false} />
                </StaggerItem>
              ))}
              {expiredCerts.map((cert) => (
                <StaggerItem key={cert._id}>
                  <CertificationCard certification={cert} expired={true} />
                </StaggerItem>
              ))}
            </StaggerContainer>
          </ScrollReveal>
        )}

        {activeCredentials.length === 0 && expiredCredentials.length === 0 && activeCerts.length === 0 && expiredCerts.length === 0 && (
          <ScrollReveal>
            <div className="text-center py-16">
              <Award className="w-16 h-16 mx-auto text-dark-300 dark:text-dark-700 mb-4" />
              <p className="text-dark-600 dark:text-dark-400">
                No credentials or certifications added yet.
              </p>
            </div>
          </ScrollReveal>
        )}
      </div>
    </section>
  );
}

function CredentialCard({ credential, expired }: { credential: any; expired: boolean }) {
  const Icon = typeIcons[credential.type] || Award;
  const colorClass = typeColors[credential.type] || typeColors.other;

  return (
    <Card className={expired ? 'opacity-60' : ''} padding="lg" hover>
      <div className="flex items-start gap-4">
        <div className={cn('p-3 rounded-xl', colorClass)}>
          <Icon className="w-6 h-6" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h4 className="text-lg font-semibold text-dark-900 dark:text-white">{credential.title}</h4>
              <p className="text-dark-600 dark:text-dark-400">{credential.issuer}</p>
            </div>
            {credential.type !== 'other' && (
              <Badge variant="default" className={colorClass}>
                {credential.type.charAt(0).toUpperCase() + credential.type.slice(1)}
              </Badge>
            )}
          </div>
          
          {credential.description && (
            <p className="mt-2 text-sm text-dark-600 dark:text-dark-400 line-clamp-2">{credential.description}</p>
          )}

          <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-dark-500 dark:text-dark-400">
            <span className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              Issued: {formatDate(credential.issueDate)}
            </span>
            {credential.expiryDate && (
              <span className={cn('flex items-center gap-1', expired ? 'text-red-500' : '')}>
                <Calendar className="w-4 h-4" />
                Expires: {formatDate(credential.expiryDate)}
              </span>
            )}
            {credential.credentialId && (
              <span className="font-mono text-xs bg-dark-100 dark:bg-dark-800 px-2 py-1 rounded">
                {credential.credentialId}
              </span>
            )}
          </div>

          {credential.skills && credential.skills.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-1.5">
              {credential.skills.slice(0, 5).map((skill: string) => (
                <Badge key={skill} variant="default" size="sm" className="bg-dark-100 text-dark-700 dark:bg-dark-800 dark:text-dark-300">
                  {skill}
                </Badge>
              ))}
              {credential.skills.length > 5 && (
                <Badge variant="default" size="sm" className="bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-300">
                  +{credential.skills.length - 5}
                </Badge>
              )}
            </div>
          )}

          <div className="mt-4 flex gap-3">
            {credential.credentialUrl && (
              <a
                href={credential.credentialUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-primary-600 dark:text-primary-400 hover:underline flex items-center gap-1"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                View Credential
              </a>
            )}
            {credential.verificationUrl && (
              <a
                href={credential.verificationUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-primary-600 dark:text-primary-400 hover:underline flex items-center gap-1"
              >
                <Shield className="w-3.5 h-3.5" />
                Verify
              </a>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
}

function CertificationCard({ certification, expired }: { certification: any; expired: boolean }) {
  const colorClass = levelColors[certification.level] || levelColors.beginner;

  return (
    <Card className={expired ? 'opacity-60' : ''} padding="lg" hover>
      <div className="flex items-start gap-4">
        <div className="p-3 rounded-xl bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-300">
          <Award className="w-6 h-6" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h4 className="text-lg font-semibold text-dark-900 dark:text-white">{certification.name}</h4>
              <p className="text-dark-600 dark:text-dark-400">{certification.issuer}</p>
            </div>
            <Badge variant="default" className={colorClass}>
              {certification.level.charAt(0).toUpperCase() + certification.level.slice(1)}
            </Badge>
          </div>

          <p className="mt-1 text-sm text-dark-500 dark:text-dark-400">{certification.category}</p>

          <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-dark-500 dark:text-dark-400">
            <span className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              Issued: {formatDate(certification.issueDate)}
            </span>
            {certification.expiryDate && (
              <span className={cn('flex items-center gap-1', expired ? 'text-red-500' : '')}>
                <Calendar className="w-4 h-4" />
                Expires: {formatDate(certification.expiryDate)}
              </span>
            )}
            <span className="font-mono text-xs bg-dark-100 dark:bg-dark-800 px-2 py-1 rounded">
              {certification.credentialId}
            </span>
          </div>

          {certification.skills && certification.skills.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-1.5">
              {certification.skills.slice(0, 5).map((skill: string) => (
                <Badge key={skill} variant="default" size="sm" className="bg-dark-100 text-dark-700 dark:bg-dark-800 dark:text-dark-300">
                  {skill}
                </Badge>
              ))}
              {certification.skills.length > 5 && (
                <Badge variant="default" size="sm" className="bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-300">
                  +{certification.skills.length - 5}
                </Badge>
              )}
            </div>
          )}

          <div className="mt-4 flex gap-3">
            {certification.verificationUrl && (
              <a
                href={certification.verificationUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-primary-600 dark:text-primary-400 hover:underline flex items-center gap-1"
              >
                <Shield className="w-3.5 h-3.5" />
                Verify
              </a>
            )}
            {certification.pdfUrl && (
              <a
                href={certification.pdfUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-primary-600 dark:text-primary-400 hover:underline flex items-center gap-1"
              >
                <Link2 className="w-3.5 h-3.5" />
                View PDF
              </a>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
}