import { Outlet } from 'react-router-dom'

export function AuthLayout() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50 p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold">ResolveOps</h1>
          <p className="text-muted mt-2">Sign in to your account</p>
        </div>
        <div className="card p-6">
          <Outlet />
        </div>
        <div className="mt-8 text-center text-sm text-muted">
          This is a mock frontend demo environment. No real backend is connected.
        </div>
      </div>
    </div>
  )
}
