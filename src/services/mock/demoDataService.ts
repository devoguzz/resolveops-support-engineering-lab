import { getStoredState, saveState } from '../../store/demoDataStore'
import type { DemoState } from '../../mocks/seed'
import { ServiceResult, success, simulateNetworkDelay } from '../contracts'

export class DemoDataService {
  async getState(): Promise<ServiceResult<DemoState>> {
    await simulateNetworkDelay(300)
    return success(getStoredState())
  }
  
  async resetData(): Promise<ServiceResult<void>> {
    await simulateNetworkDelay(500)
    const seedModule = await import('../../mocks/seed')
    const fresh = JSON.parse(JSON.stringify(seedModule.SEED_DATA))
    saveState(fresh)
    return success(undefined)
  }

  getDemoIds() {
    return {
      org_main: 'org_northstar',
      org_2: 'org_acme',
      org_3: 'org_globex',
      whd_main: 'whd_2048',
      req_main: 'req_8bd129c2',
      job_main: 'job_7721',
      incident_main: 'INC-2026-008',
      ticket_main: 'SUP-1042',
      user_owner: 'usr_owner_1',
      user_member: 'usr_member_1',
      support_agent: 'sup_agent_1',
      support_lead: 'sup_lead_1',
    }
  }
}

export const demoDataService = new DemoDataService()
