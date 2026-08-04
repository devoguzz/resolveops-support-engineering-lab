import { DemoState, SEED_DATA } from '../mocks/seed'

const STORAGE_KEY = 'resolveops_demo_state'

export function getStoredState(): DemoState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) {
      const parsed = JSON.parse(raw) as DemoState
      if (parsed.version === SEED_DATA.version) {
        return parsed
      }
      console.warn('Demo state version mismatch. Resetting to seed.')
    }
  } catch (e) {
    console.error('Failed to parse demo state', e)
  }
  
  return resetState()
}

export function saveState(state: DemoState) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
}

export function resetState(): DemoState {
  const fresh = JSON.parse(JSON.stringify(SEED_DATA))
  saveState(fresh)
  return fresh
}
