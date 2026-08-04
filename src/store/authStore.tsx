import { createContext, useContext, useState, ReactNode, useEffect } from 'react'
import { User } from '../domain/models'
import { USERS } from '../mocks/seed'

interface AuthContextType {
  user: User | null
  login: (email: string) => Promise<void>
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
        // Verify user exists in our mock seed
        const realUser = USERS.find(u => u.id === parsedUser.id)
        if (realUser) {
          setUser(realUser)
        }
      } catch (e) {
        // ignore
      }
    }
    setIsLoading(false)
  }, [])

  const login = async (email: string) => {
    // Simulate delay
    await new Promise(r => setTimeout(r, 600))
    const found = USERS.find(u => u.email === email)
    if (!found) throw new Error('Invalid credentials')
    setUser(found)
    localStorage.setItem('resolveops_auth', JSON.stringify(found))
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
