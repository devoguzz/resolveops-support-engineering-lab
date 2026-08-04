
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ticketService } from '../../services/mock/ticketService';
import { LoadingState, StatusBadge } from '../../components/shared';

import { useAuth } from '../../store/authStore';

export function TicketQueue() {
  const [tickets, setTickets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    ticketService.listTickets({}, user).then(res => {
      if (res.ok) setTickets(res.data.items);
      setLoading(false);
    });
  }, [user]);

  if (loading) return <LoadingState />;

  return (
    <div className="p-6 flex flex-col gap-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center border-b border-slate-200 pb-4">
        <div>
            <h1 className="text-2xl font-bold text-slate-900">Ticket Queue</h1>
            <p className="text-sm text-slate-500 mt-1">Manage global support tickets.</p>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="p-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Ticket ID</th>
                <th className="p-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Subject</th>
                <th className="p-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Customer</th>
                <th className="p-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Priority</th>
                <th className="p-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
                <th className="p-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Assignee</th>
                <th className="p-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">SLA</th>
              </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {tickets.map(t => (
              <tr key={t.id} className="hover:bg-slate-50 transition-colors">
                <td className="p-4"><Link to={`/support/tickets/${t.id}`} className="text-blue-600 font-mono text-sm font-medium hover:underline">{t.id}</Link></td>
                <td className="p-4 text-sm text-slate-900 font-medium">{t.subject}</td>
                <td className="p-4 text-sm font-mono text-slate-500">{t.organizationId}</td>
                <td className="p-4"><StatusBadge status={t.priority} /></td>
                <td className="p-4"><StatusBadge status={t.status} /></td>
                <td className="p-4 text-sm text-slate-600">{t.assigneeId || <span className="italic text-slate-400">Unassigned</span>}</td>
                <td className="p-4">
                   <div className="flex items-center gap-2">
                       <div className={`w-2 h-2 rounded-full ${t.priority === 'p1' ? 'bg-red-500' : 'bg-green-500'}`}></div>
                       <span className={`text-xs font-medium ${t.priority === 'p1' ? 'text-red-700' : 'text-slate-600'}`}>{t.priority === 'p1' ? 'Breaching in 2h' : 'OK'}</span>
                   </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
