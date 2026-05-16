import { NavLink } from 'react-router-dom'
import { LayoutGrid, Camera, AlertTriangle, Package, Menu } from 'lucide-react'
import { useAppStore } from '@/store/appStore'
import { cn } from '@/lib/utils'

const navItems = [
  { to: '/', icon: LayoutGrid, label: 'สะพาน', exact: true },
  { to: '/report', icon: Camera, label: 'รายงาน' },
  { to: '/problems', icon: AlertTriangle, label: 'ปัญหา' },
  { to: '/materials', icon: Package, label: 'วัสดุ' },
  { to: '/more', icon: Menu, label: 'อื่นๆ' },
]

export function BottomNav() {
  const unreadCount = useAppStore(s => s.notifications.filter(n => !n.isRead).length)

  return (
    <nav className="shrink-0 bg-white border-t border-gray-200 z-50">
      <div className="flex">
        {navItems.map(({ to, icon: Icon, label, exact }) => (
          <NavLink
            key={to}
            to={to}
            end={exact}
            className={({ isActive }) =>
              cn(
                'flex-1 flex flex-col items-center justify-center py-2 gap-0.5 text-xs transition-colors',
                isActive ? 'text-blue-600' : 'text-gray-400'
              )
            }
          >
            <div className="relative">
              <Icon size={22} strokeWidth={1.8} />
              {to === '/more' && unreadCount > 0 && (
                <span className="absolute -top-1 -right-2 bg-red-500 text-white text-[10px] rounded-full min-w-[16px] h-4 flex items-center justify-center px-0.5 font-bold">
                  {unreadCount}
                </span>
              )}
            </div>
            <span>{label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  )
}
