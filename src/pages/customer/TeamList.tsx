
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { teamService } from '../../services/mock/teamService';
import { useAuth } from '../../store/authStore';
import { LoadingState, StatusBadge } from '../../components/shared';

export function TeamList() {
  const { user } = useAuth();
  const [members, setMembers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  useEffect(() => {
    teamService.listMembers(user?.organizationId || '', user).then((res: any) => {
      if (res.ok) setMembers(res.data);
      setLoading(false);
    });
  }, [user]);

  if (loading) return <LoadingState />;

  const filtered = members.filter(m => {
    const matchesSearch = m.userId.toLowerCase().includes(search.toLowerCase());
    const matchesRole = roleFilter ? m.role === roleFilter : true;
    const matchesStatus = statusFilter ? m.status === statusFilter : true;
    return matchesSearch && matchesRole && matchesStatus;
  });

  return <div className="p-6 flex flex-col gap-6 max-w-7xl mx-auto">
    <div className="flex justify-between items-center border-b border-slate-200 pb-4">
        <div>
            <h1 className="text-2xl font-bold text-slate-900">Team Members</h1>
            <p className="text-sm text-slate-500 mt-1">Manage who has access to your organization.</p>
        </div>
        <button className="btn btn-primary bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors shadow-sm">Invite Member</button>
    </div>
    
    <div className="flex gap-4 mb-2 bg-slate-50 p-4 rounded-lg border border-slate-200">
        <input type="text" placeholder="Search by name or email..." className="form-input flex-1 px-4 py-2 border rounded-md" value={search} onChange={e => setSearch(e.target.value)} />
        <select className="form-input w-48 px-4 py-2 border rounded-md" value={roleFilter} onChange={e => setRoleFilter(e.target.value)}>
            <option value="">All Roles</option>
            <option value="customer_owner">Owner</option>
            <option value="customer_member">Member</option>
        </select>
        <select className="form-input w-48 px-4 py-2 border rounded-md" value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
            <option value="">All Statuses</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
        </select>
    </div>

    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
                <thead className="bg-slate-50 border-b border-slate-200">
                    <tr>
                        <th className="p-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">User</th>
                        <th className="p-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Role</th>
                        <th className="p-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
                        <th className="p-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Joined</th>
                        <th className="p-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Last Active</th>
                        <th className="p-4 text-xs font-semibold text-slate-500 uppercase tracking-wider text-right">Actions</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                    {filtered.map(m => (
                        <tr key={m.id} className="hover:bg-slate-50 transition-colors">
                            <td className="p-4">
                                <div className="flex flex-col">
                                    <span className="font-medium text-slate-900">{m.user?.fullName || m.userId}</span>
                                    <span className="text-sm text-slate-500">{m.user?.email || ''}</span>
                                </div>
                            </td>
                            <td className="p-4"><span className="text-sm text-slate-700 capitalize">{m.role.replace('customer_', '')}</span></td>
                            <td className="p-4"><StatusBadge status={m.status} /></td>
                            <td className="p-4 text-sm text-slate-500">{new Date(m.joinedAt).toLocaleDateString()}</td>
                            <td className="p-4 text-sm text-slate-500">{new Date(m.lastActiveAt).toLocaleDateString()}</td>
                            <td className="p-4 text-right">
                                <Link to={`/app/team/${m.id}`} className="text-blue-600 hover:text-blue-800 text-sm font-medium px-3 py-1 hover:bg-blue-50 rounded transition-colors">Manage</Link>
                            </td>
                        </tr>
                    ))}
                    {filtered.length === 0 && (
                        <tr><td colSpan={6} className="p-8 text-center text-slate-500">No members match your filters.</td></tr>
                    )}
                </tbody>
            </table>
        </div>
    </div>
  </div>;
}

