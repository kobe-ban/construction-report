'use client'

import { ArrowLeft } from 'lucide-react'
import { useRouter } from 'next/navigation'

interface HeaderProps {
  title: string
  subtitle?: string
  showBack?: boolean
  right?: React.ReactNode
}

export function Header({ title, subtitle, showBack, right }: HeaderProps) {
  const router = useRouter()

  return (
    <header className="sticky top-0 bg-white border-b border-gray-200 z-40 px-4 py-3">
      <div className="flex items-center gap-3">
        {showBack && (
          <button onClick={() => router.back()} className="p-1 -ml-1 text-gray-600">
            <ArrowLeft size={22} />
          </button>
        )}
        <div className="flex-1 min-w-0">
          <h1 className="font-semibold text-gray-900 truncate">{title}</h1>
          {subtitle && <p className="text-xs text-gray-500 truncate">{subtitle}</p>}
        </div>
        {right}
      </div>
    </header>
  )
}
