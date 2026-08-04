import { ReactNode } from 'react'

export function LoadingState({ message = 'Loading...' }: { message?: string }) {
  return <div className="p-8 text-center text-muted flex flex-col items-center justify-center">
    <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin mb-2"></div>
    {message}
  </div>
}

export function ErrorState({ message, onRetry }: { message: string, onRetry?: () => void }) {
  return <div className="p-8 text-center flex flex-col items-center">
    <div className="text-danger mb-2">⚠️ Error</div>
    <p className="text-muted mb-4">{message}</p>
    {onRetry && <button onClick={onRetry} className="btn btn-secondary text-sm">Retry</button>}
  </div>
}

export function EmptyState({ title = 'No data found', description, action }: { title?: string, description?: string, action?: ReactNode }) {
  return <div className="p-12 text-center bg-slate-50 border border-slate-100 rounded">
    <h3 className="text-lg font-medium text-slate-700">{title}</h3>
    {description && <p className="text-slate-500 mt-2">{description}</p>}
    {action && <div className="mt-4">{action}</div>}
  </div>
}

export function StatusBadge({ status }: { status: string }) {
  const normalized = status.toLowerCase()
  let bg = 'bg-slate-100'
  let text = 'text-slate-600'
  
  if (['active', 'success', 'resolved', 'completed', 'monitoring'].includes(normalized)) { bg = 'bg-green-100'; text = 'text-green-700' }
  else if (['failed', 'error', 'revoked', 'dead_letter'].includes(normalized)) { bg = 'bg-red-100'; text = 'text-red-700' }
  else if (['warning', 'past_due', 'failing', 'investigating', 'retrying'].includes(normalized)) { bg = 'bg-amber-100'; text = 'text-amber-700' }
  else if (['open', 'pending', 'processing'].includes(normalized)) { bg = 'bg-blue-100'; text = 'text-blue-700' }
  
  return <span className={`px-2 py-0.5 rounded text-xs font-medium ${bg} ${text}`}>{status.replace('_', ' ').toUpperCase()}</span>
}

export function Toast({ message, type = 'info' }: { message: string, type?: 'info'|'success'|'error' }) {
  return <div className={`fixed bottom-4 right-4 p-4 rounded shadow-md border bg-white z-50`}>
    <div className={`text-sm font-medium ${type === 'error' ? 'text-danger' : type === 'success' ? 'text-success' : 'text-primary'}`}>
      {message}
    </div>
  </div>
}
