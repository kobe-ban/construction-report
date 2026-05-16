import type { NextResponse } from 'next/server'
import { AUTH_COOKIE } from './jwt'

export interface PublicUser {
  id: string
  username: string
  fullName: string
  role: string
  email: string | null
  phone: string | null
  employeeCode: string | null
  isActive: boolean
}

export function toPublicUser(u: {
  id: string
  username: string
  fullName: string
  role: string
  email: string | null
  phone: string | null
  employeeCode: string | null
  isActive: boolean
}): PublicUser {
  return {
    id: u.id,
    username: u.username,
    fullName: u.fullName,
    role: u.role,
    email: u.email,
    phone: u.phone,
    employeeCode: u.employeeCode,
    isActive: u.isActive,
  }
}

export function attachAuthCookie(res: NextResponse, token: string) {
  res.cookies.set(AUTH_COOKIE, token, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 7 * 24 * 60 * 60,
  })
  return res
}
