import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ticketService } from '../../services/mock/ticketService';
import { LoadingState, StatusBadge } from '../../components/shared';
import { useAuth } from '../../store/authStore';

export function CustomerTicketDetail() {
  const { ticketId } = useParams();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const { user } = useAuth();

  useEffect(() => {
    ticketService.getTicket(ticketId!, user).then(res => {
      if (res.ok) {
         setData(res.data);
      } else {
         setData(null);
      }
      setLoading(false);
    });
  }, [ticketId, user]);

  if (loading) return <LoadingState />;
  if (!data) return <div className="p-8 text-center text-slate-500">Ticket not found</div>;

  return (
    <div className="p-6 flex flex-col gap-6 max-w-4xl mx-auto">
      <Link to="/app/support" className="text-sm text-blue-600 hover:underline self-start">&larr; Back to Requests</Link>
      
      <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">{data.subject}</h1>
            <p className="text-sm text-slate-500 mt-1">Ticket ID: <span className="font-mono bg-slate-100 px-1 py-0.5 rounded">{data.id}</span></p>
          </div>
          <div className="flex gap-2">
            <StatusBadge status={data.status} />
          </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 flex flex-col gap-4">
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
                <div className="flex justify-between mb-4 pb-4 border-b border-slate-100">
                    <div className="font-semibold text-slate-800">Jane Doe <span className="font-normal text-slate-500 text-sm ml-2">You</span></div>
                    <div className="text-sm text-slate-500">{new Date(data.createdAt).toLocaleString()}</div>
                </div>
                <p className="text-slate-700 whitespace-pre-wrap">{data.description}</p>
            </div>
            
            {/* Conversation mock */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
                <div className="flex justify-between mb-4 pb-4 border-b border-slate-100">
                    <div className="font-semibold text-blue-800">Support Agent <span className="font-normal text-blue-500 text-sm ml-2">ResolveOps Support</span></div>
                    <div className="text-sm text-slate-500">{new Date(data.updatedAt).toLocaleString()}</div>
                </div>
                <p className="text-slate-700 whitespace-pre-wrap">We are looking into the issue you reported. Our system detected a Webhook Signature Invalid error. Could you verify your HMAC secret?</p>
            </div>

            <div className="bg-slate-50 rounded-xl border border-slate-200 p-4">
                <textarea className="form-input w-full p-3 border rounded-lg mb-2" rows={3} placeholder="Reply to this ticket..."></textarea>
                <div className="flex justify-end"><button className="btn btn-primary bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium">Send Reply</button></div>
            </div>
        </div>
        
        <div className="flex flex-col gap-4">
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
                <h3 className="font-semibold text-slate-800 mb-4 border-b border-slate-100 pb-2">Ticket Details</h3>
                <div className="flex flex-col gap-3">
                    <div><span className="text-sm text-slate-500 block">Category</span><span className="font-medium text-slate-700">{data.category}</span></div>
                    <div><span className="text-sm text-slate-500 block">Impact</span><span className="font-medium text-slate-700 capitalize">{data.impact}</span></div>
                    {data.requestIds.length > 0 && (
                        <div>
                            <span className="text-sm text-slate-500 block">Linked Traces</span>
                            {data.requestIds.map((id:string) => (
                                <Link key={id} to={`/app/support/traces/${id}`} className="font-mono text-sm text-blue-600 hover:underline">{id}</Link>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
      </div>
    </div>
  );
}
