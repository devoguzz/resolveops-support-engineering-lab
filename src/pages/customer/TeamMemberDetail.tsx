import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { teamService } from '../../services/mock/teamService';
import { activityService } from '../../services/mock/activityService';
import { useAuth } from '../../store/authStore';
import { LoadingState, StatusBadge, Toast } from '../../components/shared';

export function TeamMemberDetail() {
  const { memberId } = useParams();
  
  const { user } = useAuth();
  
  const [member, setMember] = useState<any>(null);
  const [activities, setActivities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' as any });
  
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
    if (member.status === 'active') {
       const res = await teamService.deactivateMember(memberId!, user);
       if (res.ok) {
         setToast({ show: true, message: 'Member deactivated successfully', type: 'success' });
         setMember({ ...member, status: 'inactive' });
       } else {
         setToast({ show: true, message: res.error?.message || 'Error deactivating member', type: 'error' });
       }
    } else {
       // Mock activating
       setToast({ show: true, message: 'Re-activation is not supported in demo', type: 'error' });
    }
    setTimeout(() => setToast(t => ({ ...t, show: false })), 3000);
  };

  if (loading) return <LoadingState />;
  if (!member) return <div className="p-8 text-center text-slate-500">Member not found or access denied</div>;

  return (
    <div className="p-6 flex flex-col gap-6 max-w-4xl mx-auto relative">
      {toast.show && (
        <div className="fixed top-4 right-4 z-50">
          <Toast message={toast.message} type={toast.type}  />
        </div>
      )}

      <div>
        <Link to="/app/team" className="text-sm text-blue-600 hover:underline mb-4 inline-block">&larr; Back to Team</Link>
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">{member.user?.fullName || member.userId}</h1>
            <p className="text-slate-500 mt-1">{member.user?.email || 'No email available'}</p>
          </div>
          <div className="flex items-center gap-3">
             <StatusBadge status={member.status} />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 flex flex-col gap-6">
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 bg-slate-50">
              <h3 className="font-semibold text-slate-800">Recent Activity</h3>
            </div>
            <div className="divide-y divide-slate-100">
               {activities.length > 0 ? activities.map(act => (
                 <div key={act.id} className="px-6 py-4 flex items-center justify-between hover:bg-slate-50">
                     <div>
                         <p className="text-sm font-medium text-slate-900">{act.description}</p>
                         <p className="text-xs text-slate-500 mt-1 capitalize">Resource: {act.resource} • Result: {act.result}</p>
                     </div>
                     <span className="text-xs text-slate-400">{new Date(act.timestamp).toLocaleString()}</span>
                 </div>
               )) : (
                 <div className="p-6 text-center text-slate-500">No recent activity</div>
               )}
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-6">
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
            <h3 className="font-semibold text-slate-800 mb-4 border-b border-slate-100 pb-2">Profile Details</h3>
            <div className="flex flex-col gap-4">
              <div>
                <span className="text-xs text-slate-500 uppercase tracking-wider block mb-1">Role</span>
                {isOwner && member.userId !== user?.id ? (
                  <select 
                    className="form-input w-full px-3 py-2 border rounded-md text-sm"
                    value={member.role}
                    onChange={(e) => handleRoleChange(e.target.value)}
                  >
                    <option value="customer_owner">Owner</option>
                    <option value="customer_member">Member</option>
                  </select>
                ) : (
                  <span className="font-medium text-slate-700 capitalize">{member.role.replace('customer_', '')}</span>
                )}
              </div>
              <div>
                <span className="text-xs text-slate-500 uppercase tracking-wider block mb-1">Joined</span>
                <span className="font-medium text-slate-700">{new Date(member.joinedAt).toLocaleDateString()}</span>
              </div>
              <div>
                <span className="text-xs text-slate-500 uppercase tracking-wider block mb-1">Last Active</span>
                <span className="font-medium text-slate-700">{new Date(member.lastActiveAt).toLocaleString()}</span>
              </div>
            </div>
          </div>

          {isOwner && (
            <div className="bg-red-50 rounded-xl border border-red-200 shadow-sm p-6">
              <h3 className="font-semibold text-red-800 mb-2">Danger Zone</h3>
              <p className="text-sm text-red-700 mb-4">Revoking access will immediately disconnect this user's active sessions.</p>
              <button 
                onClick={handleStatusToggle}
                disabled={member.userId === user?.id}
                className="btn btn-secondary w-full text-red-700 border-red-200 hover:bg-red-100 disabled:opacity-50"
              >
                {member.status === 'active' ? 'Deactivate Member' : 'Activate Member'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}


