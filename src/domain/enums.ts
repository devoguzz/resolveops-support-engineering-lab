export type Role = 'customer_owner' | 'customer_member' | 'support_agent' | 'support_lead'

export type TicketPriority = 'p1' | 'p2' | 'p3' | 'p4'

export type TicketStatus = 
  | 'open'
  | 'waiting_for_support'
  | 'waiting_for_customer'
  | 'investigating'
  | 'resolved'
  | 'closed'

export type LogLevel = 'debug' | 'info' | 'warn' | 'error'

export type JobStatus =
  | 'pending'
  | 'processing'
  | 'completed'
  | 'failed'
  | 'retrying'
  | 'dead_letter'

export type SubscriptionStatus = 'trialing' | 'active' | 'past_due' | 'cancelled' | 'suspended'

export type IntegrationType = 'CRM' | 'Accounting' | 'Webhook' | 'Custom API'

export type WebhookStatus = 'active' | 'disabled' | 'failing'

export type IncidentStatus = 
  | 'investigating'
  | 'identified'
  | 'monitoring'
  | 'resolved'
  | 'postmortem_pending'
  | 'closed'

export type IncidentSeverity = 'sev1' | 'sev2' | 'sev3' | 'sev4'

export type AppErrorCode = 
  | 'WEBHOOK_SIGNATURE_INVALID' 
  | 'PERMISSION_CACHE_STALE' 
  | 'SUBSCRIPTION_SYNC_TIMEOUT' 
  | 'NOT_FOUND' 
  | 'UNAUTHORIZED' 
  | 'FORBIDDEN' 
  | 'VALIDATION_ERROR' 
  | 'INTERNAL_ERROR'
