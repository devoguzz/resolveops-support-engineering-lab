import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { diagnosticService } from '../../services/mock/diagnosticService'
import { RequestTrace } from '../../domain/models'
import { formatDate } from '../../lib/dates'

export function TraceExplorer() {
  const [searchParams, setSearchParams] = useState(new URLSearchParams())
  const [traces, setTraces] = useState<RequestTrace[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchTraces = async () => {
      setLoading(true)
      const query = {
        organizationId: searchParams.get('organizationId') || undefined
      }
      const res = await diagnosticService.listTraces(query)
      if (res.ok) setTraces(res.data)
      setLoading(false)
    }
    fetchTraces()
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
          <h1 className="text-2xl font-bold text-slate-900">Request Traces</h1>
          <p className="text-slate-500 mt-1">Explore API requests across all organizations.</p>
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
          <div className="p-8 text-center text-slate-500">Loading traces...</div>
        ) : (
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-slate-500 border-b border-slate-200">
              <tr>
                <th className="p-4 font-medium">Trace ID</th>
                <th className="p-4 font-medium">Timestamp</th>
                <th className="p-4 font-medium">Method</th>
                <th className="p-4 font-medium">Path</th>
                <th className="p-4 font-medium">Status</th>
                <th className="p-4 font-medium">Duration</th>
                <th className="p-4 font-medium">Org ID</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {traces.length === 0 ? (
                <tr><td colSpan={7} className="p-8 text-center text-slate-500">No traces found.</td></tr>
              ) : traces.map(t => (
                <tr key={t.id} className="hover:bg-slate-50">
                  <td className="p-4"><Link to={`/support/traces/${t.id}`} className="font-mono text-indigo-600 hover:underline">{t.id}</Link></td>
                  <td className="p-4 text-slate-500">{formatDate(t.timestamp)}</td>
                  <td className="p-4 font-mono text-xs">{t.method}</td>
                  <td className="p-4 font-mono text-xs text-slate-500">{t.path}</td>
                  <td className="p-4">
                    <span className={`px-2 py-1 text-xs font-semibold rounded ${t.statusCode >= 400 ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
                      {t.statusCode}
                    </span>
                  </td>
                  <td className="p-4 text-slate-500">{t.durationMs}ms</td>
                  <td className="p-4 text-slate-500">{t.organizationId}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
