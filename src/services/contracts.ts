export interface AppError {
  code: string
  message: string
  requestId?: string
  fieldErrors?: Record<string, string>
}

export type ServiceResult<T> =
  | { ok: true; data: T }
  | { ok: false; error: AppError }

export interface Paginated<T> {
  items: T[]
  total: number
  page: number
  pageSize: number
  hasMore: boolean
}

// Utility to create success
export function success<T>(data: T): ServiceResult<T> {
  return { ok: true, data }
}

// Utility to create failure
export function failure(error: AppError): ServiceResult<never> {
  return { ok: false, error }
}

// Global delay simulator
export async function simulateNetworkDelay(ms = 600) {
  return new Promise(resolve => setTimeout(resolve, ms))
}
