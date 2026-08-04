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

  async testConnection(_id: string): Promise<ServiceResult<{ success: boolean, message: string }>> {
    await simulateNetworkDelay(800)
    // Simulate a successful connection for the demo
    return success({ success: true, message: 'Connection established successfully.' })
  }
}

export const integrationService = new IntegrationService()
