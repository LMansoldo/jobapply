import type { Voucher, CreateVoucherPayload, RedeemVoucherResponse } from './types'

export interface IVoucherRepository {
  listVouchers(): Promise<Voucher[]>
  createVoucher(payload: CreateVoucherPayload): Promise<Voucher>
  getVoucherByCode(code: string): Promise<Voucher>
  redeemVoucher(code: string): Promise<RedeemVoucherResponse>
  getPublicCV(publicId: string): Promise<unknown>
}
