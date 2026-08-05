import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { diagnosticService } from '../../services/mock/diagnosticService'
import { BackgroundJob } from '../../domain/models'
import { formatDate } from '../../lib/dates'
import { StatusBadge } from '../../components/StatusBadge'

import { EntityNotFound } from '../../components/system/EntityNotFound'

export function JobDetail() {
  const { jobId } = useParams()
  const [job, setJob] = useState<BackgroundJob | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchJob = async () => {
      if (!jobId) return
      setLoading(true)
      const res = await diagnosticService.getJob(jobId)
      if (res.ok) setJob(res.data)
      setLoading(false)
    }
    fetchJob()
  }, [jobId])

  if (loading) return <div className="p-8 text-center text-slate-500">Loading job details...</div>
  if (!job) return <EntityNotFound entityName="Job" />

  return (
    <div className="flex flex-col gap-6 max-w-4xl">
      <div>
        <Link to="/support/jobs" className="text-sm text-indigo-600 hover:underline mb-2 inline-block">&larr; Back to Jobs</Link>
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 font-mono text-lg">{job.id}</h1>
            <p className="text-slate-500 mt-1 font-mono text-sm">{job.type}</p>
          </div>
          <div className="flex gap-2 items-center">
            <StatusBadge status={job.status as any} />
            <button className="btn btn-secondary border-slate-300 px-3 py-1.5 text-sm rounded">Retry Job</button>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col gap-6">
        <h2 className="text-lg font-semibold text-slate-900 border-b border-slate-100 pb-2">Execution Details</h2>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div>
            <span className="block text-xs font-semibold text-slate-500 uppercase mb-1">Organization</span>
            <Link to={`/support/customers/${job.organizationId}`} className="text-indigo-600 hover:underline text-sm">{job.organizationId}</Link>
          </div>
          <div>
            <span className="block text-xs font-semibold text-slate-500 uppercase mb-1">Attempt</span>
            <span className="text-slate-900 text-sm">{job.attempt}</span>
          </div>
          <div>
            <span className="block text-xs font-semibold text-slate-500 uppercase mb-1">Created At</span>
            <span className="text-slate-900 text-sm">{formatDate(job.createdAt)}</span>
          </div>
          <div>
            <span className="block text-xs font-semibold text-slate-500 uppercase mb-1">Finished At</span>
            <span className="text-slate-900 text-sm">{job.finishedAt ? formatDate(job.finishedAt) : 'N/A'}</span>
          </div>
        </div>

        {job.error && (
          <div className="mt-4">
            <h3 className="text-sm font-semibold text-red-800 mb-2">Error Message</h3>
            <div className="bg-red-50 p-4 rounded border border-red-100 text-red-900 font-mono text-sm break-all">
              {job.error}
            </div>
          </div>
        )}

        <div className="mt-4 pt-4 border-t border-slate-100">
          <h3 className="text-sm font-semibold text-slate-800 mb-4">Diagnostic Links</h3>
          <div className="flex flex-col gap-2">
            {job.requestId ? (
              <Link to={`/support/traces/${job.requestId}`} className="text-indigo-600 hover:underline text-sm flex items-center gap-2">
                View Request Trace <span className="font-mono text-xs bg-slate-100 px-2 py-0.5 rounded">{job.requestId}</span>
              </Link>
            ) : (
              <span className="text-slate-400 text-sm italic">No trace ID associated</span>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
