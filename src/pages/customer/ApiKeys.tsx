import { useEffect, useState } from 'react'
import { apiKeyService } from '../../services/mock/apiKeyService'
import { ApiKey } from '../../domain/models'
import { useAuth } from '../../store/authStore'
import { formatDate } from '../../lib/dates'
import { PageHeader } from '../../components/domain/PageHeader'
import { Card, CardContent } from '../../components/ui/card'
import { Button } from '../../components/ui/button'
import { X, Copy } from 'lucide-react'
import { AnimatedStatus } from '../../components/motion/AnimatedStatus'
import { BorderBeam } from '../../components/ui/border-beam'

export function ApiKeys() {
  const { user } = useAuth()
  const [keys, setKeys] = useState<ApiKey[]>([])
  const [loading, setLoading] = useState(true)
  const [newKeyData, setNewKeyData] = useState<{name: string, secret: string} | null>(null)
  const [isCreating, setIsCreating] = useState(false)
  const [createState, setCreateState] = useState<'idle' | 'success'>('idle')
  const [copyState, setCopyState] = useState<'idle' | 'success'>('idle')
  const [newKeyName, setNewKeyName] = useState('')
  const [revokingId, setRevokingId] = useState<string | null>(null)
  const [revokedId, setRevokedId] = useState<string | null>(null)

  const loadKeys = async () => {
    if (!user?.organizationId) return
    setLoading(true)
    const res = await apiKeyService.listKeys(user.organizationId, user)
    if (res.ok) setKeys(res.data)
    setLoading(false)
  }

  useEffect(() => {
    loadKeys()
  }, [user])

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user?.organizationId || !newKeyName) return
    setIsCreating(true)
    setCreateState('idle')
    const res = await apiKeyService.createKey(user.organizationId, newKeyName, user.id, user)
    if (res.ok) {
      setNewKeyData({ name: newKeyName, secret: res.data.secret })
      setNewKeyName('')
      await loadKeys()
      setCreateState('success')
      setTimeout(() => setCreateState('idle'), 2000)
    }
    setIsCreating(false)
  }

  const handleCopy = () => {
    if (!newKeyData) return
    navigator.clipboard.writeText(newKeyData.secret)
    setCopyState('success')
    setTimeout(() => setCopyState('idle'), 2000)
  }

  const handleRevoke = async (id: string) => {
    if (!confirm('Are you sure you want to revoke this API key? This action cannot be undone.')) return
    setRevokingId(id)
    const res = await apiKeyService.revokeKey(id, user)
    if (res.ok) {
      setRevokedId(id)
      setTimeout(async () => {
        await loadKeys()
        setRevokingId(null)
        setRevokedId(null)
      }, 1000)
    } else {
      setRevokingId(null)
    }
  }

  return (
    <div className="p-8 max-w-[1400px] mx-auto space-y-6">
      <PageHeader 
        title="API Keys" 
        description="Manage API keys for accessing the ResolveOps API."
      />
      
      {newKeyData && (
        <Card className="bg-success/10 border-success/20 relative overflow-hidden">
          <BorderBeam colorFrom="var(--color-success)" colorTo="var(--color-success)" duration={5} />
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => setNewKeyData(null)} 
            className="absolute top-4 right-4 text-success hover:text-success hover:bg-success/20"
          >
            <X className="w-4 h-4" />
          </Button>
          <CardContent className="pt-6">
            <h3 className="text-success font-semibold mb-2">New API Key Created: {newKeyData.name}</h3>
            <p className="text-success/80 text-sm mb-4 font-medium">Please copy this secret key now. You will not be able to see it again.</p>
            <div className="flex gap-2 items-stretch">
              <code className="flex-1 bg-background/50 p-3 rounded-md border border-success/20 font-mono text-success select-all">{newKeyData.secret}</code>
              <Button 
                variant="outline"
                className="bg-background/50 border-success/20 text-success hover:bg-success/20 hover:text-success flex items-center gap-2 relative z-10" 
                onClick={handleCopy}
              >
                <Copy className="w-4 h-4" /> <AnimatedStatus status={copyState === 'success' ? 'Copied' : 'Copy'} />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardContent className="p-0 flex flex-col md:flex-row divide-y md:divide-y-0 md:divide-x divide-border">
          <div className="md:w-1/3 p-6 bg-muted/10">
            <h2 className="text-lg font-semibold text-foreground mb-2">Create New Key</h2>
            <p className="text-sm text-muted-foreground mb-6">Generate a new API key for a script or application.</p>
            <form onSubmit={handleCreate} className="flex flex-col gap-4">
              <input 
                type="text" 
                placeholder="Key Name (e.g., Production Backend)" 
                value={newKeyName}
                onChange={e => setNewKeyName(e.target.value)}
                className="w-full bg-background border border-border text-foreground rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring transition-all"
                required
                disabled={isCreating || user?.role !== 'customer_owner'}
              />
              <Button 
                type="submit" 
                disabled={isCreating || !newKeyName || user?.role !== 'customer_owner' || createState === 'success'} 
                className="w-full"
              >
                <AnimatedStatus status={isCreating ? 'Generating...' : createState === 'success' ? 'Key Created' : 'Generate Key'} />
              </Button>
              {user?.role !== 'customer_owner' && (
                <p className="text-xs text-muted-foreground mt-1 font-medium bg-muted/50 p-2 rounded border border-border text-center">
                  Only Organization Owners can generate API keys.
                </p>
              )}
            </form>
          </div>
          
          <div className="md:w-2/3 p-6">
            <h2 className="text-lg font-semibold text-foreground mb-6">Active Keys</h2>
            {loading ? (
              <div className="text-center text-sm text-muted-foreground py-12">Loading keys...</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm border-collapse">
                  <thead className="text-muted-foreground border-b border-border">
                    <tr>
                      <th className="pb-3 text-xs font-semibold uppercase tracking-wider">Name</th>
                      <th className="pb-3 text-xs font-semibold uppercase tracking-wider">Key Prefix</th>
                      <th className="pb-3 text-xs font-semibold uppercase tracking-wider">Created</th>
                      <th className="pb-3 text-xs font-semibold uppercase tracking-wider text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {keys.filter(k => k.status === 'active').length === 0 ? (
                      <tr>
                        <td colSpan={4} className="py-12 text-center text-sm text-muted-foreground">
                          No active keys.
                        </td>
                      </tr>
                    ) : keys.filter(k => k.status === 'active').map(k => (
                      <tr key={k.id} className="hover:bg-muted/30 transition-colors">
                        <td className="py-4 font-medium text-foreground">{k.name}</td>
                        <td className="py-4 font-mono text-muted-foreground">{k.prefix}</td>
                        <td className="py-4 text-muted-foreground">{formatDate(k.createdAt)}</td>
                        <td className="py-4 text-right">
                          <Button 
                            variant="ghost"
                            onClick={() => handleRevoke(k.id)}
                            disabled={user?.role !== 'customer_owner' || revokingId === k.id || revokedId === k.id}
                            className="text-destructive hover:text-destructive hover:bg-destructive/10 h-8 px-3"
                          >
                            <AnimatedStatus status={revokedId === k.id ? 'Revoked' : revokingId === k.id ? 'Revoking...' : 'Revoke'} />
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
