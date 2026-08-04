import { useEffect, useState } from 'react'

import { activityService } from '../../services/mock/activityService'
import { ActivityEvent } from '../../domain/models'
import { useAuth } from '../../store/authStore'
import { formatDate } from '../../lib/dates'

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
    <div className="flex flex-col gap-6 max-w-6xl">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Activity Log</h1>
          <p className="text-slate-500 mt-1">Audit trail of actions performed in your organization.</p>
        </div>
      </div>
      
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex gap-4 items-end">
        <div className="flex-1">
          <label className="block text-xs font-medium text-slate-500 uppercase tracking-wider mb-1">Action Type</label>
          <select 
            value={searchParams.get('action') || ''} 
            onChange={e => handleFilter('action', e.target.value)}
            className="w-full form-input py-2"
          >
            <option value="">All Actions</option>
            <option value="user.login">Login</option>
            <option value="ticket.created">Ticket Created</option>
            <option value="ticket.reply">Ticket Reply</option>
            <option value="webhook.retry">Webhook Retry</option>
            <option value="apikey.create">API Key Created</option>
          </select>
        </div>
        <div className="flex-1">
          <label className="block text-xs font-medium text-slate-500 uppercase tracking-wider mb-1">Result</label>
          <select 
            value={searchParams.get('result') || ''} 
            onChange={e => handleFilter('result', e.target.value)}
            className="w-full form-input py-2"
          >
            <option value="">All Results</option>
            <option value="success">Success</option>
            <option value="failed">Failed</option>
          </select>
        </div>
        <button 
          onClick={() => setSearchParams(new URLSearchParams())} 
          className="btn btn-secondary border-slate-300 py-2"
        >
          Clear Filters
        </button>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-slate-500">Loading activity...</div>
        ) : (
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-slate-500 border-b border-slate-200">
              <tr>
                <th className="p-4 font-medium">Timestamp</th>
                <th className="p-4 font-medium">Actor</th>
                <th className="p-4 font-medium">Action</th>
                <th className="p-4 font-medium">Resource</th>
                <th className="p-4 font-medium">Result</th>
                <th className="p-4 font-medium">Description</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {events.length === 0 ? (
                <tr><td colSpan={6} className="p-8 text-center text-slate-500">No activity records found.</td></tr>
              ) : events.map(e => (
                <tr key={e.id} className="hover:bg-slate-50">
                  <td className="p-4 text-slate-500">{formatDate(e.timestamp)}</td>
                  <td className="p-4 font-medium text-slate-900">{e.actorId === user?.id ? 'You' : e.actorId}</td>
                  <td className="p-4 font-mono text-xs text-indigo-700">{e.action}</td>
                  <td className="p-4 font-mono text-xs text-slate-500">{e.resource}</td>
                  <td className="p-4">
                    <span className={`px-2 py-1 text-xs font-semibold rounded ${e.result === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                      {e.result}
                    </span>
                  </td>
                  <td className="p-4 text-slate-700">{e.description}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
