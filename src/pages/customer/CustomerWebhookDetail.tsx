import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { diagnosticService } from '../../services/mock/diagnosticService';
import { webhookService } from '../../services/mock/webhookService';
import { LoadingState, Toast } from '../../components/shared';
import { useAuth } from '../../store/authStore';
import { StatusBadge } from '../../components/domain/StatusBadge';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { ArrowLeft, RefreshCw, AlertCircle, FileJson } from 'lucide-react';

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
  if (!data) return <div className="p-12 text-center text-sm text-muted-foreground">Webhook delivery not found</div>;

  return (
    <div className="p-8 max-w-[1400px] mx-auto space-y-6">
      {toast && <Toast message={toast} type="success" />}
      
      <div>
        <Link to="/app/webhooks" className="inline-flex items-center text-sm font-medium text-primary hover:underline gap-1 mb-4">
          <ArrowLeft className="w-4 h-4" /> Back to Webhooks
        </Link>
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold font-mono text-foreground flex items-center gap-2">
              Delivery: {data.id}
            </h1>
            <p className="text-sm text-muted-foreground mt-2">
              Created at: <span className="font-medium text-foreground">{new Date(data.createdAt).toLocaleString()}</span>
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
              <Button onClick={handleRetry} disabled={retrying} variant="outline" className="flex items-center gap-2">
                <RefreshCw className={`w-4 h-4 ${retrying ? 'animate-spin' : ''}`} /> {retrying ? 'Retrying...' : 'Retry Delivery'}
              </Button>
              <Link to={`/app/support/new?requestId=${data.requestId}`}>
                <Button>Create Support Request</Button>
              </Link>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="border-b border-border bg-muted/30 pb-4">
            <CardTitle className="text-base">Overview</CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="flex flex-col gap-4">
              <div>
                <span className="text-sm font-medium text-muted-foreground block mb-1">Event</span>
                <span className="font-mono text-foreground font-medium">{data.event}</span>
              </div>
              <div>
                <span className="text-sm font-medium text-muted-foreground block mb-1">Result</span>
                <div className="flex items-center gap-2">
                  <StatusBadge status={data.result} /> 
                  <span className="text-sm font-mono text-muted-foreground">HTTP {data.statusCode}</span>
                </div>
              </div>
              <div>
                <span className="text-sm font-medium text-muted-foreground block mb-1">Request ID</span>
                <span className="font-mono text-foreground text-sm bg-muted px-1.5 py-0.5 rounded">{data.requestId}</span>
              </div>
              <div>
                <span className="text-sm font-medium text-muted-foreground block mb-1">Attempts</span>
                <span className="font-medium text-foreground">{data.attempt}</span>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {data.errorMessage && (
          <Card className="border-destructive/30 bg-destructive/5">
            <CardHeader className="border-b border-destructive/20 pb-4 flex flex-row items-center gap-2">
              <AlertCircle className="w-5 h-5 text-destructive" />
              <CardTitle className="text-base text-destructive">Error Message</CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <p className="text-destructive font-mono text-sm whitespace-pre-wrap leading-relaxed">{data.errorMessage}</p>
            </CardContent>
          </Card>
        )}
      </div>

      <Card className="overflow-hidden">
        <CardHeader className="border-b border-border bg-muted/30 pb-4 flex flex-row items-center gap-2">
          <FileJson className="w-5 h-5 text-muted-foreground" />
          <CardTitle className="text-base">Request Payload</CardTitle>
        </CardHeader>
        <div className="p-6 bg-slate-950 text-slate-300 font-mono text-sm overflow-x-auto">
          <pre>{JSON.stringify(data.requestPayload, null, 2)}</pre>
        </div>
      </Card>
    </div>
  );
}
