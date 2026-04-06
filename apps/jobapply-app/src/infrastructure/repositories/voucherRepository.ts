import api, { USE_MOCK } from '../http/client'
import type { Voucher, CreateVoucherPayload, RedeemVoucherResponse } from '../../domain/voucher/types'

let mockVouchers: Voucher[] = []

function delay(ms = 500) {
  return new Promise((r) => setTimeout(r, ms))
}

export async function listVouchers(): Promise<Voucher[]> {
  if (USE_MOCK) {
    await delay()
    return [...mockVouchers]
  }
  const { data } = await api.get<{ vouchers: Voucher[] }>('/vouchers')
  return data.vouchers
}

export async function createVoucher(payload: CreateVoucherPayload): Promise<Voucher> {
  if (USE_MOCK) {
    await delay(600)
    if (mockVouchers.find((v) => v.code === payload.code)) {
      throw { response: { data: { message: 'Código de voucher já existe' }, status: 409 } }
    }
    const voucher: Voucher = {
      _id: `voucher-${Date.now()}`,
      ...payload,
      source_url: payload.source_url ?? null,
      is_active: true,
      created_at: new Date().toISOString(),
    }
    mockVouchers = [voucher, ...mockVouchers]
    return voucher
  }
  const { data } = await api.post<{ voucher: Voucher }>('/vouchers', payload)
  return data.voucher
}

export async function getVoucherByCode(code: string): Promise<Voucher> {
  if (USE_MOCK) {
    await delay(300)
    const voucher = mockVouchers.find((v) => v.code === code)
    if (!voucher) throw { response: { data: { message: 'Voucher não encontrado' }, status: 404 } }
    return voucher
  }
  const { data } = await api.get<{ voucher: Voucher }>(`/vouchers/${code}`)
  return data.voucher
}

export async function redeemVoucher(code: string): Promise<RedeemVoucherResponse> {
  if (USE_MOCK) {
    await delay(700)
    const voucher = mockVouchers.find((v) => v.code === code)
    if (!voucher) throw { response: { data: { message: 'Voucher não encontrado' }, status: 404 } }
    if (!voucher.is_active || new Date(voucher.expires_at) < new Date()) {
      throw { response: { data: { message: 'Voucher inativo ou expirado' }, status: 410 } }
    }
    return {
      message: 'Voucher resgatado com sucesso',
      access_type: voucher.access_type,
      discount_percentage: voucher.discount_percentage,
      expires_at: voucher.expires_at,
    }
  }
  const { data } = await api.post<RedeemVoucherResponse>('/vouchers/redeem', { code })
  return data
}

export async function getPublicCV(publicId: string) {
  const { data } = await api.get(`/public/${publicId}`)
  return data.cv
}
