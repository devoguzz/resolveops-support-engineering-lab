import { Organization, OrganizationMember } from '../../domain/models'
import { ServiceResult, success, simulateNetworkDelay } from '../contracts'
import { DEMO_IDS } from '../../mocks/seed'

export class OrganizationService {
  async getOrganization(id: string): Promise<ServiceResult<Organization>> {
    await simulateNetworkDelay(200)
    const stored = JSON.parse(localStorage.getItem('resolveops_demo_state') || '{}')
    const orgs: Organization[] = stored.organizations || [
      { id: DEMO_IDS.org_main, name: 'Northstar Labs', plan: 'enterprise' },
      { id: DEMO_IDS.org_2, name: 'Stark Industries', plan: 'pro' },
      { id: DEMO_IDS.org_3, name: 'Wayne Enterprises', plan: 'free' }
    ]
    const org = orgs.find((o: Organization) => o.id === id)
    if (!org) return { ok: false, error: { code: 'NOT_FOUND', message: 'Organization not found' } }
    return success(org)
  }

  async listMembers(organizationId: string): Promise<ServiceResult<OrganizationMember[]>> {
    await simulateNetworkDelay(200)
    const stored = JSON.parse(localStorage.getItem('resolveops_demo_state') || '{}')
    const members: OrganizationMember[] = stored.members || [
      {
        id: 'mem_1',
        organizationId: DEMO_IDS.org_main,
        userId: DEMO_IDS.user_owner,
        role: 'customer_owner',
        status: 'active',
        joinedAt: '2025-01-15T00:00:00Z',
        lastActiveAt: new Date().toISOString()
      },
      {
        id: 'mem_2',
        organizationId: DEMO_IDS.org_main,
        userId: DEMO_IDS.user_member,
        role: 'customer_member',
        status: 'active',
        joinedAt: '2025-02-10T00:00:00Z',
        lastActiveAt: new Date().toISOString()
      }
    ]
    return success(members.filter((m: OrganizationMember) => m.organizationId === organizationId))
  }
}

export const organizationService = new OrganizationService()
