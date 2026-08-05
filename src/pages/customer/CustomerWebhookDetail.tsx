import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { diagnosticService } from '../../services/mock/diagnosticService';
import { webhookService } from '../../services/mock/webhookService';
import { formatDate } from '../../lib/dates';
import { LoadingState, Toast } from '../../components/shared';
import { useAuth } from '../../store/authStore';
import { StatusBadge } from '../../components/domain/StatusBadge';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { ArrowLeft, RefreshCw, AlertCircle, FileJson } from 'lucide-react';
import { AnimatedMetric } from '../../components/motion/AnimatedMetric';
import { AnimatedStatus } from '../../components/motion/AnimatedStatus';
import { BorderBeam } from '../../components/ui/border-beam';
import { EntityNotFound } from '../../components/system/EntityNotFound';

export function CustomerWebhookDetail() {
  const { deliveryId } = useParams();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [retrying, setRetrying] = useState(false);
  const [retryStatus, setRetryStatus] = useState<'idle' | 'success' | 'failed'>('idle');
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
    setRetryStatus('idle');
    const res = await webhookService.retryDelivery(deliveryId!, user);
    if (res.ok) {
      setData(res.data);
      setToast('Retry attempt triggered successfully');
      setTimeout(() => setToast(''), 3000);
      setRetryStatus(res.data.result === 'success' ? 'success' : 'failed');
      setTimeout(() => setRetryStatus('idle'), 3000);
    }
    setRetrying(false);
  };

  let buttonText = 'Retry Delivery';
  if (retrying) buttonText = 'Retrying...';
  else if (retryStatus === 'success') buttonText = 'Delivered';
  else if (retryStatus === 'failed') buttonText = 'Failed Again';

  if (loading) return <LoadingState />;
  if (!data) return <EntityNotFound entityName="Webhook Delivery" />;

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
              Created at: <span className="font-medium text-foreground">{formatDate(data.createdAt)}</span>
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
              <Button onClick={handleRetry} disabled={retrying || retryStatus === 'success'} variant="outline" className="flex items-center gap-2">
                <RefreshCw className={`w-4 h-4 ${retrying ? 'animate-spin' : ''}`} /> 
                <AnimatedStatus status={buttonText} />
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
                <span className="font-medium text-foreground"><AnimatedMetric value={data.attempt} /></span>
              </div>
              <div>
                <span className="text-sm font-medium text-muted-foreground block mb-1">Duration</span>
                <span className="font-medium text-foreground">{data.duration || '234'} ms</span>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {data.errorMessage && (
          <Card className="border-destructive/30 overflow-hidden flex flex-col relative">
            {data.result === 'failed' && retryStatus !== 'success' && (
              <BorderBeam colorFrom="var(--color-destructive)" colorTo="var(--color-warning)" duration={20} delay={1} />
            )}
            {retryStatus === 'success' && (
              <BorderBeam colorFrom="var(--color-success)" colorTo="var(--color-success)" duration={5} />
            )}
            <CardHeader className="bg-destructive/10 border-b border-destructive/20 p-4 flex flex-row items-center gap-2">
              <AlertCircle className="w-5 h-5 text-destructive" />
              <CardTitle className="text-base text-destructive">Error & Troubleshooting</CardTitle>
            </CardHeader>
            <CardContent className="p-4 bg-destructive/5 flex-1">
              <p className="text-destructive font-mono text-sm whitespace-pre-wrap leading-relaxed mb-4">{data.errorMessage}</p>
              
              <div className="bg-background rounded-md border border-border p-3 text-sm">
                 <p className="font-semibold text-foreground mb-1">Troubleshooting Steps:</p>
                 <ul className="list-disc pl-5 text-muted-foreground space-y-1">
                   <li>Verify that your endpoint is publicly accessible and responding within 5 seconds.</li>
                   <li>Check if your server is returning a 2xx status code.</li>
                   <li>Ensure your HMAC secret matches the one configured in ResolveOps.</li>
                 </ul>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="overflow-hidden">
          <CardHeader className="border-b border-border bg-muted/30 pb-4 flex flex-row items-center gap-2">
            <FileJson className="w-5 h-5 text-muted-foreground" />
            <CardTitle className="text-base">Request Payload</CardTitle>
          </CardHeader>
          <div className="p-4 bg-slate-950 text-slate-300 font-mono text-sm overflow-x-auto h-[400px]">
            <pre>{JSON.stringify(data.requestPayload, null, 2)}</pre>
          </div>
        </Card>

        <Card className="overflow-hidden">
          <CardHeader className="border-b border-border bg-muted/30 pb-4 flex flex-row items-center gap-2">
            <FileJson className="w-5 h-5 text-muted-foreground" />
            <CardTitle className="text-base">Response Payload</CardTitle>
          </CardHeader>
          <div className="p-4 bg-slate-950 text-slate-300 font-mono text-sm overflow-x-auto h-[400px]">
            <pre>{data.responsePayload ? JSON.stringify(data.responsePayload, null, 2) : 'No response body received.'}</pre>
          </div>
        </Card>
      </div>
    </div>
  );
}
