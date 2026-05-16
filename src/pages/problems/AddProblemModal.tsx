import { useState } from 'react'
import { X } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { useAppStore } from '@/store/appStore'
import type { ProblemSeverity } from '@/types'

interface Props {
  onClose: () => void
}

export function AddProblemModal({ onClose }: Props) {
  const { addProblem, currentUser } = useAppStore()
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [severity, setSeverity] = useState<ProblemSeverity>('medium')
  const [location, setLocation] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    addProblem({
      title, description, severity, location,
      status: 'open',
      reportedBy: currentUser.name,
    })
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative w-full max-w-[480px] mx-auto bg-white rounded-t-3xl p-5 pb-8 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold text-gray-900">แจ้งปัญหา</h2>
          <button onClick={onClose} className="text-gray-500"><X size={20} /></button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm text-gray-700 mb-1 block">ชื่อปัญหา *</label>
            <input
              className="w-full border border-gray-300 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-blue-500"
              placeholder="สรุปปัญหาสั้นๆ"
              value={title}
              onChange={e => setTitle(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="text-sm text-gray-700 mb-1 block">รายละเอียด *</label>
            <textarea
              className="w-full border border-gray-300 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-blue-500 resize-none"
              rows={3}
              placeholder="อธิบายปัญหาอย่างละเอียด..."
              value={description}
              onChange={e => setDescription(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="text-sm text-gray-700 mb-2 block">ระดับความรุนแรง *</label>
            <div className="grid grid-cols-2 gap-2">
              {([
                { value: 'low', label: 'ต่ำ', color: 'border-blue-200 bg-blue-50 text-blue-700' },
                { value: 'medium', label: 'ปานกลาง', color: 'border-yellow-200 bg-yellow-50 text-yellow-700' },
                { value: 'high', label: 'สูง', color: 'border-red-200 bg-red-50 text-red-700' },
                { value: 'critical', label: 'วิกฤต', color: 'border-red-400 bg-red-100 text-red-800' },
              ] as { value: ProblemSeverity; label: string; color: string }[]).map(s => (
                <button
                  key={s.value}
                  type="button"
                  onClick={() => setSeverity(s.value)}
                  className={`py-2 rounded-xl border text-sm font-medium transition-all ${s.color} ${severity === s.value ? 'ring-2 ring-offset-1 ring-blue-500' : 'opacity-60'}`}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-sm text-gray-700 mb-1 block">สถานที่ / โซน</label>
            <input
              className="w-full border border-gray-300 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-blue-500"
              placeholder="เช่น โซน A, ชั้น B1"
              value={location}
              onChange={e => setLocation(e.target.value)}
            />
          </div>

          <Button type="submit" fullWidth size="lg" variant="danger">แจ้งปัญหา</Button>
        </form>
      </div>
    </div>
  )
}
