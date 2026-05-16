import { useState } from 'react'
import { X } from 'lucide-react'
import { Button } from '@/components/ui/Button'

interface Props {
  onClose: () => void
}

export function AddProgressModal({ onClose }: Props) {
  const [taskName, setTaskName] = useState('')
  const [planned, setPlanned] = useState('')
  const [actual, setActual] = useState('')
  const [note, setNote] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // In real app: call store action
    alert(`บันทึกรายงาน: ${taskName} แผน ${planned}% จริง ${actual}%`)
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative w-full max-w-[480px] mx-auto bg-white rounded-t-3xl p-5 pb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold text-gray-900">รายงานความคืบหน้า</h2>
          <button onClick={onClose} className="text-gray-500"><X size={20} /></button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm text-gray-700 mb-1 block">ชื่องาน</label>
            <input
              className="w-full border border-gray-300 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-blue-500"
              placeholder="เช่น งานฐานราก"
              value={taskName}
              onChange={e => setTaskName(e.target.value)}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-sm text-gray-700 mb-1 block">แผน (%)</label>
              <input
                type="number" min="0" max="100"
                className="w-full border border-gray-300 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-blue-500"
                placeholder="0"
                value={planned}
                onChange={e => setPlanned(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="text-sm text-gray-700 mb-1 block">จริง (%)</label>
              <input
                type="number" min="0" max="100"
                className="w-full border border-gray-300 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-blue-500"
                placeholder="0"
                value={actual}
                onChange={e => setActual(e.target.value)}
                required
              />
            </div>
          </div>

          <div>
            <label className="text-sm text-gray-700 mb-1 block">หมายเหตุ</label>
            <textarea
              className="w-full border border-gray-300 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-blue-500 resize-none"
              rows={3}
              placeholder="ระบุรายละเอียดเพิ่มเติม..."
              value={note}
              onChange={e => setNote(e.target.value)}
            />
          </div>

          <Button type="submit" fullWidth size="lg">บันทึกรายงาน</Button>
        </form>
      </div>
    </div>
  )
}
