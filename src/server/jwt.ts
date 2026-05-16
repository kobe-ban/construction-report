import { SignJWT, jwtVerify } from 'jose'

export interface JwtPayload {
  sub: string
  username: string
  role: string
}

const SECRET = process.env.JWT_SECRET
if (!SECRET) {
  // Surface a clear error early instead of cryptic crypto failures.
  // eslint-disable-next-line no-console
  console.warn('JWT_SECRET is not set — auth will not work')
}
const EXPIRES_IN = process.env.JWT_EXPIRES_IN ?? '7d'

function getKey(): Uint8Array {
  if (!SECRET) throw new Error('JWT_SECRET is not configured')
  return new TextEncoder().encode(SECRET)
}

export async function signToken(payload: JwtPayload): Promise<string> {
  return await new SignJWT({ username: payload.username, role: payload.role })
    .setProtectedHeader({ alg: 'HS256' })
    .setSubject(payload.sub)
    .setIssuedAt()
    .setExpirationTime(EXPIRES_IN)
    .sign(getKey())
}

export async function verifyToken(token: string): Promise<JwtPayload> {
  const { payload } = await jwtVerify(token, getKey())
  return {
    sub: String(payload.sub),
    username: String(payload.username ?? ''),
    role: String(payload.role ?? ''),
  }
}

export const AUTH_COOKIE = 'token'
