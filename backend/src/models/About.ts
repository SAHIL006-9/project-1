import mongoose, { Document, Schema } from 'mongoose';

export interface IStat {
  label: string;
  value: string | number;
  icon?: string;
  order: number;
}

export interface ISkill {
  name: string;
  category: 'frontend' | 'backend' | 'database' | 'devops' | 'tools' | 'other';
  proficiency: number; // 1-100
  icon?: string;
  order: number;
}

export interface IInterest {
  name: string;
  icon?: string;
  order: number;
}

export interface IAbout extends Document {
  description: string;
  skills: ISkill[];
  interests: IInterest[];
  stats: IStat[];
  createdAt: Date;
  updatedAt: Date;
}

const statSchema = new Schema<IStat>({
  label: { type: String, required: true },
  value: { type: Schema.Types.Mixed, required: true },
  icon: String,
  order: { type: Number, default: 0 },
});

const skillSchema = new Schema<ISkill>({
  name: { type: String, required: true },
  category: {
    type: String,
    enum: ['frontend', 'backend', 'database', 'devops', 'tools', 'other'],
    required: true,
  },
  proficiency: { type: Number, min: 1, max: 100, required: true },
  icon: String,
  order: { type: Number, default: 0 },
});

const interestSchema = new Schema<IInterest>({
  name: { type: String, required: true },
  icon: String,
  order: { type: Number, default: 0 },
});

const aboutSchema = new Schema<IAbout>(
  {
    description: { type: String, required: true },
    skills: [skillSchema],
    interests: [interestSchema],
    stats: [statSchema],
  },
  { timestamps: true }
);

export default mongoose.model<IAbout>('About', aboutSchema);