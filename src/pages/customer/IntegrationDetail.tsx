import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { integrationService } from '../../services/mock/integrationService'
import { Integration } from '../../domain/models'
import { formatDate } from '../../lib/dates'
import { useAuth } from '../../store/authStore'
import { StatusBadge } from '../../components/StatusBadge'

export function IntegrationDetail() {
  const { integrationId } = useParams()
  const [integration, setIntegration] = useState<Integration | null>(null)
  const [loading, setLoading] = useState(true)
  const [testing, setTesting] = useState(false)
  const [testResult, setTestResult] = useState<{success: boolean, message: string} | null>(null)
  
  const { user } = useAuth()

  useEffect(() => {
    const fetchIntegration = async () => {
      if (!integrationId) return
      setLoading(true)
      const res = await integrationService.getIntegration(integrationId, user)
      if (res.ok) setIntegration(res.data)
      setLoading(false)
    }
    fetchIntegration()
  }, [integrationId])

  const handleTestConnection = async () => {
    if (!integrationId) return
    setTesting(true)
    setTestResult(null)
    const res = await integrationService.testConnection(integrationId)
    if (res.ok) setTestResult(res.data)
    setTesting(false)
  }

  const handleToggle = async (enabled: boolean) => {
    if (!integrationId) return
    const res = await integrationService.toggleIntegration(integrationId, enabled, user)
    if (res.ok) setIntegration(res.data)
  }

  if (loading) return <div className="p-8 text-center text-slate-500">Loading integration details...</div>
  if (!integration) return <div className="p-8 text-center text-red-500">Integration not found</div>

  return (
    <div className="flex flex-col gap-6 max-w-4xl">
      <div>
        <Link to="/app/integrations" className="text-sm text-indigo-600 hover:underline mb-2 inline-block">&larr; Back to Integrations</Link>
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">{integration.name}</h1>
            <p className="text-slate-500 mt-1">Integration Type: {integration.type}</p>
          </div>
          <div className="flex gap-2 items-center">
            <StatusBadge status={integration.status} />
            {integration.status === 'active' ? (
              <button onClick={() => handleToggle(false)} className="btn btn-secondary border-slate-300 px-3 py-1.5 text-sm rounded">Disable</button>
            ) : (
              <button onClick={() => handleToggle(true)} className="btn btn-primary bg-slate-900 text-white hover:bg-slate-800 px-3 py-1.5 text-sm rounded">Enable</button>
            )}
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col gap-6">
        <h2 className="text-lg font-semibold text-slate-900 border-b border-slate-100 pb-2">Configuration</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <span className="block text-sm font-medium text-slate-500 mb-1">Endpoint Host</span>
            <span className="text-slate-900 font-mono text-sm">{integration.endpointHost}</span>
          </div>
          <div>
            <span className="block text-sm font-medium text-slate-500 mb-1">Authentication Type</span>
            <span className="text-slate-900 text-sm">{integration.authType}</span>
          </div>
          <div>
            <span className="block text-sm font-medium text-slate-500 mb-1">API Key / Token (Masked)</span>
            <span className="text-slate-900 font-mono text-sm tracking-widest">••••••••••••••••</span>
          </div>
        </div>

        <div className="mt-4 pt-4 border-t border-slate-100">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-semibold text-slate-800">Connection Health</h3>
            <button 
              onClick={handleTestConnection} 
              disabled={testing || integration.status === 'disabled'}
              className="text-sm bg-indigo-50 text-indigo-700 hover:bg-indigo-100 px-3 py-1.5 rounded font-medium disabled:opacity-50"
            >
              {testing ? 'Testing...' : 'Test Connection'}
            </button>
          </div>
          
          {testResult && (
            <div className={`p-4 rounded-lg mb-4 text-sm ${testResult.success ? 'bg-green-50 text-green-800 border border-green-200' : 'bg-red-50 text-red-800 border border-red-200'}`}>
              {testResult.message}
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div>
              <span className="block text-xs font-medium text-slate-500 uppercase tracking-wider mb-1">Last Synchronization</span>
              <span className="text-slate-900 text-sm">{integration.lastSyncAt ? formatDate(integration.lastSyncAt) : 'Never'}</span>
            </div>
            <div>
              <span className="block text-xs font-medium text-slate-500 uppercase tracking-wider mb-1">Last Error</span>
              <span className="text-red-600 text-sm">{integration.lastErrorAt ? formatDate(integration.lastErrorAt) : 'None'}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
