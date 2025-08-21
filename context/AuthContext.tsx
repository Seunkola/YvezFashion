'use client'

import { getBrowserSupabaseClient } from '@/lib/supabase/browser'
import { Session, User } from '@supabase/supabase-js'
import { createContext, useContext, useEffect, useState } from 'react'
import * as authService from '@/features/auth/auth.service'

type AuthContextType = {
  user: User | null
  session: Session | null
  loading: boolean
  signUp: typeof authService.signUp
  login: typeof authService.login
  logout: () => Promise<{ error: any }>
  loginWithProvider: typeof authService.loginWithProvider
  resetPassword: typeof authService.resetPassword
  updatePassword: typeof authService.updatePassword
  getSession: typeof authService.getSession
}

interface AuthProviderProps {
  children: React.ReactNode
  initialUser?: User | null
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider = ({ children}: AuthProviderProps) => {
  const supabase = getBrowserSupabaseClient()
  const [session, setSession] = useState<Session | null>(null)
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadUser = async () => {
      const { data: sessionData } = await supabase.auth.getSession()
      setSession(sessionData.session ?? null)

      const { data: userData } = await supabase.auth.getUser()
      setUser(userData.user ?? null)
      setLoading(false)
    }

    loadUser()

    // Listen for login/logout/session changes
    const { data: listener } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        setSession(session)
        setUser(session?.user ?? null)
      }
    )

    return () => {
      listener.subscription.unsubscribe()
    }
  }, [supabase])

  // Custom logout to instantly clear state
  const handleLogout = async () => {
    const { error } = await authService.logout()

    // Immediately clear UI state, regardless of middleware timing
    setUser(null)
    setSession(null)

    return { error }
  }

  // Show loading screen until user session is resolved
  if (loading) {
    return (
      <div className="flex flex-col items-center gap-2">
            <div className="h-10 w-10 rounded-full border-4 border-gray-300 border-t-black animate-spin" />
            <p>Loading Page...</p>
      </div>
    )
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        loading,
        signUp: authService.signUp,
        login: authService.login,
        logout: handleLogout,
        loginWithProvider: authService.loginWithProvider,
        resetPassword: authService.resetPassword,
        updatePassword: authService.updatePassword,
        getSession: authService.getSession,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used within AuthProvider')
  return context
}

export const useAuthenticate = () => useContext(AuthContext);
