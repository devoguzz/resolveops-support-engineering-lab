import { 
  User, Organization, OrganizationMember, ApiKey, Integration, 
  WebhookEndpoint, WebhookDelivery, SupportTicket, RequestTrace, StructuredLog, BackgroundJob, Incident, 
  Runbook, ActivityEvent 
} from '../domain/models';

export const DEMO_IDS = {
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
};

export const ORGANIZATIONS: Organization[] = [
  { id: DEMO_IDS.org_main, name: 'NorthStar Labs', plan: 'enterprise' },
  { id: DEMO_IDS.org_2, name: 'Acme Corp', plan: 'pro' },
  { id: DEMO_IDS.org_3, name: 'Globex Inc', plan: 'starter' },
];

export const USERS: User[] = [
  { id: DEMO_IDS.user_owner, email: 'owner@northstar.demo', fullName: 'Jane Doe', role: 'customer_owner', organizationId: DEMO_IDS.org_main },
  { id: DEMO_IDS.user_member, email: 'member@northstar.demo', fullName: 'John Smith', role: 'customer_member', organizationId: DEMO_IDS.org_main },
  { id: 'usr_acme_owner', email: 'owner@acme.demo', fullName: 'Alice Acme', role: 'customer_owner', organizationId: DEMO_IDS.org_2 },
  { id: 'usr_acme_member', email: 'member@acme.demo', fullName: 'Bob Acme', role: 'customer_member', organizationId: DEMO_IDS.org_2 },
  { id: 'usr_globex_owner', email: 'owner@globex.demo', fullName: 'Charlie Globex', role: 'customer_owner', organizationId: DEMO_IDS.org_3 },
  { id: DEMO_IDS.support_agent, email: 'maya@resolveops.demo', fullName: 'Maya Agent', role: 'support_agent' },
  { id: DEMO_IDS.support_lead, email: 'lead@resolveops.demo', fullName: 'Bob Lead', role: 'support_lead' },
];

// Generate members mapping strictly to USERS
export const MEMBERS: OrganizationMember[] = USERS.filter(u => u.organizationId).map((u, i) => ({
  id: `mem_${i}`,
  organizationId: u.organizationId as string,
  userId: u.id,
  role: u.role as any,
  status: 'active',
  joinedAt: '2025-01-01T00:00:00Z',
  lastActiveAt: new Date(Date.now() - Math.random() * 86400000 * 5).toISOString()
}));

export const API_KEYS: ApiKey[] = Array.from({length: 8}).map((_, i) => ({
  id: `key_${i}`,
  organizationId: ORGANIZATIONS[i % 3].id,
  name: `Production Key ${i}`,
  prefix: 'rop_demo_',
  lastFour: `${1000 + i}`,
  createdAt: '2025-01-01T00:00:00Z',
  createdBy: DEMO_IDS.user_owner,
  lastUsedAt: '2026-08-01T00:00:00Z',
  status: i === 7 ? 'revoked' : 'active'
}));

export const INTEGRATIONS: Integration[] = Array.from({length: 6}).map((_, i) => ({
  id: `int_${i}`,
  organizationId: ORGANIZATIONS[i % 3].id,
  name: i % 2 === 0 ? 'Slack Prod Alerts' : 'PagerDuty On-call',
  type: i % 2 === 0 ? 'slack' : 'pagerduty',
  endpointHost: 'api.example.com',
  authType: 'oauth2',
  status: 'active',
  createdAt: '2025-01-01T00:00:00Z'
} as any));

export const WEBHOOK_ENDPOINTS: WebhookEndpoint[] = Array.from({length: 5}).map((_, i) => ({
  id: `whe_${i}`,
  organizationId: ORGANIZATIONS[i % 3].id,
  name: `Payment Processor Endpoint ${i}`,
  url: `https://api.example.com/webhook/events/${i}`,
  status: 'active',
  subscribedEvents: ['payment.completed', 'payment.failed'],
  createdAt: '2025-01-01T00:00:00Z'
}));

