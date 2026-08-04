import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../store/authStore';
import { teamService } from '../../services/mock/teamService';
import { webhookService } from '../../services/mock/webhookService';
import { ticketService } from '../../services/mock/ticketService';
import { activityService } from '../../services/mock/activityService';
import { LoadingState } from '../../components/shared';
import { motion } from 'framer-motion';
import { Users, Activity, AlertCircle, LifeBuoy, ArrowRight, CheckCircle2, ShieldAlert, Cpu } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const API_DATA = [
  { name: 'Mon', requests: 12000 },
  { name: 'Tue', requests: 19000 },
  { name: 'Wed', requests: 15000 },
  { name: 'Thu', requests: 22000 },
  { name: 'Fri', requests: 28000 },
  { name: 'Sat', requests: 14000 },
  { name: 'Sun', requests: 11000 },
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
  
  const [metrics, setMetrics] = useState({
    users: 0,
    failedWebhooks: 0,
    openTickets: 0
  });
  const [activities, setActivities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    if (!user) return;
    Promise.all([
      teamService.listMembers((user.organizationId || ''), user),
      webhookService.listDeliveries({ organizationId: (user.organizationId || '') }, user),
      ticketService.listTickets({ status: 'open' }, user),
      activityService.listActivity((user.organizationId || ''), {}, user)
    ]).then(([membersRes, webhooksRes, ticketsRes, activityRes]) => {
      setMetrics({
        users: membersRes.ok ? membersRes.data.filter(m => m.status === 'active').length : 0,
        failedWebhooks: webhooksRes.ok ? webhooksRes.data.filter((w:any) => w.result === 'failed').length : 0,
        openTickets: ticketsRes.ok ? ticketsRes.data.total : 0
      });
      if (activityRes.ok) {
        setActivities(activityRes.data.slice(0, 5));
      }
      setLoading(false);
    });
  }, [user]);

  if (loading) return <LoadingState />;

  return (
    <motion.div 
      className="p-8 flex flex-col gap-8 max-w-[1400px] mx-auto"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div variants={itemVariants} className="flex justify-between items-end pb-6 border-b border-slate-200/60">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight text-slate-900">Overview</h1>
          <p className="text-slate-500 mt-2 text-lg">Welcome back, <span className="font-semibold text-slate-700">{user?.fullName}</span>. Here's what's happening today.</p>
        </div>
        <div className="hidden sm:block">
          <div className="flex items-center gap-2 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100/50 px-4 py-2 rounded-xl shadow-sm">
            <Cpu className="w-5 h-5 text-blue-600" />
            <span className="text-sm font-semibold text-blue-900 uppercase tracking-wider">Enterprise Plan</span>
          </div>
        </div>
      </motion.div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        <motion.div variants={itemVariants} whileHover={{ y: -4, transition: { duration: 0.2 } }} className="bg-white p-6 rounded-2xl border border-slate-200/75 shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)] relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-bl-full -z-10 transition-transform group-hover:scale-110"></div>
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-slate-500 text-sm font-bold uppercase tracking-widest">Active Users</h3>
            <div className="p-2 bg-blue-100/50 rounded-lg text-blue-600"><Users className="w-5 h-5" /></div>
          </div>
          <p className="text-5xl font-black text-slate-900 tracking-tight">{metrics.users}</p>
          <Link to="/app/team" className="inline-flex items-center gap-1 text-blue-600 text-sm hover:text-blue-800 mt-6 font-semibold group-hover:underline">Manage Team <ArrowRight className="w-4 h-4" /></Link>
        </motion.div>
        
        <motion.div variants={itemVariants} whileHover={{ y: -4, transition: { duration: 0.2 } }} className="bg-white p-6 rounded-2xl border border-slate-200/75 shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)] relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50 rounded-bl-full -z-10 transition-transform group-hover:scale-110"></div>
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-slate-500 text-sm font-bold uppercase tracking-widest">API Requests</h3>
            <div className="p-2 bg-indigo-100/50 rounded-lg text-indigo-600"><Activity className="w-5 h-5" /></div>
          </div>
          <p className="text-5xl font-black text-slate-900 tracking-tight">121k</p>
          <Link to="/app/activity" className="inline-flex items-center gap-1 text-indigo-600 text-sm hover:text-indigo-800 mt-6 font-semibold group-hover:underline">View Traffic Logs <ArrowRight className="w-4 h-4" /></Link>
        </motion.div>

        <motion.div variants={itemVariants} whileHover={{ y: -4, transition: { duration: 0.2 } }} className="bg-white p-6 rounded-2xl border border-red-200/50 shadow-[0_2px_10px_-3px_rgba(220,38,38,0.1)] relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-red-50 rounded-bl-full -z-10 transition-transform group-hover:scale-110"></div>
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-red-600 text-sm font-bold uppercase tracking-widest">Failed Webhooks</h3>
            <div className="p-2 bg-red-100/50 rounded-lg text-red-600"><AlertCircle className="w-5 h-5" /></div>
          </div>
          <p className="text-5xl font-black text-red-700 tracking-tight">{metrics.failedWebhooks}</p>
          <Link to="/app/webhooks" className="inline-flex items-center gap-1 text-red-600 text-sm hover:text-red-800 mt-6 font-semibold group-hover:underline">Investigate Failures <ArrowRight className="w-4 h-4" /></Link>
        </motion.div>
        
        <motion.div variants={itemVariants} whileHover={{ y: -4, transition: { duration: 0.2 } }} className="bg-white p-6 rounded-2xl border border-sky-200/50 shadow-[0_2px_10px_-3px_rgba(2,132,199,0.1)] relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-sky-50 rounded-bl-full -z-10 transition-transform group-hover:scale-110"></div>
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-sky-700 text-sm font-bold uppercase tracking-widest">Open Tickets</h3>
            <div className="p-2 bg-sky-100/50 rounded-lg text-sky-600"><LifeBuoy className="w-5 h-5" /></div>
          </div>
          <p className="text-5xl font-black text-sky-900 tracking-tight">{metrics.openTickets}</p>
          <Link to="/app/support" className="inline-flex items-center gap-1 text-sky-700 text-sm hover:text-sky-800 mt-6 font-semibold group-hover:underline">View Ticket Queue <ArrowRight className="w-4 h-4" /></Link>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-4">
        {/* API Usage Chart */}
        <motion.div variants={itemVariants} className="lg:col-span-2 bg-white rounded-3xl border border-slate-200/60 shadow-sm flex flex-col overflow-hidden">
          <div className="px-8 py-6 border-b border-slate-100 flex justify-between items-center">
            <div>
               <h3 className="text-lg font-bold text-slate-900">API Traffic Volume</h3>
               <p className="text-sm text-slate-500">Total requests over the last 7 days</p>
            </div>
            <select className="bg-slate-50 border-none text-sm font-medium text-slate-700 rounded-lg py-2 px-4 cursor-pointer hover:bg-slate-100 transition-colors focus:ring-0">
               <option>Last 7 Days</option>
               <option>Last 30 Days</option>
            </select>
          </div>
          <div className="p-6 flex-1 h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={API_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRequests" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#4f46e5" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} dx={-10} />
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)' }}
                  labelStyle={{ fontWeight: 'bold', color: '#0f172a' }}
                />
                <Area type="monotone" dataKey="requests" stroke="#4f46e5" strokeWidth={3} fillOpacity={1} fill="url(#colorRequests)" activeDot={{ r: 6, strokeWidth: 0, fill: '#4f46e5' }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        <div className="flex flex-col gap-8">
          {/* System Status Slider equivalent */}
          <motion.div variants={itemVariants} className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl border border-slate-700 shadow-xl overflow-hidden text-white flex flex-col relative">
             <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl -z-10"></div>
             <div className="px-8 py-6 border-b border-slate-700/50">
                <h3 className="text-lg font-bold flex items-center gap-2"><ShieldAlert className="w-5 h-5 text-amber-400" /> Platform Status</h3>
             </div>
             <div className="p-8 flex-1 flex flex-col justify-center relative">
                 <div className="flex items-center gap-4 mb-4">
                     <span className="relative flex h-4 w-4">
                       <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                       <span className="relative inline-flex rounded-full h-4 w-4 bg-amber-500"></span>
                     </span>
                     <h4 className="text-xl font-bold tracking-tight">Degraded Performance</h4>
                 </div>
                 <p className="text-slate-300 text-sm leading-relaxed mb-8">We are actively investigating intermittent delays in webhook deliveries across the EU-West regions. Core APIs remain fully functional.</p>
                 <a href="#" className="mt-auto inline-flex justify-center items-center px-4 py-2.5 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl text-sm font-semibold transition-all hover:scale-[1.02]">
                    Subscribe to Updates
                 </a>
             </div>
          </motion.div>
        </div>
      </div>

      {/* Activity Logs */}
      <motion.div variants={itemVariants} className="bg-white rounded-3xl border border-slate-200/60 shadow-sm overflow-hidden flex flex-col mt-4">
        <div className="px-8 py-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
            <h3 className="text-lg font-bold text-slate-900">Audit & Activity Log</h3>
            <Link to="/app/activity" className="text-sm font-semibold text-blue-600 hover:text-blue-800 transition-colors flex items-center gap-1">View Full Logs <ArrowRight className="w-4 h-4"/></Link>
        </div>
        <div className="divide-y divide-slate-100 flex-1">
            {activities.length > 0 ? activities.map((act, i) => (
              <motion.div 
                initial={{ opacity: 0, x: -20 }} 
                animate={{ opacity: 1, x: 0 }} 
                transition={{ delay: i * 0.1 }}
                key={act.id} 
                className="px-8 py-5 flex items-center justify-between hover:bg-slate-50/80 transition-colors"
              >
                  <div className="flex items-center gap-4">
                      <div className={`p-2 rounded-full ${act.result === 'success' ? 'bg-emerald-100 text-emerald-600' : 'bg-red-100 text-red-600'}`}>
                         {act.result === 'success' ? <CheckCircle2 className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
                      </div>
                      <div>
                          <p className="text-sm font-bold text-slate-900">{act.description}</p>
                          <p className="text-xs font-medium text-slate-500 mt-0.5 capitalize">Resource: {act.resource} • Action: {act.action}</p>
                      </div>
                  </div>
                  <span className="text-xs font-semibold text-slate-400 bg-slate-100 px-3 py-1 rounded-full">{new Date(act.timestamp).toLocaleTimeString()}</span>
              </motion.div>
            )) : (
              <div className="p-12 text-center text-slate-500 font-medium">No recent activity found.</div>
            )}
        </div>
      </motion.div>
    </motion.div>
  );
}

