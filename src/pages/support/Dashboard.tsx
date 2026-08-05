import { Link } from 'react-router-dom';
import { useAuth } from '../../store/authStore';
import { AlertTriangle, Clock, Server, Inbox, Activity, CheckCircle2, ChevronRight, BarChart2, ArrowRight } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { AnimatedMetric } from '../../components/motion/AnimatedMetric';

const QUEUE_DATA = [
  { name: 'P1 - Critical', value: 3, color: '#ef4444' },
  { name: 'P2 - High', value: 14, color: '#f97316' },
  { name: 'P3 - Normal', value: 45, color: '#3b82f6' },
  { name: 'P4 - Low', value: 22, color: '#64748b' },
];

export function Dashboard() {
  const { user } = useAuth();
  
  return (
    <div className="p-8 flex flex-col gap-6 max-w-[1400px] mx-auto">
      <div className="flex justify-between items-center mb-2">
          <div>
              <h1 className="text-[28px] font-bold tracking-tight text-slate-900">Support Console</h1>
              <p className="text-[15px] text-slate-500 mt-1">Shift started. Welcome back, <span className="font-medium text-slate-700">{user?.fullName}</span>. Here's your queue.</p>
          </div>
          <div className="hidden sm:flex gap-3">
             <button className="flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-700 font-semibold rounded-lg border border-emerald-200/50 shadow-[0_1px_2px_rgba(0,0,0,0.02)] transition-all hover:bg-emerald-100 hover:border-emerald-300">
               <CheckCircle2 className="w-[18px] h-[18px]" /> Clocked In
             </button>
          </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-[0_1px_2px_rgba(0,0,0,0.04)] relative overflow-hidden group hover:border-blue-300 transition-colors">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-slate-500 text-[13px] font-semibold">Unassigned Tickets</h3>
            <div className="text-slate-400 group-hover:text-blue-500 transition-colors"><Inbox className="w-[18px] h-[18px]" /></div>
          </div>
          <div className="flex items-baseline gap-2">
            <p className="text-3xl font-bold text-slate-900 tracking-tight"><AnimatedMetric value={12} /></p>
          </div>
          <div className="mt-4 pt-4 border-t border-slate-100/80 flex items-center justify-between text-[13px] font-medium">
             <span className="text-slate-500">+3 since last hour</span>
             <Link to="/support/tickets" className="text-blue-600 hover:text-blue-700 flex items-center gap-1 group-hover:underline relative z-10">Triage <ArrowRight className="w-3.5 h-3.5" /></Link>
          </div>
        </div>
        
        <div className="bg-white p-5 rounded-xl border border-red-200 shadow-[0_1px_2px_rgba(0,0,0,0.04)] relative overflow-hidden group hover:border-red-300 transition-colors">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-slate-500 text-[13px] font-semibold">High Priority (P1/P2)</h3>
            <div className="text-red-500"><AlertTriangle className="w-[18px] h-[18px]" /></div>
          </div>
          <div className="flex items-baseline gap-2">
            <p className="text-3xl font-bold text-red-600 tracking-tight"><AnimatedMetric value={3} /></p>
          </div>
          <div className="mt-4 pt-4 border-t border-red-100 flex items-center justify-between text-[13px] text-red-600 font-medium">
             <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5"/> 1 approaching SLA</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-amber-200 shadow-[0_1px_2px_rgba(0,0,0,0.04)] relative overflow-hidden group hover:border-amber-300 transition-colors">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-slate-500 text-[13px] font-semibold">Active Incidents</h3>
            <div className="text-amber-500"><Activity className="w-[18px] h-[18px]" /></div>
          </div>
          <div className="flex items-baseline gap-2">
            <p className="text-3xl font-bold text-amber-600 tracking-tight"><AnimatedMetric value={1} /></p>
          </div>
          <div className="mt-4 pt-4 border-t border-amber-100 flex items-center justify-between text-[13px] text-amber-600 font-medium">
             <span>webhook-delivery-delay</span>
             <Link to="/support/incidents/INC-2026-008" className="hover:underline flex items-center gap-1 relative z-10">View <ArrowRight className="w-3.5 h-3.5" /></Link>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-[0_1px_2px_rgba(0,0,0,0.04)] relative overflow-hidden group hover:border-emerald-300 transition-colors">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-slate-500 text-[13px] font-semibold">System Health</h3>
            <div className="text-slate-400 group-hover:text-emerald-500 transition-colors"><Server className="w-[18px] h-[18px]" /></div>
          </div>
          <div className="flex items-baseline gap-1">
            <p className="text-3xl font-bold text-slate-900 tracking-tight"><AnimatedMetric value={99.8} formatNumber={false} /></p>
            <span className="text-lg font-bold text-slate-400">%</span>
          </div>
          <div className="mt-4 pt-4 border-t border-slate-100/80 flex items-center justify-between text-[13px] text-slate-500 font-medium">
             <span>Global uptime (30d)</span>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Ticket Volume Chart */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-[0_1px_2px_rgba(0,0,0,0.04)] flex flex-col overflow-hidden">
          <div className="px-6 py-5 border-b border-slate-100 flex justify-between items-center">
             <h3 className="text-[15px] font-semibold text-slate-900 flex items-center gap-2">
               <BarChart2 className="w-[18px] h-[18px] text-slate-400"/> Current Backlog Volume
             </h3>
          </div>
          <div className="p-6 flex-1 h-[340px]">
             <ResponsiveContainer width="100%" height="100%">
               <BarChart data={QUEUE_DATA} layout="vertical" margin={{ top: 10, right: 30, left: 20, bottom: 5 }}>
                 <CartesianGrid strokeDasharray="4 4" horizontal={false} stroke="#f1f5f9" />
                 <XAxis type="number" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12, fontWeight: 500}} />
                 <YAxis type="category" dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#334155', fontSize: 12, fontWeight: 600}} width={90} />
                 <Tooltip 
                   cursor={{fill: '#f8fafc'}}
                   contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                   labelStyle={{ fontWeight: 600, color: '#0f172a', marginBottom: '4px' }}
                 />
                 <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={28}>
                    {QUEUE_DATA.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                 </Bar>
               </BarChart>
             </ResponsiveContainer>
          </div>
        </div>

        {/* Quick Actions & Runbooks */}
        <div className="flex flex-col gap-6">
          <div className="bg-slate-900 text-white rounded-xl border border-slate-800 shadow-xl p-6 relative overflow-hidden flex-1 flex flex-col">
            <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/20 rounded-full blur-3xl -z-10 pointer-events-none"></div>
            <h3 className="text-[18px] font-bold mb-1">Needs Attention</h3>
            <p className="text-slate-400 text-[14px] mb-6">The following items require immediate triage.</p>
            
            <div className="flex flex-col gap-3 flex-1">
              <Link to="/support/tickets/SUP-1042" className="group flex items-center justify-between p-4 bg-white/[0.03] border border-white/10 rounded-xl hover:bg-white/[0.08] hover:border-white/20 transition-all">
                 <div>
                    <span className="inline-block px-2 py-0.5 bg-red-500/20 text-red-400 rounded-md text-[11px] font-bold uppercase mb-1.5 tracking-wider">P1 - SLA Breach Risk</span>
                    <p className="text-[14px] font-medium text-white/90">Webhook delivery failing for NorthStar</p>
                 </div>
                 <ChevronRight className="w-5 h-5 text-slate-500 group-hover:text-white group-hover:translate-x-0.5 transition-all" />
              </Link>
              
              <Link to="/support/incidents/INC-2026-008" className="group flex items-center justify-between p-4 bg-white/[0.03] border border-white/10 rounded-xl hover:bg-white/[0.08] hover:border-white/20 transition-all">
                 <div>
                    <span className="inline-block px-2 py-0.5 bg-amber-500/20 text-amber-400 rounded-md text-[11px] font-bold uppercase mb-1.5 tracking-wider">Active Incident</span>
                    <p className="text-[14px] font-medium text-white/90">Review Webhook Dispatcher Latency</p>
                 </div>
                 <ChevronRight className="w-5 h-5 text-slate-500 group-hover:text-white group-hover:translate-x-0.5 transition-all" />
              </Link>
            </div>
          </div>

          <div className="flex gap-4">
             <Link to="/support/tickets" className="flex-1 bg-slate-900 hover:bg-slate-800 text-white flex items-center justify-center gap-2 py-3.5 rounded-xl text-[15px] font-semibold shadow-sm transition-all active:scale-[0.98]">
                Open Ticket Queue <ArrowRight className="w-[18px] h-[18px]" />
             </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
