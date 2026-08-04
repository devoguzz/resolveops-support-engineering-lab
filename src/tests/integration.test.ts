import { describe, it, expect, beforeEach } from 'vitest';
import { ticketService } from '../services/mock/ticketService';
import { webhookService } from '../services/mock/webhookService';
import { demoDataService } from '../services/mock/demoDataService';

describe('Integration Tests', () => {
  beforeEach(async () => {
    // Reset state before each test
    await demoDataService.resetData();
  });

  it('Customer Owner can create ticket with request ID', async () => {
    const res = await ticketService.createTicket({
      subject: 'Test Ticket via E2E Simulation',
      category: 'API problem',
      description: 'Cannot auth with new keys',
      impact: 'One user affected',
      requestIds: ['req_8bd129c2'],
      organizationId: 'org_northstar'
    });
    
    expect(res.ok).toBe(true);
    if(res.ok) {
        expect(res.data.subject).toBe('Test Ticket via E2E Simulation');
        expect(res.data.requestIds[0]).toBe('req_8bd129c2');
        expect(res.data.status).toBe('open');
    }
  });

  it('Webhook retry creates new attempt', async () => {
    const res = await webhookService.retryDelivery('whd_2048');
    expect(res.ok).toBe(true);
    if(res.ok) {
        // Seed starts at attempt = 3, retry bumps it to 4
        expect(res.data.attempt).toBe(4); 
    }
  });
  
  it('Reset demo data successfully restores seed', async () => {
    // Modify state
    await webhookService.retryDelivery('whd_2048');
    
    // Reset state
    await demoDataService.resetData();
    
    // Check state is back to normal
    const res = await webhookService.listDeliveries({ organizationId: 'org_northstar' });
    expect(res.ok).toBe(true);
    if(res.ok) {
      const delivery = res.data.find(d => d.id === 'whd_2048');
      expect(delivery?.attempt).toBe(3);
    }
  });
});
