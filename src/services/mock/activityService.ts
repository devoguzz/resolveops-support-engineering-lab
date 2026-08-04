import { ActivityEvent } from '../../domain/models'
import { ServiceResult, success, simulateNetworkDelay } from '../contracts'
import { ACTIVITY } from '../../mocks/seed'

export class ActivityService {
  async listActivity(organizationId: string, query?: any, user?: any): Promise<ServiceResult<ActivityEvent[]>> {
    await simulateNetworkDelay(200)
    const stored = JSON.parse(localStorage.getItem('resolveops_demo_state') || '{}')
    let activities: ActivityEvent[] = stored.activity || ACTIVITY
    
    if (user && user.role.startsWith('customer')) {
      if (organizationId !== user.organizationId) {
        return { ok: false, error: { code: 'FORBIDDEN', message: 'Access denied' } }
      }
    }
    
    let filtered = activities.filter(e => e.organizationId === organizationId)
    
    if (query?.actorId) {
      filtered = filtered.filter(e => e.actorId === query.actorId)
    }
    if (query?.action) {
      filtered = filtered.filter(e => e.action === query.action)
    }
    if (query?.result) {
      filtered = filtered.filter(e => e.result === query.result)
    }
    
    // Sort by timestamp descending
    filtered.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    
    return success(filtered)
  }
}

export const activityService = new ActivityService()
