import mongoose, { Schema, Document } from 'mongoose';
import { IExperience, IEducation, experienceSchema, educationSchema } from './CV';

export interface IPublishedCV extends Document {
  user: mongoose.Types.ObjectId;
  public_id: string;
  fullName: string;
  email: string;
  phone?: string;
  summary?: string;
  skills: string[];
  experience: IExperience[];
  education: IEducation[];
  languages: string[];
  published_at: Date;
}

const publishedCVSchema = new Schema<IPublishedCV>({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  public_id: { type: String, required: true, index: true },
  fullName: { type: String, required: true, trim: true },
  email: { type: String, required: true, trim: true },
  phone: { type: String, trim: true },
  summary: String,
  skills: { type: [String], default: [] },
  experience: { type: [experienceSchema], default: [] },
  education: { type: [educationSchema], default: [] },
  languages: { type: [String], default: [] },
  published_at: { type: Date, default: Date.now },
});

export default mongoose.model<IPublishedCV>('PublishedCV', publishedCVSchema);
