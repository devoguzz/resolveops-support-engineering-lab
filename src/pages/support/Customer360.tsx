import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { organizationService } from '../../services/mock/organizationService'
import { Organization, OrganizationMember } from '../../domain/models'
import { formatDate } from '../../lib/dates'

export function Customer360() {
  const { organizationId } = useParams()
  const [org, setOrg] = useState<Organization | null>(null)
  const [members, setMembers] = useState<OrganizationMember[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      if (!organizationId) return
      setLoading(true)
      const res = await organizationService.getOrganization(organizationId)
      if (res.ok) setOrg(res.data)
      
      const memRes = await organizationService.listMembers(organizationId)
      if (memRes.ok) setMembers(memRes.data)
      
      setLoading(false)
    }
    load()
  }, [organizationId])

  if (loading) return <div className="p-8 text-center text-slate-500">Loading Customer 360...</div>
  if (!org) return <div className="p-8 text-center text-red-500">Organization not found</div>

  return (
    <div className="flex flex-col gap-6 max-w-6xl">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">{org.name}</h1>
          <p className="text-slate-500 mt-1">ID: {org.id} • Plan: {org.plan}</p>
        </div>
        <div className="flex gap-2">
          <button className="btn btn-secondary text-sm">Assume Identity</button>
          <Link to={`/support/tickets?organizationId=${org.id}`} className="btn btn-primary text-sm">View Tickets</Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1 flex flex-col gap-6">
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <h2 className="text-lg font-semibold mb-4">Organization Profile</h2>
            <div className="flex flex-col gap-3">
              <div>
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">Plan</span>
                <span className="text-slate-900 capitalize">{org.plan}</span>
              </div>
              <div>
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">Members Count</span>
                <span className="text-slate-900">{members.length}</span>
              </div>
              <div>
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">Status</span>
                <span className="text-green-600 font-medium">Active</span>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <h2 className="text-lg font-semibold mb-4">Quick Links</h2>
            <ul className="flex flex-col gap-2">
              <li><Link to={`/support/tickets?organizationId=${org.id}`} className="text-indigo-600 hover:underline">Support Tickets</Link></li>
              <li><Link to={`/support/traces?organizationId=${org.id}`} className="text-indigo-600 hover:underline">Request Traces</Link></li>
              <li><Link to={`/support/webhooks?organizationId=${org.id}`} className="text-indigo-600 hover:underline">Webhook Deliveries</Link></li>
              <li><Link to={`/support/jobs?organizationId=${org.id}`} className="text-indigo-600 hover:underline">Background Jobs</Link></li>
            </ul>
          </div>
        </div>

        <div className="md:col-span-2 flex flex-col gap-6">
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-4 border-b border-slate-200 bg-slate-50">
              <h2 className="font-semibold text-slate-800">Team Members</h2>
            </div>
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-slate-500 border-b border-slate-200">
                <tr>
                  <th className="p-4 font-medium">User ID</th>
                  <th className="p-4 font-medium">Role</th>
                  <th className="p-4 font-medium">Status</th>
                  <th className="p-4 font-medium">Last Active</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {members.length === 0 ? (
                  <tr><td colSpan={4} className="p-4 text-center text-slate-500">No members found.</td></tr>
                ) : members.map(m => (
                  <tr key={m.id} className="hover:bg-slate-50">
                    <td className="p-4 text-slate-900 font-medium">{m.userId}</td>
                    <td className="p-4 text-slate-500">{m.role}</td>
                    <td className="p-4 text-green-600 font-medium capitalize">{m.status}</td>
                    <td className="p-4 text-slate-500">{formatDate(m.lastActiveAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