export const WEBHOOK_DELIVERIES: WebhookDelivery[] = Array.from({length: 25}).map((_, i) => {
  const isMain = i === 0;
  return {
    id: isMain ? DEMO_IDS.whd_main : `whd_100${i}`,
    organizationId: isMain ? DEMO_IDS.org_main : ORGANIZATIONS[i % 3].id,
    endpointId: WEBHOOK_ENDPOINTS[i % 5].id,
    event: isMain ? 'payment.completed' : (i % 2 === 0 ? 'payment.completed' : 'user.created'),
    statusCode: isMain ? 401 : (i % 5 === 0 ? 500 : 200),
    result: isMain ? 'failed' : (i % 5 === 0 ? 'failed' : 'success'),
    attempt: isMain ? 3 : 1,
    durationMs: 120 + Math.floor(Math.random() * 100),
    requestPayload: { customer: 'test', amount: 99.99 },
    responseBody: isMain ? { error: 'Invalid Signature' } : {},
    requestId: isMain ? DEMO_IDS.req_main : `req_100${i}`,
    createdAt: new Date(Date.now() - i * 3600000).toISOString(),
    errorMessage: isMain ? 'Signature mismatch detected by destination server.' : ''
  };
});

const TICKET_SUBJECTS = [
  'API Rate limit exceeded on reporting endpoint',
  'Webhook signature validation failing intermittently',
  'Cannot invite new team members',
  'Billing invoice not generated for July',
  'SSO integration with Okta throwing 500 error',
  'Latency spikes on data export jobs'
];

export const TICKETS: SupportTicket[] = Array.from({length: 24}).map((_, i) => {
  const isMain = i === 0;
  const org = isMain ? DEMO_IDS.org_main : ORGANIZATIONS[i % 3].id;
  const creator = USERS.find(u => u.organizationId === org)?.id || DEMO_IDS.user_owner;
  
  return {
    id: isMain ? DEMO_IDS.ticket_main : `SUP-${2000 + i}`,
    organizationId: org,
    subject: isMain ? 'Webhook delivery failing for production events' : TICKET_SUBJECTS[i % TICKET_SUBJECTS.length],
    description: isMain ? 'We are seeing 401s on all our webhooks.' : 'Please help, it is impacting our production.',
    status: isMain ? 'open' : (i % 3 === 0 ? 'resolved' : 'open'),
    priority: isMain ? 'p1' : (i % 2 === 0 ? 'p2' : 'p3'),
    category: isMain ? 'webhooks' : 'api',
    impact: isMain ? 'critical' : 'high',
    createdAt: new Date(Date.now() - i * 3600000 * 24).toISOString(),
    updatedAt: new Date(Date.now() - i * 3600000 * 12).toISOString(),
    requestIds: isMain ? [DEMO_IDS.req_main] : [],
    assigneeId: (i % 2 === 0 || isMain) ? DEMO_IDS.support_agent : undefined,
    createdBy: creator
  };
});

export const TRACES: RequestTrace[] = Array.from({length: 40}).map((_, i) => {
  const isMain = i === 0;
  return {
    id: isMain ? DEMO_IDS.req_main : `req_200${i}`,
    organizationId: isMain ? DEMO_IDS.org_main : ORGANIZATIONS[i % 3].id,
    method: 'POST',
    path: '/api/v1/events',
    statusCode: isMain ? 500 : (i % 5 === 0 ? 429 : 200),
    durationMs: Math.floor(Math.random() * 500),
    timestamp: new Date(Date.now() - i * 3600000).toISOString(),
    errorType: isMain ? 'WEBHOOK_SIGNATURE_INVALID' : undefined,
    stackTrace: isMain ? 'Failed to deliver webhook due to invalid HMAC signature\n  at verifySignature (src/worker/webhook.ts:45)\n  at processJob (src/worker/index.ts:112)' : undefined
  };
});

export const LOGS: StructuredLog[] = Array.from({length: 100}).map((_, i) => {
  const isMain = i === 0;
  return {
    id: `log_${i}`,
    organizationId: isMain ? DEMO_IDS.org_main : ORGANIZATIONS[i % 3].id,
    timestamp: new Date(Date.now() - i * 1800000).toISOString(),
    level: isMain ? 'error' : (i % 10 === 0 ? 'warn' : 'info'),
    message: isMain ? 'Failed to deliver webhook' : `Processed job successfully`,
    service: 'webhook-worker',
    traceId: isMain ? DEMO_IDS.req_main : undefined,
    metadata: isMain ? { error: 'WEBHOOK_SIGNATURE_INVALID' } : {}
  };
});

