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
}

export const demoDataService = new DemoDataService()
