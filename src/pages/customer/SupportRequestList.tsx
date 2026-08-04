import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ticketService } from '../../services/mock/ticketService';
import { LoadingState } from '../../components/shared';
import { useAuth } from '../../store/authStore';
import { PageHeader } from '../../components/domain/PageHeader';
import { StatusBadge } from '../../components/domain/StatusBadge';
import { Card, CardContent } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Plus } from 'lucide-react';

export function SupportRequestList() {
  const [tickets, setTickets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const [statusFilter, setStatusFilter] = useState('');

  useEffect(() => {
    ticketService.listTickets({}, user).then(res => {
      if (res.ok) setTickets(res.data.items);
      setLoading(false);
    });
  }, [user]);

  if (loading) return <LoadingState />;

  const filtered = tickets.filter(t => statusFilter ? t.status === statusFilter : true);

  return (
    <div className="p-8 max-w-[1400px] mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <PageHeader 
          title="Support Requests" 
          description="Manage and track your technical support inquiries."
        />
        <Link to="/app/support/new">
          <Button className="flex items-center gap-2">
            <Plus className="w-4 h-4" /> New Request
          </Button>
        </Link>
      </div>
      
      <div className="flex items-center gap-4 bg-muted/50 p-4 rounded-xl border border-border">
        <select 
          className="bg-background border border-border text-sm font-medium text-foreground rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-ring w-48" 
          value={statusFilter} 
          onChange={e => setStatusFilter(e.target.value)}
        >
            <option value="">All Statuses</option>
            <option value="open">Open</option>
            <option value="resolved">Resolved</option>
        </select>
      </div>

      <Card>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-muted/30 border-b border-border">
                <tr>
                  <th className="p-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Ticket ID</th>
                  <th className="p-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Subject</th>
                  <th className="p-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Priority</th>
                  <th className="p-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Status</th>
                  <th className="p-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Updated At</th>
                </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filtered.map(t => (
                <tr key={t.id} className="hover:bg-muted/30 transition-colors">
                  <td className="p-4">
                    <Link to={`/app/support/${t.id}`} className="text-primary font-mono text-sm font-medium hover:underline">
                      {t.id}
                    </Link>
                  </td>
                  <td className="p-4 text-sm text-foreground font-medium">{t.subject}</td>
                  <td className="p-4"><StatusBadge status={t.priority} /></td>
                  <td className="p-4"><StatusBadge status={t.status} /></td>
                  <td className="p-4 text-sm text-muted-foreground">{new Date(t.updatedAt).toLocaleString()}</td>
                </tr>
              ))}
              {filtered.length === 0 && (
                  <tr>
                    <td colSpan={5} className="p-12 text-center text-sm text-muted-foreground">
                      No support requests found matching your criteria.
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
