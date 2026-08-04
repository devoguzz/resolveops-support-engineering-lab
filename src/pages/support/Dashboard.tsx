
import { Link } from 'react-router-dom';
import { useAuth } from '../../store/authStore';
import { motion } from 'framer-motion';
import { AlertTriangle, Clock, Server, Inbox, Activity, CheckCircle2, ChevronRight, BarChart2 } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const QUEUE_DATA = [
  { name: 'P1 - Critical', value: 3, color: '#ef4444' },
  { name: 'P2 - High', value: 14, color: '#f97316' },
  { name: 'P3 - Normal', value: 45, color: '#3b82f6' },
  { name: 'P4 - Low', value: 22, color: '#64748b' },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const itemVariants: any = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { type: 'spring', stiffness: 300, damping: 24 } }
};

export function Dashboard() {
  const { user } = useAuth();
  
  return (
    <motion.div 
      className="p-8 flex flex-col gap-8 max-w-[1400px] mx-auto"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div variants={itemVariants} className="flex justify-between items-end pb-6 border-b border-slate-200/60">
          <div>
              <h1 className="text-4xl font-extrabold tracking-tight text-slate-900">Support Console</h1>
              <p className="text-slate-500 mt-2 text-lg">Shift started. Welcome back, <span className="font-semibold text-slate-700">{user?.fullName}</span>. Here's your queue.</p>
          </div>
          <div className="hidden sm:flex gap-3">
             <button className="flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-700 font-semibold rounded-xl border border-emerald-200/50 shadow-sm transition-all hover:bg-emerald-100">
               <CheckCircle2 className="w-5 h-5" /> Clocked In
             </button>
          </div>
      </motion.div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div variants={itemVariants} whileHover={{ y: -4, transition: { duration: 0.2 } }} className="bg-white p-6 rounded-2xl border border-slate-200/75 shadow-sm relative overflow-hidden group">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-slate-500 text-sm font-bold uppercase tracking-widest">Unassigned Tickets</h3>
            <div className="p-2 bg-slate-100/50 rounded-lg text-slate-600"><Inbox className="w-5 h-5" /></div>
          </div>
          <p className="text-5xl font-black text-slate-900 tracking-tight">12</p>
          <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between text-sm text-slate-500 font-medium">
             <span>+3 since last hour</span>
             <Link to="/support/tickets" className="text-blue-600 hover:underline">Triage</Link>
          </div>
        </motion.div>
        
        <motion.div variants={itemVariants} whileHover={{ y: -4, transition: { duration: 0.2 } }} className="bg-red-50 p-6 rounded-2xl border border-red-200/50 shadow-sm relative overflow-hidden group">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-red-800 text-sm font-bold uppercase tracking-widest">High Priority (P1/P2)</h3>
            <div className="p-2 bg-red-100/50 rounded-lg text-red-600"><AlertTriangle className="w-5 h-5" /></div>
          </div>
          <p className="text-5xl font-black text-red-900 tracking-tight">3</p>
          <div className="mt-4 pt-4 border-t border-red-200/50 flex items-center justify-between text-sm text-red-700 font-medium">
             <span className="flex items-center gap-1"><Clock className="w-4 h-4"/> 1 approaching SLA</span>
          </div>
        </motion.div>

        <motion.div variants={itemVariants} whileHover={{ y: -4, transition: { duration: 0.2 } }} className="bg-amber-50 p-6 rounded-2xl border border-amber-200/50 shadow-sm relative overflow-hidden group">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-amber-800 text-sm font-bold uppercase tracking-widest">Active Incidents</h3>
            <div className="p-2 bg-amber-100/50 rounded-lg text-amber-600"><Activity className="w-5 h-5" /></div>
          </div>
          <p className="text-5xl font-black text-amber-900 tracking-tight">1</p>
          <div className="mt-4 pt-4 border-t border-amber-200/50 flex items-center justify-between text-sm text-amber-700 font-medium">
             <span>webhook-delivery-delay</span>
             <Link to="/support/incidents/INC-2026-008" className="hover:underline">View Incident</Link>
          </div>
        </motion.div>

        <motion.div variants={itemVariants} whileHover={{ y: -4, transition: { duration: 0.2 } }} className="bg-white p-6 rounded-2xl border border-slate-200/75 shadow-sm relative overflow-hidden group">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-slate-500 text-sm font-bold uppercase tracking-widest">System Health</h3>
            <div className="p-2 bg-slate-100/50 rounded-lg text-slate-600"><Server className="w-5 h-5" /></div>
          </div>
          <p className="text-5xl font-black text-slate-900 tracking-tight">99.8<span className="text-2xl text-slate-400">%</span></p>
          <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between text-sm text-slate-500 font-medium">
             <span>Global uptime (30d)</span>
          </div>
        </motion.div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-4">
        {/* Ticket Volume Chart */}
        <motion.div variants={itemVariants} className="bg-white rounded-3xl border border-slate-200/60 shadow-sm flex flex-col overflow-hidden">
          <div className="px-8 py-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
             <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2"><BarChart2 className="w-5 h-5 text-indigo-600"/> Current Backlog Volume</h3>
          </div>
          <div className="p-6 flex-1 h-[320px]">
             <ResponsiveContainer width="100%" height="100%">
               <BarChart data={QUEUE_DATA} layout="vertical" margin={{ top: 10, right: 30, left: 20, bottom: 5 }}>
                 <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                 <XAxis type="number" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                 <YAxis type="category" dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#334155', fontSize: 13, fontWeight: 600}} width={100} />
                 <Tooltip 
                   cursor={{fill: '#f8fafc'}}
                   contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)' }}
                 />
                 <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={32}>
                    {QUEUE_DATA.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                 </Bar>
               </BarChart>
             </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Quick Actions & Runbooks */}
        <motion.div variants={itemVariants} className="flex flex-col gap-6">
          <div className="bg-slate-900 text-white rounded-3xl border border-slate-800 shadow-xl p-8 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/20 rounded-full blur-3xl -z-10 pointer-events-none"></div>
            <h3 className="text-xl font-bold mb-2">Needs Attention</h3>
            <p className="text-slate-400 mb-8">The following items require immediate triage.</p>
            
            <div className="flex flex-col gap-3">
              <Link to="/support/tickets/SUP-1042" className="group flex items-center justify-between p-4 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 transition-colors">
                 <div>
                    <span className="inline-block px-2 py-1 bg-red-500/20 text-red-400 rounded text-xs font-bold uppercase mb-1">P1 - SLA Breach Risk</span>
                    <p className="font-semibold">Webhook delivery failing for NorthStar</p>
                 </div>
                 <ChevronRight className="w-5 h-5 text-slate-500 group-hover:text-white transition-colors" />
              </Link>
              
              <Link to="/support/incidents/INC-2026-008" className="group flex items-center justify-between p-4 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 transition-colors">
                 <div>
                    <span className="inline-block px-2 py-1 bg-amber-500/20 text-amber-400 rounded text-xs font-bold uppercase mb-1">Active Incident</span>
                    <p className="font-semibold">Review Webhook Dispatcher Latency</p>
                 </div>
                 <ChevronRight className="w-5 h-5 text-slate-500 group-hover:text-white transition-colors" />
              </Link>
            </div>
          </div>

          <div className="flex gap-4">
             <Link to="/support/tickets" className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white flex items-center justify-center gap-2 py-4 rounded-2xl font-bold shadow-lg shadow-indigo-200 transition-all hover:scale-[1.02]">
                Open Ticket Queue <ChevronRight className="w-5 h-5" />
             </Link>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
