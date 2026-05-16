import { NextResponse } from 'next/server'
import { z, ZodError } from 'zod'
import { prisma } from '@/server/prisma'
import { hashPassword } from '@/server/password'
import { signToken } from '@/server/jwt'
import { attachAuthCookie, toPublicUser } from '@/server/authResponse'

const registerSchema = z.object({
  username: z.string().min(3).max(50),
  password: z.string().min(6).max(100),
  fullName: z.string().min(1).max(255),
  role: z.enum(['boss', 'worker', 'engineer', 'accountant', 'admin']),
  email: z.string().email().optional(),
  phone: z.string().max(30).optional(),
  employeeCode: z.string().max(50).optional(),
})

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const data = registerSchema.parse(body)

    const existing = await prisma.user.findFirst({
      where: {
        OR: [
          { username: data.username },
          ...(data.email ? [{ email: data.email }] : []),
          ...(data.employeeCode ? [{ employeeCode: data.employeeCode }] : []),
        ],
      },
      select: { id: true },
    })
    if (existing) {
      return NextResponse.json(
        { error: 'Username, email, or employee code already in use' },
        { status: 409 }
      )
    }

    const passwordHash = await hashPassword(data.password)
    const user = await prisma.user.create({
      data: {
        username: data.username,
        passwordHash,
        fullName: data.fullName,
        role: data.role,
        email: data.email,
        phone: data.phone,
        employeeCode: data.employeeCode,
      },
    })

    const token = await signToken({ sub: user.id, username: user.username, role: user.role })
    const response = NextResponse.json(
      { token, user: toPublicUser(user) },
      { status: 201 }
    )
    return attachAuthCookie(response, token)
  } catch (err) {
    if (err instanceof ZodError) {
      return NextResponse.json(
        { error: 'ValidationError', details: err.flatten().fieldErrors },
        { status: 400 }
      )
    }
    console.error(err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
