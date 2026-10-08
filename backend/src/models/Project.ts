import mongoose, { Document, Schema } from 'mongoose';

export interface IProject extends Document {
  title: string;
  slug: string;
  description: string;
  shortDescription: string;
  images: string[];
  thumbnail: string;
  techStack: string[];
  liveUrl?: string;
  repoUrl?: string;
  featured: boolean;
  status: 'completed' | 'in-progress' | 'planned';
  startDate?: Date;
  endDate?: Date;
  highlights: string[];
  challenges?: string;
  solutions?: string;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

const projectSchema = new Schema<IProject>(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    description: { type: String, required: true },
    shortDescription: { type: String, required: true, maxlength: 300 },
    images: [{ type: String }],
    thumbnail: { type: String, required: true },
    techStack: [{ type: String, trim: true }],
    liveUrl: { type: String, trim: true },
    repoUrl: { type: String, trim: true },
    featured: { type: Boolean, default: false },
    status: {
      type: String,
      enum: ['completed', 'in-progress', 'planned'],
      default: 'completed',
    },
    startDate: Date,
    endDate: Date,
    highlights: [{ type: String, trim: true }],
    challenges: String,
    solutions: String,
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

projectSchema.index({ slug: 1 }, { unique: true });
projectSchema.index({ featured: -1, order: 1 });
projectSchema.index({ techStack: 1 });

export default mongoose.model<IProject>('Project', projectSchema);