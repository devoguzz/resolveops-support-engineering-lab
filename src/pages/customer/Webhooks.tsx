
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { webhookService } from '../../services/mock/webhookService';
import { useAuth } from '../../store/authStore';
import { LoadingState, StatusBadge } from '../../components/shared';

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
    <div className="p-6 flex flex-col gap-8 max-w-7xl mx-auto">
      <div className="flex justify-between items-center border-b border-slate-200 pb-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Webhooks</h1>
            <p className="text-sm text-slate-500 mt-1">Manage webhook endpoints and monitor delivery logs.</p>
          </div>
          <button className="btn btn-primary bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors shadow-sm">Add Endpoint</button>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200 bg-slate-50 flex justify-between items-center">
            <h3 className="font-semibold text-slate-800">Configured Endpoints</h3>
        </div>
        <table className="w-full text-left border-collapse">
          <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="p-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">URL</th>
                <th className="p-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
                <th className="p-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Events</th>
                <th className="p-4 text-xs font-semibold text-slate-500 uppercase tracking-wider text-right">Actions</th>
              </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
              <tr className="hover:bg-slate-50">
                  <td className="p-4 font-mono text-sm text-slate-700">https://api.northstar.test/webhooks/resolveops</td>
                  <td className="p-4"><StatusBadge status="active" /></td>
                  <td className="p-4 text-sm text-slate-600"><span className="bg-slate-100 px-2 py-1 rounded text-xs border border-slate-200">* (All Events)</span></td>
                  <td className="p-4 text-right"><button className="text-slate-400 hover:text-slate-600">...</button></td>
              </tr>
          </tbody>
        </table>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200 bg-slate-50 flex justify-between items-center">
            <h3 className="font-semibold text-slate-800">Recent Deliveries</h3>
            <div className="flex gap-2">
                <select className="text-sm border-slate-200 rounded-md py-1 px-2"><option>All Results</option><option>Failed</option></select>
            </div>
        </div>
        <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
            <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                    <th className="p-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">ID</th>
                    <th className="p-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Timestamp</th>
                    <th className="p-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Event</th>
                    <th className="p-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Attempt</th>
                    <th className="p-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Result</th>
                </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
                {deliveries.map(d => (
                <tr key={d.id} className="hover:bg-slate-50 cursor-pointer transition-colors">
                    <td className="p-4"><Link to={`/app/webhooks/${d.id}`} className="text-blue-600 hover:underline font-mono text-sm font-medium px-2 py-1 bg-blue-50 rounded">{d.id}</Link></td>
                    <td className="p-4 text-sm text-slate-500">{new Date(d.createdAt).toLocaleString()}</td>
                    <td className="p-4 text-sm text-slate-700 font-medium">{d.event}</td>
                    <td className="p-4 text-sm text-slate-500">{d.attempt}</td>
                    <td className="p-4">
                        <div className="flex items-center gap-2">
                            <StatusBadge status={d.result} />
                            <span className="text-xs text-slate-400 font-mono">HTTP {d.statusCode}</span>
                        </div>
                    </td>
                </tr>
                ))}
                {deliveries.length === 0 && (
                    <tr><td colSpan={5} className="p-8 text-center text-slate-500">No recent webhook deliveries.</td></tr>
                )}
            </tbody>
            </table>
        </div>
      </div>
    </div>
  );
}

