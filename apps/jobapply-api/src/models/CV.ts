import mongoose, { Schema, Document } from 'mongoose';

export interface IExperience {
  company?: string;
  role?: string;
  startDate?: string;
  endDate?: string;
  description?: string;
}

export interface IEducation {
  institution?: string;
  degree?: string;
  field?: string;
  startDate?: string;
  endDate?: string;
}

export interface ITailoredVersion {
  jobId: mongoose.Types.ObjectId;
  tailoredContent: string;
  createdAt: Date;
}

export interface ICV extends Document {
  user: mongoose.Types.ObjectId;
  fullName: string;
  email: string;
  phone?: string;
  summary?: string;
  skills: string[];
  experience: IExperience[];
  education: IEducation[];
  languages: string[];
  tailoredVersions: ITailoredVersion[];
  updatedAt: Date;
}

export const experienceSchema = new Schema<IExperience>(
  { company: String, role: String, startDate: String, endDate: String, description: String },
  { _id: false }
);

export const educationSchema = new Schema<IEducation>(
  { institution: String, degree: String, field: String, startDate: String, endDate: String },
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

const cvSchema = new Schema<ICV>({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  fullName: { type: String, required: true, trim: true },
  email: { type: String, required: true, trim: true },
  phone: { type: String, trim: true },
  summary: String,
  skills: { type: [String], default: [] },
  experience: { type: [experienceSchema], default: [] },
  education: { type: [educationSchema], default: [] },
  languages: { type: [String], default: [] },
  tailoredVersions: { type: [tailoredVersionSchema], default: [] },
  updatedAt: { type: Date, default: Date.now },
});

cvSchema.pre('save', function (next) {
  this.updatedAt = new Date();
  next();
});

export default mongoose.model<ICV>('CV', cvSchema);
