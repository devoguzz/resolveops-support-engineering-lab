import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { teamService } from '../../services/mock/teamService';
import { useAuth } from '../../store/authStore';
import { formatDate } from '../../lib/dates';
import { LoadingState, Toast } from '../../components/shared';
import { PageHeader } from '../../components/domain/PageHeader';
import { StatusBadge } from '../../components/domain/StatusBadge';
import { Card, CardContent } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Plus, Search } from 'lucide-react';
import { AnimatedStatus } from '../../components/motion/AnimatedStatus';
import { PermissionGate } from '../../components/system/PermissionGate';

export function TeamList() {
  const { user } = useAuth();
  const [members, setMembers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [inviting, setInviting] = useState(false);
  const [inviteState, setInviteState] = useState<'idle' | 'success'>('idle');
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' as any });

  const loadMembers = async () => {
    setLoading(true);
    const res: any = await teamService.listMembers(user?.organizationId || '', user);
    if (res.ok) setMembers(res.data);
    setLoading(false);
  };

  useEffect(() => {
    if (user) loadMembers();
  }, [user]);

  const handleInvite = async () => {
    const email = 'demo.member@company.com';
    setInviting(true);
    setInviteState('idle');
    const res: any = await teamService.inviteMember?.(user?.organizationId || '', email, user);
    if (res?.ok) {
      setToast({ show: true, message: `Invitation sent to ${email}`, type: 'success' });
      await loadMembers();
      setInviteState('success');
      setTimeout(() => setInviteState('idle'), 2000);
    } else {
      setToast({ show: true, message: res?.error?.message || 'Failed to invite member. Not implemented in mock service.', type: 'error' });
    }
    setInviting(false);
    setTimeout(() => setToast(t => ({ ...t, show: false })), 3000);
  };

  if (loading) return <LoadingState />;

  const filtered = members.filter(m => {
    const matchesSearch = m.userId.toLowerCase().includes(search.toLowerCase());
    const matchesRole = roleFilter ? m.role === roleFilter : true;
    const matchesStatus = statusFilter ? m.status === statusFilter : true;
    return matchesSearch && matchesRole && matchesStatus;
  });

  return (
    <div className="p-8 max-w-[1400px] mx-auto space-y-6 relative">
      {toast.show && (
        <div className="fixed top-4 right-4 z-50">
          <Toast message={toast.message} type={toast.type}  />
        </div>
      )}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <PageHeader 
          title="Team Members" 
          description="Manage who has access to your organization."
        />
        <PermissionGate allowedRoles={['customer_owner']}>
          <Button className="flex items-center gap-2" onClick={handleInvite} disabled={inviting || inviteState === 'success'}>
            <Plus className="w-4 h-4" /> <AnimatedStatus status={inviting ? 'Sending...' : inviteState === 'success' ? 'Invited' : 'Invite Member'} />
          </Button>
        </PermissionGate>
      </div>
      
      <Card className="bg-muted/30">
        <CardContent className="p-4 flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input 
              type="text" 
              placeholder="Search by name or email..." 
              className="w-full pl-9 pr-4 py-2 bg-background border border-border text-foreground rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-ring transition-all" 
              value={search} 
              onChange={e => setSearch(e.target.value)} 
            />
          </div>
          <div className="flex gap-4">
            <select 
              className="w-48 bg-background border border-border text-foreground rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring transition-all" 
              value={roleFilter} 
              onChange={e => setRoleFilter(e.target.value)}
            >
              <option value="">All Roles</option>
              <option value="customer_owner">Owner</option>
              <option value="customer_member">Member</option>
            </select>
            <select 
              className="w-48 bg-background border border-border text-foreground rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring transition-all" 
              value={statusFilter} 
              onChange={e => setStatusFilter(e.target.value)}
            >
              <option value="">All Statuses</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
        </CardContent>
      </Card>

      <Card>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-muted/30 border-b border-border">
              <tr>
                <th className="p-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">User</th>
                <th className="p-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Role</th>
                <th className="p-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Status</th>
                <th className="p-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Joined</th>
                <th className="p-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Last Active</th>
                <th className="p-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filtered.map(m => (
                <tr key={m.id} className="hover:bg-muted/30 transition-colors">
                  <td className="p-4">
                    <div className="flex flex-col">
                      <span className="font-semibold text-foreground">{m.user?.fullName || m.userId}</span>
                      <span className="text-sm font-medium text-muted-foreground">{m.user?.email || ''}</span>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className="text-sm font-medium text-foreground capitalize">{m.role.replace('customer_', '')}</span>
                  </td>
                  <td className="p-4"><StatusBadge status={m.status} /></td>
                  <td className="p-4 text-sm font-medium text-muted-foreground">{formatDate(m.joinedAt)}</td>
                  <td className="p-4 text-sm font-medium text-muted-foreground">{formatDate(m.lastActiveAt)}</td>
                  <td className="p-4 text-right">
                    <Link to={`/app/team/${m.id}`}>
                      <Button variant="ghost" size="sm">Manage</Button>
                    </Link>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={6} className="p-12 text-center text-sm text-muted-foreground">
                    No members match your filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
