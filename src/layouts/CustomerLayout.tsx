import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../store/authStore'

export function CustomerLayout() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const handleSignOut = () => {
    logout()
    navigate('/login')
  }

  const navItems = [
    { name: 'Dashboard', path: '/app/dashboard' },
    { name: 'Support Tickets', path: '/app/support' },
    { name: 'Webhooks', path: '/app/webhooks' },
    { name: 'Integrations', path: '/app/integrations' },
    { name: 'API Keys', path: '/app/api-keys' },
    { name: 'Team Settings', path: '/app/team' },
    { name: 'Activity Log', path: '/app/activity' },
  ]

  return (
    <div className="flex h-screen bg-slate-50">
      <aside className="w-64 bg-white border-r border-slate-200 flex flex-col">
        <div className="h-16 flex items-center px-6 border-b border-slate-200">
          <span className="font-bold text-lg text-slate-900">ResolveOps</span>
          <span className="ml-2 text-xs px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full font-medium tracking-wide">CUSTOMER</span>
        </div>
        
        <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
          {navItems.map(item => {
            const active = location.pathname.startsWith(item.path) && 
                           (item.path !== '/app' || location.pathname === '/app' || location.pathname === '/app/dashboard');
            return (
              <Link 
                key={item.name} 
                to={item.path} 
                className={`flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-colors ${
                  active ? 'bg-blue-50 text-blue-700' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                {item.name}
              </Link>
            )
          })}
        </nav>
        
        <div className="p-4 border-t border-slate-200">
          <div className="flex items-center gap-3 px-3 py-2">
            <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-slate-600 font-bold text-sm">
              {user?.fullName.charAt(0) || 'U'}
            </div>
            <div className="flex-1 overflow-hidden">
              <p className="text-sm font-medium text-slate-900 truncate">{user?.fullName}</p>
              <p className="text-xs text-slate-500 truncate">{user?.role.replace('customer_', '')}</p>
            </div>
          </div>
          <button onClick={handleSignOut} className="mt-2 w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg font-medium transition-colors">
            Sign Out
          </button>
        </div>
      </aside>
      
      <main className="flex-1 flex flex-col overflow-hidden">
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8">
           <h2 className="text-lg font-semibold text-slate-800 capitalize">
              {location.pathname.split('/')[2]?.replace('-', ' ') || 'Dashboard'}
           </h2>
           <div className="flex items-center gap-4">
              <span className="text-sm text-slate-500">Organization: {user?.organizationId?.replace('org_', '').toUpperCase()}</span>
           </div>
        </header>
        <div className="flex-1 overflow-y-auto p-8">
          <Outlet />
        </div>
      </main>
    </div>
  )
}


