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
      
      // Prevent demoting the last owner
      if (member.role === 'customer_owner' && newRole !== 'customer_owner') {
        const storedMembers = stored.members || [];
        const activeOwners = storedMembers.filter((m: OrganizationMember) => m.organizationId === user.organizationId && m.role === 'customer_owner' && m.status === 'active');
        if (activeOwners.length <= 1) {
           return failure({ code: 'FORBIDDEN', message: 'Cannot demote the last active owner' });
        }
      }
    }
    
    member.role = newRole as any;
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

  async inviteMember(orgId: string, email: string, user?: any): Promise<ServiceResult<any>> {
    await simulateNetworkDelay(400);
    const stored = JSON.parse(localStorage.getItem('resolveops_demo_state') || '{}');
    if (user && user.role.startsWith('customer')) {
      if (user.role !== 'customer_owner') {
         return failure({ code: 'FORBIDDEN', message: 'Only owners can invite users' });
      }
      if (orgId !== user.organizationId) {
         return failure({ code: 'FORBIDDEN', message: 'Access denied' });
      }
    }
    
    const users = stored.users || [];
    const members = stored.members || [];
    
    // Check if user exists
    let invitedUser = users.find((u: any) => u.email === email);
    if (!invitedUser) {
      invitedUser = {
        id: `user_${Math.random()}`,
        email,
        fullName: email.split('@')[0],
        role: 'customer_member',
        organizationId: orgId
      };
      stored.users = [...users, invitedUser];
    }
    
    // Check if member already exists in org
    const existingMember = members.find((m: any) => m.userId === invitedUser.id && m.organizationId === orgId);
    if (existingMember) {
      return failure({ code: 'CONFLICT', message: 'User is already a member of this organization' });
    }
    
    const newMember: OrganizationMember = {
      id: `member_${Math.random()}`,
      organizationId: orgId,
      userId: invitedUser.id,
      role: 'customer_member',
      status: 'active',
      joinedAt: new Date().toISOString(),
      lastActiveAt: new Date().toISOString()
    };
    
    stored.members = [...members, newMember];
    localStorage.setItem('resolveops_demo_state', JSON.stringify(stored));
    
    return success({ ...newMember, user: invitedUser });
  }
}
export const teamService = new TeamService();
