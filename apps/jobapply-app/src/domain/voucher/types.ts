export interface Voucher {
  _id: string
  code: string
  name: string
  source_url?: string | null
  expires_at: string
  discount_percentage: number
  access_type: string
  is_active: boolean
  created_at: string
}

export interface CreateVoucherPayload {
  code: string
  name: string
  source_url?: string
  expires_at: string
  discount_percentage: number
  access_type: string
}

export interface RedeemVoucherResponse {
  message: string
  access_type: string
  discount_percentage: number
  expires_at: string
}
