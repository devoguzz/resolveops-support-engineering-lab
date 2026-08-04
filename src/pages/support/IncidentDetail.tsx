import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { diagnosticService } from '../../services/mock/diagnosticService'
import { Incident } from '../../domain/models'
import { formatDate } from '../../lib/dates'
import { StatusBadge } from '../../components/StatusBadge'

export function IncidentDetail() {
  const { incidentId } = useParams()
  const [incident, setIncident] = useState<Incident | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchIncident = async () => {
      if (!incidentId) return
      setLoading(true)
      const res = await diagnosticService.getIncident(incidentId)
      if (res.ok) setIncident(res.data)
      setLoading(false)
    }
    fetchIncident()
  }, [incidentId])

  if (loading) return <div className="p-8 text-center text-slate-500">Loading incident details...</div>
  if (!incident) return <div className="p-8 text-center text-red-500">Incident not found</div>

  return (
    <div className="flex flex-col gap-6 max-w-5xl">
      <div>
        <Link to="/support/incidents" className="text-sm text-indigo-600 hover:underline mb-2 inline-block">&larr; Back to Incidents</Link>
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">{incident.title}</h1>
            <p className="text-slate-500 mt-1 font-mono text-sm">{incident.id}</p>
          </div>
          <div className="flex gap-2 items-center">
            <StatusBadge status={incident.status as any} />
            <button className="btn btn-secondary border-slate-300 px-3 py-1.5 text-sm rounded">Update Status</button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 flex flex-col gap-6">
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col gap-6">
            <h2 className="text-lg font-semibold text-slate-900 border-b border-slate-100 pb-2">Investigation Summary</h2>
            
            <div className="grid grid-cols-2 gap-6">
              <div>
                <span className="block text-xs font-semibold text-slate-500 uppercase mb-1">Severity</span>
                <span className={`px-2 py-1 text-xs font-semibold rounded uppercase inline-block ${incident.severity === 'sev1' ? 'bg-red-100 text-red-800' : incident.severity === 'sev2' ? 'bg-orange-100 text-orange-800' : 'bg-yellow-100 text-yellow-800'}`}>
                  {incident.severity}
                </span>
              </div>
              <div>
                <span className="block text-xs font-semibold text-slate-500 uppercase mb-1">Affected Service</span>
                <span className="font-mono text-sm text-slate-700 bg-slate-50 px-2 py-1 rounded">{incident.affectedService}</span>
              </div>
            </div>

            <div>
              <span className="block text-xs font-semibold text-slate-500 uppercase mb-2">Timeline</span>
              <div className="bg-slate-50 p-4 rounded border border-slate-100 font-mono text-sm text-slate-700 whitespace-pre-wrap">
                14:02 — First error detected
                14:08 — First customer ticket received
                14:15 — Incident declared
                14:27 — Root cause identified
                14:36 — Mitigation applied
                14:49 — Error rate returned to normal
                15:10 — Incident resolved
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div>
                <span className="block text-xs font-semibold text-slate-500 uppercase mb-1">Started At</span>
                <span className="text-slate-900 text-sm">{formatDate(incident.startedAt)}</span>
              </div>
              <div>
                <span className="block text-xs font-semibold text-slate-500 uppercase mb-1">Owner ID</span>
                <span className="text-slate-900 text-sm">{incident.ownerId}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="md:col-span-1 flex flex-col gap-6">
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-900 mb-4 border-b border-slate-100 pb-2">Related Items</h2>
            <ul className="flex flex-col gap-3">
              <li>
                <Link to="/support/tickets" className="text-indigo-600 hover:underline text-sm flex items-center justify-between">
                  <span>Linked Tickets</span>
                  <span className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded text-xs">12</span>
                </Link>
              </li>
              <li>
                <Link to="/support/runbooks/troubleshooting-webhook-failures" className="text-indigo-600 hover:underline text-sm flex items-center justify-between">
                  <span>Relevant Runbook</span>
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
