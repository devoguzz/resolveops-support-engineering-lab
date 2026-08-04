import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { diagnosticService } from '../../services/mock/diagnosticService'
import { formatDate } from '../../lib/dates'

export function LogExplorer() {
  const [searchParams, setSearchParams] = useState(new URLSearchParams())
  const [logs, setLogs] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedLog, setSelectedLog] = useState<any | null>(null)

  useEffect(() => {
    const fetchLogs = async () => {
      setLoading(true)
      const query = {
        requestId: searchParams.get('requestId') || undefined
      }
      const res = await diagnosticService.listLogs(query)
      if (res.ok) setLogs(res.data)
      setLoading(false)
    }
    fetchLogs()
  }, [searchParams])

  const handleFilter = (key: string, value: string) => {
    const newParams = new URLSearchParams(searchParams.toString())
    if (value) newParams.set(key, value)
    else newParams.delete(key)
    setSearchParams(newParams)
  }

  return (
    <div className="flex flex-col gap-6 max-w-7xl">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Log Explorer</h1>
          <p className="text-slate-500 mt-1">Search and analyze structured application logs.</p>
        </div>
      </div>

      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex gap-4 items-end">
        <div className="flex-1">
          <label className="block text-xs font-medium text-slate-500 uppercase tracking-wider mb-1">Request / Trace ID</label>
          <input 
            type="text" 
            placeholder="e.g. req_8bd129c2"
            value={searchParams.get('requestId') || ''}
            onChange={e => handleFilter('requestId', e.target.value)}
            className="w-full form-input py-2 font-mono text-sm"
          />
        </div>
        <button onClick={() => setSearchParams(new URLSearchParams())} className="btn btn-secondary border-slate-300 py-2">Clear</button>
      </div>

      <div className="flex gap-6 h-[600px]">
        <div className="flex-1 bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
          {loading ? (
            <div className="p-8 text-center text-slate-500">Loading logs...</div>
          ) : (
            <div className="overflow-y-auto flex-1">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-50 text-slate-500 border-b border-slate-200 sticky top-0">
                  <tr>
                    <th className="p-3 font-medium w-48">Timestamp</th>
                    <th className="p-3 font-medium w-24">Level</th>
                    <th className="p-3 font-medium w-32">Service</th>
                    <th className="p-3 font-medium">Message</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-mono text-xs">
                  {logs.length === 0 ? (
                    <tr><td colSpan={4} className="p-8 text-center text-slate-500 font-sans">No logs found.</td></tr>
                  ) : logs.map(l => (
                    <tr 
                      key={l.id} 
                      className={`cursor-pointer hover:bg-slate-50 ${selectedLog?.id === l.id ? 'bg-indigo-50 border-l-4 border-indigo-500' : 'border-l-4 border-transparent'}`}
                      onClick={() => setSelectedLog(l)}
                    >
                      <td className="p-3 text-slate-500">{formatDate(l.timestamp)}</td>
                      <td className="p-3">
                        <span className={`${
                          l.level === 'error' ? 'text-red-600' :
                          l.level === 'warn' ? 'text-yellow-600' :
                          l.level === 'info' ? 'text-blue-600' : 'text-slate-500'
                        }`}>
                          {l.level.toUpperCase()}
                        </span>
                      </td>
                      <td className="p-3 text-slate-600">{l.service}</td>
                      <td className="p-3 truncate max-w-xs">{l.message}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {selectedLog && (
          <div className="w-96 bg-white rounded-xl border border-slate-200 shadow-sm flex flex-col overflow-hidden">
            <div className="p-4 border-b border-slate-200 bg-slate-50 flex justify-between items-center">
              <h2 className="font-semibold text-slate-800">Log Details</h2>
              <button onClick={() => setSelectedLog(null)} className="text-slate-400 hover:text-slate-600">&times;</button>
            </div>
            <div className="p-4 overflow-y-auto flex-1 text-sm flex flex-col gap-4">
              <div>
                <span className="block text-xs font-semibold text-slate-500 uppercase mb-1">Message</span>
                <p className="font-mono text-xs bg-slate-50 p-2 rounded border border-slate-100 whitespace-pre-wrap break-all">{selectedLog.message}</p>
              </div>
              
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <span className="block text-xs font-semibold text-slate-500 uppercase mb-1">Service</span>
                  <span className="font-mono text-xs">{selectedLog.service}</span>
                </div>
                <div>
                  <span className="block text-xs font-semibold text-slate-500 uppercase mb-1">Trace ID</span>
                  {selectedLog.traceId ? (
                    <Link to={`/support/traces/${selectedLog.traceId}`} className="font-mono text-xs text-indigo-600 hover:underline">{selectedLog.traceId}</Link>
                  ) : <span className="text-muted text-xs">None</span>}
                </div>
              </div>

              <div>
                <span className="block text-xs font-semibold text-slate-500 uppercase mb-1">Metadata (JSON)</span>
                <pre className="font-mono text-xs bg-slate-900 text-slate-50 p-3 rounded overflow-x-auto">
                  {JSON.stringify(selectedLog.metadata, null, 2)}
                </pre>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
