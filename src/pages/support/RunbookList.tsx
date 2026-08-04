import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { runbookService } from '../../services/mock/runbookService'
import { Runbook } from '../../domain/models'
import { formatDate } from '../../lib/dates'

export function RunbookList() {
  const [runbooks, setRunbooks] = useState<Runbook[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchRunbooks = async () => {
      setLoading(true)
      const res = await runbookService.listRunbooks()
      if (res.ok) setRunbooks(res.data)
      setLoading(false)
    }
    fetchRunbooks()
  }, [])

  return (
    <div className="flex flex-col gap-6 max-w-6xl">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Knowledge Base</h1>
          <p className="text-slate-500 mt-1">Internal runbooks for support engineering.</p>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-slate-500">Loading runbooks...</div>
        ) : (
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-slate-500 border-b border-slate-200">
              <tr>
                <th className="p-4 font-medium">Title</th>
                <th className="p-4 font-medium">Category</th>
                <th className="p-4 font-medium">Tags</th>
                <th className="p-4 font-medium">Last Updated</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {runbooks.length === 0 ? (
                <tr><td colSpan={4} className="p-8 text-center text-slate-500">No runbooks found.</td></tr>
              ) : runbooks.map(r => (
                <tr key={r.slug} className="hover:bg-slate-50">
                  <td className="p-4">
                    <Link to={`/support/runbooks/${r.slug}`} className="font-medium text-indigo-600 hover:underline">{r.title}</Link>
                    <p className="text-xs text-slate-500 mt-1 truncate max-w-md">{r.summary}</p>
                  </td>
                  <td className="p-4 text-slate-700 capitalize">{r.category}</td>
                  <td className="p-4">
                    <div className="flex gap-1 flex-wrap">
                      {r.tags.map(tag => (
                        <span key={tag} className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded text-xs">{tag}</span>
                      ))}
                    </div>
                  </td>
                  <td className="p-4 text-slate-500">{formatDate(r.lastUpdated)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
