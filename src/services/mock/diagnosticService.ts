import { WebhookDelivery, RequestTrace, BackgroundJob, Incident } from '../../domain/models'
import { ServiceResult, success, failure, simulateNetworkDelay } from '../contracts'

export class DiagnosticService {
  async getWebhookDelivery(id: string, user?: any): Promise<ServiceResult<WebhookDelivery>> {
    await simulateNetworkDelay(300)
    const stored = JSON.parse(localStorage.getItem('resolveops_demo_state') || '{}')
    const item = (stored.webhookDeliveries || []).find((t: WebhookDelivery) => t.id === id)
    if (!item) return failure({ code: 'NOT_FOUND', message: 'Webhook delivery not found' })
    if (user && user.role.startsWith('customer') && item.organizationId !== user.organizationId) {
      return failure({ code: 'FORBIDDEN', message: 'Access denied' })
    }
    return success(item)
  }

  async getTrace(id: string, user?: any): Promise<ServiceResult<RequestTrace>> {
    await simulateNetworkDelay(300)
    const stored = JSON.parse(localStorage.getItem('resolveops_demo_state') || '{}')
    const item = (stored.traces || []).find((t: RequestTrace) => t.id === id)
    if (!item) return failure({ code: 'NOT_FOUND', message: 'Trace not found' })
    if (user && user.role.startsWith('customer') && item.organizationId !== user.organizationId) {
      return failure({ code: 'FORBIDDEN', message: 'Access denied' })
    }
    return success(item)
  }

  async getJob(id: string, user?: any): Promise<ServiceResult<BackgroundJob>> {
    await simulateNetworkDelay(300)
    const stored = JSON.parse(localStorage.getItem('resolveops_demo_state') || '{}')
    const item = (stored.jobs || []).find((t: BackgroundJob) => t.id === id)
    if (!item) return failure({ code: 'NOT_FOUND', message: 'Job not found' })
    if (user && user.role.startsWith('customer') && item.organizationId !== user.organizationId) {
      return failure({ code: 'FORBIDDEN', message: 'Access denied' })
    }
    return success(item)
  }

  async getIncident(id: string, _user?: any): Promise<ServiceResult<Incident>> {
    await simulateNetworkDelay(300)
    const stored = JSON.parse(localStorage.getItem('resolveops_demo_state') || '{}')
    const item = (stored.incidents || []).find((t: Incident) => t.id === id)
    if (!item) return failure({ code: 'NOT_FOUND', message: 'Incident not found' })
    return success(item)
  }
  
  async listTraces(query?: { organizationId?: string }, user?: any): Promise<ServiceResult<RequestTrace[]>> {
    await simulateNetworkDelay(400)
    const stored = JSON.parse(localStorage.getItem('resolveops_demo_state') || '{}')
    let traces = stored.traces || []
    
    if (user && user.role.startsWith('customer')) {
      traces = traces.filter((t: RequestTrace) => t.organizationId === user.organizationId)
    } else if (query?.organizationId) {
      traces = traces.filter((t: RequestTrace) => t.organizationId === query.organizationId)
    }
    return success(traces)
  }

  async listJobs(query?: { organizationId?: string }, user?: any): Promise<ServiceResult<BackgroundJob[]>> {
    await simulateNetworkDelay(400)
    const stored = JSON.parse(localStorage.getItem('resolveops_demo_state') || '{}')
    let jobs = stored.jobs || []
    
    if (user && user.role.startsWith('customer')) {
      jobs = jobs.filter((t: BackgroundJob) => t.organizationId === user.organizationId)
    } else if (query?.organizationId) {
      jobs = jobs.filter((t: BackgroundJob) => t.organizationId === query.organizationId)
    }
    return success(jobs)
  }

  async listLogs(query?: { requestId?: string }, user?: any): Promise<ServiceResult<any[]>> {
    await simulateNetworkDelay(400)
    const stored = JSON.parse(localStorage.getItem('resolveops_demo_state') || '{}')
    let logs = stored.logs || []
    
    if (user && user.role.startsWith('customer')) {
      logs = logs.filter((l: any) => l.organizationId === user.organizationId)
    }
    
    if (query?.requestId) logs = logs.filter((l: any) => l.traceId === query.requestId)
    return success(logs)
  }

  async listIncidents(): Promise<ServiceResult<Incident[]>> {
    await simulateNetworkDelay(400)
    const stored = JSON.parse(localStorage.getItem('resolveops_demo_state') || '{}')
    return success(stored.incidents || [])
  }
}
export const diagnosticService = new DiagnosticService()
