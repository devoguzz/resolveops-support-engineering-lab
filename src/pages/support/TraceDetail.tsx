import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { diagnosticService } from '../../services/mock/diagnosticService'
import { RequestTrace } from '../../domain/models'
import { demoDataService } from '../../services/mock/demoDataService'

import { EntityNotFound } from '../../components/system/EntityNotFound'

export function TraceDetail() {
  const DEMO_IDS = demoDataService.getDemoIds()
  const { requestId } = useParams()
  const [trace, setTrace] = useState<RequestTrace | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchTrace = async () => {
      if (!requestId) return
      setLoading(true)
      const result = await diagnosticService.getTrace(requestId)
      if (result.ok) setTrace(result.data)
      setLoading(false)
    }
    fetchTrace()
  }, [requestId])

  if (loading) return <div className="p-4">Loading trace...</div>
  if (!trace) return <EntityNotFound entityName="Trace" />

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-4">
        <Link to="/support/traces" className="text-sm text-muted hover:underline">← Back to Traces</Link>
      </div>
      <div>
        <h1 className="text-2xl font-bold font-mono">Trace: {trace.id}</h1>
        <p className="text-sm text-muted mt-1">
          {trace.method} {trace.path} • Status: {trace.statusCode} • Duration: {trace.durationMs}ms
        </p>
      </div>

      <div className="card p-6 bg-red-50 border-red-200">
        <h3 className="text-sm font-semibold text-red-800 mb-2">Error Identified</h3>
        <p className="text-sm text-red-700 font-mono">{trace.errorType}</p>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div className="card p-6">
          <h3 className="text-sm font-semibold mb-4 border-b pb-2">Related Entities</h3>
          <ul className="flex flex-col gap-3 text-sm">
            <li><strong>Organization:</strong> <Link to={`/support/customers/${trace.organizationId}`} className="text-primary hover:underline">{trace.organizationId}</Link></li>
            {trace.id === DEMO_IDS.req_main && (
              <>
                <li><strong>Webhook Delivery:</strong> <Link to={`/support/webhooks/${DEMO_IDS.whd_main}`} className="text-primary hover:underline">{DEMO_IDS.whd_main}</Link></li>
                <li><strong>Job:</strong> <Link to={`/support/jobs/${DEMO_IDS.job_main}`} className="text-primary hover:underline">{DEMO_IDS.job_main}</Link></li>
                <li><strong>Support Ticket:</strong> <Link to={`/support/tickets/${DEMO_IDS.ticket_main}`} className="text-primary hover:underline">{DEMO_IDS.ticket_main}</Link></li>
              </>
            )}
          </ul>
        </div>
        <div className="card p-6 bg-slate-900 text-slate-300 font-mono text-xs overflow-auto">
          <h3 className="text-sm font-semibold text-white mb-4 border-b border-slate-700 pb-2">Log Output</h3>
          <p>[{trace.timestamp}] [ERROR] webhook-worker: Failed to deliver webhook, signature invalid</p>
          <p>  at verifySignature (src/worker/webhook.ts:45)</p>
          <p>  at processJob (src/worker/index.ts:112)</p>
        </div>
      </div>
    </div>
  )
}