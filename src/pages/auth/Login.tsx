import { useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useAuth } from '../../store/authStore'
import { USERS } from '../../mocks/seed'

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  rememberMe: z.boolean().optional(),
})

type LoginForm = z.infer<typeof loginSchema>

export function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const [error, setError] = useState('')

  const { register, handleSubmit, setValue, formState: { errors, isSubmitting } } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema)
  })

  const onSubmit = async (data: LoginForm) => {
    try {
      setError('')
      await login(data.email)
      
      // Determine where to redirect
      const returnTo = searchParams.get('returnTo')
      if (returnTo) {
        navigate(returnTo, { replace: true })
        return
      }

      // Default redirects based on role (we fetch user from mock manually to know role here)
      const user = USERS.find(u => u.email === data.email)
      if (user?.role.startsWith('support_')) {
        navigate('/support/dashboard', { replace: true })
      } else {
        navigate('/app/dashboard', { replace: true })
      }
    } catch (e: any) {
      setError(e.message || 'Login failed')
    }
  }

  const fillDemoAccount = (email: string) => {
    setValue('email', email)
    setValue('password', 'Demo123!')
  }

  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        {error && <div className="p-3 bg-red-50 text-red-600 rounded text-sm border border-red-200">{error}</div>}
        
        <div className="form-group">
          <label className="form-label">Email</label>
          <input 
            type="email" 
            className="form-input" 
            placeholder="name@company.com" 
            {...register('email')}
          />
          {errors.email && <p className="form-error">{errors.email.message}</p>}
        </div>

        <div className="form-group">
          <label className="form-label">Password</label>
          <input 
            type="password" 
            className="form-input" 
            placeholder="••••••••" 
            {...register('password')}
          />
          {errors.password && <p className="form-error">{errors.password.message}</p>}
        </div>

        <div className="flex items-center justify-between mt-2">
          <label className="flex items-center gap-2 text-sm cursor-pointer">
            <input type="checkbox" {...register('rememberMe')} />
            Remember me
          </label>
          <button type="button" disabled className="text-sm text-primary opacity-50 cursor-not-allowed" title="Disabled in demo">
            Forgot password?
          </button>
        </div>

        <button type="submit" disabled={isSubmitting} className="btn btn-primary mt-4 py-2">
          {isSubmitting ? 'Signing in...' : 'Sign in'}
        </button>
      </form>

      <div className="mt-8 pt-6 border-t border-gray-200">
        <h3 className="text-sm font-semibold mb-3 text-slate-600">Demo Accounts</h3>
        <div className="flex flex-col gap-2">
          <button type="button" onClick={() => fillDemoAccount('admin@northstar.test')} className="text-left text-sm p-2 hover:bg-slate-50 rounded border border-transparent hover:border-slate-200">
            <strong>Customer Owner</strong> — admin@northstar.test
          </button>
          <button type="button" onClick={() => fillDemoAccount('dev@northstar.test')} className="text-left text-sm p-2 hover:bg-slate-50 rounded border border-transparent hover:border-slate-200">
            <strong>Customer Member</strong> — dev@northstar.test
          </button>
          <button type="button" onClick={() => fillDemoAccount('agent@resolveops.test')} className="text-left text-sm p-2 hover:bg-slate-50 rounded border border-transparent hover:border-slate-200">
            <strong>Support Agent</strong> — agent@resolveops.test
          </button>
          <button type="button" onClick={() => fillDemoAccount('lead@resolveops.test')} className="text-left text-sm p-2 hover:bg-slate-50 rounded border border-transparent hover:border-slate-200">
            <strong>Support Lead</strong> — lead@resolveops.test
          </button>
        </div>
      </div>
    </div>
  )
}
