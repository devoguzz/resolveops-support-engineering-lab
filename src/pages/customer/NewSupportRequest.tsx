import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ticketService } from '../../services/mock/ticketService';
import { useAuth } from '../../store/authStore';
import { Card, CardContent } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { PageHeader } from '../../components/domain/PageHeader';

export function NewSupportRequest() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const initialRequestId = searchParams.get('requestId') || '';
  
  const [subject, setSubject] = useState('');
  const [description, setDescription] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    if (!subject || !description) {
      setError('Subject and description are required');
      return;
    }
    
    setSubmitting(true);
    setError('');
    
    const res = await ticketService.createTicket({
      subject,
      category: 'Webhook problem',
      description,
      impact: 'Business-critical operation blocked',
      requestIds: initialRequestId ? [initialRequestId] : [],
      organizationId: user?.organizationId || ''
    });
    
    if (res.ok) {
      navigate(`/app/support/${res.data.id}`);
    } else {
      setError(res.error.message || 'Failed to create request');
    }
    setSubmitting(false);
  };

  return (
    <div className="p-8 max-w-3xl mx-auto space-y-6">
      <PageHeader 
        title="Create Support Request" 
        description="Submit a new technical support request to our engineering team."
      />
      
      <Card>
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            {error && (
              <div className="p-3 bg-destructive/10 text-destructive rounded-md text-sm border border-destructive/20 font-medium">
                {error}
              </div>
            )}
            
            <div className="space-y-2">
              <label className="text-sm font-semibold text-foreground">Subject</label>
              <input 
                required 
                type="text" 
                className="w-full bg-background border border-border text-foreground rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring transition-all" 
                placeholder="Brief summary of the issue" 
                value={subject} 
                onChange={e => setSubject(e.target.value)} 
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-semibold text-foreground">Description</label>
              <textarea 
                required 
                rows={5} 
                className="w-full bg-background border border-border text-foreground rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring transition-all" 
                placeholder="Provide as much detail as possible..." 
                value={description} 
                onChange={e => setDescription(e.target.value)}
              ></textarea>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-semibold text-foreground">Request ID (Optional)</label>
              <input 
                type="text" 
                className="w-full bg-muted border border-border text-muted-foreground rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring transition-all" 
                value={initialRequestId} 
                readOnly 
                disabled 
              />
              <p className="text-xs text-muted-foreground font-medium">If this request is related to a specific API or Webhook request, its ID will appear here.</p>
            </div>
            
            <div className="pt-4 border-t border-border flex justify-end gap-3">
              <Button type="button" variant="outline" onClick={() => navigate(-1)}>Cancel</Button>
              <Button type="submit" disabled={submitting}>
                {submitting ? 'Submitting...' : 'Submit Request'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
