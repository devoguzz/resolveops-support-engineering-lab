import { SupportTicket } from '../../domain/models'
import { TicketStatus } from '../../domain/enums'
import { ServiceResult, success, failure, simulateNetworkDelay, Paginated } from '../contracts'
import { TICKETS } from '../../mocks/seed'
import { TicketMessage, InternalNote } from '../../domain/models'

export class TicketService {
  async getTicket(id: string, user?: any): Promise<ServiceResult<SupportTicket>> {
    await simulateNetworkDelay(400)
    const stored = JSON.parse(localStorage.getItem('resolveops_demo_state') || '{}')
    const ticket = (stored.tickets || TICKETS).find((t: SupportTicket) => t.id === id)
    if (!ticket) return failure({ code: 'NOT_FOUND', message: 'Ticket not found' })
    
    if (user && user.role.startsWith('customer')) {
      if (ticket.organizationId !== user.organizationId) return failure({ code: 'FORBIDDEN', message: 'Access denied' })
      if (user.role === 'customer_member' && ticket.createdBy !== user.id) return failure({ code: 'FORBIDDEN', message: 'Access denied' })
    }
    
    return success(ticket)
  }

  async listTickets(query: { status?: TicketStatus, assigneeId?: string, organizationId?: string }, user?: any): Promise<ServiceResult<Paginated<SupportTicket>>> {
    await simulateNetworkDelay(500)
    const stored = JSON.parse(localStorage.getItem('resolveops_demo_state') || '{}')
    let tickets: SupportTicket[] = stored.tickets || TICKETS
    
    if (user && user.role.startsWith('customer')) {
      tickets = tickets.filter(t => t.organizationId === user.organizationId)
      if (user.role === 'customer_member') {
        tickets = tickets.filter(t => t.createdBy === user.id)
      }
    } else if (query.organizationId) {
      tickets = tickets.filter(t => t.organizationId === query.organizationId)
    }

    if (query.status) tickets = tickets.filter(t => t.status === query.status)
    if (query.assigneeId) tickets = tickets.filter(t => t.assigneeId === query.assigneeId)
    
    return success({
      items: tickets,
      total: tickets.length,
      page: 1,
      pageSize: 50,
      hasMore: false
    })
  }

  async createTicket(input: { subject: string, category: string, description: string, impact: string, requestIds: string[], organizationId: string }): Promise<ServiceResult<SupportTicket>> {
    await simulateNetworkDelay(800)
    const stored = JSON.parse(localStorage.getItem('resolveops_demo_state') || '{}')
    
    const newTicket: SupportTicket = {
      id: `SUP-${Math.floor(1000 + Math.random() * 9000)}`,
      organizationId: input.organizationId,
      subject: input.subject,
      category: input.category,
      priority: 'p3',
      status: 'open',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      requestIds: input.requestIds,
      description: input.description,
      impact: input.impact
    }
    
    stored.tickets = [...(stored.tickets || []), newTicket]
    localStorage.setItem('resolveops_demo_state', JSON.stringify(stored))
    
    return success(newTicket)
  }

  async addMessage(ticketId: string, content: string, authorId: string): Promise<ServiceResult<TicketMessage>> {
    await simulateNetworkDelay(400)
    const stored = JSON.parse(localStorage.getItem('resolveops_demo_state') || '{}')
    const msg: TicketMessage = {
      id: `msg_${Math.random()}`,
      ticketId,
      authorId,
      content,
      isPublic: true,
      createdAt: new Date().toISOString()
    }
    stored.ticketMessages = [...(stored.ticketMessages || []), msg]
    localStorage.setItem('resolveops_demo_state', JSON.stringify(stored))
    return success(msg)
  }

  async addInternalNote(ticketId: string, content: string, authorId: string): Promise<ServiceResult<InternalNote>> {
    await simulateNetworkDelay(400)
    const stored = JSON.parse(localStorage.getItem('resolveops_demo_state') || '{}')
    const note: InternalNote = {
      id: `note_${Math.random()}`,
      ticketId,
      authorId,
      content,
      createdAt: new Date().toISOString()
    }
    stored.internalNotes = [...(stored.internalNotes || []), note]
    localStorage.setItem('resolveops_demo_state', JSON.stringify(stored))
    return success(note)
  }

  async resolveTicket(ticketId: string, _resolution: string): Promise<ServiceResult<SupportTicket>> {
    await simulateNetworkDelay(400)
    const stored = JSON.parse(localStorage.getItem('resolveops_demo_state') || '{}')
    const ticket = (stored.tickets || []).find((t:any) => t.id === ticketId)
    if (!ticket) return failure({ code: 'NOT_FOUND', message: 'Ticket not found' })
    ticket.status = 'resolved'
    ticket.updatedAt = new Date().toISOString()
    localStorage.setItem('resolveops_demo_state', JSON.stringify(stored))
    return success(ticket)
  }
  async listMessages(ticketId: string): Promise<ServiceResult<TicketMessage[]>> {
    await simulateNetworkDelay(200)
    const stored = JSON.parse(localStorage.getItem('resolveops_demo_state') || '{}')
    const messages = stored.ticketMessages || []
    return success(messages.filter((m: TicketMessage) => m.ticketId === ticketId))
  }

  async listInternalNotes(ticketId: string): Promise<ServiceResult<InternalNote[]>> {
    await simulateNetworkDelay(200)
    const stored = JSON.parse(localStorage.getItem('resolveops_demo_state') || '{}')
    const notes = stored.internalNotes || []
    return success(notes.filter((n: InternalNote) => n.ticketId === ticketId))
  }
}

export const ticketService = new TicketService()
