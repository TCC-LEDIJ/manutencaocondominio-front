import type { ReactNode } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'

import { useAuth } from './context/AuthContext'
import { LoginPage } from './pages/auth/LoginPage'
import { RegisterPage } from './pages/auth/RegisterPage'
import { DashboardPage } from './pages/dashboard/DashboardPage'
import { EquipmentDetailPage } from './pages/equipment/EquipmentDetailPage'
import { EquipmentListPage } from './pages/equipment/EquipmentListPage'
import { LandingPage } from './pages/landing/LandingPage'
import { ResidentPage } from './pages/resident/ResidentPage'
import { ProtectedRoute } from './routes/ProtectedRoute'

function HomeEntry() {
  const { role, token } = useAuth()

  if (!token || !role) {
    return <LandingPage />
  }

  if (role === 'MANAGER') {
    return <Navigate to="/dashboard" replace />
  }

  if (role === 'RESIDENT') {
    return <Navigate to="/resident" replace />
  }

  return <Navigate to="/resident" replace />
}

function PublicOnly({ children }: { children: ReactNode }) {
  const { token, role } = useAuth()

  if (token && role) {
    return <Navigate to={role === 'MANAGER' ? '/dashboard' : '/resident'} replace />
  }

  return <>{children}</>
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomeEntry />} />
      <Route
        path="/login"
        element={
          <PublicOnly>
            <LoginPage />
          </PublicOnly>
        }
      />
      <Route
        path="/register"
        element={
          <PublicOnly>
            <RegisterPage />
          </PublicOnly>
        }
      />

      <Route element={<ProtectedRoute requiredRole="MANAGER" />}>
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/equipment" element={<EquipmentListPage />} />
        <Route path="/equipment/:id" element={<EquipmentDetailPage />} />
      </Route>

      <Route element={<ProtectedRoute requiredRole="RESIDENT" />}>
        <Route path="/resident" element={<ResidentPage />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default App
