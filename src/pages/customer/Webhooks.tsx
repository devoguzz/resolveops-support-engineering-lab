import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { webhookService } from '../../services/mock/webhookService';
import { useAuth } from '../../store/authStore';
import { LoadingState } from '../../components/shared';
import { PageHeader } from '../../components/domain/PageHeader';
import { StatusBadge } from '../../components/domain/StatusBadge';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Plus, MoreHorizontal } from 'lucide-react';

export function Webhooks() {
  const { user } = useAuth();
  const [deliveries, setDeliveries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    webhookService.listDeliveries({ organizationId: user?.organizationId }, user).then(res => {
      if (res.ok) setDeliveries(res.data);
      setLoading(false);
    });
  }, [user]);

  if (loading) return <LoadingState />;

  return (
    <div className="p-8 max-w-[1400px] mx-auto space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <PageHeader 
            title="Webhooks" 
            description="Manage webhook endpoints and monitor delivery logs."
          />
          <Button className="flex items-center gap-2">
            <Plus className="w-4 h-4" /> Add Endpoint
          </Button>
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
                <tr className="hover:bg-muted/30 transition-colors">
                    <td className="p-4 font-mono text-sm text-foreground font-medium">https://api.northstar.test/webhooks/resolveops</td>
                    <td className="p-4"><StatusBadge status="active" /></td>
                    <td className="p-4 text-sm text-muted-foreground">
                      <span className="bg-muted border border-border px-2 py-1 rounded-md text-xs font-medium text-foreground">* (All Events)</span>
                    </td>
                    <td className="p-4 text-right">
                      <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
                        <MoreHorizontal className="w-5 h-5" />
                      </Button>
                    </td>
                </tr>
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
                    <td className="p-4 text-sm text-muted-foreground">{new Date(d.createdAt).toLocaleString()}</td>
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
