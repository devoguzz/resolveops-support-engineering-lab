import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { integrationService } from '../../services/mock/integrationService'
import { Integration } from '../../domain/models'
import { formatDate } from '../../lib/dates'
import { useAuth } from '../../store/authStore'
import { StatusBadge } from '../../components/domain/StatusBadge'
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card'
import { Button } from '../../components/ui/button'
import { ArrowLeft, CheckCircle2, AlertCircle, RefreshCw } from 'lucide-react'

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
  }, [integrationId, user])

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

  if (loading) return <div className="p-12 text-center text-sm text-muted-foreground">Loading integration details...</div>
  if (!integration) return <div className="p-12 text-center text-destructive font-medium">Integration not found</div>

  return (
    <div className="p-8 max-w-[1400px] mx-auto space-y-6">
      <div>
        <Link to="/app/integrations" className="inline-flex items-center text-sm font-medium text-primary hover:underline gap-1 mb-4">
          <ArrowLeft className="w-4 h-4" /> Back to Integrations
        </Link>
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">{integration.name}</h1>
            <p className="text-sm text-muted-foreground mt-2">Integration Type: <span className="font-medium text-foreground">{integration.type}</span></p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <StatusBadge status={integration.status} />
            {integration.status === 'active' ? (
              <Button variant="outline" onClick={() => handleToggle(false)}>Disable</Button>
            ) : (
              <Button onClick={() => handleToggle(true)}>Enable</Button>
            )}
          </div>
        </div>
      </div>

      <Card>
        <CardHeader className="border-b border-border bg-muted/30 pb-4">
          <CardTitle className="text-lg">Configuration</CardTitle>
        </CardHeader>
        
        <CardContent className="pt-6 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-2">
              <span className="block text-sm font-semibold text-muted-foreground">Endpoint Host</span>
              <span className="block text-foreground font-mono text-sm bg-muted/50 border border-border px-3 py-2 rounded-md">{integration.endpointHost}</span>
            </div>
            <div className="space-y-2">
              <span className="block text-sm font-semibold text-muted-foreground">Authentication Type</span>
              <span className="block text-foreground font-medium text-sm bg-muted/50 border border-border px-3 py-2 rounded-md">{integration.authType}</span>
            </div>
            <div className="space-y-2 md:col-span-2">
              <span className="block text-sm font-semibold text-muted-foreground">API Key / Token (Masked)</span>
              <span className="block text-foreground font-mono text-sm tracking-widest bg-muted/50 border border-border px-3 py-2 rounded-md">••••••••••••••••</span>
            </div>
          </div>

          <div className="pt-6 border-t border-border">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
              <div className="space-y-1">
                <h3 className="font-semibold text-foreground text-base">Connection Health</h3>
                <p className="text-sm text-muted-foreground">Test your connection to ensure the integration is working correctly.</p>
              </div>
              <Button 
                variant="outline"
                onClick={handleTestConnection} 
                disabled={testing || integration.status === 'disabled'}
                className="flex items-center gap-2"
              >
                <RefreshCw className={`w-4 h-4 ${testing ? 'animate-spin' : ''}`} />
                {testing ? 'Testing...' : 'Test Connection'}
              </Button>
            </div>
            
            {testResult && (
              <div className={`p-4 rounded-md mb-6 flex items-start gap-3 border ${testResult.success ? 'bg-success/10 text-success border-success/20' : 'bg-destructive/10 text-destructive border-destructive/20'}`}>
                {testResult.success ? <CheckCircle2 className="w-5 h-5 flex-shrink-0" /> : <AlertCircle className="w-5 h-5 flex-shrink-0" />}
                <span className="text-sm font-medium">{testResult.message}</span>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 bg-muted/30 p-4 rounded-md border border-border">
              <div className="space-y-1">
                <span className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider">Last Synchronization</span>
                <span className="block text-foreground font-medium text-sm">{integration.lastSyncAt ? formatDate(integration.lastSyncAt) : 'Never'}</span>
              </div>
              <div className="space-y-1">
                <span className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider">Last Error</span>
                <span className="block text-sm font-medium text-destructive">{integration.lastErrorAt ? formatDate(integration.lastErrorAt) : 'None'}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
