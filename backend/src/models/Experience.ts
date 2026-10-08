import mongoose, { Document, Schema } from 'mongoose';

export interface IExperience extends Document {
  company: string;
  role: string;
  period: string;
  startDate: Date;
  endDate?: Date;
  current: boolean;
  description: string[];
  technologies: string[];
  logo?: string;
  location?: string;
  type: 'full-time' | 'part-time' | 'contract' | 'internship' | 'freelance';
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

const experienceSchema = new Schema<IExperience>(
  {
    company: { type: String, required: true, trim: true },
    role: { type: String, required: true, trim: true },
    period: { type: String, required: true, trim: true },
    startDate: { type: Date, required: true },
    endDate: Date,
    current: { type: Boolean, default: false },
    description: [{ type: String, trim: true }],
    technologies: [{ type: String, trim: true }],
    logo: String,
    location: { type: String, trim: true },
    type: {
      type: String,
      enum: ['full-time', 'part-time', 'contract', 'internship', 'freelance'],
      default: 'full-time',
    },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

experienceSchema.index({ startDate: -1 });
experienceSchema.index({ order: 1 });

export default mongoose.model<IExperience>('Experience', experienceSchema);