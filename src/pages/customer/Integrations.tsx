import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { integrationService } from '../../services/mock/integrationService'
import { Integration } from '../../domain/models'
import { useAuth } from '../../store/authStore'
import { formatDate } from '../../lib/dates'
import { StatusBadge } from '../../components/StatusBadge'

export function Integrations() {
  const { user } = useAuth()
  const [integrations, setIntegrations] = useState<Integration[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchIntegrations = async () => {
      if (!user?.organizationId) return
      setLoading(true)
      const res = await integrationService.listIntegrations(user.organizationId, user)
      if (res.ok) setIntegrations(res.data)
      setLoading(false)
    }
    fetchIntegrations()
  }, [user])

  return (
    <div className="flex flex-col gap-6 max-w-6xl">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Integrations</h1>
          <p className="text-slate-500 mt-1">Connect ResolveOps with your existing tools and services.</p>
        </div>
        <button className="btn btn-primary bg-slate-900 hover:bg-slate-800 text-white px-4 py-2 rounded font-medium disabled:opacity-50" disabled>Add Integration</button>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-slate-500">Loading integrations...</div>
        ) : (
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-slate-500 border-b border-slate-200">
              <tr>
                <th className="p-4 font-medium">Name</th>
                <th className="p-4 font-medium">Type</th>
                <th className="p-4 font-medium">Endpoint</th>
                <th className="p-4 font-medium">Status</th>
                <th className="p-4 font-medium">Last Sync</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {integrations.length === 0 ? (
                <tr><td colSpan={5} className="p-8 text-center text-slate-500">No integrations configured.</td></tr>
              ) : integrations.map(i => (
                <tr key={i.id} className="hover:bg-slate-50">
                  <td className="p-4">
                    <Link to={`/app/integrations/${i.id}`} className="font-medium text-indigo-600 hover:underline">{i.name}</Link>
                  </td>
                  <td className="p-4 text-slate-500">{i.type}</td>
                  <td className="p-4 text-slate-500 font-mono text-xs">{i.endpointHost}</td>
                  <td className="p-4"><StatusBadge status={i.status} /></td>
                  <td className="p-4 text-slate-500">{i.lastSyncAt ? formatDate(i.lastSyncAt) : 'Never'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
