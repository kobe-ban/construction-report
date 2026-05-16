import { cookies } from 'next/headers'
import { AUTH_COOKIE, verifyToken, type JwtPayload } from './jwt'

export async function getCurrentUser(): Promise<JwtPayload | null> {
  const store = await cookies()
  const token = store.get(AUTH_COOKIE)?.value
  if (!token) return null
  try {
    return await verifyToken(token)
  } catch {
    return null
  }
}
