import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { teamService } from '../../services/mock/teamService';
import { activityService } from '../../services/mock/activityService';
import { formatDate } from '../../lib/dates';
import { useAuth } from '../../store/authStore';
import { LoadingState, Toast } from '../../components/shared';
import { StatusBadge } from '../../components/domain/StatusBadge';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { ArrowLeft, AlertTriangle } from 'lucide-react';
import { AnimatedStatus } from '../../components/motion/AnimatedStatus';
import { EntityNotFound } from '../../components/system/EntityNotFound';
import { PermissionGate } from '../../components/system/PermissionGate';

export function TeamMemberDetail() {
  const { memberId } = useParams();
  
  const { user } = useAuth();
  
  const [member, setMember] = useState<any>(null);
  const [activities, setActivities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' as any });
  
  const [toggling, setToggling] = useState(false);
  const [toggleState, setToggleState] = useState<'idle' | 'success'>('idle');

  const isOwner = user?.role === 'customer_owner';

  const loadData = async () => {
    setLoading(true);
    const mRes = await teamService.getMember(memberId!, user);
    if (mRes.ok) {
      setMember(mRes.data);
      const aRes = await activityService.listActivity((user!.organizationId || ''), { actorId: mRes.data.userId }, user);
      if (aRes.ok) {
         setActivities(aRes.data.slice(0, 10)); // Top 10 recent
      }
    }
    setLoading(false);
  };

  useEffect(() => {
    if (user && memberId) loadData();
  }, [user, memberId]);

  const handleRoleChange = async (newRole: string) => {
    const res = await teamService.updateMemberRole(memberId!, newRole, user);
    if (res.ok) {
      setToast({ show: true, message: 'Role updated successfully', type: 'success' });
      setMember({ ...member, role: newRole });
    } else {
      setToast({ show: true, message: res.error?.message || 'Error updating role', type: 'error' });
    }
    setTimeout(() => setToast(t => ({ ...t, show: false })), 3000);
  };

  const handleStatusToggle = async () => {
    setToggling(true);
    setToggleState('idle');
    if (member.status === 'active') {
       const res = await teamService.deactivateMember(memberId!, user);
       if (res.ok) {
         setToast({ show: true, message: 'Member deactivated successfully', type: 'success' });
         setMember({ ...member, status: 'inactive' });
         setToggleState('success');
         setTimeout(() => setToggleState('idle'), 2000);
       } else {
         setToast({ show: true, message: res.error?.message || 'Error deactivating member', type: 'error' });
       }
    } else {
       // Mock activating
       setToast({ show: true, message: 'Re-activation is not supported in demo', type: 'error' });
    }
    setToggling(false);
    setTimeout(() => setToast(t => ({ ...t, show: false })), 3000);
  };

  if (loading) return <LoadingState />;
  if (!member) return <EntityNotFound entityName="Team Member" />;

  return (
    <div className="p-8 max-w-[1400px] mx-auto space-y-6 relative">
      {toast.show && (
        <div className="fixed top-4 right-4 z-50">
          <Toast message={toast.message} type={toast.type}  />
        </div>
      )}

      <div>
        <Link to="/app/team" className="inline-flex items-center text-sm font-medium text-primary hover:underline gap-1 mb-4">
          <ArrowLeft className="w-4 h-4" /> Back to Team
        </Link>
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground">{member.user?.fullName || member.userId}</h1>
            <p className="text-muted-foreground mt-2 font-medium">{member.user?.email || 'No email available'}</p>
          </div>
          <div className="flex items-center gap-3">
             <StatusBadge status={member.status} />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 flex flex-col gap-6">
          <Card>
            <CardHeader className="border-b border-border bg-muted/30 pb-4">
              <CardTitle className="text-base">Recent Activity</CardTitle>
            </CardHeader>
            <div className="divide-y divide-border">
               {activities.length > 0 ? activities.map(act => (
                 <div key={act.id} className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-muted/30 transition-colors">
                     <div>
                         <p className="text-sm font-semibold text-foreground">{act.description}</p>
                         <p className="text-xs text-muted-foreground mt-1.5 font-medium capitalize flex flex-wrap gap-2">
                           <span className="bg-muted px-2 py-0.5 rounded-sm">Resource: {act.resource}</span> 
                           <span className="bg-muted px-2 py-0.5 rounded-sm">Result: {act.result}</span>
                         </p>
                     </div>
                     <span className="text-xs font-medium text-muted-foreground whitespace-nowrap">{formatDate(act.timestamp)}</span>
                 </div>
               )) : (
                 <div className="p-12 text-center text-sm text-muted-foreground">No recent activity</div>
               )}
            </div>
          </Card>
        </div>

        <div className="flex flex-col gap-6">
          <Card>
            <CardHeader className="border-b border-border bg-muted/30 pb-4">
              <CardTitle className="text-base">Profile Details</CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="flex flex-col gap-6">
                <div className="space-y-2">
                  <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block">Role</span>
                  {isOwner && member.userId !== user?.id ? (
                    <select 
                      className="w-full bg-background border border-border text-foreground rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring transition-all"
                      value={member.role}
                      onChange={(e) => handleRoleChange(e.target.value)}
                    >
                      <option value="customer_owner">Owner</option>
                      <option value="customer_member">Member</option>
                    </select>
                  ) : (
                    <span className="font-semibold text-foreground capitalize block bg-muted/50 border border-border px-3 py-2 rounded-md"><AnimatedStatus status={member.role.replace('customer_', '')} /></span>
                  )}
                </div>
                <div className="space-y-1">
                  <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block">Joined</span>
                  <span className="font-medium text-foreground">{formatDate(member.joinedAt)}</span>
                </div>
                <div className="space-y-1">
                  <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block">Last Active</span>
                  <span className="font-medium text-foreground">{formatDate(member.lastActiveAt)}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <PermissionGate allowedRoles={['customer_owner']}>
            <Card className="border-destructive/30 bg-destructive/5">
              <CardHeader className="border-b border-destructive/20 pb-4 flex flex-row items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-destructive" />
                <CardTitle className="text-base text-destructive">Danger Zone</CardTitle>
              </CardHeader>
              <CardContent className="pt-6 space-y-4">
                <p className="text-sm text-destructive font-medium leading-relaxed">Revoking access will immediately disconnect this user's active sessions.</p>
                <Button 
                  variant="outline"
                  onClick={handleStatusToggle}
                  disabled={member.userId === user?.id || toggling || toggleState === 'success'}
                  className="w-full text-destructive border-destructive/30 hover:bg-destructive/10 hover:text-destructive"
                >
                  <AnimatedStatus status={toggling ? (member.status === 'active' ? 'Deactivating...' : 'Activating...') : toggleState === 'success' ? (member.status === 'inactive' ? 'Deactivated' : 'Activated') : (member.status === 'active' ? 'Deactivate Member' : 'Activate Member')} />
                </Button>
              </CardContent>
            </Card>
          </PermissionGate>
        </div>
      </div>
    </div>
  );
}
