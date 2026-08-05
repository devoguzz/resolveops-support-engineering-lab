import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../store/authStore';
import { FileQuestion, ArrowLeft, Home } from 'lucide-react';

export function NotFound() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const getDashboardLink = () => {
    if (user?.role.startsWith('support_')) {
      return '/support/dashboard';
    }
    return '/app/dashboard';
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
      <div className="max-w-md w-full bg-white border border-slate-200 rounded-2xl p-8 shadow-sm text-center flex flex-col items-center">
        <div className="w-16 h-16 bg-slate-100 text-slate-600 rounded-2xl flex items-center justify-center mb-6 border border-slate-200">
          <FileQuestion className="w-8 h-8" />
        </div>
        <h1 className="text-4xl font-bold text-slate-900 mb-2">404</h1>
        <h2 className="text-xl font-semibold text-slate-800 mb-2">Page Not Found</h2>
        <p className="text-slate-500 mb-6 text-sm">
          The requested URL <code className="bg-slate-100 px-1.5 py-0.5 rounded text-slate-700">{location.pathname}</code> could not be found. 
          It might have been moved or deleted.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-3 w-full">
          <button 
            onClick={() => navigate(-1)}
            className="flex-1 flex items-center justify-center gap-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 font-medium py-2.5 px-4 rounded-xl transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Go Back
          </button>
          <Link 
            to={getDashboardLink()} 
            className="flex-1 flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-800 text-white font-medium py-2.5 px-4 rounded-xl transition-colors"
          >
            <Home className="w-4 h-4" /> Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}