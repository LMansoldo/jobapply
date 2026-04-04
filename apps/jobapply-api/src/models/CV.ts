import mongoose, { Schema, Document } from 'mongoose';

// ─── Sub-types ────────────────────────────────────────────────────────────────

export interface IHighlight {
  text: string;
  category?: string;
}

export interface IExperience {
  company?: string;
  role?: string;
  location?: string;
  period?: string;
  highlights: IHighlight[];
}

export interface IEducation {
  institution?: string;
  degree?: string;
  graduation?: string;
}

export interface ISummary {
  headline?: string;
  focus_areas?: string[];
  tagline?: string;
}

export interface ISkillGroup {
  label: string;
  items: string[];
}

export interface ISkills {
  tech?: ISkillGroup[];
  competencies?: ISkillGroup[];
  soft_skills?: string[];
}

export interface IObjective {
  role?: string;
  main_stack?: string[];
}

export interface ITailoredVersion {
  jobId: mongoose.Types.ObjectId;
  tailoredContent: string;
  createdAt: Date;
}

export type CVLocale = 'en' | 'pt-BR';

export interface ICVLocaleVersion {
  locale: CVLocale;
  objective?: IObjective;
  summary?: ISummary;
  skills?: ISkills;
  expertise?: string[];
  experience?: IExperience[];
  education?: IEducation;
}

export interface ICV extends Document {
  user: mongoose.Types.ObjectId;
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
  tailoredVersions: ITailoredVersion[];
  localeVersions: ICVLocaleVersion[];
  updatedAt: Date;
}

// ─── Schemas ──────────────────────────────────────────────────────────────────

const highlightSchema = new Schema<IHighlight>(
  { text: { type: String, required: true }, category: String },
  { _id: false }
);

export const experienceSchema = new Schema<IExperience>(
  {
    company: String,
    role: String,
    location: String,
    period: String,
    highlights: { type: [highlightSchema], default: [] },
  },
  { _id: false }
);

export const educationSchema = new Schema<IEducation>(
  { institution: String, degree: String, graduation: String },
  { _id: false }
);

const summarySchema = new Schema<ISummary>(
  { headline: String, focus_areas: { type: [String], default: [] }, tagline: String },
  { _id: false }
);

const skillGroupSchema = new Schema<ISkillGroup>(
  { label: { type: String, required: true }, items: { type: [String], default: [] } },
  { _id: false }
);

const skillsSchema = new Schema<ISkills>(
  {
    tech: { type: [skillGroupSchema], default: [] },
    competencies: { type: [skillGroupSchema], default: [] },
    soft_skills: { type: [String], default: [] },
  },
  { _id: false }
);

const objectiveSchema = new Schema<IObjective>(
  { role: String, main_stack: { type: [String], default: [] } },
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
    objective: objectiveSchema,
    summary: summarySchema,
    skills: skillsSchema,
    expertise: { type: [String], default: [] },
    experience: { type: [experienceSchema], default: [] },
    education: educationSchema,
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
  objective: objectiveSchema,
  summary: summarySchema,
  skills: skillsSchema,
  expertise: { type: [String], default: [] },
  experience: { type: [experienceSchema], default: [] },
  education: educationSchema,
  languages: { type: [String], default: [] },
  tailoredVersions: { type: [tailoredVersionSchema], default: [] },
  localeVersions: { type: [localeVersionSchema], default: [] },
  updatedAt: { type: Date, default: Date.now },
});

cvSchema.pre('save', function (next) {
  this.updatedAt = new Date();
  next();
});

export default mongoose.model<ICV>('CV', cvSchema);
