import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { diagnosticService } from '../../services/mock/diagnosticService';
import { webhookService } from '../../services/mock/webhookService';
import { LoadingState, StatusBadge, Toast } from '../../components/shared';
import { useAuth } from '../../store/authStore';

export function CustomerWebhookDetail() {
  const { deliveryId } = useParams();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [retrying, setRetrying] = useState(false);
  const [toast, setToast] = useState('');

  const { user } = useAuth();

  useEffect(() => {
    diagnosticService.getWebhookDelivery(deliveryId!, user).then(res => {
      if (res.ok) setData(res.data);
      else setData(null);
      setLoading(false);
    });
  }, [deliveryId, user]);

  const handleRetry = async () => {
    setRetrying(true);
    const res = await webhookService.retryDelivery(deliveryId!, user);
    if (res.ok) {
      setData(res.data);
      setToast('Retry attempt triggered successfully');
      setTimeout(() => setToast(''), 3000);
    }
    setRetrying(false);
  };

  if (loading) return <LoadingState />;
  if (!data) return <div className="p-4 text-center">Webhook delivery not found</div>;

  return (
    <div className="flex flex-col gap-4">
      {toast && <Toast message={toast} type="success" />}
      
      <div>
        <Link to="/app/webhooks" className="text-sm text-muted hover:underline mb-2 inline-block">← Back to Webhooks</Link>
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-bold font-mono">Delivery: {data.id}</h1>
            <p className="text-sm text-muted mt-1">Created at: {new Date(data.createdAt).toLocaleString()}</p>
          </div>
          <div className="flex gap-2">
              <button onClick={handleRetry} disabled={retrying} className="btn btn-secondary">{retrying ? 'Retrying...' : 'Retry Delivery'}</button>
              <Link to={`/app/support/new?requestId=${data.requestId}`} className="btn btn-primary">Create Support Request</Link>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="card p-6 flex flex-col gap-3">
          <h3 className="font-semibold border-b pb-2">Overview</h3>
          <div><span className="text-muted block text-sm">Event</span><span className="font-mono">{data.event}</span></div>
          <div><span className="text-muted block text-sm">Result</span><StatusBadge status={data.result} /> HTTP {data.statusCode}</div>
          <div><span className="text-muted block text-sm">Request ID</span><span className="font-mono">{data.requestId}</span></div>
          <div><span className="text-muted block text-sm">Attempts</span><span>{data.attempt}</span></div>
        </div>
        
        {data.errorMessage && (
          <div className="card p-6 bg-red-50 border-red-200">
            <h3 className="font-semibold text-red-800 border-b border-red-200 pb-2 mb-2">Error Message</h3>
            <p className="text-red-700 font-mono text-sm">{data.errorMessage}</p>
          </div>
        )}
      </div>

      <div className="card p-0 overflow-hidden">
        <div className="p-4 bg-slate-50 border-b border-slate-200"><h3 className="font-semibold">Request Payload</h3></div>
        <div className="p-4 bg-slate-900 text-slate-300 font-mono text-sm overflow-auto">
          <pre>{JSON.stringify(data.requestPayload, null, 2)}</pre>
        </div>
      </div>
    </div>
  );
}
