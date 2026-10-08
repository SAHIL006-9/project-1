import mongoose, { Document, Schema } from 'mongoose';

export interface ICertification extends Document {
  name: string;
  issuer: string;
  issueDate: Date;
  expiryDate?: Date;
  credentialId: string;
  verificationUrl?: string;
  pdfUrl?: string;
  skills: string[];
  level: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  category: string;
  isActive: boolean;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

const certificationSchema = new Schema<ICertification>(
  {
    name: { type: String, required: true, trim: true },
    issuer: { type: String, required: true, trim: true },
    issueDate: { type: Date, required: true },
    expiryDate: Date,
    credentialId: { type: String, required: true, trim: true, unique: true },
    verificationUrl: { type: String, trim: true },
    pdfUrl: String,
    skills: [{ type: String, trim: true }],
    level: {
      type: String,
      enum: ['beginner', 'intermediate', 'advanced', 'expert'],
      default: 'intermediate',
    },
    category: { type: String, required: true, trim: true },
    isActive: { type: Boolean, default: true },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

certificationSchema.index({ credentialId: 1 }, { unique: true });
certificationSchema.index({ issueDate: -1 });
certificationSchema.index({ isActive: 1, order: 1 });

export default mongoose.model<ICertification>('Certification', certificationSchema);