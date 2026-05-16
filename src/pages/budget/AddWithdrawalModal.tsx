import { useState } from 'react'
import { X } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { useAppStore } from '@/store/appStore'
import type { WithdrawalCategory } from '@/types'

interface Props {
  onClose: () => void
}

const categories: WithdrawalCategory[] = ['วัสดุ', 'แรงงาน', 'เครื่องจักร', 'ค่าใช้จ่ายอื่นๆ']

export function AddWithdrawalModal({ onClose }: Props) {
  const { addWithdrawal, currentUser } = useAppStore()
  const [title, setTitle] = useState('')
  const [category, setCategory] = useState<WithdrawalCategory>('วัสดุ')
  const [amount, setAmount] = useState('')
  const [description, setDescription] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    addWithdrawal({
      title, category,
      amount: parseFloat(amount),
      description,
      requestedBy: currentUser.name,
    })
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative w-full max-w-[480px] mx-auto bg-white rounded-t-3xl p-5 pb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold text-gray-900">ขอเบิกเงิน</h2>
          <button onClick={onClose} className="text-gray-500"><X size={20} /></button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm text-gray-700 mb-1 block">หัวข้อการเบิก *</label>
            <input
              className="w-full border border-gray-300 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-blue-500"
              placeholder="เช่น ค่าวัสดุก่อสร้างเดือนพฤษภาคม"
              value={title}
              onChange={e => setTitle(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="text-sm text-gray-700 mb-2 block">ประเภท *</label>
            <div className="grid grid-cols-2 gap-2">
              {categories.map(c => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setCategory(c)}
                  className={`py-2 rounded-xl border text-sm font-medium transition-all ${
                    category === c
                      ? 'border-blue-500 bg-blue-50 text-blue-700 ring-1 ring-blue-500'
                      : 'border-gray-200 text-gray-600'
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-sm text-gray-700 mb-1 block">จำนวนเงิน (บาท) *</label>
            <input
              type="number" min="1"
              className="w-full border border-gray-300 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-blue-500"
              placeholder="0"
              value={amount}
              onChange={e => setAmount(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="text-sm text-gray-700 mb-1 block">รายละเอียด</label>
            <textarea
              className="w-full border border-gray-300 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-blue-500 resize-none"
              rows={3}
              placeholder="ระบุรายละเอียดการใช้จ่าย..."
              value={description}
              onChange={e => setDescription(e.target.value)}
            />
          </div>

          <Button type="submit" fullWidth size="lg">ส่งคำขอ</Button>
        </form>
      </div>
    </div>
  )
}
