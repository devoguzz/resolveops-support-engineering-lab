import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../store/authStore';
import { teamService } from '../../services/mock/teamService';
import { webhookService } from '../../services/mock/webhookService';
import { ticketService } from '../../services/mock/ticketService';
import { activityService } from '../../services/mock/activityService';
import { LoadingState } from '../../components/shared';
import { Users, Activity, AlertCircle, LifeBuoy, ArrowRight, CheckCircle2, ShieldAlert, Clock, Terminal } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { PageHeader } from '../../components/domain/PageHeader';
import { MetricCard } from '../../components/domain/MetricCard';
import { StatusBadge } from '../../components/domain/StatusBadge';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';

const API_DATA = [
  { name: 'Mon', requests: 12000 },
  { name: 'Tue', requests: 19000 },
  { name: 'Wed', requests: 15000 },
  { name: 'Thu', requests: 22000 },
  { name: 'Fri', requests: 28000 },
  { name: 'Sat', requests: 14000 },
  { name: 'Sun', requests: 11000 },
];

// Helper to format Y-axis labels like 3k, 6k, 12k
const formatYAxis = (value: number) => {
  if (value === 0) return '0';
  return `${value / 1000}k`;
};

// Custom Tooltip for Recharts
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-card border border-border shadow-md p-3 rounded-lg">
        <p className="font-semibold text-foreground mb-1">{label}</p>
        <p className="text-primary font-bold">
          {payload[0].value.toLocaleString()} requests
        </p>
      </div>
    );
  }
  return null;
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
    <div className="p-8 max-w-[1400px] mx-auto space-y-8">
      <PageHeader 
        title="Overview" 
        description={`Welcome back, ${user?.fullName}. Here's what's happening in your workspace.`} 
      />
      
      {/* KPI Cards Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Link to="/app/team" className="block outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-xl">
          <MetricCard
            title="Active Users"
            value={metrics.users}
            icon={Users}
            trend={{ value: '+2%', positive: true }}
            footerText="vs last month"
          />
        </Link>
        <Link to="/app/activity" className="block outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-xl">
          <MetricCard
            title="API Requests Today"
            value="121k"
            icon={Activity}
            trend={{ value: '+14%', positive: true }}
            footerText="vs previous day"
          />
        </Link>
        <Link to="/app/webhooks" className="block outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-xl">
          <MetricCard
            title="Failed Webhooks"
            value={metrics.failedWebhooks}
            icon={AlertCircle}
            trend={metrics.failedWebhooks > 0 ? { value: 'Action needed', positive: false } : undefined}
          />
        </Link>
        <Link to="/app/support" className="block outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-xl">
          <MetricCard
            title="Open Tickets"
            value={metrics.openTickets}
            icon={LifeBuoy}
          />
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* API Usage Chart */}
        <Card className="lg:col-span-2 flex flex-col">
          <CardHeader className="flex flex-row items-center justify-between pb-2 border-b border-border">
            <div>
              <CardTitle className="text-base">API Traffic Volume</CardTitle>
              <p className="text-sm text-muted-foreground mt-1">Total requests processed over the last 7 days</p>
            </div>
            <select className="bg-background border border-border text-sm font-medium text-foreground rounded-md py-1.5 px-3 cursor-pointer outline-none focus:ring-2 focus:ring-ring">
               <option>Last 7 Days</option>
               <option>Last 30 Days</option>
            </select>
          </CardHeader>
          <CardContent className="flex-1 p-6 h-[340px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={API_DATA} margin={{ top: 20, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRequests" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--chart-1)" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="var(--chart-1)" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: 'hsl(var(--muted-foreground))', fontSize: 12, fontWeight: 500}} dy={10} />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tickFormatter={formatYAxis}
                  tick={{fill: 'hsl(var(--muted-foreground))', fontSize: 12, fontWeight: 500}} 
                  dx={-10} 
                />
                <Tooltip content={<CustomTooltip />} />
                <Area 
                  type="monotone" 
                  dataKey="requests" 
                  stroke="var(--chart-1)" 
                  strokeWidth={2} 
                  fillOpacity={1} 
                  fill="url(#colorRequests)" 
                  activeDot={{ r: 4, strokeWidth: 2, stroke: 'var(--background)', fill: 'var(--chart-1)' }} 
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Platform Status */}
        <Card className="flex flex-col">
          <CardHeader className="border-b border-border bg-muted/30 pb-4">
            <h3 className="text-sm font-bold tracking-widest uppercase text-muted-foreground flex items-center gap-2">
               <ShieldAlert className="w-4 h-4 text-warning" /> Platform Status
            </h3>
          </CardHeader>
          <CardContent className="flex-1 p-6 flex flex-col justify-center">
             <div className="flex items-center gap-3 mb-4">
                 <StatusBadge status="degraded" />
                 <h4 className="text-lg font-bold text-foreground">Degraded Performance</h4>
             </div>
             <p className="text-muted-foreground text-sm leading-relaxed mb-8">
               We are actively investigating intermittent delays in webhook deliveries across the EU-West regions. Core APIs remain fully functional.
             </p>
             
             <div className="mt-auto flex flex-col gap-3">
               <div className="flex items-center justify-between text-xs font-mono text-muted-foreground border-b border-border pb-2">
                 <span>UPDATED</span>
                 <span>2 MINS AGO</span>
               </div>
               <Button variant="outline" className="w-full">
                  Subscribe to Updates
               </Button>
             </div>
          </CardContent>
        </Card>
      </div>

      {/* Activity Logs */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between border-b border-border bg-muted/30 pb-4">
            <CardTitle className="text-base flex items-center gap-2">
               <Terminal className="w-4 h-4 text-muted-foreground" /> Audit & Activity Log
            </CardTitle>
            <Link to="/app/activity" className="text-sm font-semibold text-primary hover:underline flex items-center gap-1 group">
               View Full Logs <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform"/>
            </Link>
        </CardHeader>
        <div className="divide-y divide-border">
            {activities.length > 0 ? activities.map((act) => (
              <div 
                key={act.id} 
                className="px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between hover:bg-muted/30 transition-colors"
              >
                  <div className="flex items-center gap-4">
                      <div className="shrink-0">
                         {act.result === 'success' ? (
                           <CheckCircle2 className="w-5 h-5 text-success" />
                         ) : (
                           <AlertCircle className="w-5 h-5 text-destructive" />
                         )}
                      </div>
                      <div>
                          <p className="text-sm font-medium text-foreground">{act.description}</p>
                          <div className="flex items-center gap-2 mt-1">
                             <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest">{act.resource}</span>
                             <span className="w-1 h-1 rounded-full bg-border"></span>
                             <span className="text-xs font-medium text-muted-foreground capitalize">{act.action}</span>
                          </div>
                      </div>
                  </div>
                  <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground mt-3 sm:mt-0">
                     <Clock className="w-3.5 h-3.5" />
                     <span className="tabular-nums">{new Date(act.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}</span>
                  </div>
              </div>
            )) : (
              <div className="p-12 text-center text-sm text-muted-foreground">No recent activity found.</div>
            )}
        </div>
      </Card>
    </div>
  );
}


