import { useEffect, useState } from 'react'
import { apiKeyService } from '../../services/mock/apiKeyService'
import { ApiKey } from '../../domain/models'
import { useAuth } from '../../store/authStore'
import { formatDate } from '../../lib/dates'

export function ApiKeys() {
  const { user } = useAuth()
  const [keys, setKeys] = useState<ApiKey[]>([])
  const [loading, setLoading] = useState(true)
  const [newKeyData, setNewKeyData] = useState<{name: string, secret: string} | null>(null)
  const [isCreating, setIsCreating] = useState(false)
  const [newKeyName, setNewKeyName] = useState('')

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
    const res = await apiKeyService.createKey(user.organizationId, newKeyName, user.id, user)
    if (res.ok) {
      setNewKeyData({ name: newKeyName, secret: res.data.secret })
      setNewKeyName('')
      await loadKeys()
    }
    setIsCreating(false)
  }

  const handleRevoke = async (id: string) => {
    if (!confirm('Are you sure you want to revoke this API key? This action cannot be undone.')) return
    const res = await apiKeyService.revokeKey(id, user)
    if (res.ok) {
      await loadKeys()
    }
  }

  return (
    <div className="flex flex-col gap-6 max-w-5xl">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">API Keys</h1>
          <p className="text-slate-500 mt-1">Manage API keys for accessing the ResolveOps API.</p>
        </div>
      </div>
      
      {newKeyData && (
        <div className="bg-green-50 border border-green-200 p-6 rounded-xl relative">
          <button onClick={() => setNewKeyData(null)} className="absolute top-4 right-4 text-green-700 hover:text-green-900">&times;</button>
          <h3 className="text-green-900 font-semibold mb-2">New API Key Created: {newKeyData.name}</h3>
          <p className="text-green-800 text-sm mb-4">Please copy this secret key now. You will not be able to see it again.</p>
          <div className="flex gap-2">
            <code className="flex-1 bg-white p-3 rounded border border-green-200 font-mono text-green-900 select-all">{newKeyData.secret}</code>
            <button className="btn btn-secondary bg-white text-green-800 border-green-200 hover:bg-green-100" onClick={() => navigator.clipboard.writeText(newKeyData.secret)}>Copy</button>
          </div>
        </div>
      )}

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col md:flex-row gap-8 p-6">
        <div className="md:w-1/3">
          <h2 className="text-lg font-semibold text-slate-900 mb-2">Create New Key</h2>
          <p className="text-sm text-slate-500 mb-4">Generate a new API key for a script or application.</p>
          <form onSubmit={handleCreate} className="flex flex-col gap-3">
            <input 
              type="text" 
              placeholder="Key Name (e.g., Production Backend)" 
              value={newKeyName}
              onChange={e => setNewKeyName(e.target.value)}
              className="form-input w-full"
              required
              disabled={isCreating || user?.role !== 'customer_owner'}
            />
            <button type="submit" disabled={isCreating || !newKeyName || user?.role !== 'customer_owner'} className="btn btn-primary bg-slate-900 hover:bg-slate-800 text-white w-full py-2">
              {isCreating ? 'Creating...' : 'Generate Key'}
            </button>
            {user?.role !== 'customer_owner' && (
              <p className="text-xs text-slate-400 mt-1">Only Organization Owners can generate API keys.</p>
            )}
          </form>
        </div>
        
        <div className="md:w-2/3">
          <h2 className="text-lg font-semibold text-slate-900 mb-4">Active Keys</h2>
          {loading ? (
            <div className="text-center text-slate-500 p-4">Loading keys...</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="text-slate-500 border-b border-slate-200">
                  <tr>
                    <th className="pb-3 font-medium">Name</th>
                    <th className="pb-3 font-medium">Key Prefix</th>
                    <th className="pb-3 font-medium">Created</th>
                    <th className="pb-3 font-medium text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {keys.filter(k => k.status === 'active').length === 0 ? (
                    <tr><td colSpan={4} className="py-4 text-center text-slate-500">No active keys.</td></tr>
                  ) : keys.filter(k => k.status === 'active').map(k => (
                    <tr key={k.id} className="hover:bg-slate-50">
                      <td className="py-3 font-medium text-slate-900">{k.name}</td>
                      <td className="py-3 font-mono text-slate-500">{k.prefix}</td>
                      <td className="py-3 text-slate-500">{formatDate(k.createdAt)}</td>
                      <td className="py-3 text-right">
                        <button 
                          onClick={() => handleRevoke(k.id)}
                          disabled={user?.role !== 'customer_owner'}
                          className="text-red-600 hover:underline disabled:opacity-50 disabled:no-underline font-medium"
                        >
                          Revoke
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
