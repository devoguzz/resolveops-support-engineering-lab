import { ReactNode } from 'react'
import { AuthProvider } from '../store/authStore'

export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <AuthProvider>
      {children}
    </AuthProvider>
  )
}
