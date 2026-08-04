import {
  Role, TicketPriority, TicketStatus, LogLevel, JobStatus,
  SubscriptionStatus, IntegrationType, WebhookStatus, IncidentStatus, IncidentSeverity
} from './enums'

export interface User {
  id: string
  email: string
  fullName: string
  role: Role
  organizationId?: string // Support users don't have this
}

export interface Organization {
  id: string
  name: string
  plan: string
}

export interface OrganizationMember {
  id: string
  organizationId: string
  userId: string
  role: Role
  status: 'active' | 'inactive'
  joinedAt: string
  lastActiveAt: string
  user?: User
}

export interface Subscription {
  id: string
  organizationId: string
  planName: string
  status: SubscriptionStatus
  startDate: string
  renewalDate: string
}

export interface ApiKey {
  id: string
  organizationId: string
  name: string
  prefix: string
  createdAt: string
  createdBy: string
  lastUsedAt?: string
  status: 'active' | 'revoked'
}

export interface Integration {
  id: string
  organizationId: string
  name: string
  type: IntegrationType
  endpointHost: string
  authType: string
  status: 'active' | 'error' | 'disabled'
  lastSyncAt?: string
  lastErrorAt?: string
}

export interface WebhookEndpoint {
  id: string
  organizationId: string
  name: string
  url: string
  subscribedEvents: string[]
  status: WebhookStatus
  createdAt: string
}

export interface WebhookDelivery {
  id: string
  endpointId: string
  organizationId: string
  event: string
  statusCode: number
  result: 'success' | 'failed'
  attempt: number
  createdAt: string
  durationMs: number
  requestId: string
  requestPayload: any
  responseBody?: any
  errorMessage?: string
}

export interface SupportTicket {
  id: string
  organizationId: string
  subject: string
  category: string
  priority: TicketPriority
  status: TicketStatus
  createdAt: string
  updatedAt: string
  assigneeId?: string
  requestIds: string[]
  createdBy?: string
  description: string
  impact: string
}

export interface TicketMessage {
  id: string
  ticketId: string
  authorId: string
  content: string
  isPublic: boolean
  createdAt: string
}

export interface InternalNote {
  id: string
  ticketId: string
  authorId: string
  content: string
  createdAt: string
}

export interface TicketTimelineEvent {
  id: string
  ticketId: string
  actorId: string
  action: string
  createdAt: string
}

export interface TicketResolution {
  ticketId: string
  rootCause: string
  workaround?: string
  permanentResolution?: string
  customerFacingResolution: string
  resolvedAt: string
}

export interface RequestTrace {
  id: string
  organizationId: string
  userId?: string
  method: string
  path: string
  statusCode: number
  durationMs: number
  timestamp: string
  errorType?: string
  stackTrace?: string
}

export interface StructuredLog {
  id: string
  traceId?: string
  organizationId: string
  level: LogLevel
  service: string
  message: string
  metadata: any
  timestamp: string
}

export interface BackgroundJob {
  id: string
  organizationId: string
  type: string
  status: JobStatus
  attempt: number
  createdAt: string
  startedAt?: string
  finishedAt?: string
  error?: string
  requestId?: string
}

export interface Incident {
  id: string
  title: string
  severity: IncidentSeverity
  affectedService: string
  status: IncidentStatus
  startedAt: string
  ownerId: string
}

export interface IncidentTimelineEvent {
  id: string
  incidentId: string
  content: string
  createdAt: string
}

export interface Runbook {
  slug: string
  title: string
  summary: string
  category: string
  tags: string[]
  content: string
  lastUpdated: string
}

export interface ActivityEvent {
  id: string
  organizationId: string
  actorId: string
  action: string
  resource: string
  result: 'success' | 'failed'
  description: string
  timestamp: string
}
