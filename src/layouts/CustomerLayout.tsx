import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../store/authStore'
import { 
  LayoutDashboard, LifeBuoy, Webhook, Blocks, KeySquare, 
  Users, Activity, LogOut, Search, Bell, Menu, Hexagon
} from 'lucide-react'
import { useState } from 'react'

export function CustomerLayout() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [sidebarOpen, setSidebarOpen] = useState(true)

  const handleSignOut = () => {
    logout()
    navigate('/login')
  }

  const handleResetDemoData = () => {
    localStorage.removeItem('resolveops-demo-tenant')
    window.location.reload()
  }

  const navItems = [
    { name: 'Dashboard', path: '/app', icon: LayoutDashboard },
    { name: 'Tickets', path: '/app/support', icon: LifeBuoy },
    { name: 'Webhook Deliveries', path: '/app/webhooks', icon: Webhook },
    { name: 'Integrations', path: '/app/integrations', icon: Blocks },
    { name: 'API Keys', path: '/app/api-keys', icon: KeySquare },
    { name: 'Team', path: '/app/team', icon: Users },
    { name: 'Activity Log', path: '/app/activity', icon: Activity },
  ]

  return (
    <div className="flex h-screen bg-background overflow-hidden font-sans selection:bg-primary/30">
      
      {/* Sidebar - Clean Light Theme Aesthetic */}
      {sidebarOpen && (
        <aside 
          className="relative z-20 h-full w-[260px] flex flex-col bg-card border-r border-border shrink-0 overflow-hidden transition-all duration-300"
        >
          {/* Logo Section */}
          <div className="h-[72px] flex items-center px-6 border-b border-border bg-card">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-primary flex items-center justify-center">
                 <Hexagon className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="font-extrabold text-lg tracking-tight text-foreground">Resolve<span className="text-primary">Ops</span></span>
            </div>
          </div>
          
          {/* Navigation */}
          <nav className="flex-1 px-4 py-8 space-y-1 overflow-y-auto custom-scrollbar">
            <p className="px-3 text-[11px] font-bold uppercase tracking-widest text-muted-foreground mb-4">Workspace</p>
            {navItems.map((item) => {
              const active = location.pathname.startsWith(item.path) && 
                             (item.path !== '/app' || location.pathname === '/app' || location.pathname === '/app/dashboard');
              const Icon = item.icon;
              return (
                <div key={item.name}>
                  <Link 
                    to={item.path} 
                    className={`group flex items-center gap-3 px-3 py-2.5 text-[14px] font-semibold rounded-lg transition-all duration-200 outline-none ${
                      active 
                        ? 'bg-foreground text-background shadow-sm' 
                        : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                    }`}
                  >
                    <Icon className={`w-[18px] h-[18px] transition-transform duration-200 ${active ? 'text-background' : 'text-muted-foreground group-hover:text-foreground'}`} />
                    {item.name}
                  </Link>
                </div>
              )
            })}
          </nav>
          
          {/* User Profile & Actions */}
          <div className="p-4 bg-muted/50 border-t border-border">
            <div className="flex items-center gap-3 mb-4 px-2">
              <div className="w-9 h-9 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary font-bold shadow-sm text-sm">
                 {user?.fullName.charAt(0) || 'U'}
              </div>
              <div className="flex-1 overflow-hidden">
                <p className="text-sm font-bold text-foreground truncate leading-tight">{user?.fullName}</p>
                <p className="text-[12px] font-medium text-muted-foreground truncate capitalize leading-tight">{user?.role.replace('customer_', '')}</p>
              </div>
            </div>
            <div className="flex flex-col gap-1.5">
              <button onClick={handleResetDemoData} className="flex items-center justify-between w-full px-3 py-2 text-[13px] font-semibold text-muted-foreground hover:text-warning-foreground hover:bg-warning rounded-lg transition-colors outline-none group">
                <div className="flex items-center gap-2">
                  <Activity className="w-4 h-4 text-muted-foreground group-hover:text-warning-foreground transition-colors" /> Reset Demo
                </div>
              </button>
              <button onClick={handleSignOut} className="flex items-center justify-between w-full px-3 py-2 text-[13px] font-semibold text-muted-foreground hover:text-destructive-foreground hover:bg-destructive rounded-lg transition-colors outline-none group">
                <div className="flex items-center gap-2">
                  <LogOut className="w-4 h-4 text-muted-foreground group-hover:text-destructive-foreground transition-colors" /> Sign Out
                </div>
              </button>
            </div>
          </div>
        </aside>
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 bg-background relative">
        
        {/* Top Header */}
        <header className="h-[72px] flex items-center justify-between px-8 border-b border-border bg-card/80 backdrop-blur-xl sticky top-0 z-10">
          <div className="flex items-center gap-5">
            <button 
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 -ml-2 rounded-lg text-muted-foreground hover:bg-muted transition-colors active:scale-95"
            >
              <Menu className="w-[20px] h-[20px]" />
            </button>
            
            <div className="h-5 w-[1px] bg-border hidden sm:block"></div>
            
            <div className="relative hidden sm:block group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-[16px] h-[16px] text-muted-foreground group-focus-within:text-primary transition-colors" />
              <input 
                type="text" 
                placeholder="Search tickets, logs, webhooks..." 
                className="pl-10 pr-4 py-2 w-[340px] bg-muted/50 border border-border rounded-lg text-[14px] font-medium text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/20 focus:bg-background transition-all"
              />
              <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
                 <kbd className="px-1.5 py-0.5 text-[10px] font-bold text-muted-foreground bg-background border border-border rounded shadow-sm">⌘</kbd>
                 <kbd className="px-1.5 py-0.5 text-[10px] font-bold text-muted-foreground bg-background border border-border rounded shadow-sm">K</kbd>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
             <button className="relative p-2 text-muted-foreground hover:bg-muted rounded-lg transition-colors group">
               <Bell className="w-[20px] h-[20px] group-hover:text-foreground transition-colors" />
               <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-destructive border-2 border-card rounded-full"></span>
             </button>
          </div>
        </header>

        {/* Scrollable Page Content */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden relative scroll-smooth">
          <Outlet />
        </div>
      </div>
    </div>
  )
}
