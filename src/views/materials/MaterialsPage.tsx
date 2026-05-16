'use client'

import { useState } from 'react'
import { Plus } from 'lucide-react'
import { Header } from '@/components/layout/Header'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { useAppStore } from '@/store/appStore'
import { formatThaiCurrency, formatThaiDate } from '@/lib/utils'
import type { MaterialUsage } from '@/types'
import { AddMaterialModal } from './AddMaterialModal'

const statusConfig: Record<MaterialUsage['status'], { label: string; variant: 'success' | 'warning' | 'danger' }> = {
  approved: { label: 'อนุมัติแล้ว', variant: 'success' },
  pending: { label: 'รอการอนุมัติ', variant: 'warning' },
  rejected: { label: 'ถูกปฏิเสธ', variant: 'danger' },
}

export function MaterialsPage() {
  const { materials } = useAppStore()
  const [showModal, setShowModal] = useState(false)

  const totalCost = materials.filter(m => m.status === 'approved').reduce((sum, m) => sum + m.totalCost, 0)
  const pendingCount = materials.filter(m => m.status === 'pending').length

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      <Header
        title="วัสดุและอุปกรณ์"
        right={
          <Button size="sm" onClick={() => setShowModal(true)}>
            <Plus size={16} className="inline mr-1" />เบิกวัสดุ
          </Button>
        }
      />

      <div className="p-4 space-y-4">
        {/* Summary */}
        <div className="grid grid-cols-2 gap-3">
          <Card className="text-center py-3 bg-green-50 border-green-100">
            <p className="text-sm font-bold text-green-700">{formatThaiCurrency(totalCost)}</p>
            <p className="text-xs text-green-500">มูลค่าที่อนุมัติแล้ว</p>
          </Card>
          <Card className="text-center py-3 bg-yellow-50 border-yellow-100">
            <p className="text-2xl font-bold text-yellow-600">{pendingCount}</p>
            <p className="text-xs text-yellow-500">รายการรอการอนุมัติ</p>
          </Card>
        </div>

        {/* Material List */}
        <div>
          <h3 className="font-semibold text-gray-800 mb-2">รายการเบิกวัสดุ</h3>
          <div className="space-y-3">
            {materials.map(m => {
              const cfg = statusConfig[m.status]
              return (
                <Card key={m.id}>
                  <div className="flex items-start justify-between mb-1">
                    <div>
                      <p className="font-medium text-gray-900 text-sm">{m.materialName}</p>
                      <p className="text-xs text-gray-500">{m.usedFor}</p>
                    </div>
                    <Badge variant={cfg.variant}>{cfg.label}</Badge>
                  </div>

                  <div className="flex items-center justify-between mt-2">
                    <div className="flex items-center gap-3">
                      <span className="text-sm text-gray-700 font-medium">
                        {m.quantity.toLocaleString('th-TH')} {m.unit}
                      </span>
                      <span className="text-sm font-semibold text-blue-600">
                        {formatThaiCurrency(m.totalCost)}
                      </span>
                    </div>
                    <span className="text-xs text-gray-400">{formatThaiDate(m.date)}</span>
                  </div>

                  <div className="flex items-center justify-between mt-2 pt-2 border-t border-gray-100">
                    <span className="text-xs text-gray-500">โดย {m.requestedBy}</span>
                    {m.approvedBy && (
                      <span className="text-xs text-green-600">อนุมัติโดย {m.approvedBy}</span>
                    )}
                  </div>
                </Card>
              )
            })}
          </div>
        </div>
      </div>

      {showModal && <AddMaterialModal onClose={() => setShowModal(false)} />}
    </div>
  )
}
