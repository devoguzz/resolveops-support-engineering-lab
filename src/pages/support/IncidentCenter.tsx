import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { diagnosticService } from '../../services/mock/diagnosticService'
import { Incident } from '../../domain/models'
import { formatDate } from '../../lib/dates'
import { StatusBadge } from '../../components/StatusBadge'

export function IncidentCenter() {
  const [incidents, setIncidents] = useState<Incident[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchIncidents = async () => {
      setLoading(true)
      const res = await diagnosticService.listIncidents()
      if (res.ok) setIncidents(res.data)
      setLoading(false)
    }
    fetchIncidents()
  }, [])

  return (
    <div className="flex flex-col gap-6 max-w-6xl">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Incident Center</h1>
          <p className="text-slate-500 mt-1">Track and manage global platform incidents.</p>
        </div>
        <button className="btn btn-primary bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded font-medium disabled:opacity-50" disabled>Declare Incident</button>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-slate-500">Loading incidents...</div>
        ) : (
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-slate-500 border-b border-slate-200">
              <tr>
                <th className="p-4 font-medium">Incident ID</th>
                <th className="p-4 font-medium">Title</th>
                <th className="p-4 font-medium">Severity</th>
                <th className="p-4 font-medium">Service</th>
                <th className="p-4 font-medium">Status</th>
                <th className="p-4 font-medium">Started At</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {incidents.length === 0 ? (
                <tr><td colSpan={6} className="p-8 text-center text-slate-500">No incidents found.</td></tr>
              ) : incidents.map(i => (
                <tr key={i.id} className="hover:bg-slate-50">
                  <td className="p-4"><Link to={`/support/incidents/${i.id}`} className="font-mono text-indigo-600 hover:underline">{i.id}</Link></td>
                  <td className="p-4 text-slate-900 font-medium">{i.title}</td>
                  <td className="p-4">
                    <span className={`px-2 py-1 text-xs font-semibold rounded uppercase ${i.severity === 'sev1' ? 'bg-red-100 text-red-800' : i.severity === 'sev2' ? 'bg-orange-100 text-orange-800' : 'bg-yellow-100 text-yellow-800'}`}>
                      {i.severity}
                    </span>
                  </td>
                  <td className="p-4 font-mono text-xs text-slate-500">{i.affectedService}</td>
                  <td className="p-4"><StatusBadge status={i.status as any} /></td>
                  <td className="p-4 text-slate-500">{formatDate(i.startedAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
