import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../store/authStore';
import { teamService } from '../../services/mock/teamService';
import { webhookService } from '../../services/mock/webhookService';
import { ticketService } from '../../services/mock/ticketService';
import { activityService } from '../../services/mock/activityService';
import { LoadingState } from '../../components/shared';

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

  return <div className="p-6 flex flex-col gap-6 max-w-7xl mx-auto">
    <div className="flex justify-between items-end border-b border-slate-200 pb-4">
        <div>
            <h1 className="text-3xl font-bold text-slate-900">Dashboard</h1>
            <p className="text-slate-500 mt-1">Welcome back, {user?.fullName}. Here is your organization's overview.</p>
        </div>
        <div className="text-right">
            <span className="text-sm font-medium text-purple-700 bg-purple-100 px-3 py-1 rounded-full border border-purple-200 uppercase tracking-wide">Enterprise Plan</span>
        </div>
    </div>
    
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col">
        <h3 className="text-slate-500 text-sm font-medium mb-2 uppercase tracking-wider">Active Users</h3>
        <p className="text-4xl font-light text-slate-900">{metrics.users}</p>
        <Link to="/app/team" className="text-blue-600 text-sm hover:underline mt-auto pt-4 font-medium">Manage Team &rarr;</Link>
      </div>
      
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col">
        <h3 className="text-slate-500 text-sm font-medium mb-2 uppercase tracking-wider">API Requests (Today)</h3>
        <p className="text-4xl font-light text-slate-900">12,450</p>
        <Link to="/app/activity" className="text-blue-600 text-sm hover:underline mt-auto pt-4 font-medium">View Logs &rarr;</Link>
      </div>

      <div className="bg-red-50 p-6 rounded-xl border border-red-200 shadow-sm flex flex-col">
        <h3 className="text-red-800 text-sm font-medium mb-2 uppercase tracking-wider">Failed Webhooks</h3>
        <p className="text-4xl font-light text-red-900">{metrics.failedWebhooks}</p>
        <Link to="/app/webhooks" className="text-red-700 text-sm hover:underline mt-auto pt-4 font-medium">Investigate Failure &rarr;</Link>
      </div>
      
      <div className="bg-blue-50 p-6 rounded-xl border border-blue-200 shadow-sm flex flex-col">
        <h3 className="text-blue-800 text-sm font-medium mb-2 uppercase tracking-wider">Open Tickets</h3>
        <p className="text-4xl font-light text-blue-900">{metrics.openTickets}</p>
        <Link to="/app/support" className="text-blue-700 text-sm hover:underline mt-auto pt-4 font-medium">View Queue &rarr;</Link>
      </div>
    </div>

    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-4">
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
            <div className="px-6 py-4 border-b border-slate-100 bg-slate-50">
                <h3 className="font-semibold text-slate-800">Recent Activity</h3>
            </div>
            <div className="divide-y divide-slate-100 flex-1">
                {activities.map(act => (
                  <div key={act.id} className="px-6 py-4 flex items-center justify-between hover:bg-slate-50">
                      <div>
                          <p className="text-sm font-medium text-slate-900">{act.description}</p>
                          <p className="text-xs text-slate-500 mt-1 capitalize">Result: {act.result}</p>
                      </div>
                      <span className="text-xs text-slate-400">{new Date(act.timestamp).toLocaleString()}</span>
                  </div>
                ))}
            </div>
            <div className="px-6 py-3 border-t border-slate-100 bg-slate-50 mt-auto">
                <Link to="/app/activity" className="text-sm text-blue-600 font-medium hover:underline">View all activity &rarr;</Link>
            </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
            <div className="px-6 py-4 border-b border-slate-100 bg-slate-50">
                <h3 className="font-semibold text-slate-800">System Status</h3>
            </div>
            <div className="p-6 flex-1 flex flex-col justify-center items-center text-center">
                <div className="w-16 h-16 rounded-full bg-amber-100 flex items-center justify-center mb-4 border-4 border-amber-50">
                    <div className="w-8 h-8 rounded-full bg-amber-500 animate-pulse"></div>
                </div>
                <h4 className="text-lg font-medium text-slate-900 mb-2">Degraded Performance</h4>
                <p className="text-sm text-slate-500 mb-6">We are currently investigating webhook delivery delays across all regions.</p>
                <a href="#" className="btn btn-secondary w-full text-sm">View Status Page</a>
            </div>
        </div>
    </div>
  </div>;
}

