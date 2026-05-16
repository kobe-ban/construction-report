import { useState } from 'react'
import { Plus, AlertTriangle, AlertOctagon, Info, CheckCircle2 } from 'lucide-react'
import { Header } from '@/components/layout/Header'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { useAppStore } from '@/store/appStore'
import { timeAgo } from '@/lib/utils'
import type { ProblemSeverity, ProblemStatus } from '@/types'
import { AddProblemModal } from './AddProblemModal'

const severityConfig: Record<ProblemSeverity, { label: string; variant: 'danger' | 'warning' | 'info' | 'gray'; icon: React.ReactNode }> = {
  critical: { label: 'วิกฤต', variant: 'danger', icon: <AlertOctagon size={14} /> },
  high: { label: 'สูง', variant: 'danger', icon: <AlertTriangle size={14} /> },
  medium: { label: 'ปานกลาง', variant: 'warning', icon: <AlertTriangle size={14} /> },
  low: { label: 'ต่ำ', variant: 'info', icon: <Info size={14} /> },
}

const statusConfig: Record<ProblemStatus, { label: string; variant: 'gray' | 'warning' | 'success' | 'default' }> = {
  open: { label: 'เปิด', variant: 'default' },
  in_progress: { label: 'กำลังแก้ไข', variant: 'warning' },
  resolved: { label: 'แก้ไขแล้ว', variant: 'success' },
  closed: { label: 'ปิด', variant: 'gray' },
}

const filterTabs: { key: 'all' | ProblemStatus; label: string }[] = [
  { key: 'all', label: 'ทั้งหมด' },
  { key: 'open', label: 'เปิด' },
  { key: 'in_progress', label: 'กำลังแก้ไข' },
  { key: 'resolved', label: 'แก้ไขแล้ว' },
]

export function ProblemsPage() {
  const { problems, updateProblemStatus } = useAppStore()
  const [filter, setFilter] = useState<'all' | ProblemStatus>('all')
  const [showModal, setShowModal] = useState(false)

  const filtered = filter === 'all' ? problems : problems.filter(p => p.status === filter)

  const criticalCount = problems.filter(p => p.severity === 'critical' && p.status === 'open').length
  const openCount = problems.filter(p => p.status === 'open').length

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      <Header
        title="รายงานปัญหา"
        right={
          <Button size="sm" variant="danger" onClick={() => setShowModal(true)}>
            <Plus size={16} className="inline mr-1" />แจ้งปัญหา
          </Button>
        }
      />

      <div className="p-4 space-y-4">
        {/* Summary */}
        <div className="grid grid-cols-3 gap-3">
          <Card className="text-center py-3">
            <p className="text-2xl font-bold text-gray-900">{openCount}</p>
            <p className="text-xs text-gray-500">ปัญหาที่เปิดอยู่</p>
          </Card>
          <Card className="text-center py-3 border-red-100 bg-red-50">
            <p className="text-2xl font-bold text-red-600">{criticalCount}</p>
            <p className="text-xs text-red-500">วิกฤต</p>
          </Card>
          <Card className="text-center py-3 border-green-100 bg-green-50">
            <p className="text-2xl font-bold text-green-600">{problems.filter(p => p.status === 'resolved').length}</p>
            <p className="text-xs text-green-500">แก้ไขแล้ว</p>
          </Card>
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
          {filterTabs.map(tab => (
            <button
              key={tab.key}
              onClick={() => setFilter(tab.key)}
              className={`shrink-0 px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                filter === tab.key ? 'bg-blue-600 text-white' : 'bg-white text-gray-600 border border-gray-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Problem List */}
        <div className="space-y-3">
          {filtered.map(problem => {
            const sevCfg = severityConfig[problem.severity]
            const stCfg = statusConfig[problem.status]
            return (
              <Card key={problem.id}>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2 flex-1">
                    <span className={`text-${problem.severity === 'critical' || problem.severity === 'high' ? 'red' : problem.severity === 'medium' ? 'yellow' : 'blue'}-500`}>
                      {sevCfg.icon}
                    </span>
                    <p className="font-medium text-gray-900 text-sm">{problem.title}</p>
                  </div>
                  <Badge variant={sevCfg.variant}>{sevCfg.label}</Badge>
                </div>

                <p className="text-sm text-gray-600 mb-3">{problem.description}</p>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Badge variant={stCfg.variant}>{stCfg.label}</Badge>
                    {problem.location && (
                      <span className="text-xs text-gray-400">{problem.location}</span>
                    )}
                  </div>
                  <span className="text-xs text-gray-400">{timeAgo(problem.createdAt)}</span>
                </div>

                {problem.assignedTo && (
                  <p className="text-xs text-gray-500 mt-2">มอบหมายให้: {problem.assignedTo}</p>
                )}

                {problem.status === 'open' && (
                  <div className="flex gap-2 mt-3 pt-3 border-t border-gray-100">
                    <Button size="sm" variant="secondary" fullWidth onClick={() => updateProblemStatus(problem.id, 'in_progress')}>
                      รับเรื่อง
                    </Button>
                    <Button size="sm" variant="primary" fullWidth onClick={() => updateProblemStatus(problem.id, 'resolved')}>
                      <CheckCircle2 size={14} className="inline mr-1" />แก้ไขแล้ว
                    </Button>
                  </div>
                )}
                {problem.status === 'in_progress' && (
                  <Button size="sm" variant="primary" fullWidth className="mt-3" onClick={() => updateProblemStatus(problem.id, 'resolved')}>
                    <CheckCircle2 size={14} className="inline mr-1" />ทำเครื่องหมายแก้ไขแล้ว
                  </Button>
                )}
              </Card>
            )
          })}
        </div>
      </div>

      {showModal && <AddProblemModal onClose={() => setShowModal(false)} />}
    </div>
  )
}
