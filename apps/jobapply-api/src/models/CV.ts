import mongoose, { Schema, Document } from 'mongoose';

// ─── Sub-types ────────────────────────────────────────────────────────────────

export interface ISkillGroup {
  label: string;
  items: string[];
}

export interface IExperience {
  role?: string;
  company?: string;
  location?: string;
  period?: string;
  context?: string;
  highlights: string[];
}

export interface IEducation {
  degree?: string;
  field?: string;
  institution?: string;
  location?: string;
  period?: string;
  notes?: string;
}

export interface ILanguage {
  language: string;
  level: string;
  score?: string;
}

export interface ICertification {
  name: string;
  organization: string;
  date?: string;
}

export interface IProject {
  name: string;
  url?: string;
  description?: string;
  highlights: string[];
}

export interface ITailoredVersion {
  jobId: mongoose.Types.ObjectId;
  tailoredContent: string;
  createdAt: Date;
}

export type CVLocale = 'en' | 'pt-BR';

export interface ICVLocaleVersion {
  locale: CVLocale;
  summary?: string;
  skills?: ISkillGroup[];
  experience?: IExperience[];
}

export interface ICV extends Document {
  user: mongoose.Types.ObjectId;
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
  tailoredVersions: ITailoredVersion[];
  localeVersions: ICVLocaleVersion[];
  updatedAt: Date;
}

// ─── Schemas ──────────────────────────────────────────────────────────────────

export const skillGroupSchema = new Schema<ISkillGroup>(
  { label: { type: String, required: true }, items: { type: [String], default: [] } },
  { _id: false }
);

export const experienceSchema = new Schema<IExperience>(
  {
    role: String,
    company: String,
    location: String,
    period: String,
    context: String,
    highlights: { type: [String], default: [] },
  },
  { _id: false }
);

export const educationSchema = new Schema<IEducation>(
  { degree: String, field: String, institution: String, location: String, period: String, notes: String },
  { _id: false }
);

const languageSchema = new Schema<ILanguage>(
  { language: { type: String, required: true }, level: { type: String, required: true }, score: String },
  { _id: false }
);

const certificationSchema = new Schema<ICertification>(
  { name: { type: String, required: true }, organization: { type: String, required: true }, date: String },
  { _id: false }
);

const projectSchema = new Schema<IProject>(
  {
    name: { type: String, required: true },
    url: String,
    description: String,
    highlights: { type: [String], default: [] },
  },
  { _id: false }
);

const tailoredVersionSchema = new Schema<ITailoredVersion>(
  {
    jobId: { type: Schema.Types.ObjectId, ref: 'Job' },
    tailoredContent: String,
    createdAt: { type: Date, default: Date.now },
  },
  { _id: false }
);

const localeVersionSchema = new Schema<ICVLocaleVersion>(
  {
    locale: { type: String, enum: ['en', 'pt-BR'], required: true },
    summary: String,
    skills: { type: [skillGroupSchema], default: [] },
    experience: { type: [experienceSchema], default: [] },
  },
  { _id: false }
);

const cvSchema = new Schema<ICV>({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
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
  tailoredVersions: { type: [tailoredVersionSchema], default: [] },
  localeVersions: { type: [localeVersionSchema], default: [] },
  updatedAt: { type: Date, default: Date.now },
});

cvSchema.pre('save', function (next) {
  this.updatedAt = new Date();
  next();
});

export default mongoose.model<ICV>('CV', cvSchema);
