
import { Link } from 'react-router-dom';
import { useAuth } from '../../store/authStore';

export function Dashboard() {
  const { user } = useAuth();
  
  return <div className="p-6 flex flex-col gap-6 max-w-7xl mx-auto">
    <div className="flex justify-between items-end border-b border-slate-200 pb-4">
        <div>
            <h1 className="text-3xl font-bold text-slate-900">Support Dashboard</h1>
            <p className="text-slate-500 mt-1">Hello, {user?.fullName}. Here's the current queue status.</p>
        </div>
    </div>
    
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col">
        <h3 className="text-slate-500 text-sm font-medium mb-2 uppercase tracking-wider">Unassigned Tickets</h3>
        <p className="text-4xl font-light text-slate-900">12</p>
      </div>
      
      <div className="bg-red-50 p-6 rounded-xl border border-red-200 shadow-sm flex flex-col">
        <h3 className="text-red-800 text-sm font-medium mb-2 uppercase tracking-wider">High Priority</h3>
        <p className="text-4xl font-light text-red-900">3</p>
      </div>

      <div className="bg-amber-50 p-6 rounded-xl border border-amber-200 shadow-sm flex flex-col">
        <h3 className="text-amber-800 text-sm font-medium mb-2 uppercase tracking-wider">Active Incidents</h3>
        <p className="text-4xl font-light text-amber-900">1</p>
      </div>
    </div>
    
    <div className="flex gap-4">
      <Link to="/support/tickets" className="btn btn-primary bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium shadow-sm transition-colors">View Ticket Queue &rarr;</Link>
      <Link to="/support/incidents" className="btn btn-secondary bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 px-6 py-3 rounded-lg font-medium shadow-sm transition-colors">Incident Center</Link>
    </div>
  </div>;
}
