import { useState } from 'react'
import { X } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { useAppStore } from '@/store/appStore'
import type { MaterialUnit } from '@/types'

interface Props {
  onClose: () => void
}

const units: MaterialUnit[] = ['ถุง', 'ตัน', 'กิโลกรัม', 'ลูกบาศก์เมตร', 'ตารางเมตร', 'เมตร', 'ชิ้น', 'แผ่น']

export function AddMaterialModal({ onClose }: Props) {
  const { addMaterial, currentUser } = useAppStore()
  const [materialName, setMaterialName] = useState('')
  const [quantity, setQuantity] = useState('')
  const [unit, setUnit] = useState<MaterialUnit>('ถุง')
  const [pricePerUnit, setPricePerUnit] = useState('')
  const [usedFor, setUsedFor] = useState('')

  const totalCost = parseFloat(quantity || '0') * parseFloat(pricePerUnit || '0')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    addMaterial({
      date: new Date().toISOString().split('T')[0],
      materialId: `mat${Date.now()}`,
      materialName,
      quantity: parseFloat(quantity),
      unit,
      totalCost,
      usedFor,
      requestedBy: currentUser.name,
      status: 'pending',
    })
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative w-full max-w-[480px] mx-auto bg-white rounded-t-3xl p-5 pb-8 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold text-gray-900">เบิกวัสดุ</h2>
          <button onClick={onClose} className="text-gray-500"><X size={20} /></button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm text-gray-700 mb-1 block">ชื่อวัสดุ *</label>
            <input
              className="w-full border border-gray-300 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-blue-500"
              placeholder="เช่น ปูนซีเมนต์ตราช้าง"
              value={materialName}
              onChange={e => setMaterialName(e.target.value)}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-sm text-gray-700 mb-1 block">จำนวน *</label>
              <input
                type="number" min="0.01" step="0.01"
                className="w-full border border-gray-300 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-blue-500"
                placeholder="0"
                value={quantity}
                onChange={e => setQuantity(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="text-sm text-gray-700 mb-1 block">หน่วย *</label>
              <select
                className="w-full border border-gray-300 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-blue-500 bg-white"
                value={unit}
                onChange={e => setUnit(e.target.value as MaterialUnit)}
              >
                {units.map(u => <option key={u} value={u}>{u}</option>)}
              </select>
            </div>
          </div>

          <div>
            <label className="text-sm text-gray-700 mb-1 block">ราคาต่อหน่วย (บาท)</label>
            <input
              type="number" min="0"
              className="w-full border border-gray-300 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-blue-500"
              placeholder="0"
              value={pricePerUnit}
              onChange={e => setPricePerUnit(e.target.value)}
            />
            {totalCost > 0 && (
              <p className="text-xs text-blue-600 mt-1">รวม: {totalCost.toLocaleString('th-TH')} บาท</p>
            )}
          </div>

          <div>
            <label className="text-sm text-gray-700 mb-1 block">ใช้สำหรับ *</label>
            <input
              className="w-full border border-gray-300 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-blue-500"
              placeholder="เช่น งานฐานราก โซน A"
              value={usedFor}
              onChange={e => setUsedFor(e.target.value)}
              required
            />
          </div>

          <Button type="submit" fullWidth size="lg">ส่งคำขอเบิก</Button>
        </form>
      </div>
    </div>
  )
}
