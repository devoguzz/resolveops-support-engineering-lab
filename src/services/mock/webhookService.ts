import { WebhookDelivery } from '../../domain/models'
import { ServiceResult, success, simulateNetworkDelay } from '../contracts'

export class WebhookService {
  async listDeliveries(query: any, user?: any): Promise<ServiceResult<WebhookDelivery[]>> {
    await simulateNetworkDelay(200);
    const stored = JSON.parse(localStorage.getItem('resolveops_demo_state') || '{}');
    let deliveries = stored.webhookDeliveries || [];
    
    if (user && user.role.startsWith('customer')) {
      deliveries = deliveries.filter((d:any) => d.organizationId === user.organizationId);
    } else if (query.organizationId) {
      deliveries = deliveries.filter((d:any) => d.organizationId === query.organizationId);
    }
    
    return success(deliveries);
  }
  
  async retryDelivery(id: string, user?: any): Promise<ServiceResult<WebhookDelivery>> {
    await simulateNetworkDelay(500);
    const stored = JSON.parse(localStorage.getItem('resolveops_demo_state') || '{}');
    const item = (stored.webhookDeliveries || []).find((d:any) => d.id === id);
    if (!item) return { ok: false, error: { code: 'NOT_FOUND', message: 'Delivery not found' } };
    
    if (user && user.role.startsWith('customer')) {
      if (item.organizationId !== user.organizationId) {
        return { ok: false, error: { code: 'FORBIDDEN', message: 'Access denied' } };
      }
    }
    
    item.attempt += 1;
    item.updatedAt = new Date().toISOString();
    localStorage.setItem('resolveops_demo_state', JSON.stringify(stored));
    return success(item);
  }

  async listEndpoints(organizationId: string, user?: any): Promise<ServiceResult<any[]>> {
    await simulateNetworkDelay(200);
    const stored = JSON.parse(localStorage.getItem('resolveops_demo_state') || '{}');
    const endpoints = stored.webhookEndpoints || [
      { id: 'ep_1', organizationId, url: 'https://api.northstar.test/webhooks/resolveops', status: 'active', events: ['*'] }
    ];
    if (user && user.role.startsWith('customer') && user.organizationId !== organizationId) {
       return { ok: false, error: { code: 'FORBIDDEN', message: 'Access denied' } };
    }
    return success(endpoints.filter((e:any) => e.organizationId === organizationId));
  }

  async addEndpoint(organizationId: string, url: string, events: string[], user?: any): Promise<ServiceResult<any>> {
    await simulateNetworkDelay(300);
    if (user && user.role !== 'customer_owner') {
      return { ok: false, error: { code: 'FORBIDDEN', message: 'Only owners can add endpoints' } };
    }
    const stored = JSON.parse(localStorage.getItem('resolveops_demo_state') || '{}');
    const endpoints = stored.webhookEndpoints || [
      { id: 'ep_1', organizationId, url: 'https://api.northstar.test/webhooks/resolveops', status: 'active', events: ['*'] }
    ];
    const newEp = {
      id: `ep_${Math.random()}`,
      organizationId,
      url,
      status: 'active',
      events
    };
    stored.webhookEndpoints = [...endpoints, newEp];
    localStorage.setItem('resolveops_demo_state', JSON.stringify(stored));
    return success(newEp);
  }

  async editEndpoint(id: string, updates: any, user?: any): Promise<ServiceResult<any>> {
    await simulateNetworkDelay(300);
    if (user && user.role !== 'customer_owner') {
      return { ok: false, error: { code: 'FORBIDDEN', message: 'Only owners can edit endpoints' } };
    }
    const stored = JSON.parse(localStorage.getItem('resolveops_demo_state') || '{}');
    const endpoints = stored.webhookEndpoints || [];
    const index = endpoints.findIndex((e:any) => e.id === id);
    if (index === -1) return { ok: false, error: { code: 'NOT_FOUND', message: 'Endpoint not found' } };
    
    if (user && endpoints[index].organizationId !== user.organizationId) {
      return { ok: false, error: { code: 'FORBIDDEN', message: 'Access denied' } };
    }

    endpoints[index] = { ...endpoints[index], ...updates };
    stored.webhookEndpoints = endpoints;
    localStorage.setItem('resolveops_demo_state', JSON.stringify(stored));
    return success(endpoints[index]);
  }

  async toggleEndpoint(id: string, user?: any): Promise<ServiceResult<any>> {
    await simulateNetworkDelay(300);
    if (user && user.role !== 'customer_owner') {
      return { ok: false, error: { code: 'FORBIDDEN', message: 'Only owners can toggle endpoints' } };
    }
    const stored = JSON.parse(localStorage.getItem('resolveops_demo_state') || '{}');
    const endpoints = stored.webhookEndpoints || [];
    const index = endpoints.findIndex((e:any) => e.id === id);
    if (index === -1) return { ok: false, error: { code: 'NOT_FOUND', message: 'Endpoint not found' } };
    
    if (user && endpoints[index].organizationId !== user.organizationId) {
      return { ok: false, error: { code: 'FORBIDDEN', message: 'Access denied' } };
    }

    endpoints[index].status = endpoints[index].status === 'active' ? 'inactive' : 'active';
    stored.webhookEndpoints = endpoints;
    localStorage.setItem('resolveops_demo_state', JSON.stringify(stored));
    return success(endpoints[index]);
  }

  async deleteEndpoint(id: string, user?: any): Promise<ServiceResult<null>> {
    await simulateNetworkDelay(300);
    if (user && user.role !== 'customer_owner') {
      return { ok: false, error: { code: 'FORBIDDEN', message: 'Only owners can delete endpoints' } };
    }
    const stored = JSON.parse(localStorage.getItem('resolveops_demo_state') || '{}');
    const endpoints = stored.webhookEndpoints || [];
    const index = endpoints.findIndex((e:any) => e.id === id);
    if (index === -1) return { ok: false, error: { code: 'NOT_FOUND', message: 'Endpoint not found' } };
    
    if (user && endpoints[index].organizationId !== user.organizationId) {
      return { ok: false, error: { code: 'FORBIDDEN', message: 'Access denied' } };
    }

    stored.webhookEndpoints = endpoints.filter((e:any) => e.id !== id);
    localStorage.setItem('resolveops_demo_state', JSON.stringify(stored));
    return success(null);
  }
}
export const webhookService = new WebhookService();
