import axios from 'axios'

// Next.js serves API from the same origin, so no base URL or proxy needed.
// Auth uses an httpOnly cookie set by the server, but we also support the
// Authorization header for non-browser clients.

const TOKEN_KEY = 'auth_token'

export const api = axios.create({
  baseURL: '/api',
  withCredentials: true,
})

export function getToken(): string | null {
  if (typeof window === 'undefined') return null
  return localStorage.getItem(TOKEN_KEY)
}

export function setToken(token: string | null) {
  if (typeof window === 'undefined') return
  if (token) localStorage.setItem(TOKEN_KEY, token)
  else localStorage.removeItem(TOKEN_KEY)
}

api.interceptors.request.use((config) => {
  const token = getToken()
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})
