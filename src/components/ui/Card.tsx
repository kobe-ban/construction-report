import { cn } from '@/lib/utils'

interface CardProps {
  children: React.ReactNode
  className?: string
  onClick?: () => void
}

export function Card({ children, className, onClick }: CardProps) {
  return (
    <div
      className={cn('bg-white rounded-2xl shadow-sm border border-gray-100 p-4', onClick && 'cursor-pointer active:bg-gray-50', className)}
      onClick={onClick}
    >
      {children}
    </div>
  )
}
