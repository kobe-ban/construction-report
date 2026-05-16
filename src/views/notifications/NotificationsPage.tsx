'use client'

import { useRouter } from 'next/navigation'
import { Bell, Camera, Settings, CheckCircle2 } from 'lucide-react'
import { useAppStore } from '@/store/appStore'
import { timeAgo } from '@/lib/utils'
import { cn } from '@/lib/utils'
import type { NotificationType } from '@/types'
import { Button } from '@/components/ui/Button'

const typeIcon: Record<NotificationType, React.ReactNode> = {
  report: <Camera size={18} className="text-blue-600" />,
  step_complete: <CheckCircle2 size={18} className="text-green-600" />,
  system: <Settings size={18} className="text-gray-500" />,
}

const typeBg: Record<NotificationType, string> = {
  report: 'bg-blue-100',
  step_complete: 'bg-green-100',
  system: 'bg-gray-100',
}

export function NotificationsPage() {
  const { notifications, markAsRead, markAllAsRead, bridges } = useAppStore()
  const router = useRouter()

  const unreadCount = notifications.filter(n => !n.isRead).length

  const handleClick = (id: string, linkTo?: string) => {
    markAsRead(id)
    if (linkTo) router.push(linkTo)
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      <div className="sticky top-0 bg-white border-b border-gray-200 z-40 px-4 py-3">
        <div className="flex items-center justify-between">
          <h1 className="font-semibold text-gray-900">การแจ้งเตือน</h1>
          {unreadCount > 0 && (
            <Button size="sm" variant="ghost" onClick={markAllAsRead}>อ่านทั้งหมด</Button>
          )}
        </div>
        {unreadCount > 0 && (
          <p className="text-xs text-blue-600 mt-0.5">{unreadCount} รายการยังไม่ได้อ่าน</p>
        )}
      </div>

      <div className="p-4 space-y-2">
        {notifications.length === 0 && (
          <div className="text-center py-12 text-gray-400">
            <Bell size={32} className="mx-auto mb-2" />
            <p className="text-sm">ไม่มีการแจ้งเตือน</p>
          </div>
        )}

        {notifications.map(n => {
          const bridge = n.bridgeId ? bridges.find(b => b.id === n.bridgeId) : null
          return (
            <div
              key={n.id}
              onClick={() => handleClick(n.id, n.linkTo)}
              className={cn(
                'flex items-start gap-3 p-4 rounded-2xl border cursor-pointer transition-colors',
                n.isRead ? 'bg-white border-gray-100' : 'bg-blue-50 border-blue-100'
              )}
            >
              <div className={cn('p-2 rounded-xl shrink-0', typeBg[n.type])}>
                {typeIcon[n.type]}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2 flex-wrap">
                    {bridge && (
                      <span
                        className="text-[10px] font-bold text-white px-1.5 py-0.5 rounded"
                        style={{ backgroundColor: bridge.color }}
                      >
                        {bridge.code}
                      </span>
                    )}
                    <p className={cn('text-sm font-medium', n.isRead ? 'text-gray-700' : 'text-gray-900')}>
                      {n.title}
                    </p>
                  </div>
                  {!n.isRead && <div className="w-2 h-2 rounded-full bg-blue-500 shrink-0 mt-1" />}
                </div>
                <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">{n.body}</p>
                <p className="text-xs text-gray-400 mt-1">{timeAgo(n.createdAt)}</p>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
