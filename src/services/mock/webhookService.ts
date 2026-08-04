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
}
export const webhookService = new WebhookService();
