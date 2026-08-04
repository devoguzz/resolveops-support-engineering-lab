import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { webhookService } from '../../services/mock/webhookService'
import { WebhookDelivery } from '../../domain/models'
import { formatDate } from '../../lib/dates'

export function SupportWebhookInspector() {
  const [searchParams, setSearchParams] = useState(new URLSearchParams())
  const [deliveries, setDeliveries] = useState<WebhookDelivery[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchDeliveries = async () => {
      setLoading(true)
      const query = {
        organizationId: searchParams.get('organizationId') || undefined
      }
      const res = await webhookService.listDeliveries(query)
      if (res.ok) setDeliveries(res.data)
      setLoading(false)
    }
    fetchDeliveries()
  }, [searchParams])

  const handleFilter = (key: string, value: string) => {
    const newParams = new URLSearchParams(searchParams.toString())
    if (value) newParams.set(key, value)
    else newParams.delete(key)
    setSearchParams(newParams)
  }

  return (
    <div className="flex flex-col gap-6 max-w-6xl">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Webhook Inspector</h1>
          <p className="text-slate-500 mt-1">Investigate webhook delivery failures across organizations.</p>
        </div>
      </div>

      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex gap-4 items-end">
        <div className="flex-1">
          <label className="block text-xs font-medium text-slate-500 uppercase tracking-wider mb-1">Organization ID</label>
          <input 
            type="text" 
            placeholder="e.g. org_northstar"
            value={searchParams.get('organizationId') || ''}
            onChange={e => handleFilter('organizationId', e.target.value)}
            className="w-full form-input py-2"
          />
        </div>
        <button onClick={() => setSearchParams(new URLSearchParams())} className="btn btn-secondary border-slate-300 py-2">Clear</button>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-slate-500">Loading deliveries...</div>
        ) : (
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-slate-500 border-b border-slate-200">
              <tr>
                <th className="p-4 font-medium">Delivery ID</th>
                <th className="p-4 font-medium">Event</th>
                <th className="p-4 font-medium">Organization</th>
                <th className="p-4 font-medium">Status</th>
                <th className="p-4 font-medium">Attempt</th>
                <th className="p-4 font-medium">Created</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {deliveries.length === 0 ? (
                <tr><td colSpan={6} className="p-8 text-center text-slate-500">No deliveries found.</td></tr>
              ) : deliveries.map(d => (
                <tr key={d.id} className="hover:bg-slate-50">
                  <td className="p-4"><Link to={`/support/webhooks/${d.id}`} className="font-mono text-indigo-600 hover:underline">{d.id}</Link></td>
                  <td className="p-4 font-mono text-xs text-slate-700">{d.event}</td>
                  <td className="p-4 text-slate-500">{d.organizationId}</td>
                  <td className="p-4">
                    <span className={`px-2 py-1 text-xs font-semibold rounded ${d.result === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                      {d.result}
                    </span>
                  </td>
                  <td className="p-4 text-slate-500">{d.attempt}</td>
                  <td className="p-4 text-slate-500">{formatDate(d.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
