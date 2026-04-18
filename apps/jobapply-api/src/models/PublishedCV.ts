import mongoose, { Schema, Document } from 'mongoose';
import {
  ISkillGroup, IExperience, IEducation, ILanguage, ICertification, IProject,
  skillGroupSchema, experienceSchema, educationSchema,
} from './CV';

export interface IPublishedCV extends Document {
  user: mongoose.Types.ObjectId;
  public_id: string;
  fullName: string;
  email: string;
  phone?: string;
  location?: string;
  linkedin?: string;
  github?: string;
  portfolio?: string;
  summary?: string;
  skills: ISkillGroup[];
  experience: IExperience[];
  education: IEducation[];
  languages: ILanguage[];
  certifications: ICertification[];
  projects: IProject[];
  published_at: Date;
}

const languageSchema = new Schema(
  { language: { type: String, required: true }, level: { type: String, required: true }, score: String },
  { _id: false }
);

const certificationSchema = new Schema(
  { name: { type: String, required: true }, organization: { type: String, required: true }, date: String },
  { _id: false }
);

const projectSchema = new Schema(
  {
    name: { type: String, required: true },
    url: String,
    description: String,
    highlights: { type: [String], default: [] },
  },
  { _id: false }
);

const publishedCVSchema = new Schema<IPublishedCV>({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  public_id: { type: String, required: true, index: true },
  fullName: { type: String, required: true, trim: true },
  email: { type: String, required: true, trim: true },
  phone: { type: String, trim: true },
  location: { type: String, trim: true },
  linkedin: { type: String, trim: true },
  github: { type: String, trim: true },
  portfolio: { type: String, trim: true },
  summary: String,
  skills: { type: [skillGroupSchema], default: [] },
  experience: { type: [experienceSchema], default: [] },
  education: { type: [educationSchema], default: [] },
  languages: { type: [languageSchema], default: [] },
  certifications: { type: [certificationSchema], default: [] },
  projects: { type: [projectSchema], default: [] },
  published_at: { type: Date, default: Date.now },
});

export default mongoose.model<IPublishedCV>('PublishedCV', publishedCVSchema);
