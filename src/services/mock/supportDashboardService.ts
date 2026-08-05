import { ServiceResult, success, simulateNetworkDelay } from '../contracts'
import { SupportTicket, Incident } from '../../domain/models'

export interface SupportDashboardMetrics {
  unassignedTickets: number
  highPriorityApproachingSla: number
  activeIncidents: number
  activeIncidentId: string | null
  systemHealth: number
  queueData: { name: string, value: number, color: string }[]
}

export class SupportDashboardService {
  async getMetrics(_user?: any): Promise<ServiceResult<SupportDashboardMetrics>> {
    await simulateNetworkDelay(300)
    const stored = JSON.parse(localStorage.getItem('resolveops_demo_state') || '{}')
    
    // In a real app, this would be computed by the backend database.
    const tickets: SupportTicket[] = stored.tickets || []
    const incidents: Incident[] = stored.incidents || []
    
    const unassignedTickets = tickets.filter(t => !t.assigneeId && t.status !== 'resolved').length
    const highPriorityApproachingSla = tickets.filter(t => (t.priority === 'p1' || t.priority === 'p2') && t.status !== 'resolved').length
    
    const activeIncidentsList = incidents.filter(i => i.status !== 'resolved')
    const activeIncidents = activeIncidentsList.length
    const activeIncidentId = activeIncidents > 0 ? activeIncidentsList[0].id : null

    // Compute queue data
    const p1 = tickets.filter(t => t.priority === 'p1' && t.status !== 'resolved').length
    const p2 = tickets.filter(t => t.priority === 'p2' && t.status !== 'resolved').length
    const p3 = tickets.filter(t => t.priority === 'p3' && t.status !== 'resolved').length
    const p4 = tickets.filter(t => t.priority === 'p4' && t.status !== 'resolved').length

    const queueData = [
      { name: 'P1 - Critical', value: p1, color: '#ef4444' },
      { name: 'P2 - High', value: p2, color: '#f97316' },
      { name: 'P3 - Normal', value: p3, color: '#3b82f6' },
      { name: 'P4 - Low', value: p4, color: '#64748b' },
    ]

    return success({
      unassignedTickets,
      highPriorityApproachingSla,
      activeIncidents,
      activeIncidentId,
      systemHealth: activeIncidents > 0 ? 98.2 : 99.8,
      queueData
    })
  }
}

export const supportDashboardService = new SupportDashboardService()
