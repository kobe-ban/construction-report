import { Link } from 'react-router-dom'
import { TrendingUp, Wallet, Bell, ChevronRight } from 'lucide-react'
import { Header } from '@/components/layout/Header'
import { useAppStore } from '@/store/appStore'

const menuItems = [
  { to: '/progress', icon: TrendingUp, label: 'ความคืบหน้า', description: 'ติดตามความคืบหน้าโครงการ', color: 'text-blue-600 bg-blue-50' },
  { to: '/budget', icon: Wallet, label: 'เบิกเงิน', description: 'ขอเบิกและติดตามงบประมาณ', color: 'text-green-600 bg-green-50' },
  { to: '/notifications', icon: Bell, label: 'แจ้งเตือน', description: 'ศูนย์การแจ้งเตือน', color: 'text-orange-600 bg-orange-50', showBadge: true },
]

export function MorePage() {
  const unreadCount = useAppStore(s => s.notifications.filter(n => !n.isRead).length)

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      <Header title="อื่นๆ" />

      <div className="p-4 space-y-2">
        {menuItems.map(({ to, icon: Icon, label, description, color, showBadge }) => (
          <Link
            key={to}
            to={to}
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
      </div>
    </div>
  )
}
