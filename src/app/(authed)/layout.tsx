import { redirect } from 'next/navigation'
import { BottomNav } from '@/components/layout/BottomNav'
import { getCurrentUser } from '@/server/auth'

export default async function AuthedLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const user = await getCurrentUser()
  if (!user) {
    redirect('/login')
  }

  return (
    <div className="h-screen flex flex-col">
      <div className="flex-1 overflow-y-auto">{children}</div>
      <BottomNav />
    </div>
  )
}
