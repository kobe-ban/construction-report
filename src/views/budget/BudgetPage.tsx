'use client'

import { useState } from 'react'
import { Plus, TrendingUp } from 'lucide-react'
import { Header } from '@/components/layout/Header'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { ProgressBar } from '@/components/ui/ProgressBar'
import { useAppStore } from '@/store/appStore'
import { formatThaiCurrency, formatThaiDateTime } from '@/lib/utils'
import type { WithdrawalRequest } from '@/types'
import { AddWithdrawalModal } from './AddWithdrawalModal'

const statusConfig: Record<WithdrawalRequest['status'], { label: string; variant: 'gray' | 'warning' | 'success' | 'danger' | 'info' }> = {
  draft: { label: 'ร่าง', variant: 'gray' },
  pending: { label: 'รออนุมัติ', variant: 'warning' },
  approved: { label: 'อนุมัติแล้ว', variant: 'success' },
  rejected: { label: 'ถูกปฏิเสธ', variant: 'danger' },
  paid: { label: 'จ่ายแล้ว', variant: 'info' },
}

const categoryColor: Record<string, string> = {
  'วัสดุ': 'bg-blue-100 text-blue-700',
  'แรงงาน': 'bg-purple-100 text-purple-700',
  'เครื่องจักร': 'bg-orange-100 text-orange-700',
  'ค่าใช้จ่ายอื่นๆ': 'bg-gray-100 text-gray-600',
}

export function BudgetPage() {
  const { project, withdrawals } = useAppStore()
  const [showModal, setShowModal] = useState(false)

  const totalApproved = withdrawals.filter(w => w.status === 'approved' || w.status === 'paid').reduce((s, w) => s + w.amount, 0)
  const totalPending = withdrawals.filter(w => w.status === 'pending').reduce((s, w) => s + w.amount, 0)
  const budgetPct = (project.budgetSpent / project.budget) * 100

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      <Header
        title="เบิกเงิน"
        right={
          <Button size="sm" onClick={() => setShowModal(true)}>
            <Plus size={16} className="inline mr-1" />ขอเบิก
          </Button>
        }
      />

      <div className="p-4 space-y-4">
        {/* Budget Overview */}
        <Card>
          <div className="flex items-center gap-2 mb-3">
            <TrendingUp size={18} className="text-blue-600" />
            <h3 className="font-semibold text-gray-900">ภาพรวมงบประมาณ</h3>
          </div>

          <div className="space-y-3">
            <div>
              <div className="flex justify-between text-xs text-gray-600 mb-1">
                <span>ใช้ไปแล้ว</span>
                <span>{formatThaiCurrency(project.budgetSpent)} / {formatThaiCurrency(project.budget)}</span>
              </div>
              <ProgressBar
                value={budgetPct}
                color={budgetPct > 80 ? 'red' : budgetPct > 60 ? 'yellow' : 'green'}
                showLabel
              />
            </div>

            <div className="grid grid-cols-3 gap-2 pt-1">
              <div className="text-center">
                <p className="text-xs text-gray-500">คงเหลือ</p>
                <p className="text-sm font-bold text-green-600">{formatThaiCurrency(project.budget - project.budgetSpent)}</p>
              </div>
              <div className="text-center border-x border-gray-100">
                <p className="text-xs text-gray-500">รออนุมัติ</p>
                <p className="text-sm font-bold text-yellow-600">{formatThaiCurrency(totalPending)}</p>
              </div>
              <div className="text-center">
                <p className="text-xs text-gray-500">อนุมัติแล้ว</p>
                <p className="text-sm font-bold text-blue-600">{formatThaiCurrency(totalApproved)}</p>
              </div>
            </div>
          </div>
        </Card>

        {/* Withdrawal List */}
        <div>
          <h3 className="font-semibold text-gray-800 mb-2">รายการขอเบิก</h3>
          <div className="space-y-3">
            {withdrawals.map(w => {
              const cfg = statusConfig[w.status]
              return (
                <Card key={w.id}>
                  <div className="flex items-start justify-between mb-1">
                    <div className="flex-1">
                      <p className="font-medium text-gray-900 text-sm">{w.title}</p>
                      <p className="text-xs text-gray-500 mt-0.5">{w.description}</p>
                    </div>
                    <Badge variant={cfg.variant}>{cfg.label}</Badge>
                  </div>

                  <div className="flex items-center justify-between mt-3">
                    <div className="flex items-center gap-2">
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${categoryColor[w.category]}`}>
                        {w.category}
                      </span>
                    </div>
                    <p className="text-base font-bold text-gray-900">{formatThaiCurrency(w.amount)}</p>
                  </div>

                  <div className="flex items-center justify-between mt-2 pt-2 border-t border-gray-100">
                    <span className="text-xs text-gray-500">โดย {w.requestedBy}</span>
                    <span className="text-xs text-gray-400">{formatThaiDateTime(w.requestedAt)}</span>
                  </div>

                  {w.approvedBy && (
                    <p className="text-xs text-green-600 mt-1">อนุมัติโดย {w.approvedBy}</p>
                  )}
                </Card>
              )
            })}
          </div>
        </div>
      </div>

      {showModal && <AddWithdrawalModal onClose={() => setShowModal(false)} />}
    </div>
  )
}
