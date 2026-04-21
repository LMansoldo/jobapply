import mongoose, { Schema, Document } from 'mongoose';
import bcrypt from 'bcryptjs';
import { randomUUID } from 'crypto';


export type AccessType = 'free' | 'premium' | 'ultimate';

export interface IUser extends Document {
  name: string;
  email: string;
  password?: string;
  linkedinId?: string;
  createdAt: Date;
  public_id: string;
  cv?: mongoose.Types.ObjectId;
  access_type: AccessType;
  is_restricted: boolean;
  daily_usage: { count: number; date: Date | null };
  comparePassword(candidate: string): Promise<boolean>;
}

const userSchema = new Schema<IUser>({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: false, minlength: 8, select: false },
  linkedinId: { type: String, sparse: true, unique: true },
  createdAt: { type: Date, default: Date.now },
  public_id: { type: String, unique: true, default: () => randomUUID() },
  cv: { type: Schema.Types.ObjectId, ref: 'CV', default: null },
  access_type: { type: String, enum: ['free', 'premium', 'ultimate'], default: 'free' },
  is_restricted: { type: Boolean, default: false },
  daily_usage: {
    count: { type: Number, default: 0 },
    date: { type: Date, default: null },
  },
});

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  if (!this.password) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

userSchema.methods.comparePassword = function (candidate: string): Promise<boolean> {
  if (!this.password) return Promise.resolve(false);
  return bcrypt.compare(candidate, this.password);
};

userSchema.set('toJSON', {
  transform(_doc: unknown, ret: any) {
    delete ret.password;
    return ret;
  },
});

export default mongoose.model<IUser>('User', userSchema);
