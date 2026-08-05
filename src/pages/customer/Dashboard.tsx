import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../store/authStore';
import { teamService } from '../../services/mock/teamService';
import { webhookService } from '../../services/mock/webhookService';
import { ticketService } from '../../services/mock/ticketService';
import { activityService } from '../../services/mock/activityService';
import { diagnosticService } from '../../services/mock/diagnosticService';
import { LoadingState } from '../../components/shared';
import { Users, Activity, AlertCircle, LifeBuoy, ArrowRight, CheckCircle2, ShieldAlert, Clock, Terminal } from 'lucide-react';

import { PageHeader } from '../../components/domain/PageHeader';
import { MetricCard } from '../../components/domain/MetricCard';
import { StatusBadge } from '../../components/domain/StatusBadge';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { AnimatedMetric } from '../../components/motion/AnimatedMetric';
import { LiveMetricChart } from '../../components/charts/LiveMetricChart';
import { BorderBeam } from '../../components/ui/border-beam';



export function Dashboard() {
  const { user } = useAuth();
  
  const [metrics, setMetrics] = useState({
    users: 0,
    failedWebhooks: 0,
    openTickets: 0
  });
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [activities, setActivities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    if (!user) return;
    Promise.all([
      teamService.listMembers((user.organizationId || ''), user),
      webhookService.listDeliveries({ organizationId: (user.organizationId || '') }, user),
      ticketService.listTickets({ status: 'open' }, user),
      activityService.listActivity((user.organizationId || ''), {}, user),
      diagnosticService.getCustomerDashboardMetrics(user.organizationId || '')
    ]).then(([membersRes, webhooksRes, ticketsRes, activityRes, dashboardRes]) => {
      setMetrics({
        users: membersRes.ok ? membersRes.data.filter(m => m.status === 'active').length : 0,
        failedWebhooks: webhooksRes.ok ? webhooksRes.data.filter((w:any) => w.result === 'failed').length : 0,
        openTickets: ticketsRes.ok ? ticketsRes.data.total : 0
      });
      if (activityRes.ok) {
        setActivities(activityRes.data.slice(0, 5));
      }
      if (dashboardRes.ok) {
        setDashboardData(dashboardRes.data);
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
            value={<AnimatedMetric value={metrics.users} />}
            icon={Users}
            trend={{ value: '+2%', positive: true }}
            footerText="vs last month"
          />
        </Link>
        <Link to="/app/activity" className="block outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-xl">
          <MetricCard
            title="API Requests Today"
            value={
              <AnimatedMetric 
                value={dashboardData?.apiRequestsToday ? (dashboardData.apiRequestsToday / 1000).toFixed(1) : 0} 
                suffix="k" 
                formatNumber={false} 
              />
            }
            icon={Activity}
            trend={dashboardData?.apiTrend}
            footerText="vs previous day"
          />
        </Link>
        <Link to="/app/webhooks" className="block outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-xl">
          <MetricCard
            title="Failed Webhooks"
            value={<AnimatedMetric value={metrics.failedWebhooks} />}
            icon={AlertCircle}
            trend={metrics.failedWebhooks > 0 ? { value: 'Action needed', positive: false } : undefined}
          />
          {metrics.failedWebhooks > 0 && <BorderBeam colorFrom="var(--color-destructive)" colorTo="var(--color-warning)" />}
        </Link>
        <Link to="/app/support" className="block outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-xl">
          <MetricCard
            title="Open Tickets"
            value={<AnimatedMetric value={metrics.openTickets} />}
            icon={LifeBuoy}
          />
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* API Usage Chart */}
        <div className="lg:col-span-2">
          <LiveMetricChart 
            title="System Telemetry & Ingress"
            description="Aggregated webhook and API traffic trends (trailing 7-day volume)"
            data={(dashboardData?.chartData || []).map((d: any, idx: number, arr: any[]) => {
              const date = new Date()
              date.setDate(date.getDate() - (arr.length - 1 - idx))
              return {
                date: date.toISOString(),
                value: d.requests
              }
            })}
            height={340}
          />
        </div>

        {/* Platform Status */}
        <Card className="flex flex-col relative overflow-hidden">
          <CardHeader className="border-b border-border bg-muted/30 pb-4">
            <h3 className="text-sm font-bold tracking-widest uppercase text-muted-foreground flex items-center gap-2">
               {dashboardData?.platformStatus.status === 'degraded' ? <ShieldAlert className="w-4 h-4 text-warning" /> : <CheckCircle2 className="w-4 h-4 text-success" />} 
               Platform Status
            </h3>
          </CardHeader>
          <CardContent className="flex-1 p-6 flex flex-col justify-center">
             <div className="flex items-center gap-3 mb-4">
                 <StatusBadge status={dashboardData?.platformStatus.status || 'active'} />
                 <h4 className="text-lg font-bold text-foreground">{dashboardData?.platformStatus.title}</h4>
             </div>
             <p className="text-muted-foreground text-sm leading-relaxed mb-8">
               {dashboardData?.platformStatus.description}
             </p>
             
             <div className="mt-auto flex flex-col gap-3">
               <div className="flex items-center justify-between text-xs font-mono text-muted-foreground border-b border-border pb-2">
                 <span>UPDATED</span>
                 <span>{dashboardData?.platformStatus.updated}</span>
               </div>
               <Button variant="outline" className="w-full">
                  Subscribe to Updates
               </Button>
             </div>
          </CardContent>
          {dashboardData?.platformStatus.status === 'degraded' && (
            <BorderBeam colorFrom="var(--color-warning)" colorTo="var(--color-primary)" duration={20} />
          )}
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