export const JOBS: BackgroundJob[] = Array.from({length: 20}).map((_, i) => {
  const isMain = i === 0;
  return {
    id: isMain ? DEMO_IDS.job_main : `job_100${i}`,
    organizationId: isMain ? DEMO_IDS.org_main : ORGANIZATIONS[i % 3].id,
    type: 'webhook_delivery',
    status: isMain ? 'failed' : (i % 4 === 0 ? 'failed' : 'completed'),
    attempt: isMain ? 3 : 1,
    error: isMain ? 'Error: SignatureInvalidError at processJob()' : undefined,
    createdAt: new Date(Date.now() - i * 3600000).toISOString(),
    startedAt: new Date(Date.now() - i * 3600000).toISOString(),
    finishedAt: isMain ? undefined : new Date(Date.now() - i * 3600000 + 5000).toISOString(),
    requestId: isMain ? DEMO_IDS.req_main : undefined
  };
});

export const INCIDENTS: Incident[] = Array.from({length: 3}).map((_, i) => {
  const isMain = i === 0;
  return {
    id: isMain ? DEMO_IDS.incident_main : `INC-2026-00${i}`,
    title: isMain ? 'Global Webhook Delivery Delays' : `Database Latency Spike in EU Region`,
    status: isMain ? 'investigating' : 'resolved',
    severity: isMain ? 'sev1' : 'sev2',
    startedAt: new Date(Date.now() - (i + 1) * 86400000).toISOString(),
    resolvedAt: isMain ? undefined : new Date(Date.now() - i * 86400000).toISOString(),
    affectedService: isMain ? 'webhook-worker' : 'database',
    ownerId: DEMO_IDS.support_agent
  } as any;
});

export const RUNBOOKS: Runbook[] = Array.from({length: 8}).map((_, i) => {
  const isMain = i === 0;
  return {
    id: `rb_${i}`,
    slug: isMain ? 'troubleshooting-webhook-failures' : `runbook-${i}`,
    title: isMain ? 'Handling Invalid Webhook Signatures' : `How to debug API 429s`,
    summary: isMain ? 'Steps to verify and resolve customer webhook signature mismatch issues.' : 'Runbook for rate limit debugging',
    tags: ['webhooks', 'security'],
    content: '1. Verify trace... 2. Check org secrets...',
    category: 'Security',
    lastUpdated: new Date().toISOString()
  } as any;
});

const ACTIVITY_TYPES = [
  { action: 'user_invited', description: 'Invited new user to organization' },
  { action: 'role_changed', description: 'Updated user role' },
  { action: 'api_key_created', description: 'API Key Created' },
  { action: 'api_key_revoked', description: 'API Key Revoked' },
  { action: 'integration_tested', description: 'Tested Integration Connection' },
  { action: 'webhook_endpoint_added', description: 'Added new Webhook Endpoint' },
  { action: 'webhook_delivery_failed', description: 'Webhook delivery failed after 3 attempts' },
  { action: 'ticket_resolved', description: 'Support request was resolved' },
  { action: 'subscription_updated', description: 'Subscription plan changed' }
];

export const ACTIVITY: ActivityEvent[] = Array.from({length: 50}).map((_, i) => {
  const t = ACTIVITY_TYPES[i % ACTIVITY_TYPES.length];
  const org = ORGANIZATIONS[i % 3].id;
  const user = USERS.find(u => u.organizationId === org)?.id || DEMO_IDS.user_owner;
  
  return {
    id: `act_${i}`,
    organizationId: org,
    actorId: user,
    action: t.action,
    resource: `res_${i}`,
    result: i % 10 === 0 ? 'failure' : 'success',
    description: t.description,
    timestamp: new Date(Date.now() - i * 14400000).toISOString()
  } as any;
});

export interface DemoState {
  version: number;
  users: User[];
  organizations: Organization[];
  members: OrganizationMember[];
  apiKeys: ApiKey[];
  integrations: Integration[];
  webhookEndpoints: WebhookEndpoint[];
  webhookDeliveries: WebhookDelivery[];
  tickets: SupportTicket[];
  traces: RequestTrace[];
  logs: StructuredLog[];
  jobs: BackgroundJob[];
  incidents: Incident[];
  runbooks: Runbook[];
  activity: ActivityEvent[];
}

export const SEED_DATA: DemoState = {
  version: 5, // Bump version to force reset
  users: USERS,
  organizations: ORGANIZATIONS,
  members: MEMBERS,
  apiKeys: API_KEYS,
  integrations: INTEGRATIONS,
  webhookEndpoints: WEBHOOK_ENDPOINTS,
  webhookDeliveries: WEBHOOK_DELIVERIES,
  tickets: TICKETS,
  traces: TRACES,
  logs: LOGS,
  jobs: JOBS,
  incidents: INCIDENTS,
  runbooks: RUNBOOKS,
  activity: ACTIVITY
};
