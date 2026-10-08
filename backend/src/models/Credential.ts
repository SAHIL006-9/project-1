import mongoose, { Document, Schema } from 'mongoose';

export interface ICredential extends Document {
  type: 'degree' | 'certification' | 'award' | 'license' | 'publication' | 'other';
  title: string;
  issuer: string;
  issueDate: Date;
  expiryDate?: Date;
  credentialUrl?: string;
  verificationUrl?: string;
  description?: string;
  skills?: string[];
  credentialId?: string;
  image?: string;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

const credentialSchema = new Schema<ICredential>(
  {
    type: {
      type: String,
      enum: ['degree', 'certification', 'award', 'license', 'publication', 'other'],
      required: true,
    },
    title: { type: String, required: true, trim: true },
    issuer: { type: String, required: true, trim: true },
    issueDate: { type: Date, required: true },
    expiryDate: Date,
    credentialUrl: { type: String, trim: true },
    verificationUrl: { type: String, trim: true },
    description: { type: String, trim: true },
    skills: [{ type: String, trim: true }],
    credentialId: { type: String, trim: true },
    image: String,
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

credentialSchema.index({ issueDate: -1 });
credentialSchema.index({ type: 1 });
credentialSchema.index({ order: 1 });

export default mongoose.model<ICredential>('Credential', credentialSchema);