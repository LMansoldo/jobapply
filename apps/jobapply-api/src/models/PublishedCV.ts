import mongoose, { Schema, Document } from 'mongoose';
import {
  IExperience, IEducation, ISummary, ISkills, IObjective,
  experienceSchema, educationSchema,
} from './CV';

export interface IPublishedCV extends Document {
  user: mongoose.Types.ObjectId;
  public_id: string;
  fullName: string;
  email: string;
  phone?: string;
  location?: string;
  linkedin?: string;
  objective?: IObjective;
  summary?: ISummary;
  skills?: ISkills;
  expertise?: string[];
  experience: IExperience[];
  education?: IEducation;
  languages: string[];
  published_at: Date;
}

const skillGroupSchema = new Schema(
  { label: { type: String, required: true }, items: { type: [String], default: [] } },
  { _id: false }
);

const skillsSchema = new Schema(
  {
    tech: { type: [skillGroupSchema], default: [] },
    competencies: { type: [skillGroupSchema], default: [] },
    soft_skills: { type: [String], default: [] },
  },
  { _id: false }
);

const summarySchema = new Schema(
  { headline: String, focus_areas: { type: [String], default: [] }, tagline: String },
  { _id: false }
);

const objectiveSchema = new Schema(
  { role: String, main_stack: { type: [String], default: [] } },
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
  objective: objectiveSchema,
  summary: summarySchema,
  skills: skillsSchema,
  expertise: { type: [String], default: [] },
  experience: { type: [experienceSchema], default: [] },
  education: educationSchema,
  languages: { type: [String], default: [] },
  published_at: { type: Date, default: Date.now },
});

export default mongoose.model<IPublishedCV>('PublishedCV', publishedCVSchema);
