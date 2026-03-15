import {
  createContext,
  useContext,
  useEffect,
  useState,
  type PropsWithChildren,
} from 'react'

import type { AuthPayload, AuthState } from '../types'

type AuthContextValue = AuthState & {
  login: (payload: AuthPayload) => void
  logout: () => void
}

const STORAGE_KEY = 'safecondo.auth'

const AuthContext = createContext<AuthContextValue | null>(null)

function getInitialState(): AuthState {
  if (typeof window === 'undefined') {
    return { user: null, condominiumId: null, role: null, token: null }
  }

  const savedState = window.sessionStorage.getItem(STORAGE_KEY)

  if (!savedState) {
    return { user: null, condominiumId: null, role: null, token: null }
  }

  try {
    return JSON.parse(savedState) as AuthState
  } catch {
    return { user: null, condominiumId: null, role: null, token: null }
  }
}

export function AuthProvider({ children }: PropsWithChildren) {
  const [state, setState] = useState<AuthState>(getInitialState)

  useEffect(() => {
    window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  }, [state])

  const value: AuthContextValue = {
    ...state,
    login: (payload) => {
      setState({
        user: payload.user,
        condominiumId: payload.condominiumId,
        role: payload.role,
        token: payload.token,
      })
    },
    logout: () => {
      setState({ user: null, condominiumId: null, role: null, token: null })
    },
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)

  if (!context) {
    throw new Error('useAuth deve ser usado dentro de AuthProvider')
  }

  return context
}