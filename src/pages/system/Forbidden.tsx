import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../store/authStore';
import { ShieldAlert, ArrowLeft, LogOut } from 'lucide-react';

export function Forbidden() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = () => {
    logout();
    navigate('/login');
  };

  const getDashboardLink = () => {
    if (user?.role.startsWith('support_')) {
      return '/support/dashboard';
    }
    return '/app/dashboard';
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
      <div className="max-w-md w-full bg-white border border-slate-200 rounded-2xl p-8 shadow-sm text-center flex flex-col items-center">
        <div className="w-16 h-16 bg-red-50 text-red-600 rounded-2xl flex items-center justify-center mb-6 border border-red-100">
          <ShieldAlert className="w-8 h-8" />
        </div>
        <h1 className="text-4xl font-bold text-slate-900 mb-2">403</h1>
        <h2 className="text-xl font-semibold text-slate-800 mb-2">Access Denied</h2>
        <p className="text-slate-500 mb-6 text-sm">
          You don’t have permission to access this page. 
          {user && <span> Your current role is <strong className="font-semibold">{user.role.replace('_', ' ')}</strong>.</span>}
        </p>
        
        <div className="flex flex-col gap-3 w-full">
          <Link 
            to={getDashboardLink()} 
            className="w-full flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-800 text-white font-medium py-2.5 px-4 rounded-xl transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Return to Dashboard
          </Link>
          <button 
            onClick={handleSignOut}
            className="w-full flex items-center justify-center gap-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 font-medium py-2.5 px-4 rounded-xl transition-colors"
          >
            <LogOut className="w-4 h-4" /> Sign Out
          </button>
        </div>
      </div>
    </div>
  );
}