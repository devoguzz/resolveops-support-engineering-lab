import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { runbookService } from '../../services/mock/runbookService'
import { Runbook } from '../../domain/models'
import { formatDate } from '../../lib/dates'

import { EntityNotFound } from '../../components/system/EntityNotFound'

export function RunbookDetail() {
  const { slug } = useParams()
  const [runbook, setRunbook] = useState<Runbook | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchRunbook = async () => {
      if (!slug) return
      setLoading(true)
      const res = await runbookService.getRunbook(slug)
      if (res.ok) setRunbook(res.data)
      setLoading(false)
    }
    fetchRunbook()
  }, [slug])

  if (loading) return <div className="p-8 text-center text-slate-500">Loading runbook...</div>
  if (!runbook) return <EntityNotFound entityName="Runbook" />

  return (
    <div className="flex flex-col gap-6 max-w-4xl">
      <div>
        <Link to="/support/runbooks" className="text-sm text-indigo-600 hover:underline mb-2 inline-block">&larr; Back to Knowledge Base</Link>
        <h1 className="text-2xl font-bold text-slate-900 mb-2">{runbook.title}</h1>
        <div className="flex items-center gap-4 text-sm text-slate-500">
          <span className="capitalize text-slate-700 font-medium">Category: {runbook.category}</span>
          <span>Last updated: {formatDate(runbook.lastUpdated)}</span>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col gap-6">
        <div className="bg-blue-50 border border-blue-100 p-4 rounded-lg text-blue-900 text-sm">
          <strong>Summary:</strong> {runbook.summary}
        </div>
        
        <div className="prose prose-slate max-w-none text-sm mt-4 whitespace-pre-wrap">
          {runbook.content}
        </div>
        
        <div className="mt-8 pt-4 border-t border-slate-100 flex gap-2">
          {runbook.tags.map(tag => (
            <span key={tag} className="bg-slate-100 text-slate-600 px-3 py-1 rounded-full text-xs">{tag}</span>
          ))}
        </div>
      </div>
    </div>
  )
}
