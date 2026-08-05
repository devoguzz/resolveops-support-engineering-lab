import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../store/authStore';
import { FileQuestion, ArrowLeft, Home } from 'lucide-react';

export function EntityNotFound({ entityName = 'Item' }: { entityName?: string }) {
  const { user } = useAuth();
  const navigate = useNavigate();

  const getDashboardLink = () => {
    if (user?.role.startsWith('support_')) {
      return '/support/dashboard';
    }
    return '/app/dashboard';
  };

  return (
    <div className="flex-1 flex items-center justify-center p-6 bg-slate-50/50 rounded-2xl border border-slate-100 my-8">
      <div className="max-w-md w-full bg-white border border-slate-200 rounded-xl p-8 shadow-[0_1px_2px_rgba(0,0,0,0.04)] text-center flex flex-col items-center">
        <div className="w-16 h-16 bg-slate-50 text-slate-400 rounded-xl flex items-center justify-center mb-5 border border-slate-100">
          <FileQuestion className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold text-slate-900 mb-2">{entityName} Not Found</h2>
        <p className="text-slate-500 mb-8 text-[15px] leading-relaxed">
          The {entityName.toLowerCase()} you are looking for does not exist, has been deleted, or you don't have permission to view it.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-3 w-full">
          <button 
            onClick={() => navigate(-1)}
            className="flex-1 flex items-center justify-center gap-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 font-semibold py-2.5 px-4 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-slate-900 focus:ring-offset-1"
          >
            <ArrowLeft className="w-4 h-4" /> Go Back
          </button>
          <Link 
            to={getDashboardLink()} 
            className="flex-1 flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-800 text-white font-semibold py-2.5 px-4 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-slate-900 focus:ring-offset-1"
          >
            <Home className="w-4 h-4" /> Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
