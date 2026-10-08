import mongoose, { Document, Schema } from 'mongoose';

export interface ISocialLink {
  platform: string;
  url: string;
  icon: string;
  order: number;
}

export interface IProfile extends Document {
  name: string;
  title: string;
  bio: string;
  avatar?: string;
  resumeUrl?: string;
  socialLinks: ISocialLink[];
  email: string;
  phone?: string;
  location?: string;
  createdAt: Date;
  updatedAt: Date;
}

const socialLinkSchema = new Schema<ISocialLink>({
  platform: { type: String, required: true },
  url: { type: String, required: true },
  icon: { type: String, required: true },
  order: { type: Number, default: 0 },
});

const profileSchema = new Schema<IProfile>(
  {
    name: { type: String, required: true, trim: true },
    title: { type: String, required: true, trim: true },
    bio: { type: String, required: true },
    avatar: String,
    resumeUrl: String,
    socialLinks: [socialLinkSchema],
    email: { type: String, required: true, lowercase: true, trim: true },
    phone: { type: String, trim: true },
    location: { type: String, trim: true },
  },
  { timestamps: true }
);

profileSchema.index({ email: 1 }, { unique: true });

export default mongoose.model<IProfile>('Profile', profileSchema);