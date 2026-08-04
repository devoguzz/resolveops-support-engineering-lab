import { Runbook } from '../../domain/models'
import { ServiceResult, success, simulateNetworkDelay } from '../contracts'
import { RUNBOOKS } from '../../mocks/seed'

export class RunbookService {
  async listRunbooks(): Promise<ServiceResult<Runbook[]>> {
    await simulateNetworkDelay(200)
    const stored = JSON.parse(localStorage.getItem('resolveops_demo_state') || '{}')
    return success(stored.runbooks || RUNBOOKS)
  }

  async getRunbook(slug: string): Promise<ServiceResult<Runbook>> {
    await simulateNetworkDelay(200)
    const stored = JSON.parse(localStorage.getItem('resolveops_demo_state') || '{}')
    const items: Runbook[] = stored.runbooks || RUNBOOKS
    const item = items.find(r => r.slug === slug)
    if (!item) return { ok: false, error: { code: 'NOT_FOUND', message: 'Runbook not found' } }
    return success(item)
  }
}

export const runbookService = new RunbookService()
