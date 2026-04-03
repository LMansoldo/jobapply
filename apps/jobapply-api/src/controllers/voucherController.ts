import { Response, NextFunction } from 'express';
import { AuthRequest } from '../types';
import Voucher from '../models/Voucher';
import User from '../models/User';

export async function createVoucher(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const { code, name, source_url, expires_at, discount_percentage, access_type } = req.body as {
      code?: string;
      name?: string;
      source_url?: string;
      expires_at?: string;
      discount_percentage?: number;
      access_type?: string;
    };

    if (!code || !name || !expires_at || discount_percentage == null || !access_type) {
      res.status(400).json({ message: 'code, name, expires_at, discount_percentage and access_type are required' });
      return;
    }

    const voucher = await new Voucher({ code, name, source_url, expires_at, discount_percentage, access_type }).save();
    res.status(201).json({ voucher });
  } catch (err: unknown) {
    const e = err as { code?: number; keyPattern?: Record<string, unknown> };
    if (e.code === 11000 && e.keyPattern?.code) {
      res.status(409).json({ message: 'Voucher code already exists' });
      return;
    }
    next(err);
  }
}

export async function redeemVoucher(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const { code } = req.body as { code?: string };
    if (!code) { res.status(400).json({ message: 'code is required' }); return; }

    const voucher = await Voucher.findOne({ code: code.toUpperCase() });
    if (!voucher) { res.status(404).json({ message: 'Voucher not found' }); return; }
    if (!voucher.is_active) { res.status(410).json({ message: 'Voucher is no longer active' }); return; }
    if (voucher.expires_at < new Date()) { res.status(410).json({ message: 'Voucher has expired' }); return; }

    const user = await User.findById(req.user.id);
    if (!user) { res.status(404).json({ message: 'User not found' }); return; }

    user.access_type = voucher.access_type;
    await user.save();

    res.json({
      message: 'Voucher redeemed successfully',
      access_type: user.access_type,
      discount_percentage: voucher.discount_percentage,
      expires_at: voucher.expires_at,
    });
  } catch (err) {
    next(err);
  }
}

export async function listVouchers(_req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const vouchers = await Voucher.find().sort({ created_at: -1 });
    res.json({ vouchers });
  } catch (err) {
    next(err);
  }
}

export async function getVoucher(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const voucher = await Voucher.findOne({ code: req.params.code.toUpperCase() });
    if (!voucher) { res.status(404).json({ message: 'Voucher not found' }); return; }
    res.json({ voucher });
  } catch (err) {
    next(err);
  }
}
