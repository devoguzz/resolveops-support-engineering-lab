import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { diagnosticService } from '../../services/mock/diagnosticService'
import { WebhookDelivery } from '../../domain/models'
import { formatDate } from '../../lib/dates'

import { EntityNotFound } from '../../components/system/EntityNotFound'

export function SupportWebhookDetail() {
  const { deliveryId } = useParams()
  const [delivery, setDelivery] = useState<WebhookDelivery | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchDelivery = async () => {
      if (!deliveryId) return
      setLoading(true)
      const res = await diagnosticService.getWebhookDelivery(deliveryId)
      if (res.ok) setDelivery(res.data)
      setLoading(false)
    }
    fetchDelivery()
  }, [deliveryId])

  if (loading) return <div className="p-8 text-center text-slate-500">Loading delivery details...</div>
  if (!delivery) return <EntityNotFound entityName="Webhook Delivery" />

  return (
    <div className="flex flex-col gap-6 max-w-4xl">
      <div>
        <Link to="/support/webhooks" className="text-sm text-indigo-600 hover:underline mb-2 inline-block">&larr; Back to Webhooks</Link>
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 font-mono text-lg">{delivery.id}</h1>
            <p className="text-slate-500 mt-1 font-mono text-sm">{delivery.event}</p>
          </div>
          <div className="flex gap-2 items-center">
            <span className={`px-2 py-1 text-xs font-semibold rounded uppercase ${delivery.result === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
              {delivery.result}
            </span>
            <button className="btn btn-secondary border-slate-300 px-3 py-1.5 text-sm rounded">Resend (Demo)</button>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col gap-6">
        <h2 className="text-lg font-semibold text-slate-900 border-b border-slate-100 pb-2">Delivery Details</h2>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div>
            <span className="block text-xs font-semibold text-slate-500 uppercase mb-1">Organization</span>
            <Link to={`/support/customers/${delivery.organizationId}`} className="text-indigo-600 hover:underline text-sm">{delivery.organizationId}</Link>
          </div>
          <div>
            <span className="block text-xs font-semibold text-slate-500 uppercase mb-1">Status Code</span>
            <span className={`text-sm font-semibold ${delivery.statusCode >= 400 ? 'text-red-600' : 'text-green-600'}`}>{delivery.statusCode}</span>
          </div>
          <div>
            <span className="block text-xs font-semibold text-slate-500 uppercase mb-1">Duration</span>
            <span className="text-slate-900 text-sm">{delivery.durationMs}ms</span>
          </div>
          <div>
            <span className="block text-xs font-semibold text-slate-500 uppercase mb-1">Timestamp</span>
            <span className="text-slate-900 text-sm">{formatDate(delivery.createdAt)}</span>
          </div>
        </div>

        {delivery.errorMessage && (
          <div className="mt-4">
            <h3 className="text-sm font-semibold text-red-800 mb-2">Error Message</h3>
            <div className="bg-red-50 p-4 rounded border border-red-100 text-red-900 font-mono text-sm break-all">
              {delivery.errorMessage}
            </div>
          </div>
        )}

        <div className="mt-4 pt-4 border-t border-slate-100 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-sm font-semibold text-slate-800 mb-2">Request Payload</h3>
            <pre className="bg-slate-900 text-slate-50 p-4 rounded-lg font-mono text-xs overflow-x-auto">
              {JSON.stringify(delivery.requestPayload, null, 2)}
            </pre>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-slate-800 mb-2">Response Body</h3>
            {delivery.responseBody ? (
              <pre className="bg-slate-900 text-slate-50 p-4 rounded-lg font-mono text-xs overflow-x-auto">
                {JSON.stringify(delivery.responseBody, null, 2)}
              </pre>
            ) : (
              <div className="bg-slate-50 p-4 rounded border border-slate-100 text-slate-400 text-sm italic">
                No response body received.
              </div>
            )}
          </div>
        </div>

        <div className="mt-4 pt-4 border-t border-slate-100">
          <h3 className="text-sm font-semibold text-slate-800 mb-4">Diagnostic Links</h3>
          <div className="flex flex-col gap-2">
            {delivery.requestId ? (
              <Link to={`/support/traces/${delivery.requestId}`} className="text-indigo-600 hover:underline text-sm flex items-center gap-2">
                View Request Trace <span className="font-mono text-xs bg-slate-100 px-2 py-0.5 rounded">{delivery.requestId}</span>
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
