import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { webhookService } from '../../services/mock/webhookService';
import { useAuth } from '../../store/authStore';
import { formatDate } from '../../lib/dates';
import { LoadingState } from '../../components/shared';
import { PageHeader } from '../../components/domain/PageHeader';
import { StatusBadge } from '../../components/domain/StatusBadge';
import { Card, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Plus } from 'lucide-react';

export function Webhooks() {
  const { user } = useAuth();
  const [deliveries, setDeliveries] = useState<any[]>([]);
  const [endpoints, setEndpoints] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    Promise.all([
      webhookService.listDeliveries({ organizationId: user?.organizationId }, user),
      webhookService.listEndpoints(user?.organizationId || '', user)
    ]).then(([deliveriesRes, endpointsRes]) => {
      if (deliveriesRes.ok) setDeliveries(deliveriesRes.data);
      if (endpointsRes.ok) setEndpoints(endpointsRes.data);
      setLoading(false);
    });
  }, [user]);

  const handleAddEndpoint = async () => {
    const url = prompt("Enter webhook URL (e.g. https://api.example.com/webhook):");
    if (!url) return;
    const eventsStr = prompt("Enter events comma-separated (e.g. ticket.created, or * for all):", "*");
    if (!eventsStr) return;
    const events = eventsStr.split(',').map(e => e.trim());
    const res = await webhookService.addEndpoint(user?.organizationId || '', url, events, user);
    if (res.ok) {
      setEndpoints([...endpoints, res.data]);
    } else {
      alert(res.error?.message || "Failed to add endpoint");
    }
  };

  const handleEditEndpoint = async (ep: any) => {
    const url = prompt("Edit webhook URL:", ep.url);
    if (!url) return;
    const res = await webhookService.editEndpoint(ep.id, { url }, user);
    if (res.ok) {
      setEndpoints(endpoints.map(e => e.id === ep.id ? res.data : e));
    } else {
      alert(res.error?.message || "Failed to edit endpoint");
    }
  };

  const handleToggleEndpoint = async (id: string) => {
    const res = await webhookService.toggleEndpoint(id, user);
    if (res.ok) {
      setEndpoints(endpoints.map(e => e.id === id ? res.data : e));
    } else {
      alert(res.error?.message || "Failed to toggle endpoint");
    }
  };

  const handleDeleteEndpoint = async (id: string) => {
    if (!confirm("Are you sure you want to delete this endpoint?")) return;
    const res = await webhookService.deleteEndpoint(id, user);
    if (res.ok) {
      setEndpoints(endpoints.filter(e => e.id !== id));
    } else {
      alert(res.error?.message || "Failed to delete endpoint");
    }
  };

  if (loading) return <LoadingState />;

  return (
    <div className="p-8 max-w-[1400px] mx-auto space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <PageHeader 
            title="Webhooks" 
            description="Manage webhook endpoints and monitor delivery logs."
          />
          {user?.role === 'customer_owner' && (
            <Button onClick={handleAddEndpoint} className="flex items-center gap-2">
              <Plus className="w-4 h-4" /> Add Endpoint
            </Button>
          )}
      </div>

      <Card>
        <CardHeader className="border-b border-border bg-muted/30 pb-4">
            <CardTitle className="text-base">Configured Endpoints</CardTitle>
        </CardHeader>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-muted/30 border-b border-border">
                <tr>
                  <th className="p-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">URL</th>
                  <th className="p-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Status</th>
                  <th className="p-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Events</th>
                  <th className="p-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider text-right">Actions</th>
                </tr>
            </thead>
            <tbody className="divide-y divide-border">
                {endpoints.map(ep => (
                  <tr key={ep.id} className="hover:bg-muted/30 transition-colors">
                      <td className="p-4 font-mono text-sm text-foreground font-medium">{ep.url}</td>
                      <td className="p-4"><StatusBadge status={ep.status} /></td>
                      <td className="p-4 text-sm text-muted-foreground">
                        <div className="flex gap-1 flex-wrap">
                          {(ep.events || ep.subscribedEvents || []).map((ev:string) => (
                            <span key={ev} className="bg-muted border border-border px-2 py-1 rounded-md text-xs font-medium text-foreground">{ev === '*' ? '* (All Events)' : ev}</span>
                          ))}
                        </div>
                      </td>
                      <td className="p-4 text-right">
                        {user?.role === 'customer_owner' && (
                          <div className="flex items-center justify-end gap-2">
                            <Button variant="ghost" size="sm" onClick={() => handleToggleEndpoint(ep.id)}>
                              {ep.status === 'active' ? 'Disable' : 'Enable'}
                            </Button>
                            <Button variant="ghost" size="sm" onClick={() => handleEditEndpoint(ep)}>
                              Edit
                            </Button>
                            <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive" onClick={() => handleDeleteEndpoint(ep.id)}>
                              Delete
                            </Button>
                          </div>
                        )}
                      </td>
                  </tr>
                ))}
                {endpoints.length === 0 && (
                  <tr>
                    <td colSpan={4} className="p-12 text-center text-sm text-muted-foreground">
                      No webhook endpoints configured.
                    </td>
                  </tr>
                )}
            </tbody>
          </table>
        </div>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between border-b border-border bg-muted/30 pb-4">
            <CardTitle className="text-base">Recent Deliveries</CardTitle>
            <div className="flex gap-2">
                <select className="bg-background border border-border text-sm font-medium text-foreground rounded-md py-1.5 px-3 focus:outline-none focus:ring-2 focus:ring-ring transition-all">
                  <option>All Results</option>
                  <option>Failed</option>
                </select>
            </div>
        </CardHeader>
        <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
            <thead className="bg-muted/30 border-b border-border">
                <tr>
                    <th className="p-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">ID</th>
                    <th className="p-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Timestamp</th>
                    <th className="p-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Event</th>
                    <th className="p-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Attempt</th>
                    <th className="p-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Result</th>
                </tr>
            </thead>
            <tbody className="divide-y divide-border">
                {deliveries.map(d => (
                <tr key={d.id} className="hover:bg-muted/30 cursor-pointer transition-colors">
                    <td className="p-4">
                      <Link to={`/app/webhooks/${d.id}`} className="text-primary hover:underline font-mono text-sm font-medium">
                        {d.id}
                      </Link>
                    </td>
                    <td className="p-4 text-sm text-muted-foreground">{formatDate(d.createdAt)}</td>
                    <td className="p-4 text-sm text-foreground font-medium">{d.event}</td>
                    <td className="p-4 text-sm text-muted-foreground font-mono">{d.attempt}</td>
                    <td className="p-4">
                        <div className="flex items-center gap-2">
                            <StatusBadge status={d.result} />
                            <span className="text-xs text-muted-foreground font-mono">HTTP {d.statusCode}</span>
                        </div>
                    </td>
                </tr>
                ))}
                {deliveries.length === 0 && (
                    <tr>
                      <td colSpan={5} className="p-12 text-center text-sm text-muted-foreground">
                        No recent webhook deliveries.
                      </td>
                    </tr>
                )}
            </tbody>
            </table>
        </div>
      </Card>
    </div>
  );
}
