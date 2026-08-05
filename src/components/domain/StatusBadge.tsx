import { Badge } from "../ui/badge"
import { AnimatedStatus } from "../motion/AnimatedStatus"

interface StatusBadgeProps {
  status: 'healthy' | 'degraded' | 'failed' | 'active' | 'inactive' | 'open' | 'investigating' | 'resolved' | 'success' | 'p1' | 'p2' | 'p3' | string
  animate?: boolean
}

export function StatusBadge({ status, animate = false }: StatusBadgeProps) {
  const s = status.toLowerCase();
  
  const content = animate ? <AnimatedStatus status={s} /> : s;

  switch (s) {
    case 'healthy':
    case 'active':
    case 'resolved':
    case 'success':
      return <Badge variant="success" className="capitalize">{content}</Badge>
    case 'degraded':
    case 'investigating':
      return <Badge variant="warning" className="capitalize">{content}</Badge>
    case 'p2':
      return <Badge variant="warning" className="uppercase">{content}</Badge>
    case 'failed':
    case 'inactive':
      return <Badge variant="destructive" className="capitalize">{content}</Badge>
    case 'p1':
      return <Badge variant="destructive" className="uppercase">{content}</Badge>
    case 'p3':
      return <Badge variant="secondary" className="uppercase">{content}</Badge>
    case 'open':
      return <Badge variant="default" className="capitalize">{content}</Badge>
    default:
      return <Badge variant="default" className="capitalize">{content}</Badge>
  }
}
