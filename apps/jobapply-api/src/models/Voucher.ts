import mongoose, { Schema, Document } from 'mongoose';
import { AccessType } from './User';

export interface IVoucher extends Document {
  code: string;
  name: string;
  source_url?: string;
  expires_at: Date;
  discount_percentage: number;
  access_type: AccessType;
  is_active: boolean;
  created_at: Date;
}

const voucherSchema = new Schema<IVoucher>({
  code: {
    type: String,
    required: true,
    unique: true,
    uppercase: true,
    trim: true,
    maxlength: 8,
    match: /^[A-Z0-9]{1,8}$/,
  },
  name: { type: String, required: true, trim: true },
  source_url: { type: String, trim: true },
  expires_at: { type: Date, required: true },
  discount_percentage: { type: Number, required: true, min: 0, max: 100 },
  access_type: { type: String, enum: ['free', 'premium', 'ultimate'], required: true },
  is_active: { type: Boolean, default: true },
  created_at: { type: Date, default: Date.now },
});

export default mongoose.model<IVoucher>('Voucher', voucherSchema);
