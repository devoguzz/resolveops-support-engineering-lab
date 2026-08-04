import { createBrowserRouter, Navigate } from 'react-router-dom'
import { AuthLayout } from '../layouts/AuthLayout'
import { CustomerLayout } from '../layouts/CustomerLayout'
import { SupportLayout } from '../layouts/SupportLayout'
import { ProtectedRoute } from './routeGuards'
import { Login } from '../pages/auth/Login'

// System Pages
import { Forbidden } from '../pages/system/Forbidden'
import { NotFound } from '../pages/system/NotFound'

// Customer Pages
import { Dashboard as CustomerDashboard } from '../pages/customer/Dashboard'
import { TeamList } from '../pages/customer/TeamList'
import { TeamMemberDetail } from '../pages/customer/TeamMemberDetail'
import { Subscription } from '../pages/customer/Subscription'
import { ApiKeys } from '../pages/customer/ApiKeys'
import { Integrations } from '../pages/customer/Integrations'
import { IntegrationDetail } from '../pages/customer/IntegrationDetail'
import { Webhooks } from '../pages/customer/Webhooks'
import { CustomerWebhookDetail } from '../pages/customer/CustomerWebhookDetail'
import { ActivityLog } from '../pages/customer/ActivityLog'
import { SupportRequestList } from '../pages/customer/SupportRequestList'
import { NewSupportRequest } from '../pages/customer/NewSupportRequest'
import { CustomerTicketDetail } from '../pages/customer/CustomerTicketDetail'

// Support Pages
import { Dashboard as SupportDashboard } from '../pages/support/Dashboard'
import { TicketQueue } from '../pages/support/TicketQueue'
import { SupportTicketDetail } from '../pages/support/SupportTicketDetail'
import { Customer360 } from '../pages/support/Customer360'
import { TraceExplorer } from '../pages/support/TraceExplorer'
import { TraceDetail } from '../pages/support/TraceDetail'
import { LogExplorer } from '../pages/support/LogExplorer'
import { SupportWebhookInspector } from '../pages/support/SupportWebhookInspector'
import { SupportWebhookDetail } from '../pages/support/SupportWebhookDetail'
import { JobMonitor } from '../pages/support/JobMonitor'
import { JobDetail } from '../pages/support/JobDetail'
import { IncidentCenter } from '../pages/support/IncidentCenter'
import { IncidentDetail } from '../pages/support/IncidentDetail'
import { RunbookList } from '../pages/support/RunbookList'
import { RunbookDetail } from '../pages/support/RunbookDetail'

export const router = createBrowserRouter([
  {
    path: '/',
    // Redirect based on role will be handled in a dynamic way later or default to login
    element: <Navigate to="/login" replace />,
  },
  {
    element: <AuthLayout />,
    children: [
      {
        path: '/login',
        element: <Login />,
      },
    ]
  },
  {
    path: '/app',
    element: (
      <ProtectedRoute allowedRoles={['customer_owner', 'customer_member']}>
        <CustomerLayout />
      </ProtectedRoute>
    ),
    children: [
      { path: 'dashboard', element: <CustomerDashboard /> },
      { path: 'team', element: <TeamList /> },
      { path: 'team/:memberId', element: <TeamMemberDetail /> },
      { path: 'subscription', element: <Subscription /> },
      { path: 'api-keys', element: <ApiKeys /> },
      { path: 'integrations', element: <Integrations /> },
      { path: 'integrations/:integrationId', element: <IntegrationDetail /> },
      { path: 'webhooks', element: <Webhooks /> },
      { path: 'webhooks/:deliveryId', element: <CustomerWebhookDetail /> },
      { path: 'activity', element: <ActivityLog /> },
      { path: 'support', element: <SupportRequestList /> },
      { path: 'support/new', element: <NewSupportRequest /> },
      { path: 'support/:ticketId', element: <CustomerTicketDetail /> },
      { path: '', element: <Navigate to="/app/dashboard" replace /> },
      { path: '*', element: <NotFound /> }
    ]
  },
  {
    path: '/support',
    element: (
      <ProtectedRoute allowedRoles={['support_agent', 'support_lead']}>
        <SupportLayout />
      </ProtectedRoute>
    ),
    children: [
      { path: 'dashboard', element: <SupportDashboard /> },
      { path: 'tickets', element: <TicketQueue /> },
      { path: 'tickets/:ticketId', element: <SupportTicketDetail /> },
      { path: 'customers/:organizationId', element: <Customer360 /> },
      { path: 'traces', element: <TraceExplorer /> },
      { path: 'traces/:requestId', element: <TraceDetail /> },
      { path: 'logs', element: <LogExplorer /> },
      { path: 'webhooks', element: <SupportWebhookInspector /> },
      { path: 'webhooks/:deliveryId', element: <SupportWebhookDetail /> },
      { path: 'jobs', element: <JobMonitor /> },
      { path: 'jobs/:jobId', element: <JobDetail /> },
      { path: 'incidents', element: <IncidentCenter /> },
      { path: 'incidents/:incidentId', element: <IncidentDetail /> },
      { path: 'runbooks', element: <RunbookList /> },
      { path: 'runbooks/:slug', element: <RunbookDetail /> },
      { path: '', element: <Navigate to="/support/dashboard" replace /> },
      { path: '*', element: <NotFound /> }
    ]
  },
  {
    path: '/403',
    element: <Forbidden />,
  },
  {
    path: '*',
    element: <NotFound />,
  }
])
