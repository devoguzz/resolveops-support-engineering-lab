import { useEffect, useState } from 'react'
import { Navigate } from 'react-router-dom'
import { subscriptionService } from '../../services/mock/subscriptionService'
import { Subscription as SubscriptionModel } from '../../domain/models'
import { useAuth } from '../../store/authStore'
import { formatDate } from '../../lib/dates'
import { PageHeader } from '../../components/domain/PageHeader'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/card'
import { Button } from '../../components/ui/button'
import { Download } from 'lucide-react'

export function Subscription() {
  const { user } = useAuth()
  const [subscription, setSubscription] = useState<SubscriptionModel | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchSub = async () => {
      if (!user?.organizationId) return
      setLoading(true)
      const res = await subscriptionService.getSubscription(user.organizationId, user)
      if (res.ok) setSubscription(res.data)
      setLoading(false)
    }
    fetchSub()
  }, [user])

  if (user?.role !== 'customer_owner') {
    return <Navigate to="/403" replace />
  }

  if (loading) return <div className="p-12 text-center text-sm text-muted-foreground">Loading subscription details...</div>
  if (!subscription) return <div className="p-12 text-center text-destructive font-medium">Subscription not found</div>

  return (
    <div className="p-8 max-w-[1400px] mx-auto space-y-6">
      <PageHeader 
        title="Subscription & Billing" 
        description="Manage your plan, billing cycle, and view usage limits."
      />
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="flex flex-col">
          <CardHeader>
            <div className="flex justify-between items-start">
              <CardTitle>Current Plan</CardTitle>
              <span className={`px-2.5 py-1 text-[10px] font-bold rounded-sm uppercase tracking-wider ${subscription.status === 'active' ? 'bg-success/10 text-success' : 'bg-destructive/10 text-destructive'}`}>
                {subscription.status}
              </span>
            </div>
          </CardHeader>
          <CardContent className="flex-1 flex flex-col justify-between">
            <div>
              <p className="text-4xl font-bold text-primary mb-2">{subscription.planName}</p>
              <p className="text-muted-foreground text-sm font-medium">Billed annually. Next charge on <span className="text-foreground">{formatDate(subscription.renewalDate)}</span>.</p>
            </div>
            
            <div className="mt-8 space-y-3">
              <div className="flex flex-wrap gap-3">
                <Button disabled>Manage Billing</Button>
                <Button variant="outline" disabled>Change Plan</Button>
              </div>
              <p className="text-xs font-medium text-muted-foreground bg-muted/50 p-2 rounded inline-block">* Billing management is disabled in demo mode.</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Usage Limits</CardTitle>
            <CardDescription>Track your usage across your workspace.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <div className="flex justify-between text-sm font-medium">
                <span className="text-foreground">Team Members</span>
                <span className="text-muted-foreground">12 / <span className="text-foreground">Unlimited</span></span>
              </div>
              <div className="w-full bg-muted rounded-full h-2 overflow-hidden border border-border">
                <div className="bg-primary h-full rounded-full" style={{ width: '15%' }}></div>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between text-sm font-medium">
                <span className="text-foreground">API Requests</span>
                <span className="text-muted-foreground">1.2M / <span className="text-foreground">10M</span></span>
              </div>
              <div className="w-full bg-muted rounded-full h-2 overflow-hidden border border-border">
                <div className="bg-blue-500 h-full rounded-full" style={{ width: '12%' }}></div>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between text-sm font-medium">
                <span className="text-foreground">Storage</span>
                <span className="text-muted-foreground">45GB / <span className="text-foreground">100GB</span></span>
              </div>
              <div className="w-full bg-muted rounded-full h-2 overflow-hidden border border-border">
                <div className="bg-amber-500 h-full rounded-full" style={{ width: '45%' }}></div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader className="border-b border-border bg-muted/30 pb-4">
          <CardTitle className="text-base">Billing History</CardTitle>
        </CardHeader>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm border-collapse">
            <thead className="text-muted-foreground border-b border-border bg-muted/10">
              <tr>
                <th className="p-4 text-xs font-semibold uppercase tracking-wider">Date</th>
                <th className="p-4 text-xs font-semibold uppercase tracking-wider">Description</th>
                <th className="p-4 text-xs font-semibold uppercase tracking-wider">Amount</th>
                <th className="p-4 text-xs font-semibold uppercase tracking-wider">Status</th>
                <th className="p-4 text-xs font-semibold uppercase tracking-wider text-right">Invoice</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              <tr className="hover:bg-muted/30 transition-colors">
                <td className="p-4 text-muted-foreground font-medium">{formatDate(subscription.startDate)}</td>
                <td className="p-4 text-foreground font-semibold">Enterprise Annual Renewal</td>
                <td className="p-4 font-mono text-muted-foreground">$12,000.00</td>
                <td className="p-4">
                  <span className="text-xs font-bold text-success bg-success/10 px-2.5 py-1 rounded-sm uppercase tracking-wider">Paid</span>
                </td>
                <td className="p-4 text-right">
                  <Button variant="ghost" size="sm" className="text-primary hover:text-primary gap-2">
                    <Download className="w-4 h-4" /> Download PDF
                  </Button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )
}
