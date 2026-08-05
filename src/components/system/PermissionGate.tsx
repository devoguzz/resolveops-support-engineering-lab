import { ReactNode } from 'react'
import { useAuth } from '../../store/authStore'

interface PermissionGateProps {
  children: ReactNode
  allowedRoles: string[]
  fallback?: ReactNode
}

export function PermissionGate({ children, allowedRoles, fallback = null }: PermissionGateProps) {
  const { user } = useAuth()

  if (!user || !allowedRoles.includes(user.role)) {
    return <>{fallback}</>
  }

  return <>{children}</>
}
