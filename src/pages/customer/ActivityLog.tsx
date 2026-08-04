import { useEffect, useState } from 'react'

import { activityService } from '../../services/mock/activityService'
import { ActivityEvent } from '../../domain/models'
import { useAuth } from '../../store/authStore'
import { formatDate } from '../../lib/dates'
import { PageHeader } from '../../components/domain/PageHeader'
import { Card, CardContent } from '../../components/ui/card'
import { Button } from '../../components/ui/button'

export function ActivityLog() {
  const { user } = useAuth()
  const [searchParams, setSearchParams] = useState(new URLSearchParams())
  const [events, setEvents] = useState<ActivityEvent[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchActivity = async () => {
      if (!user?.organizationId) return
      setLoading(true)
      const query = {
        actorId: searchParams.get('actorId') || undefined,
        action: searchParams.get('action') || undefined,
        result: searchParams.get('result') || undefined
      }
      const res = await activityService.listActivity(user.organizationId, query, user)
      if (res.ok) setEvents(res.data)
      setLoading(false)
    }
    fetchActivity()
  }, [user, searchParams])

  const handleFilter = (key: string, value: string) => {
    const newParams = new URLSearchParams(searchParams.toString())
    if (value) {
      newParams.set(key, value)
    } else {
      newParams.delete(key)
    }
    setSearchParams(newParams)
  }

  return (
    <div className="p-8 max-w-[1400px] mx-auto space-y-6">
      <PageHeader 
        title="Activity Log" 
        description="Audit trail of actions performed in your organization."
      />
      
      <Card className="bg-muted/30">
        <CardContent className="p-4 flex flex-col sm:flex-row gap-4 items-end">
          <div className="flex-1 w-full">
            <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Action Type</label>
            <select 
              value={searchParams.get('action') || ''} 
              onChange={e => handleFilter('action', e.target.value)}
              className="w-full bg-background border border-border text-foreground rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring transition-all"
            >
              <option value="">All Actions</option>
              <option value="user.login">Login</option>
              <option value="ticket.created">Ticket Created</option>
              <option value="ticket.reply">Ticket Reply</option>
              <option value="webhook.retry">Webhook Retry</option>
              <option value="apikey.create">API Key Created</option>
            </select>
          </div>
          <div className="flex-1 w-full">
            <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Result</label>
            <select 
              value={searchParams.get('result') || ''} 
              onChange={e => handleFilter('result', e.target.value)}
              className="w-full bg-background border border-border text-foreground rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring transition-all"
            >
              <option value="">All Results</option>
              <option value="success">Success</option>
              <option value="failed">Failed</option>
            </select>
          </div>
          <Button 
            variant="outline"
            onClick={() => setSearchParams(new URLSearchParams())} 
            className="w-full sm:w-auto"
          >
            Clear Filters
          </Button>
        </CardContent>
      </Card>

      <Card>
        <div className="overflow-x-auto">
          {loading ? (
            <div className="p-12 text-center text-sm text-muted-foreground">Loading activity...</div>
          ) : (
            <table className="w-full text-left text-sm border-collapse">
              <thead className="bg-muted/30 border-b border-border">
                <tr>
                  <th className="p-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Timestamp</th>
                  <th className="p-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Actor</th>
                  <th className="p-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Action</th>
                  <th className="p-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Resource</th>
                  <th className="p-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Result</th>
                  <th className="p-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Description</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {events.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="p-12 text-center text-sm text-muted-foreground">
                      No activity records found.
                    </td>
                  </tr>
                ) : events.map(e => (
                  <tr key={e.id} className="hover:bg-muted/30 transition-colors">
                    <td className="p-4 text-muted-foreground font-medium">{formatDate(e.timestamp)}</td>
                    <td className="p-4 font-semibold text-foreground">{e.actorId === user?.id ? 'You' : e.actorId}</td>
                    <td className="p-4 font-mono text-xs text-primary">{e.action}</td>
                    <td className="p-4 font-mono text-xs text-muted-foreground">{e.resource}</td>
                    <td className="p-4">
                      <span className={`px-2.5 py-1 text-xs font-bold uppercase tracking-wide rounded-md ${e.result === 'success' ? 'bg-success/15 text-success' : 'bg-destructive/15 text-destructive'}`}>
                        {e.result}
                      </span>
                    </td>
                    <td className="p-4 text-foreground">{e.description}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </Card>
    </div>
  )
}
