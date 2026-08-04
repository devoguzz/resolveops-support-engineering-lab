import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ticketService } from '../../services/mock/ticketService';
import { useAuth } from '../../store/authStore';

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
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Create New Support Request</h1>
      <div className="card p-6">
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {error && <div className="p-3 bg-red-50 text-red-600 rounded text-sm border border-red-200">{error}</div>}
          
          <div className="form-group">
            <label className="form-label">Subject</label>
            <input required type="text" className="form-input" placeholder="Brief summary of the issue" value={subject} onChange={e => setSubject(e.target.value)} />
          </div>
          
          <div className="form-group">
            <label className="form-label">Description</label>
            <textarea required rows={5} className="form-input" placeholder="Provide as much detail as possible..." value={description} onChange={e => setDescription(e.target.value)}></textarea>
          </div>
          
          <div className="form-group">
            <label className="form-label">Request ID (Optional)</label>
            <input type="text" className="form-input bg-slate-50" value={initialRequestId} readOnly disabled />
            <p className="text-xs text-muted mt-1">If this request is related to a specific API or Webhook request, its ID will appear here.</p>
          </div>
          
          <div className="pt-4 border-t border-slate-100 flex justify-end gap-2">
            <button type="button" onClick={() => navigate(-1)} className="btn btn-secondary">Cancel</button>
            <button type="submit" disabled={submitting} className="btn btn-primary">{submitting ? 'Submitting...' : 'Submit Request'}</button>
          </div>
        </form>
      </div>
    </div>
  );
}
