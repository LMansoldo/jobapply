import mongoose, { Schema, Document } from 'mongoose';

export interface IJob extends Document {
  title: string;
  company: string;
  location?: string;
  description: string;
  tailoredDescription?: string | null;
  tags: string[];
  url?: string;
  salary?: string;
  status: 'open' | 'closed' | 'applied';
  createdAt: Date;
}

const jobSchema = new Schema<IJob>({
  title: { type: String, required: true, trim: true },
  company: { type: String, required: true, trim: true },
  location: { type: String, trim: true },
  description: { type: String, required: true },
  tailoredDescription: { type: String, default: null },
  tags: { type: [String], default: [] },
  url: { type: String, trim: true },
  salary: { type: String, trim: true },
  status: { type: String, enum: ['open', 'closed', 'applied'], default: 'open' },
  createdAt: { type: Date, default: Date.now },
});

jobSchema.index({ title: 'text', company: 'text', description: 'text' });

export default mongoose.model<IJob>('Job', jobSchema);
