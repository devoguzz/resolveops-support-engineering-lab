export function StatusBadge({ status }: { status: string }) {
  let color = 'bg-slate-100 text-slate-800'
  
  if (status === 'active' || status === 'completed' || status === 'resolved') color = 'bg-green-100 text-green-800'
  else if (status === 'error' || status === 'failed' || status === 'dead_letter') color = 'bg-red-100 text-red-800'
  else if (status === 'pending' || status === 'processing' || status === 'investigating' || status === 'open') color = 'bg-blue-100 text-blue-800'
  else if (status === 'retrying' || status === 'waiting_for_support' || status === 'waiting_for_customer') color = 'bg-yellow-100 text-yellow-800'
  else if (status === 'disabled' || status === 'closed') color = 'bg-slate-100 text-slate-600'

  return (
    <span className={`px-2 py-1 text-xs font-semibold rounded uppercase tracking-wide inline-block ${color}`}>
      {status.replace(/_/g, ' ')}
    </span>
  )
}
