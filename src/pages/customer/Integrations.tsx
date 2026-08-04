import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { integrationService } from '../../services/mock/integrationService'
import { Integration } from '../../domain/models'
import { useAuth } from '../../store/authStore'
import { formatDate } from '../../lib/dates'
import { StatusBadge } from '../../components/domain/StatusBadge'
import { PageHeader } from '../../components/domain/PageHeader'
import { Card } from '../../components/ui/card'
import { Button } from '../../components/ui/button'
import { Plus } from 'lucide-react'

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
    <div className="p-8 max-w-[1400px] mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <PageHeader 
          title="Integrations" 
          description="Connect ResolveOps with your existing tools and services."
        />
        <Button disabled className="flex items-center gap-2">
          <Plus className="w-4 h-4" /> Add Integration
        </Button>
      </div>

      <Card>
        <div className="overflow-x-auto">
          {loading ? (
            <div className="p-12 text-center text-sm text-muted-foreground">Loading integrations...</div>
          ) : (
            <table className="w-full text-left text-sm border-collapse">
              <thead className="bg-muted/30 border-b border-border">
                <tr>
                  <th className="p-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Name</th>
                  <th className="p-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Type</th>
                  <th className="p-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Endpoint</th>
                  <th className="p-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Status</th>
                  <th className="p-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Last Sync</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {integrations.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="p-12 text-center text-sm text-muted-foreground">
                      No integrations configured.
                    </td>
                  </tr>
                ) : integrations.map(i => (
                  <tr key={i.id} className="hover:bg-muted/30 transition-colors">
                    <td className="p-4">
                      <Link to={`/app/integrations/${i.id}`} className="font-medium text-primary hover:underline">{i.name}</Link>
                    </td>
                    <td className="p-4 text-foreground font-medium">{i.type}</td>
                    <td className="p-4 text-muted-foreground font-mono text-xs">{i.endpointHost}</td>
                    <td className="p-4"><StatusBadge status={i.status} /></td>
                    <td className="p-4 text-muted-foreground">{i.lastSyncAt ? formatDate(i.lastSyncAt) : 'Never'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </Card>
    </div>
  )
}
