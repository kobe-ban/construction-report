import { NextResponse } from 'next/server'
import { prisma } from '@/server/prisma'
import { getCurrentUser } from '@/server/auth'
import { toPublicUser } from '@/server/authResponse'

export async function GET() {
  const session = await getCurrentUser()
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const user = await prisma.user.findUnique({ where: { id: session.sub } })
  if (!user) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 })
  }

  return NextResponse.json({ user: toPublicUser(user) })
}
