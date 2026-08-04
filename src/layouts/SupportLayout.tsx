import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../store/authStore'
import { 
  LayoutDashboard, LifeBuoy, FileSearch, TerminalSquare, 
  Activity, PlaySquare, Settings, LogOut, Bell, Search, Menu, ShieldAlert
} from 'lucide-react'
import { useState } from 'react'

export function SupportLayout() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [sidebarOpen, setSidebarOpen] = useState(true)

  const handleSignOut = () => {
    logout()
    navigate('/login')
  }

  const navItems = [
    { name: 'Dashboard', path: '/support/dashboard', icon: LayoutDashboard },
    { name: 'Ticket Queue', path: '/support/tickets', icon: LifeBuoy },
    { name: 'Trace Explorer', path: '/support/traces', icon: FileSearch },
    { name: 'Log Explorer', path: '/support/logs', icon: TerminalSquare },
    { name: 'Webhook Inspector', path: '/support/webhooks', icon: Activity },
    { name: 'Job Monitor', path: '/support/jobs', icon: Settings },
    { name: 'Incident Center', path: '/support/incidents', icon: ShieldAlert },
    { name: 'Runbooks', path: '/support/runbooks', icon: PlaySquare }
  ]

  const handleResetDemoData = () => {
    localStorage.removeItem('resolveops_demo_state');
    window.location.reload();
  }

  return (
    <div className="flex h-screen bg-slate-950 overflow-hidden font-sans text-slate-300">
      {/* Background gradients for dark theme */}
      <div className="fixed top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
         <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-[120px]"></div>
         <div className="absolute bottom-[-10%] right-[-5%] w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-[150px]"></div>
      </div>

      {/* Sidebar */}
      {sidebarOpen && (
        <aside 
          className="relative z-20 h-full w-[280px] flex flex-col bg-slate-900/90 backdrop-blur-2xl border-r border-slate-800/80 shadow-[4px_0_24px_rgba(0,0,0,0.2)] transition-all"
        >
          <div className="h-16 flex items-center px-6 border-b border-slate-800/50">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 shadow-sm flex items-center justify-center">
                 <span className="text-white font-black text-xs">R</span>
              </div>
              <span className="font-extrabold text-lg tracking-tight text-white">ResolveOps</span>
            </div>
          </div>
          
          <nav className="flex-1 px-3 py-6 space-y-0.5 overflow-y-auto">
            <p className="px-3 text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-3">Support Console</p>
            {navItems.map((item, i) => {
              const active = location.pathname.startsWith(item.path) && 
                             (item.path !== '/support' || location.pathname === '/support' || location.pathname === '/support/dashboard');
              const Icon = item.icon;
              return (
                <div key={item.name}>
                  <Link 
                    to={item.path} 
                    className={`group flex items-center gap-3 px-3 py-2.5 text-sm font-semibold rounded-xl transition-all duration-200 focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:outline-none ${
                      active 
                        ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-600/20' 
                        : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200'
                    }`}
                  >
                    <Icon className={`w-[18px] h-[18px] transition-transform duration-200 ${active ? 'text-white' : 'text-slate-500 group-hover:text-indigo-400'}`} />
                    {item.name}
                  </Link>
                </div>
              )
            })}
          </nav>
          
          <div className="p-3 mx-3 mb-4 rounded-xl bg-slate-950/50 border border-slate-800/50">
            <div className="flex items-center gap-3 mb-3 px-1">
              <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-300 font-bold shadow-sm text-sm">
                {user?.fullName.charAt(0) || 'U'}
              </div>
              <div className="flex-1 overflow-hidden">
                <p className="text-sm font-bold text-slate-200 truncate leading-tight">{user?.fullName}</p>
                <p className="text-[11px] font-medium text-slate-500 truncate capitalize leading-tight mt-0.5">{user?.role.replace('_', ' ')}</p>
              </div>
            </div>
            <div className="flex flex-col gap-1">
              <button onClick={handleResetDemoData} className="flex items-center gap-2 w-full px-3 py-1.5 text-xs font-semibold text-slate-400 hover:text-amber-400 hover:bg-amber-950/30 rounded-lg transition-colors focus-visible:ring-2 focus-visible:ring-amber-500">
                <Activity className="w-3.5 h-3.5" /> Reset Demo Data
              </button>
              <button onClick={handleSignOut} className="flex items-center gap-2 w-full px-3 py-1.5 text-xs font-semibold text-slate-400 hover:text-red-400 hover:bg-red-950/30 rounded-lg transition-colors focus-visible:ring-2 focus-visible:ring-red-500">
                <LogOut className="w-3.5 h-3.5" /> End Shift
              </button>
            </div>
          </div>
        </aside>
      )}
      
      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden relative z-10">
        <header className="h-16 bg-slate-950/40 backdrop-blur-xl border-b border-slate-800/60 flex items-center justify-between px-6 sticky top-0 z-30">
           <div className="flex items-center gap-4">
             <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-2 -ml-2 text-slate-500 hover:text-slate-300 hover:bg-slate-800 rounded-lg transition-colors focus-visible:ring-2 focus-visible:ring-indigo-500">
               <Menu className="w-5 h-5" />
             </button>
             {/* Duplicate page heading removed */}
           </div>
           
           <div className="flex items-center gap-4">
              <div className="hidden md:flex relative group">
                 <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-indigo-400 transition-colors pointer-events-none" />
                 <input type="text" placeholder="Global Search..." className="pl-10 pr-4 py-2 bg-slate-900 border border-slate-800 focus:bg-slate-900 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 rounded-full text-sm font-medium w-[280px] transition-all text-white placeholder-slate-500 outline-none" />
              </div>
              <button className="relative p-2 text-slate-500 hover:text-slate-300 hover:bg-slate-800 rounded-full transition-colors focus-visible:ring-2 focus-visible:ring-indigo-500">
                 <Bell className="w-5 h-5" />
                 <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-indigo-500 rounded-full ring-2 ring-slate-950"></span>
              </button>
           </div>
        </header>

        <div className="flex-1 overflow-y-auto overflow-x-hidden relative">
          <Outlet />
        </div>
      </main>
    </div>
  )
}

