import { useEffect, useState } from 'react'
import { subscriptionService } from '../../services/mock/subscriptionService'
import { Subscription as SubscriptionModel } from '../../domain/models'
import { useAuth } from '../../store/authStore'
import { formatDate } from '../../lib/dates'

export function Subscription() {
  const { user } = useAuth()
  const [subscription, setSubscription] = useState<SubscriptionModel | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchSub = async () => {
      if (!user?.organizationId) return
      setLoading(true)
      const res = await subscriptionService.getSubscription(user.organizationId)
      if (res.ok) setSubscription(res.data)
      setLoading(false)
    }
    fetchSub()
  }, [user])

  if (loading) return <div className="p-8 text-center text-slate-500">Loading subscription details...</div>
  if (!subscription) return <div className="p-8 text-center text-red-500">Subscription not found</div>

  return (
    <div className="flex flex-col gap-6 max-w-4xl">
      <h1 className="text-2xl font-bold text-slate-900">Subscription & Billing</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-lg font-semibold text-slate-900">Current Plan</h2>
              <span className={`px-2 py-1 text-xs font-semibold rounded-full uppercase tracking-wide ${subscription.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                {subscription.status}
              </span>
            </div>
            <p className="text-3xl font-bold text-indigo-700 mb-1">{subscription.planName}</p>
            <p className="text-slate-500 text-sm">Billed annually. Next charge on {formatDate(subscription.renewalDate)}.</p>
          </div>
          
          <div className="mt-8 flex gap-3">
            <button className="btn btn-primary bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded font-medium disabled:opacity-50" disabled>Manage Billing</button>
            <button className="btn btn-secondary border border-slate-300 hover:bg-slate-50 px-4 py-2 rounded font-medium disabled:opacity-50" disabled>Change Plan</button>
          </div>
          <p className="text-xs text-slate-400 mt-2 italic">* Billing management is disabled in demo mode.</p>
        </div>

        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col">
          <h2 className="text-lg font-semibold text-slate-900 mb-4">Usage Limits</h2>
          
          <div className="flex flex-col gap-4">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="font-medium text-slate-700">Team Members</span>
                <span className="text-slate-500">12 / Unlimited</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2">
                <div className="bg-indigo-500 h-2 rounded-full" style={{ width: '15%' }}></div>
              </div>
            </div>
            
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="font-medium text-slate-700">API Requests</span>
                <span className="text-slate-500">1.2M / 10M</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2">
                <div className="bg-blue-500 h-2 rounded-full" style={{ width: '12%' }}></div>
              </div>
            </div>
            
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="font-medium text-slate-700">Storage</span>
                <span className="text-slate-500">45GB / 100GB</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2">
                <div className="bg-amber-500 h-2 rounded-full" style={{ width: '45%' }}></div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-200 bg-slate-50">
          <h3 className="font-semibold text-slate-800">Billing History</h3>
        </div>
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 text-slate-500">
            <tr>
              <th className="p-4 font-medium">Date</th>
              <th className="p-4 font-medium">Description</th>
              <th className="p-4 font-medium">Amount</th>
              <th className="p-4 font-medium">Status</th>
              <th className="p-4 font-medium">Invoice</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            <tr className="hover:bg-slate-50">
              <td className="p-4">{formatDate(subscription.startDate)}</td>
              <td className="p-4 text-slate-900 font-medium">Enterprise Annual Renewal</td>
              <td className="p-4">$12,000.00</td>
              <td className="p-4"><span className="text-green-600 font-medium bg-green-50 px-2 py-1 rounded">Paid</span></td>
              <td className="p-4"><button className="text-indigo-600 hover:underline">Download PDF</button></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  )
}
