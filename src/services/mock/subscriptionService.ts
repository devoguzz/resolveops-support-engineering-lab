import { Subscription } from '../../domain/models'
import { ServiceResult, success, simulateNetworkDelay } from '../contracts'
import { DEMO_IDS } from '../../mocks/seed'

export class SubscriptionService {
  async getSubscription(organizationId: string, user?: any): Promise<ServiceResult<Subscription>> {
    await simulateNetworkDelay(400)
    const stored = JSON.parse(localStorage.getItem('resolveops_demo_state') || '{}')
    const subs: Subscription[] = stored.subscriptions || [
      {
        id: 'sub_enterprise_01',
        organizationId: DEMO_IDS.org_main,
        planName: 'Enterprise',
        status: 'active',
        startDate: '2025-01-01T00:00:00Z',
        renewalDate: '2026-01-01T00:00:00Z'
      }
    ]
    const sub = subs.find(s => s.organizationId === organizationId)
    if (!sub) return { ok: false, error: { code: 'NOT_FOUND', message: 'Subscription not found' } }

    if (user && user.role.startsWith('customer') && sub.organizationId !== user.organizationId) {
       return { ok: false, error: { code: 'FORBIDDEN', message: 'Access denied' } }
    }

    return success(sub)
  }
}

export const subscriptionService = new SubscriptionService()
