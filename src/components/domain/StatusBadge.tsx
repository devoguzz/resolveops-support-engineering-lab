import { Badge } from "../ui/badge"

interface StatusBadgeProps {
  status: 'healthy' | 'degraded' | 'failed' | 'active' | 'inactive'
}

export function StatusBadge({ status }: StatusBadgeProps) {
  switch (status) {
    case 'healthy':
    case 'active':
      return <Badge variant="success" className="capitalize">{status}</Badge>
    case 'degraded':
      return <Badge variant="warning" className="capitalize">{status}</Badge>
    case 'failed':
    case 'inactive':
      return <Badge variant="destructive" className="capitalize">{status}</Badge>
    default:
      return <Badge variant="default" className="capitalize">{status}</Badge>
  }
}
