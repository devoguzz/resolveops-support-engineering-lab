import { createContext, useContext, useState, ReactNode, useEffect } from 'react'
import { User } from '../domain/models'
import { getStoredState } from './demoDataStore'

interface AuthContextType {
  user: User | null
  login: (email: string) => Promise<User>
  logout: () => void
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const stored = localStorage.getItem('resolveops_auth')
    if (stored) {
      try {
        const parsedUser = JSON.parse(stored)
        const state = getStoredState()
        const realUser = state.users.find((u: User) => u.id === parsedUser.id)
        if (realUser) {
          setUser(realUser)
        }
      } catch {
        // ignore
      }
    }
    setIsLoading(false)
  }, [])

  const login = async (email: string): Promise<User> => {
    // Simulate delay
    await new Promise(r => setTimeout(r, 600))
    const state = getStoredState()
    const found = state.users.find((u: User) => u.email === email)
    if (!found) throw new Error('Invalid credentials')
    setUser(found)
    localStorage.setItem('resolveops_auth', JSON.stringify(found))
    return found
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('resolveops_auth')
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
