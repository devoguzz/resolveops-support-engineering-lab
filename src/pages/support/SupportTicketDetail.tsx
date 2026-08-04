import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ticketService } from '../../services/mock/ticketService'
import { TicketMessage, InternalNote, SupportTicket } from '../../domain/models'
import { useAuth } from '../../store/authStore'
import { formatDate } from '../../lib/dates'

export function SupportTicketDetail() {
  const { ticketId } = useParams()
  
  const { user } = useAuth()
  const [ticket, setTicket] = useState<SupportTicket | null>(null)
  const [messages, setMessages] = useState<TicketMessage[]>([])
  const [notes, setNotes] = useState<InternalNote[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [activeTab, setActiveTab] = useState<'overview' | 'conversation' | 'notes' | 'investigation'>('overview')
  const [replyText, setReplyText] = useState('')
  const [noteText, setNoteText] = useState('')
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    const fetchTicket = async () => {
      if (!ticketId) return
      setLoading(true)
      const result = await ticketService.getTicket(ticketId)
      if (result.ok) {
        setTicket(result.data)
        const msgRes = await ticketService.listMessages(ticketId)
        if (msgRes.ok) setMessages(msgRes.data)
        const noteRes = await ticketService.listInternalNotes(ticketId)
        if (noteRes.ok) setNotes(noteRes.data)
      } else {
        setError(result.error.message)
      }
      setLoading(false)
    }
    fetchTicket()
  }, [ticketId])

  const handleReply = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!ticketId || !user?.id || !replyText) return
    setSubmitting(true)
    const res = await ticketService.addMessage(ticketId, replyText, user.id)
    if (res.ok) {
      setMessages([...messages, res.data])
      setReplyText('')
    }
    setSubmitting(false)
  }

  const handleNote = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!ticketId || !user?.id || !noteText) return
    setSubmitting(true)
    const res = await ticketService.addInternalNote(ticketId, noteText, user.id)
    if (res.ok) {
      setNotes([...notes, res.data])
      setNoteText('')
    }
    setSubmitting(false)
  }

  if (loading) return <div className="p-4">Loading ticket...</div>
  if (error) return <div className="p-4 text-danger">{error}</div>
  if (!ticket) return <div className="p-4">Ticket not found</div>

  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold">{ticket.subject}</h1>
          <p className="text-sm text-muted mt-1">
            {ticket.id} • {ticket.status} • Priority: {ticket.priority} • Organization: <Link to={`/support/customers/${ticket.organizationId}`} className="text-primary hover:underline">{ticket.organizationId}</Link>
          </p>
        </div>
        <div className="flex gap-2">
          <button className="btn btn-secondary text-sm">Assign to me</button>
          <button className="btn btn-primary text-sm">Resolve</button>
        </div>
      </div>

      <div className="card p-0 overflow-hidden">
        <div className="flex border-b border-gray-200 bg-slate-50">
          <button onClick={() => setActiveTab('overview')} className={`px-4 py-3 text-sm font-medium border-b-2 ${activeTab === 'overview' ? 'border-primary text-primary' : 'border-transparent text-muted hover:text-slate-900'}`}>Overview</button>
          <button onClick={() => setActiveTab('conversation')} className={`px-4 py-3 text-sm font-medium border-b-2 ${activeTab === 'conversation' ? 'border-primary text-primary' : 'border-transparent text-muted hover:text-slate-900'}`}>Conversation ({messages.length})</button>
          <button onClick={() => setActiveTab('notes')} className={`px-4 py-3 text-sm font-medium border-b-2 ${activeTab === 'notes' ? 'border-primary text-primary' : 'border-transparent text-muted hover:text-slate-900'}`}>Internal Notes ({notes.length})</button>
          <button onClick={() => setActiveTab('investigation')} className={`px-4 py-3 text-sm font-medium border-b-2 ${activeTab === 'investigation' ? 'border-primary text-primary' : 'border-transparent text-muted hover:text-slate-900'}`}>Investigation</button>
        </div>
        <div className="p-6">
          
          {activeTab === 'overview' && (
            <>
              <h3 className="text-lg font-semibold mb-4">Customer Report</h3>
              <div className="bg-slate-50 p-4 rounded border border-gray-100 whitespace-pre-wrap text-sm">
                {ticket.description}
              </div>
              
              <div className="mt-6 grid grid-cols-2 gap-4">
                <div>
                  <span className="text-sm text-muted block mb-1">Impact</span>
                  <span className="text-sm font-medium">{ticket.impact}</span>
                </div>
                <div>
                  <span className="text-sm text-muted block mb-1">Category</span>
                  <span className="text-sm font-medium">{ticket.category}</span>
                </div>
              </div>
            </>
          )}

          {activeTab === 'conversation' && (
            <div className="flex flex-col gap-6">
              {messages.length === 0 ? (
                <p className="text-muted text-sm italic">No messages yet.</p>
              ) : (
                <div className="flex flex-col gap-4">
                  {messages.map(m => (
                    <div key={m.id} className="bg-white border border-gray-200 p-4 rounded-lg">
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-semibold text-sm">{m.authorId}</span>
                        <span className="text-xs text-muted">{formatDate(m.createdAt)}</span>
                      </div>
                      <p className="text-sm whitespace-pre-wrap">{m.content}</p>
                    </div>
                  ))}
                </div>
              )}
              <form onSubmit={handleReply} className="mt-4 flex flex-col gap-2">
                <textarea 
                  value={replyText}
                  onChange={e => setReplyText(e.target.value)}
                  placeholder="Type a public reply to the customer..."
                  className="form-input w-full h-24"
                  required
                />
                <button type="submit" disabled={submitting || !replyText} className="btn btn-primary self-end">Send Reply</button>
              </form>
            </div>
          )}

          {activeTab === 'notes' && (
            <div className="flex flex-col gap-6">
              {notes.length === 0 ? (
                <p className="text-muted text-sm italic">No internal notes yet.</p>
              ) : (
                <div className="flex flex-col gap-4">
                  {notes.map(n => (
                    <div key={n.id} className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg">
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-semibold text-sm text-yellow-900">{n.authorId}</span>
                        <span className="text-xs text-yellow-700">{formatDate(n.createdAt)}</span>
                      </div>
                      <p className="text-sm whitespace-pre-wrap text-yellow-900">{n.content}</p>
                    </div>
                  ))}
                </div>
              )}
              <form onSubmit={handleNote} className="mt-4 flex flex-col gap-2">
                <textarea 
                  value={noteText}
                  onChange={e => setNoteText(e.target.value)}
                  placeholder="Type a private internal note..."
                  className="form-input w-full h-24 bg-yellow-50 border-yellow-200 focus:border-yellow-400"
                  required
                />
                <button type="submit" disabled={submitting || !noteText} className="btn btn-secondary self-end text-yellow-900 border-yellow-300 hover:bg-yellow-100">Add Internal Note</button>
              </form>
            </div>
          )}

          {activeTab === 'investigation' && (
            <div className="flex flex-col gap-6">
              <h3 className="text-lg font-semibold">Diagnostic Links</h3>
              <p className="text-sm text-muted">Use these links to jump into diagnostics with the context of this ticket.</p>
              
              {ticket.requestIds.length > 0 ? (
                <div className="flex flex-col gap-4">
                  <h4 className="text-sm font-semibold">Related Request Traces</h4>
                  <ul className="flex flex-col gap-2">
                    {ticket.requestIds.map(reqId => (
                      <li key={reqId}>
                        <Link to={`/support/traces/${reqId}`} className="text-primary hover:underline font-mono bg-blue-50 px-2 py-1 rounded inline-block">
                          View Trace: {reqId}
                        </Link>
                        <Link to={`/support/logs?requestId=${reqId}`} className="text-muted hover:text-primary ml-4 text-sm hover:underline">
                          View Logs
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : (
                <p className="text-sm text-muted italic">No request IDs associated with this ticket.</p>
              )}
            </div>
          )}

        </div>
      </div>
    </div>
  )
}