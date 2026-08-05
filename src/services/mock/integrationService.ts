import { Integration } from '../../domain/models'
import { ServiceResult, success, simulateNetworkDelay } from '../contracts'
import { INTEGRATIONS } from '../../mocks/seed'

export class IntegrationService {
  async listIntegrations(organizationId: string, user?: any): Promise<ServiceResult<Integration[]>> {
    await simulateNetworkDelay(300)
    const stored = JSON.parse(localStorage.getItem('resolveops_demo_state') || '{}')
    const items: Integration[] = stored.integrations || INTEGRATIONS
    
    if (user && user.role.startsWith('customer') && organizationId !== user.organizationId) {
      return { ok: false, error: { code: 'FORBIDDEN', message: 'Access denied' } }
    }
    
    return success(items.filter(i => i.organizationId === organizationId))
  }

  async getIntegration(id: string, user?: any): Promise<ServiceResult<Integration>> {
    await simulateNetworkDelay(200)
    const stored = JSON.parse(localStorage.getItem('resolveops_demo_state') || '{}')
    const items: Integration[] = stored.integrations || INTEGRATIONS
    const item = items.find(i => i.id === id)
    if (!item) return { ok: false, error: { code: 'NOT_FOUND', message: 'Integration not found' } }
    
    if (user && user.role.startsWith('customer') && item.organizationId !== user.organizationId) {
      return { ok: false, error: { code: 'FORBIDDEN', message: 'Access denied' } }
    }
    
    return success(item)
  }

  async toggleIntegration(id: string, enabled: boolean, user?: any): Promise<ServiceResult<Integration>> {
    await simulateNetworkDelay(400)
    const stored = JSON.parse(localStorage.getItem('resolveops_demo_state') || '{}')
    const items: Integration[] = stored.integrations || INTEGRATIONS
    const item = items.find(i => i.id === id)
    if (!item) return { ok: false, error: { code: 'NOT_FOUND', message: 'Integration not found' } }
    
    if (user && user.role.startsWith('customer') && item.organizationId !== user.organizationId) {
      return { ok: false, error: { code: 'FORBIDDEN', message: 'Access denied' } }
    }
    
    item.status = enabled ? 'active' : 'disabled'
    localStorage.setItem('resolveops_demo_state', JSON.stringify(stored))
    return success(item)
  }

  async testConnection(id: string): Promise<ServiceResult<{ success: boolean, message: string, integration: Integration }>> {
    await simulateNetworkDelay(800)
    const stored = JSON.parse(localStorage.getItem('resolveops_demo_state') || '{}')
    const items: Integration[] = stored.integrations || INTEGRATIONS
    const item = items.find(i => i.id === id)
    if (!item) return { ok: false, error: { code: 'NOT_FOUND', message: 'Integration not found' } }

    const isSuccess = Math.random() > 0.2 // 80% success for demo

    item.lastSyncAt = new Date().toISOString()
    item.status = isSuccess ? 'active' : 'error'
    
    localStorage.setItem('resolveops_demo_state', JSON.stringify(stored))
    
    if (isSuccess) {
      return success({ success: true, message: 'Connection established successfully.', integration: item })
    } else {
      return success({ success: false, message: 'Connection failed. Please check credentials.', integration: item })
    }
  }
}

export const integrationService = new IntegrationService()
