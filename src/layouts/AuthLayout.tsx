import { Outlet } from 'react-router-dom'
import { Hexagon, Activity, AlertCircle, Clock, Server, FileText, Database, CheckCircle2 } from 'lucide-react'

export function AuthLayout() {
  return (
    <div className="min-h-[100dvh] grid grid-cols-1 md:grid-cols-2 lg:grid-cols-[minmax(520px,44%)_minmax(0,1fr)] overflow-hidden bg-white font-sans text-slate-900">
      
      {/* Left Side - Form Container */}
      <div className="flex flex-col justify-center items-center relative z-10 px-6 sm:px-12 py-12 md:py-0 overflow-y-auto max-h-[100dvh]">
        <div 
          className="w-full max-w-[460px] flex flex-col mx-auto my-auto transition-all"
        >
          {/* Top Logo aligned with form */}
          <div className="flex items-center gap-2.5 mb-10 md:mb-12">
            <div className="w-8 h-8 rounded-xl bg-slate-900 shadow-md flex items-center justify-center">
               <Hexagon className="w-5 h-5 text-white" />
            </div>
            <span className="font-extrabold text-xl tracking-tight text-slate-900">ResolveOps</span>
          </div>

          <div className="mb-8">
            <h1 className="text-[28px] sm:text-[32px] font-bold tracking-tight text-slate-900 mb-3 leading-tight">Sign in to ResolveOps</h1>
            <p className="text-slate-500 font-medium text-[15px] leading-relaxed">Investigate incidents, correlate technical evidence, and manage customer resolutions.</p>
          </div>
          
          <Outlet />
          
        </div>

        {/* Footer */}
        <div className="absolute bottom-8 left-8 right-8 lg:bottom-8 lg:left-12 flex justify-between items-center text-xs font-medium text-slate-400 hidden lg:flex">
          <span>&copy; 2026 ResolveOps Inc.</span>
        </div>
      </div>

      {/* Right Side - Incident Scenario */}
      <div className="hidden md:flex bg-slate-950 relative overflow-hidden flex-col justify-center items-center p-8 lg:p-12">
        {/* Ambient Navy Gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-950 to-[#020617]"></div>
        <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-[100px] mix-blend-screen pointer-events-none"></div>
        
        {/* Very Faint Technical Grid */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAwIDMwIEwgNjAgMzAgTSAzMCAwIEwgMzAgNjAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgyNTUsMjU1LDI1NSwwLjAyKSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-40"></div>

        <div className="relative z-10 w-full max-w-[540px] mx-auto flex flex-col gap-6">
           <div 
             className="bg-slate-900/80 backdrop-blur-md border border-slate-700/50 rounded-xl p-6 shadow-2xl flex flex-col"
           >
             <div className="flex items-center justify-between mb-5 border-b border-slate-700/50 pb-5">
               <div className="flex items-center gap-3">
                 <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/20">
                   <Activity className="w-4 h-4 text-amber-400" />
                 </div>
                 <div>
                   <div className="flex items-center gap-2">
                     <span className="text-white font-bold tracking-tight">INC-2026-008</span>
                     <span className="px-2 py-0.5 rounded text-[11px] font-bold uppercase tracking-wider bg-amber-500/20 text-amber-400">Investigating</span>
                   </div>
                   <h3 className="text-slate-300 text-[15px] font-medium mt-1">Webhook signature failures</h3>
                 </div>
               </div>
             </div>

             <div className="grid grid-cols-2 gap-y-4 gap-x-6 text-[13px]">
               <div>
                 <span className="text-slate-500 font-medium block mb-1">Organization</span>
                 <span className="text-slate-200 font-semibold flex items-center gap-1.5"><Database className="w-3.5 h-3.5 text-slate-400"/> Northstar Labs</span>
               </div>
               <div>
                 <span className="text-slate-500 font-medium block mb-1">Service</span>
                 <span className="text-slate-200 font-semibold flex items-center gap-1.5"><Server className="w-3.5 h-3.5 text-slate-400"/> webhook-worker</span>
               </div>
               <div>
                 <span className="text-slate-500 font-medium block mb-1">Error Code</span>
                 <span className="text-red-400 font-mono bg-red-400/10 px-1.5 py-0.5 rounded">WEBHOOK_SIGNATURE_INVALID</span>
               </div>
               <div>
                 <span className="text-slate-500 font-medium block mb-1">Request ID</span>
                 <span className="text-slate-300 font-mono">req_8bd129c2</span>
               </div>
               <div>
                 <span className="text-slate-500 font-medium block mb-1">Failed Attempts</span>
                 <span className="text-slate-200 font-semibold">3</span>
               </div>
               <div>
                 <span className="text-slate-500 font-medium block mb-1">Related Ticket</span>
                 <span className="text-blue-400 font-semibold flex items-center gap-1.5"><FileText className="w-3.5 h-3.5"/> SUP-1042</span>
               </div>
             </div>
           </div>

           <div 
             className="bg-slate-900/50 backdrop-blur-sm border border-slate-800/80 rounded-xl p-5"
           >
             <h4 className="text-[12px] font-bold text-slate-500 uppercase tracking-widest mb-4 flex items-center gap-2">
               <Clock className="w-3.5 h-3.5" /> Investigation Timeline
             </h4>
             <div className="space-y-4 relative before:absolute before:inset-0 before:ml-[11px] before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-700 before:to-transparent hidden sm:block">
               {[
                 { time: '14:02', event: 'Error detected in telemetry', icon: AlertCircle, color: 'text-red-400' },
                 { time: '14:08', event: 'Customer ticket SUP-1042 created', icon: FileText, color: 'text-blue-400' },
                 { time: '14:15', event: 'Incident INC-2026-008 declared', icon: Activity, color: 'text-amber-400' },
                 { time: '14:27', event: 'Root cause identified', icon: CheckCircle2, color: 'text-emerald-400' }
               ].map((item, i) => (
                 <div key={i} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                    <div className="flex items-center justify-center w-6 h-6 rounded-full border border-slate-700 bg-slate-900 text-slate-500 group-[.is-active]:border-slate-500 group-[.is-active]:text-slate-300 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 absolute left-0 md:left-1/2 -translate-x-1/2">
                       <div className={`w-2 h-2 rounded-full ${i === 3 ? 'bg-emerald-400' : 'bg-slate-500'}`}></div>
                    </div>
                    <div className="w-[calc(100%-2rem)] md:w-[calc(50%-1.5rem)] ml-8 md:ml-0 px-3 py-2 bg-slate-800/50 rounded-lg border border-slate-700/50">
                       <div className="flex items-center gap-2 justify-between">
                         <span className="text-[13px] font-medium text-slate-300">{item.event}</span>
                         <span className="text-[11px] font-bold text-slate-500 tabular-nums">{item.time}</span>
                       </div>
                    </div>
                 </div>
               ))}
             </div>
           </div>
           
           <div 
             className="text-center mt-2"
           >
             <p className="text-[15px] font-medium text-slate-400 tracking-wide">One incident. Every technical signal in one investigation workspace.</p>
           </div>
        </div>

        {/* Demo Data Label */}
        <div className="absolute top-6 right-6 px-2.5 py-1 bg-white/5 border border-white/10 rounded-md">
           <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Demo Data</span>
        </div>
      </div>
    </div>
  )
}
