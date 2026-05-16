import { NextResponse } from 'next/server'
import { z, ZodError } from 'zod'
import { prisma } from '@/server/prisma'
import { verifyPassword } from '@/server/password'
import { signToken } from '@/server/jwt'
import { attachAuthCookie, toPublicUser } from '@/server/authResponse'

const loginSchema = z.object({
  username: z.string().min(1),
  password: z.string().min(1),
})

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const data = loginSchema.parse(body)

    const user = await prisma.user.findUnique({ where: { username: data.username } })
    if (!user || !user.isActive) {
      return NextResponse.json({ error: 'Invalid username or password' }, { status: 401 })
    }

    const ok = await verifyPassword(data.password, user.passwordHash)
    if (!ok) {
      return NextResponse.json({ error: 'Invalid username or password' }, { status: 401 })
    }

    await prisma.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() },
    })

    const token = await signToken({ sub: user.id, username: user.username, role: user.role })
    const response = NextResponse.json({ token, user: toPublicUser(user) })
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
