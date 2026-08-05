import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ticketService } from '../../services/mock/ticketService';
import { formatDate } from '../../lib/dates';
import { LoadingState } from '../../components/shared';
import { useAuth } from '../../store/authStore';
import { StatusBadge } from '../../components/domain/StatusBadge';
import { Card, CardContent, CardHeader } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { ArrowLeft, Copy } from 'lucide-react';
import { AnimatedStatus } from '../../components/motion/AnimatedStatus';
import { BorderBeam } from '../../components/ui/border-beam';

export function CustomerTicketDetail() {
  const { ticketId } = useParams();
  const [data, setData] = useState<any>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [replyText, setReplyText] = useState('');
  const [sending, setSending] = useState(false);
  const [sendState, setSendState] = useState<'idle' | 'success'>('idle');

  const { user } = useAuth();

  useEffect(() => {
    Promise.all([
      ticketService.getTicket(ticketId!, user),
      ticketService.listMessages(ticketId!)
    ]).then(([ticketRes, messagesRes]) => {
      if (ticketRes.ok) {
         setData(ticketRes.data);
      } else {
         setData(null);
      }
      if (messagesRes.ok) {
         setMessages(messagesRes.data);
      }
      setLoading(false);
    });
  }, [ticketId, user]);

  const handleSendReply = async () => {
    if (!replyText.trim() || !user?.id) return;
    setSending(true);
    setSendState('idle');
    const res = await ticketService.addMessage(ticketId!, replyText, user.id);
    if (res.ok) {
      setMessages([...messages, res.data]);
      setReplyText('');
      setSendState('success');
      setTimeout(() => setSendState('idle'), 2000);
    }
    setSending(false);
  };

  if (loading) return <LoadingState />;
  if (!data) return <div className="p-12 text-center text-sm text-muted-foreground">Ticket not found</div>;

  return (
    <div className="p-8 max-w-[1400px] mx-auto space-y-6">
      <Link to="/app/support" className="inline-flex items-center text-sm font-medium text-primary hover:underline gap-1">
        <ArrowLeft className="w-4 h-4" /> Back to Requests
      </Link>
      
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">{data.subject}</h1>
            <p className="text-sm text-muted-foreground mt-2">
              Ticket ID: <span className="font-mono bg-muted px-1.5 py-0.5 rounded text-foreground">{data.id}</span>
            </p>
          </div>
          <div className="flex gap-2">
            <StatusBadge status={data.status} animate={true} />
          </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 flex flex-col gap-6">
            <Card className="relative overflow-hidden">
              {data.priority === 'P1' && <BorderBeam colorFrom="var(--color-destructive)" colorTo="var(--color-warning)" duration={20} />}
              <CardHeader className="flex flex-row justify-between pb-4 border-b border-border bg-muted/30">
                <div className="font-semibold text-foreground">
                  Jane Doe <span className="font-medium text-muted-foreground text-sm ml-2">You</span>
                </div>
                <div className="text-sm font-medium text-muted-foreground">{formatDate(data.createdAt)}</div>
              </CardHeader>
              <CardContent className="pt-6 relative z-10">
                <p className="text-foreground whitespace-pre-wrap leading-relaxed">{data.description}</p>
              </CardContent>
            </Card>
            {/* Public timeline (Messages) */}
            {messages.map((msg, index) => (
              <Card key={msg.id || index}>
                <CardHeader className="flex flex-row justify-between pb-4 border-b border-border bg-muted/30">
                  <div className={`font-semibold ${msg.authorId === user?.id ? 'text-foreground' : 'text-primary'}`}>
                    {msg.authorId === user?.id ? 'You' : 'ResolveOps Support'}
                  </div>
                  <div className="text-sm font-medium text-muted-foreground">{formatDate(msg.createdAt)}</div>
                </CardHeader>
                <CardContent className="pt-6">
                  <p className="text-foreground whitespace-pre-wrap leading-relaxed">
                    {msg.content}
                  </p>
                </CardContent>
              </Card>
            ))}

            {data.status !== 'resolved' && (
              <Card className="bg-muted/30">
                <CardContent className="p-4">
                  <textarea 
                    className="w-full bg-background border border-border rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring text-foreground mb-3 min-h-[100px]" 
                    placeholder="Reply to this ticket..."
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                  ></textarea>
                  <div className="flex justify-end">
                    <Button onClick={handleSendReply} disabled={sending || sendState === 'success'}>
                      <AnimatedStatus status={sending ? 'Sending...' : sendState === 'success' ? 'Sent' : 'Send Reply'} />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
        </div>
        
        <div className="flex flex-col gap-6">
            <Card>
              <CardHeader className="pb-4 border-b border-border bg-muted/30">
                <h3 className="font-semibold text-foreground">Ticket Details</h3>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="flex flex-col gap-4">
                    <div>
                      <span className="text-sm font-medium text-muted-foreground block mb-1">Category</span>
                      <span className="font-medium text-foreground">{data.category}</span>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-muted-foreground block mb-1">Priority</span>
                      <span className="font-medium text-foreground uppercase"><AnimatedStatus status={data.priority} /></span>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-muted-foreground block mb-1">Impact</span>
                      <span className="font-medium text-foreground capitalize">{data.impact}</span>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-muted-foreground block mb-1">Environment</span>
                      <span className="font-medium text-foreground capitalize">{data.environment || 'Production'}</span>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-muted-foreground block mb-1">Created At</span>
                      <span className="font-medium text-foreground">{formatDate(data.createdAt)}</span>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-muted-foreground block mb-1">Updated At</span>
                      <span className="font-medium text-foreground">{formatDate(data.updatedAt)}</span>
                    </div>
                    {data.resolution && (
                      <div>
                        <span className="text-sm font-medium text-muted-foreground block mb-1">Resolution</span>
                        <span className="font-medium text-foreground">{data.resolution}</span>
                      </div>
                    )}
                    {data.requestIds?.length > 0 && (
                        <div>
                            <span className="text-sm font-medium text-muted-foreground block mb-2">Request IDs</span>
                            <div className="flex flex-col gap-2">
                              {data.requestIds.map((id:string) => (
                                  <div key={id} className="inline-flex items-center justify-between gap-2 bg-muted/50 border border-border rounded-md px-3 py-1.5 text-sm font-mono text-foreground">
                                    {id}
                                    <button 
                                      type="button" 
                                      onClick={() => navigator.clipboard.writeText(id)} 
                                      className="text-muted-foreground hover:text-primary transition-colors focus:outline-none focus:ring-2 focus:ring-ring rounded" 
                                      title="Copy Request ID"
                                    >
                                      <Copy className="w-4 h-4" />
                                    </button>
                                  </div>
                              ))}
                            </div>
                        </div>
                    )}
                </div>
              </CardContent>
            </Card>
        </div>
      </div>
    </div>
  );
}
