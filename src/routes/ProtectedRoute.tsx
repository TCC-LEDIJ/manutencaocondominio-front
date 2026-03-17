import { Navigate, Outlet, useLocation } from 'react-router-dom'

import { AppShell } from '../components/layout/AppShell'
import { useAuth } from '../context/AuthContext'
import type { Role } from '../types'

type ProtectedRouteProps = {
  requiredRole: Role
}

export function ProtectedRoute({ requiredRole }: ProtectedRouteProps) {
  const auth = useAuth()
  const location = useLocation()

  if (!auth.token || !auth.role) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />
  }

  if (auth.role !== requiredRole) {
    return <Navigate to={auth.role === 'MANAGER' ? '/dashboard' : '/resident'} replace />
  }

  return (
    <AppShell>
      <Outlet />
    </AppShell>
  )
}