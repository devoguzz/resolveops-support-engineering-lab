import { Role } from './enums'

export type Permission = 
  // App scope
  | 'app:access_customer_portal'
  | 'app:access_support_console'
  
  // Organization
  | 'organization:read'
  | 'organization:manage' // e.g. billing
  
  // Team
  | 'team:read'
  | 'team:invite'
  | 'team:manage_roles'
  
  // API Keys
  | 'apikey:read'
  | 'apikey:create'
  | 'apikey:revoke'
  
  // Tickets
  | 'ticket:read_public'
  | 'ticket:create'
  | 'ticket:reply_public'
  
  // Support-specific
  | 'ticket:read_all'
  | 'ticket:read_internal'
  | 'ticket:manage' // assign, change priority
  | 'ticket:reply_internal'
  
  // Diagnostic
  | 'trace:read'
  | 'log:read'
  | 'job:read'
  | 'webhook_delivery:read_all'
  
  // Incidents
  | 'incident:read'
  | 'incident:manage'

const ROLE_PERMISSIONS: Record<Role, Permission[]> = {
  customer_owner: [
    'app:access_customer_portal',
    'organization:read',
    'organization:manage',
    'team:read',
    'team:invite',
    'team:manage_roles',
    'apikey:read',
    'apikey:create',
    'apikey:revoke',
    'ticket:read_public',
    'ticket:create',
    'ticket:reply_public',
  ],
  customer_member: [
    'app:access_customer_portal',
    'organization:read',
    'team:read',
    'apikey:read',
    'apikey:create',
    'ticket:read_public',
    'ticket:create',
    'ticket:reply_public',
  ],
  support_agent: [
    'app:access_support_console',
    'organization:read',
    'ticket:read_all',
    'ticket:read_public',
    'ticket:read_internal',
    'ticket:manage',
    'ticket:reply_public',
    'ticket:reply_internal',
    'trace:read',
    'log:read',
    'job:read',
    'webhook_delivery:read_all',
    'incident:read',
  ],
  support_lead: [
    'app:access_support_console',
    'organization:read',
    'ticket:read_all',
    'ticket:read_public',
    'ticket:read_internal',
    'ticket:manage',
    'ticket:reply_public',
    'ticket:reply_internal',
    'trace:read',
    'log:read',
    'job:read',
    'webhook_delivery:read_all',
    'incident:read',
    'incident:manage',
  ],
}

export function hasPermission(role: Role, permission: Permission): boolean {
  return ROLE_PERMISSIONS[role]?.includes(permission) || false
}
