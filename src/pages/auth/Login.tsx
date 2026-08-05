import { useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useAuth } from '../../store/authStore'
import { ArrowRight, UserCircle, Briefcase, Building2, UserCog, Mail, Lock, Eye, EyeOff } from 'lucide-react'

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
  const [showPassword, setShowPassword] = useState(false)
  const [selectedRole, setSelectedRole] = useState<string | null>(null)

  const { register, handleSubmit, setValue, formState: { errors, isSubmitting } } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema)
  })

  const onSubmit = async (data: LoginForm) => {
    try {
      setError('')
      const user = await login(data.email)
      
      const returnTo = searchParams.get('returnTo')
      if (returnTo) {
        // Safe returnTo check: only allow relative paths
        if (returnTo.startsWith('/') && !returnTo.startsWith('//')) {
           // Prevent cross-role navigation via returnTo
           if (user.role.startsWith('support_') && !returnTo.startsWith('/support')) {
              navigate('/support/dashboard', { replace: true })
           } else if (!user.role.startsWith('support_') && returnTo.startsWith('/support')) {
              navigate('/app/dashboard', { replace: true })
           } else {
              navigate(returnTo, { replace: true })
           }
           return
        }
      }

      if (user.role.startsWith('support_')) {
        navigate('/support/dashboard', { replace: true })
      } else {
        navigate('/app/dashboard', { replace: true })
      }
    } catch (e: any) {
      setError(e.message || 'Login failed')
    }
  }

  const fillDemoAccount = (email: string, roleName: string) => {
    setValue('email', email)
    setValue('password', 'Demo123!')
    setSelectedRole(roleName)
  }

  const getButtonText = () => {
    if (isSubmitting) return 'Authenticating...'
    if (selectedRole) return `Sign In as ${selectedRole}`
    return 'Sign In'
  }

  return (
    <div className="w-full">
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
          {error && (
            <div 
              className="p-3 bg-red-50 text-red-700 rounded-xl text-[14px] border border-red-200 font-medium overflow-hidden transition-all"
            >
              {error}
            </div>
          )}
        
        <div className="flex flex-col gap-2 group">
          <label htmlFor="email" className="text-[14px] font-semibold text-slate-700">Work Email</label>
          <div className="relative">
             <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-slate-900 transition-colors pointer-events-none" aria-hidden="true" />
             <input 
               id="email"
               type="email" 
               style={{ paddingLeft: '48px', paddingRight: '16px' }}
               className="w-full min-h-[48px] bg-white border border-slate-300 rounded-xl py-3 text-[15px] text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-slate-900 transition-all shadow-sm hover:border-slate-400 disabled:opacity-50 disabled:bg-slate-50"
               placeholder="name@company.com" 
               {...register('email')}
             />
          </div>
          {errors.email && <p className="text-[13px] text-red-600 font-medium mt-1">{errors.email.message}</p>}
        </div>

        <div className="flex flex-col gap-2 group">
          <label htmlFor="password" className="text-[14px] font-semibold text-slate-700">Password</label>
          <div className="relative">
             <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-slate-900 transition-colors pointer-events-none" aria-hidden="true" />
             <input 
               id="password"
               type={showPassword ? 'text' : 'password'} 
               style={{ paddingLeft: '48px', paddingRight: '48px' }}
               className="w-full min-h-[48px] bg-white border border-slate-300 rounded-xl py-3 text-[15px] text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-slate-900 transition-all shadow-sm hover:border-slate-400 disabled:opacity-50 disabled:bg-slate-50"
               placeholder="••••••••" 
               {...register('password')}
             />
             <button 
               type="button" 
               onClick={() => setShowPassword(!showPassword)}
               className="absolute right-1 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center text-slate-400 hover:text-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900 transition-colors bg-transparent"
               aria-label={showPassword ? 'Hide password' : 'Show password'}
               title={showPassword ? 'Hide password' : 'Show password'}
             >
               {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
             </button>
          </div>
          {errors.password && <p className="text-[13px] text-red-600 font-medium mt-1">{errors.password.message}</p>}
        </div>

        <div className="flex items-center justify-between mt-1">
          <label className="flex items-center gap-2.5 text-[14px] text-slate-700 cursor-pointer hover:text-slate-900 transition-colors font-medium select-none group">
            <input type="checkbox" className="rounded-md border-slate-300 text-slate-900 focus:ring-2 focus:ring-slate-900 focus:ring-offset-1 w-4 h-4 cursor-pointer group-hover:border-slate-400 transition-colors" {...register('rememberMe')} />
            Remember me
          </label>
          <a href="#" className="text-[14px] text-slate-500 hover:text-slate-900 transition-colors font-medium focus:outline-none focus:underline" onClick={(e) => { e.preventDefault(); setError('Forgot password is not supported in this demo environment.'); setTimeout(() => setError(''), 3000); }}>
            Forgot password?
          </a>
        </div>

        <button 
          type="submit" 
          disabled={isSubmitting} 
          className="w-full min-h-[48px] bg-slate-900 hover:bg-slate-800 text-white font-semibold rounded-xl shadow-sm transition-all flex justify-center items-center gap-2 mt-4 active:scale-[0.98] disabled:opacity-70 disabled:active:scale-100 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-slate-900 focus:ring-offset-2 text-[15px]"
        >
          {getButtonText()} <ArrowRight className="w-5 h-5" />
        </button>
      </form>

      <div className="mt-12">
        <div className="flex items-center gap-4 mb-8">
           <div className="flex-1 h-px bg-slate-200"></div>
           <span className="text-[12px] font-bold text-slate-500 uppercase tracking-widest bg-white px-2">Explore the demo</span>
           <div className="flex-1 h-px bg-slate-200"></div>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <button 
            type="button" 
            onClick={() => fillDemoAccount('owner@northstar.demo', 'Customer Owner')} 
            className={`flex flex-col items-start gap-1 p-4 bg-white border rounded-xl transition-all shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-left ${selectedRole === 'Customer Owner' ? 'border-blue-500 ring-1 ring-blue-500 bg-blue-50/30' : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'}`}
          >
            <div className={`flex items-center gap-2.5 text-[15px] font-semibold transition-colors ${selectedRole === 'Customer Owner' ? 'text-blue-700' : 'text-slate-900'}`}>
              <Building2 className={`w-5 h-5 ${selectedRole === 'Customer Owner' ? 'text-blue-600' : 'text-slate-400'}`} /> Customer Owner
            </div>
            <span className="text-[13px] text-slate-500 font-medium ml-[30px] leading-snug">Manage workspace and integrations</span>
          </button>

          <button 
            type="button" 
            onClick={() => fillDemoAccount('member@northstar.demo', 'Customer Member')} 
            className={`flex flex-col items-start gap-1 p-4 bg-white border rounded-xl transition-all shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-left ${selectedRole === 'Customer Member' ? 'border-blue-500 ring-1 ring-blue-500 bg-blue-50/30' : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'}`}
          >
            <div className={`flex items-center gap-2.5 text-[15px] font-semibold transition-colors ${selectedRole === 'Customer Member' ? 'text-blue-700' : 'text-slate-900'}`}>
              <UserCircle className={`w-5 h-5 ${selectedRole === 'Customer Member' ? 'text-blue-600' : 'text-slate-400'}`} /> Customer Member
            </div>
            <span className="text-[13px] text-slate-500 font-medium ml-[30px] leading-snug">Submit and track product issues</span>
          </button>

          <button 
            type="button" 
            onClick={() => fillDemoAccount('maya@resolveops.demo', 'Support Agent')} 
            className={`flex flex-col items-start gap-1 p-4 bg-white border rounded-xl transition-all shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 text-left ${selectedRole === 'Support Agent' ? 'border-indigo-500 ring-1 ring-indigo-500 bg-indigo-50/30' : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'}`}
          >
            <div className={`flex items-center gap-2.5 text-[15px] font-semibold transition-colors ${selectedRole === 'Support Agent' ? 'text-indigo-700' : 'text-slate-900'}`}>
              <Briefcase className={`w-5 h-5 ${selectedRole === 'Support Agent' ? 'text-indigo-600' : 'text-slate-400'}`} /> Support Agent
            </div>
            <span className="text-[13px] text-slate-500 font-medium ml-[30px] leading-snug">Investigate tickets and diagnostics</span>
          </button>

          <button 
            type="button" 
            onClick={() => fillDemoAccount('lead@resolveops.demo', 'Support Lead')} 
            className={`flex flex-col items-start gap-1 p-4 bg-white border rounded-xl transition-all shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 text-left ${selectedRole === 'Support Lead' ? 'border-indigo-500 ring-1 ring-indigo-500 bg-indigo-50/30' : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'}`}
          >
            <div className={`flex items-center gap-2.5 text-[15px] font-semibold transition-colors ${selectedRole === 'Support Lead' ? 'text-indigo-700' : 'text-slate-900'}`}>
              <UserCog className={`w-5 h-5 ${selectedRole === 'Support Lead' ? 'text-indigo-600' : 'text-slate-400'}`} /> Support Lead
            </div>
            <span className="text-[13px] text-slate-500 font-medium ml-[30px] leading-snug">Manage incidents and escalations</span>
          </button>
        </div>
      </div>
      
      <p className="mt-8 text-[13px] text-slate-400 text-center font-medium">
        All login interactions are mock data. No real authentication is performed.
      </p>
    </div>
  )
}
