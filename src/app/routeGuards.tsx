import { ReactNode } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../store/authStore'

interface ProtectedRouteProps {
  children: ReactNode
  allowedRoles: string[]
}

export function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
  const location = useLocation()
  const { user, isLoading } = useAuth()
  
  if (isLoading) {
    return <div className="p-8 text-center text-muted">Loading session...</div>
  }

  if (!user) {
    return <Navigate to={`/login?returnTo=${encodeURIComponent(location.pathname)}`} replace />
  }

  if (!allowedRoles.includes(user.role)) {
    return <Navigate to="/403" replace />
  }

  return <>{children}</>
}

