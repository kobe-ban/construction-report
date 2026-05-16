'use client'

import { useState } from 'react'
import { Plus, TrendingUp, TrendingDown, Minus } from 'lucide-react'
import { Header } from '@/components/layout/Header'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { ProgressBar } from '@/components/ui/ProgressBar'
import { Button } from '@/components/ui/Button'
import { useAppStore } from '@/store/appStore'
import { mockProgressReports } from '@/lib/mockData'
import { formatThaiDate, formatThaiCurrency } from '@/lib/utils'
import type { ProgressStatus } from '@/types'
import { AddProgressModal } from './AddProgressModal'

const statusConfig: Record<ProgressStatus, { label: string; variant: 'success' | 'warning' | 'danger' | 'gray' }> = {
  completed: { label: 'เสร็จสิ้น', variant: 'success' },
  on_track: { label: 'ตามแผน', variant: 'success' },
  delayed: { label: 'ล่าช้า', variant: 'danger' },
  not_started: { label: 'ยังไม่เริ่ม', variant: 'gray' },
}

export function ProgressPage() {
  const project = useAppStore(s => s.project)
  const [showModal, setShowModal] = useState(false)
  const report = mockProgressReports[0]

  const budgetPct = (project.budgetSpent / project.budget) * 100

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      <Header
        title="ความคืบหน้าโครงการ"
        subtitle={project.name}
        right={
          <Button size="sm" onClick={() => setShowModal(true)}>
            <Plus size={16} className="inline mr-1" />รายงาน
          </Button>
        }
      />

      <div className="p-4 space-y-4">
        {/* Project Overview Card */}
        <Card>
          <div className="flex items-start justify-between mb-3">
            <div>
              <h2 className="font-semibold text-gray-900">{project.name}</h2>
              <p className="text-xs text-gray-500 mt-0.5">{project.location}</p>
            </div>
            <Badge variant={project.overallProgress >= 40 ? 'success' : 'warning'}>
              {project.overallProgress}%
            </Badge>
          </div>

          <div className="space-y-3">
            <div>
              <div className="flex justify-between text-xs text-gray-600 mb-1">
                <span>ความคืบหน้าโดยรวม</span>
                <span>{project.overallProgress}% / แผน 41%</span>
              </div>
              <ProgressBar value={project.overallProgress} color="blue" showLabel />
              <div className="relative mt-0.5">
                <div className="absolute h-2 w-0.5 bg-orange-400" style={{ left: '41%' }} />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-1">
              <div className="bg-blue-50 rounded-xl p-3">
                <p className="text-xs text-blue-600 mb-1">งบประมาณทั้งหมด</p>
                <p className="font-semibold text-blue-900 text-sm">{formatThaiCurrency(project.budget)}</p>
              </div>
              <div className="bg-orange-50 rounded-xl p-3">
                <p className="text-xs text-orange-600 mb-1">ใช้ไปแล้ว ({Math.round(budgetPct)}%)</p>
                <p className="font-semibold text-orange-900 text-sm">{formatThaiCurrency(project.budgetSpent)}</p>
              </div>
            </div>
          </div>
        </Card>

        {/* Latest Report */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-semibold text-gray-800">รายงานล่าสุด</h3>
            <span className="text-xs text-gray-500">{formatThaiDate(report.date)}</span>
          </div>

          {report.note && (
            <Card className="mb-3 bg-blue-50 border-blue-100">
              <p className="text-sm text-blue-800">{report.note}</p>
              <p className="text-xs text-blue-500 mt-1">โดย {report.reportedBy}</p>
            </Card>
          )}

          <div className="space-y-2">
            {report.tasks.map(task => {
              const diff = task.actualPercent - task.plannedPercent
              const cfg = statusConfig[task.status]
              return (
                <Card key={task.id}>
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <p className="font-medium text-gray-900 text-sm">{task.name}</p>
                      {task.note && <p className="text-xs text-gray-500 mt-0.5">{task.note}</p>}
                    </div>
                    <Badge variant={cfg.variant}>{cfg.label}</Badge>
                  </div>

                  <div className="space-y-1.5">
                    <div>
                      <div className="flex justify-between text-xs text-gray-500 mb-1">
                        <span>แผน</span><span>{task.plannedPercent}%</span>
                      </div>
                      <ProgressBar value={task.plannedPercent} color="yellow" />
                    </div>
                    <div>
                      <div className="flex justify-between text-xs text-gray-500 mb-1">
                        <span>จริง</span><span>{task.actualPercent}%</span>
                      </div>
                      <ProgressBar
                        value={task.actualPercent}
                        color={task.status === 'completed' ? 'green' : task.status === 'delayed' ? 'red' : 'blue'}
                      />
                    </div>
                  </div>

                  {task.status !== 'not_started' && (
                    <div className="flex items-center gap-1 mt-2">
                      {diff < 0
                        ? <TrendingDown size={12} className="text-red-500" />
                        : diff > 0
                        ? <TrendingUp size={12} className="text-green-500" />
                        : <Minus size={12} className="text-gray-400" />
                      }
                      <span className={`text-xs ${diff < 0 ? 'text-red-500' : diff > 0 ? 'text-green-500' : 'text-gray-400'}`}>
                        {diff < 0 ? `ล่าช้า ${Math.abs(diff)}%` : diff > 0 ? `เร็วกว่าแผน ${diff}%` : 'ตามแผน'}
                      </span>
                    </div>
                  )}
                </Card>
              )
            })}
          </div>
        </div>
      </div>

      {showModal && <AddProgressModal onClose={() => setShowModal(false)} />}
    </div>
  )
}

