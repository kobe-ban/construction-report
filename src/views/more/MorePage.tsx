'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { TrendingUp, Wallet, Bell, ChevronRight, LogOut, User as UserIcon } from 'lucide-react'
import { Header } from '@/components/layout/Header'
import { useAppStore } from '@/store/appStore'
import { useAuthStore } from '@/store/authStore'

const menuItems = [
  { to: '/progress', icon: TrendingUp, label: 'ความคืบหน้า', description: 'ติดตามความคืบหน้าโครงการ', color: 'text-blue-600 bg-blue-50' },
  { to: '/budget', icon: Wallet, label: 'เบิกเงิน', description: 'ขอเบิกและติดตามงบประมาณ', color: 'text-green-600 bg-green-50' },
  { to: '/notifications', icon: Bell, label: 'แจ้งเตือน', description: 'ศูนย์การแจ้งเตือน', color: 'text-orange-600 bg-orange-50', showBadge: true },
]

export function MorePage() {
  const router = useRouter()
  const unreadCount = useAppStore(s => s.notifications.filter(n => !n.isRead).length)
  const user = useAuthStore(s => s.user)
  const logout = useAuthStore(s => s.logout)

  async function handleLogout() {
    await logout()
    router.replace('/login')
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      <Header title="อื่นๆ" />

      {user && (
        <div className="p-4">
          <div className="bg-white rounded-xl p-4 border border-gray-100 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center">
              <UserIcon size={20} />
            </div>
            <div className="flex-1">
              <p className="font-medium text-gray-900 text-sm">{user.fullName}</p>
              <p className="text-xs text-gray-500">@{user.username} · {user.role}</p>
            </div>
          </div>
        </div>
      )}

      <div className="px-4 space-y-2">
        {menuItems.map(({ to, icon: Icon, label, description, color, showBadge }) => (
          <Link
            key={to}
            href={to}
            className="flex items-center gap-3 bg-white rounded-xl p-4 border border-gray-100 active:bg-gray-50"
          >
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${color}`}>
              <Icon size={20} />
            </div>
            <div className="flex-1">
              <p className="font-medium text-gray-900 text-sm">{label}</p>
              <p className="text-xs text-gray-500">{description}</p>
            </div>
            <div className="flex items-center gap-2">
              {showBadge && unreadCount > 0 && (
                <span className="bg-red-500 text-white text-[10px] rounded-full min-w-[20px] h-5 flex items-center justify-center px-1 font-bold">
                  {unreadCount}
                </span>
              )}
              <ChevronRight size={16} className="text-gray-300" />
            </div>
          </Link>
        ))}

        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 bg-white rounded-xl p-4 border border-gray-100 active:bg-gray-50 text-left mt-2"
        >
          <div className="w-10 h-10 rounded-xl flex items-center justify-center text-red-600 bg-red-50">
            <LogOut size={20} />
          </div>
          <div className="flex-1">
            <p className="font-medium text-red-600 text-sm">ออกจากระบบ</p>
            <p className="text-xs text-gray-500">เลิกใช้งานบัญชีปัจจุบัน</p>
          </div>
        </button>
      </div>
    </div>
  )
}
