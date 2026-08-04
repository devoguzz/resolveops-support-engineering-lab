import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { diagnosticService } from '../../services/mock/diagnosticService'
import { BackgroundJob } from '../../domain/models'
import { formatDate } from '../../lib/dates'
import { StatusBadge } from '../../components/StatusBadge'

export function JobMonitor() {
  const [searchParams, setSearchParams] = useState(new URLSearchParams())
  const [jobs, setJobs] = useState<BackgroundJob[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchJobs = async () => {
      setLoading(true)
      const query = {
        organizationId: searchParams.get('organizationId') || undefined
      }
      const res = await diagnosticService.listJobs(query)
      if (res.ok) setJobs(res.data)
      setLoading(false)
    }
    fetchJobs()
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
          <h1 className="text-2xl font-bold text-slate-900">Background Jobs</h1>
          <p className="text-slate-500 mt-1">Monitor asynchronous background workers.</p>
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
          <div className="p-8 text-center text-slate-500">Loading jobs...</div>
        ) : (
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-slate-500 border-b border-slate-200">
              <tr>
                <th className="p-4 font-medium">Job ID</th>
                <th className="p-4 font-medium">Type</th>
                <th className="p-4 font-medium">Organization</th>
                <th className="p-4 font-medium">Status</th>
                <th className="p-4 font-medium">Attempt</th>
                <th className="p-4 font-medium">Created</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {jobs.length === 0 ? (
                <tr><td colSpan={6} className="p-8 text-center text-slate-500">No jobs found.</td></tr>
              ) : jobs.map(j => (
                <tr key={j.id} className="hover:bg-slate-50">
                  <td className="p-4"><Link to={`/support/jobs/${j.id}`} className="font-mono text-indigo-600 hover:underline">{j.id}</Link></td>
                  <td className="p-4 font-mono text-xs text-slate-700">{j.type}</td>
                  <td className="p-4 text-slate-500">{j.organizationId}</td>
                  <td className="p-4"><StatusBadge status={j.status as any} /></td>
                  <td className="p-4 text-slate-500">{j.attempt}</td>
                  <td className="p-4 text-slate-500">{formatDate(j.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
