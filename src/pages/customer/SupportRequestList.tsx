
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ticketService } from '../../services/mock/ticketService';
import { LoadingState, StatusBadge } from '../../components/shared';
import { useAuth } from '../../store/authStore';

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
  }, []);

  if (loading) return <LoadingState />;

  const filtered = tickets.filter(t => statusFilter ? t.status === statusFilter : true);

  return (
    <div className="p-6 flex flex-col gap-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center border-b border-slate-200 pb-4">
        <div>
            <h1 className="text-2xl font-bold text-slate-900">Support Requests</h1>
            <p className="text-sm text-slate-500 mt-1">Manage and track your technical support inquiries.</p>
        </div>
        <Link to="/app/support/new" className="btn btn-primary bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium shadow-sm">New Request</Link>
      </div>
      
      <div className="flex gap-4 mb-2 bg-slate-50 p-4 rounded-lg border border-slate-200">
        <select className="form-input w-48 px-4 py-2 border rounded-md" value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
            <option value="">All Statuses</option>
            <option value="open">Open</option>
            <option value="resolved">Resolved</option>
        </select>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="p-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Ticket ID</th>
                <th className="p-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Subject</th>
                <th className="p-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Priority</th>
                <th className="p-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
                <th className="p-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Updated At</th>
              </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filtered.map(t => (
              <tr key={t.id} className="hover:bg-slate-50 transition-colors">
                <td className="p-4"><Link to={`/app/support/${t.id}`} className="text-blue-600 font-mono text-sm font-medium hover:underline">{t.id}</Link></td>
                <td className="p-4 text-sm text-slate-900 font-medium">{t.subject}</td>
                <td className="p-4"><StatusBadge status={t.priority} /></td>
                <td className="p-4"><StatusBadge status={t.status} /></td>
                <td className="p-4 text-sm text-slate-500">{new Date(t.updatedAt).toLocaleString()}</td>
              </tr>
            ))}
            {filtered.length === 0 && (
                <tr><td colSpan={5} className="p-8 text-center text-slate-500">No support requests found matching your criteria.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

