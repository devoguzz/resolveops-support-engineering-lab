import { OrganizationMember } from '../../domain/models'
import { ServiceResult, success, failure, simulateNetworkDelay } from '../contracts'

export class TeamService {
  async listMembers(orgId: string, user?: any): Promise<ServiceResult<OrganizationMember[]>> {
    await simulateNetworkDelay(200);
    const stored = JSON.parse(localStorage.getItem('resolveops_demo_state') || '{}');
    
    if (user && user.role.startsWith('customer')) {
      if (orgId !== user.organizationId) {
        return failure({ code: 'FORBIDDEN', message: 'Access denied' });
      }
    }
    
    const members = stored.members || [];
    const users = stored.users || [];
    const mapped = members.filter((m: OrganizationMember) => m.organizationId === orgId).map((m: OrganizationMember) => ({
      ...m,
      user: users.find((u: any) => u.id === m.userId)
    }));
    return success(mapped);
  }
  
  async getMember(memberId: string, user?: any): Promise<ServiceResult<OrganizationMember>> {
    await simulateNetworkDelay(200);
    const stored = JSON.parse(localStorage.getItem('resolveops_demo_state') || '{}');
    const member = (stored.members || []).find((m: OrganizationMember) => m.id === memberId);
    
    if (!member) return failure({ code: 'NOT_FOUND', message: 'Member not found' });
    
    if (user && user.role.startsWith('customer')) {
      if (member.organizationId !== user.organizationId) {
        return failure({ code: 'FORBIDDEN', message: 'Access denied' });
      }
    }
    
    const users = stored.users || [];
    member.user = users.find((u: any) => u.id === member.userId);
    return success(member);
  }
  
  async updateMemberRole(memberId: string, newRole: string, user?: any): Promise<ServiceResult<OrganizationMember>> {
    await simulateNetworkDelay(200);
    const stored = JSON.parse(localStorage.getItem('resolveops_demo_state') || '{}');
    const member = (stored.members || []).find((m: OrganizationMember) => m.id === memberId);
    
    if (!member) return failure({ code: 'NOT_FOUND', message: 'Member not found' });
    
    if (user && user.role.startsWith('customer')) {
      if (user.role !== 'customer_owner') {
         return failure({ code: 'FORBIDDEN', message: 'Only owners can manage roles' });
      }
      if (member.organizationId !== user.organizationId) {
         return failure({ code: 'FORBIDDEN', message: 'Access denied' });
      }
    }
    
    member.role = newRole;
    localStorage.setItem('resolveops_demo_state', JSON.stringify(stored));
    return success(member);
  }
  
  async deactivateMember(memberId: string, user?: any): Promise<ServiceResult<OrganizationMember>> {
    await simulateNetworkDelay(200);
    const stored = JSON.parse(localStorage.getItem('resolveops_demo_state') || '{}');
    const members = stored.members || [];
    const member = members.find((m: OrganizationMember) => m.id === memberId);
    
    if (!member) return failure({ code: 'NOT_FOUND', message: 'Member not found' });
    
    if (user && user.role.startsWith('customer')) {
      if (user.role !== 'customer_owner') {
         return failure({ code: 'FORBIDDEN', message: 'Only owners can manage users' });
      }
      if (member.organizationId !== user.organizationId) {
         return failure({ code: 'FORBIDDEN', message: 'Access denied' });
      }
      // Owner cannot deactivate themselves
      if (member.userId === user.id) {
         return failure({ code: 'FORBIDDEN', message: 'You cannot deactivate your own account' });
      }
      // Cannot deactivate the last owner
      const activeOwners = members.filter((m: OrganizationMember) => m.organizationId === user.organizationId && m.role === 'customer_owner' && m.status === 'active');
      if (activeOwners.length <= 1 && member.role === 'customer_owner') {
         return failure({ code: 'FORBIDDEN', message: 'Cannot deactivate the last active owner' });
      }
    }
    
    member.status = 'inactive';
    localStorage.setItem('resolveops_demo_state', JSON.stringify(stored));
    return success(member);
  }
}
export const teamService = new TeamService();
