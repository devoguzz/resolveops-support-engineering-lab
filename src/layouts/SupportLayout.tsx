import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../store/authStore'

export function SupportLayout() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const handleSignOut = () => {
    logout()
    navigate('/login')
  }

  const navItems = [
    { name: 'Dashboard', path: '/support/dashboard' },
    { name: 'Ticket Queue', path: '/support/tickets' },
    { name: 'Trace Explorer', path: '/support/traces' },
    { name: 'Log Explorer', path: '/support/logs' },
    { name: 'Webhook Inspector', path: '/support/webhooks' },
    { name: 'Job Monitor', path: '/support/jobs' },
    { name: 'Incident Center', path: '/support/incidents' },
    { name: 'Runbooks', path: '/support/runbooks' }
  ]

  return (
    <div className="flex h-screen bg-slate-50">
      <aside className="w-64 bg-slate-900 text-slate-300 flex flex-col">
        <div className="h-16 flex items-center px-6 border-b border-slate-800">
          <span className="font-bold text-lg text-white">ResolveOps</span>
          <span className="ml-2 text-xs px-2 py-0.5 bg-indigo-500/20 text-indigo-300 rounded-full font-medium tracking-wide border border-indigo-500/30">SUPPORT</span>
        </div>
        
        <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
          {navItems.map(item => {
            const active = location.pathname.startsWith(item.path) && 
                           (item.path !== '/support' || location.pathname === '/support' || location.pathname === '/support/dashboard');
            return (
              <Link 
                key={item.name} 
                to={item.path} 
                className={`flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-colors ${
                  active ? 'bg-indigo-500/20 text-indigo-300' : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                }`}
              >
                {item.name}
              </Link>
            )
          })}
        </nav>
        
        <div className="p-4 border-t border-slate-800">
          <div className="flex items-center gap-3 px-3 py-2">
            <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-slate-300 font-bold text-sm">
              {user?.fullName.charAt(0) || 'U'}
            </div>
            <div className="flex-1 overflow-hidden">
              <p className="text-sm font-medium text-slate-200 truncate">{user?.fullName}</p>
              <p className="text-xs text-slate-500 truncate capitalize">{user?.role.replace('_', ' ')}</p>
            </div>
          </div>
          <button onClick={handleSignOut} className="mt-2 w-full text-left px-3 py-2 text-sm text-red-400 hover:bg-red-400/10 hover:text-red-300 rounded-lg font-medium transition-colors">
            Sign Out
          </button>
        </div>
      </aside>
      
      <main className="flex-1 flex flex-col overflow-hidden">
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8">
           <h2 className="text-lg font-semibold text-slate-800 capitalize">
              {location.pathname.split('/')[2]?.replace('-', ' ') || 'Dashboard'}
           </h2>
        </header>
        <div className="flex-1 overflow-y-auto p-8">
          <Outlet />
        </div>
      </main>
    </div>
  )
}

