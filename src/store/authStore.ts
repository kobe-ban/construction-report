'use client'

import { create } from 'zustand'
import { api, getToken, setToken } from '@/lib/api'

export type AuthRole = 'boss' | 'worker' | 'engineer' | 'accountant' | 'admin'

export interface AuthUser {
  id: string
  username: string
  fullName: string
  role: AuthRole
  email: string | null
  phone: string | null
  employeeCode: string | null
  isActive: boolean
}

interface AuthState {
  user: AuthUser | null
  status: 'idle' | 'loading' | 'authenticated' | 'unauthenticated'
  error: string | null
  login: (username: string, password: string) => Promise<void>
  register: (input: RegisterInput) => Promise<void>
  logout: () => Promise<void>
  fetchMe: () => Promise<void>
}

export interface RegisterInput {
  username: string
  password: string
  fullName: string
  role: AuthRole
  email?: string
  phone?: string
  employeeCode?: string
}

function extractError(err: unknown): string {
  if (typeof err === 'object' && err && 'response' in err) {
    const data = (err as { response?: { data?: { error?: string } } }).response?.data
    if (data?.error) return data.error
  }
  return err instanceof Error ? err.message : 'Something went wrong'
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  status: 'idle',
  error: null,

  async login(username, password) {
    set({ status: 'loading', error: null })
    try {
      const res = await api.post<{ token: string; user: AuthUser }>('/auth/login', {
        username,
        password,
      })
      setToken(res.data.token)
      set({ user: res.data.user, status: 'authenticated', error: null })
    } catch (err) {
      setToken(null)
      set({ status: 'unauthenticated', error: extractError(err) })
      throw err
    }
  },

  async register(input) {
    set({ status: 'loading', error: null })
    try {
      const res = await api.post<{ token: string; user: AuthUser }>('/auth/register', input)
      setToken(res.data.token)
      set({ user: res.data.user, status: 'authenticated', error: null })
    } catch (err) {
      setToken(null)
      set({ status: 'unauthenticated', error: extractError(err) })
      throw err
    }
  },

  async logout() {
    try {
      await api.post('/auth/logout')
    } catch {
      // ignore network errors on logout
    }
    setToken(null)
    set({ user: null, status: 'unauthenticated', error: null })
  },

  async fetchMe() {
    set({ status: 'loading' })
    try {
      const res = await api.get<{ user: AuthUser }>('/auth/me')
      set({ user: res.data.user, status: 'authenticated', error: null })
    } catch {
      if (typeof window !== 'undefined') {
        // Only clear token if call genuinely returned 401, not network noise
        const hasToken = getToken()
        if (hasToken) setToken(null)
      }
      set({ user: null, status: 'unauthenticated' })
    }
  },
}))
