import { describe, it, expect } from 'vitest'
import { hasPermission } from '../domain/permissions'

describe('Domain Permissions', () => {
  it('customer owner has manage roles permission', () => {
    expect(hasPermission('customer_owner', 'team:manage_roles')).toBe(true)
  })

  it('customer member does not have manage roles permission', () => {
    expect(hasPermission('customer_member', 'team:manage_roles')).toBe(false)
  })

  it('support agent can read internal tickets', () => {
    expect(hasPermission('support_agent', 'ticket:read_internal')).toBe(true)
  })

  it('customer owner cannot read internal tickets', () => {
    expect(hasPermission('customer_owner', 'ticket:read_internal')).toBe(false)
  })
})
