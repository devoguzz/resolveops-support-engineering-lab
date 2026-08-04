import { ApiKey } from '../../domain/models'
import { ServiceResult, success, simulateNetworkDelay } from '../contracts'
import { API_KEYS } from '../../mocks/seed'

export class ApiKeyService {
  async listKeys(organizationId: string, user?: any): Promise<ServiceResult<ApiKey[]>> {
    await simulateNetworkDelay(300)
    const stored = JSON.parse(localStorage.getItem('resolveops_demo_state') || '{}')
    const keys: ApiKey[] = stored.apiKeys || API_KEYS
    
    if (user && user.role.startsWith('customer') && organizationId !== user.organizationId) {
       return { ok: false, error: { code: 'FORBIDDEN', message: 'Access denied' } }
    }
    
    return success(keys.filter(k => k.organizationId === organizationId))
  }

  async createKey(organizationId: string, name: string, creatorId: string, user?: any): Promise<ServiceResult<{ key: ApiKey, secret: string }>> {
    await simulateNetworkDelay(600)
    const stored = JSON.parse(localStorage.getItem('resolveops_demo_state') || '{}')
    const keys: ApiKey[] = stored.apiKeys || API_KEYS
    
    if (user && user.role.startsWith('customer') && organizationId !== user.organizationId) {
       return { ok: false, error: { code: 'FORBIDDEN', message: 'Access denied' } }
    }
    
    const randomHex = Math.random().toString(16).substring(2, 10)
    const secret = `rop_demo_${randomHex}89ab`
    const prefix = `rop_demo_...${randomHex.substring(4)}`
    
    const newKey: ApiKey = {
      id: `key_${Math.random()}`,
      organizationId,
      name,
      prefix,
      createdAt: new Date().toISOString(),
      createdBy: creatorId,
      status: 'active'
    }
    
    stored.apiKeys = [...keys, newKey]
    localStorage.setItem('resolveops_demo_state', JSON.stringify(stored))
    
    return success({ key: newKey, secret })
  }

  async revokeKey(keyId: string, user?: any): Promise<ServiceResult<ApiKey>> {
    await simulateNetworkDelay(400)
    const stored = JSON.parse(localStorage.getItem('resolveops_demo_state') || '{}')
    const keys: ApiKey[] = stored.apiKeys || API_KEYS
    const key = keys.find(k => k.id === keyId)
    if (!key) return { ok: false, error: { code: 'NOT_FOUND', message: 'API Key not found' } }
    
    if (user && user.role.startsWith('customer')) {
       if (key.organizationId !== user.organizationId) {
         return { ok: false, error: { code: 'FORBIDDEN', message: 'Access denied' } }
       }
       if (user.role === 'customer_member') {
         return { ok: false, error: { code: 'FORBIDDEN', message: 'Members cannot revoke API keys' } }
       }
    }
    
    key.status = 'revoked'
    localStorage.setItem('resolveops_demo_state', JSON.stringify(stored))
    
    return success(key)
  }
}

export const apiKeyService = new ApiKeyService()
