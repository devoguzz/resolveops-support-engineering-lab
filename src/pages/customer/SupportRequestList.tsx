import { useEffect, useState, useMemo } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { ticketService } from '../../services/mock/ticketService';
import { LoadingState } from '../../components/shared';
import { useAuth } from '../../store/authStore';
import { PageHeader } from '../../components/domain/PageHeader';
import { StatusBadge } from '../../components/domain/StatusBadge';
import { Card } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Plus, Search, FilterX } from 'lucide-react';
import { formatDate } from '../../lib/dates';

export function SupportRequestList() {
  const [tickets, setTickets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();
  
  const [searchParams, setSearchParams] = useSearchParams();
  const statusFilter = searchParams.get('status') || '';
  const priorityFilter = searchParams.get('priority') || '';
  const categoryFilter = searchParams.get('category') || '';
  const searchFilter = searchParams.get('search') || '';
  const sortFilter = searchParams.get('sort') || 'newest';

  const updateParam = (key: string, value: string) => {
    const newParams = new URLSearchParams(searchParams);
    if (value) newParams.set(key, value);
    else newParams.delete(key);
    setSearchParams(newParams);
  };

  const clearFilters = () => {
    setSearchParams(new URLSearchParams());
  };

  useEffect(() => {
    ticketService.listTickets({}, user).then(res => {
      if (res.ok) {
        setTickets(res.data.items);
      } else {
        setError(res.error?.message || 'Failed to load tickets');
      }
      setLoading(false);
    });
  }, [user]);

  const filtered = useMemo(() => {
    let result = tickets;
    if (statusFilter) result = result.filter(t => t.status === statusFilter);
    if (priorityFilter) result = result.filter(t => t.priority === priorityFilter);
    if (categoryFilter) result = result.filter(t => t.category === categoryFilter);
    if (searchFilter) {
      const q = searchFilter.toLowerCase();
      result = result.filter(t => t.subject.toLowerCase().includes(q) || t.id.toLowerCase().includes(q));
    }
    
    result.sort((a, b) => {
      const dateA = new Date(a.updatedAt).getTime();
      const dateB = new Date(b.updatedAt).getTime();
      if (sortFilter === 'newest') return dateB - dateA;
      if (sortFilter === 'oldest') return dateA - dateB;
      return 0;
    });

    return result;
  }, [tickets, statusFilter, priorityFilter, categoryFilter, searchFilter, sortFilter]);

  if (loading) return <LoadingState />;
  if (error) return <div className="p-12 text-center text-destructive font-medium">{error}</div>;

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
      
      <div className="flex flex-wrap items-center gap-4 bg-muted/50 p-4 rounded-xl border border-border">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input 
            type="text"
            placeholder="Search subject or ID..."
            className="w-full bg-background border border-border text-sm font-medium text-foreground rounded-md py-2 pl-9 pr-3 focus:outline-none focus:ring-2 focus:ring-ring"
            value={searchFilter}
            onChange={e => updateParam('search', e.target.value)}
          />
        </div>
        <select 
          className="bg-background border border-border text-sm font-medium text-foreground rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-ring w-40" 
          value={statusFilter} 
          onChange={e => updateParam('status', e.target.value)}
        >
            <option value="">All Statuses</option>
            <option value="open">Open</option>
            <option value="investigating">Investigating</option>
            <option value="resolved">Resolved</option>
        </select>
        <select 
          className="bg-background border border-border text-sm font-medium text-foreground rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-ring w-40" 
          value={priorityFilter} 
          onChange={e => updateParam('priority', e.target.value)}
        >
            <option value="">All Priorities</option>
            <option value="p1">P1 - Critical</option>
            <option value="p2">P2 - High</option>
            <option value="p3">P3 - Normal</option>
        </select>
        <select 
          className="bg-background border border-border text-sm font-medium text-foreground rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-ring w-40" 
          value={sortFilter} 
          onChange={e => updateParam('sort', e.target.value)}
        >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
        </select>
        {(statusFilter || priorityFilter || categoryFilter || searchFilter || sortFilter !== 'newest') && (
          <Button variant="ghost" onClick={clearFilters} className="text-muted-foreground hover:text-foreground">
            <FilterX className="w-4 h-4 mr-2" /> Clear
          </Button>
        )}
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
                  <td className="p-4 text-sm text-muted-foreground">{formatDate(t.updatedAt)}</td>
                </tr>
              ))}
              {filtered.length === 0 && (
                  <tr>
                    <td colSpan={5} className="p-12 text-center text-sm text-muted-foreground">
                      <div className="flex flex-col items-center justify-center space-y-3">
                        <p>No support requests found matching your criteria.</p>
                        {(statusFilter || priorityFilter || categoryFilter || searchFilter) && (
                          <Button variant="outline" onClick={clearFilters}>Clear Filters</Button>
                        )}
                      </div>
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
