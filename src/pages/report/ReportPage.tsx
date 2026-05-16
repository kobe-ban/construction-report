import { useState, useRef } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { Camera, X, ArrowLeft, ArrowRight, CheckCircle2, ChevronDown, ChevronUp, ImagePlus } from 'lucide-react'
import { useAppStore } from '@/store/appStore'
import { BRIDGE_STAGES } from '@/types'
import type { WeatherCondition, ReportPhoto } from '@/types'
import { Button } from '@/components/ui/Button'

const weatherOptions: WeatherCondition[] = ['แดดจัด', 'มีเมฆ', 'ฝนตกเล็กน้อย', 'ฝนตก', 'มีลม']
const weatherEmoji: Record<WeatherCondition, string> = {
  'แดดจัด': '☀️', 'มีเมฆ': '⛅', 'ฝนตกเล็กน้อย': '🌦️', 'ฝนตก': '🌧️', 'มีลม': '💨',
}

const quickNotes = [
  'งานเป็นไปตามแผน',
  'ล่าช้าเล็กน้อย',
  'รอวัสดุ',
  'ฝนตกหยุดงาน',
  'เครื่องจักรเสีย',
  'คนงานไม่พอ',
]

const WIZARD_STEPS = ['เลือกสะพาน', 'ขั้นตอนงาน', 'รายละเอียด']

export function ReportPage() {
  const [params] = useSearchParams()
  const navigate = useNavigate()
  const { bridges, submitReport, currentUser } = useAppStore()

  const preselectedBridgeId = params.get('bridgeId')
  const getCurrentStage = (targetBridgeId: string) => {
    const targetBridge = bridges.find(b => b.id === targetBridgeId)
    return targetBridge ? BRIDGE_STAGES.find(s => s.step === targetBridge.currentStep) : undefined
  }
  const initialStage = getCurrentStage(preselectedBridgeId ?? bridges[0]?.id ?? '')
  const [bridgeId, setBridgeId] = useState(preselectedBridgeId ?? bridges[0]?.id ?? '')
  const [step, setStep] = useState<number | null>(initialStage?.step ?? null)
  const [concurrentStep, setConcurrentStep] = useState<number | null>(initialStage?.concurrentWith ?? null)
  const [note, setNote] = useState('')
  const [weather, setWeather] = useState<WeatherCondition>('มีเมฆ')
  const [photos, setPhotos] = useState<ReportPhoto[]>([])
  const [submitted, setSubmitted] = useState(false)
  const [wizardStep, setWizardStep] = useState(preselectedBridgeId ? 1 : 0)
  const [showAllStages, setShowAllStages] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const bridge = bridges.find(b => b.id === bridgeId)
  const today = new Date().toISOString().split('T')[0]


  const handleBridgeChange = (newBridgeId: string) => {
    const currentStage = getCurrentStage(newBridgeId)
    setBridgeId(newBridgeId)
    setStep(currentStage?.step ?? null)
    setConcurrentStep(currentStage?.concurrentWith ?? null)
  }

  const handlePhotoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? [])
    files.forEach(file => {
      const reader = new FileReader()
      reader.onload = ev => {
        const url = ev.target?.result as string
        const newPhoto: ReportPhoto = {
          id: `photo${Date.now()}_${Math.random()}`,
          url,
          caption: '',
          takenAt: new Date().toISOString(),
        }
        setPhotos(prev => [...prev, newPhoto])
      }
      reader.readAsDataURL(file)
    })
    e.target.value = ''
  }

  const removePhoto = (id: string) => {
    setPhotos(prev => prev.filter(p => p.id !== id))
  }

  const toggleQuickNote = (qn: string) => {
    setNote(prev => {
      if (prev.includes(qn)) {
        return prev.replace(qn, '').replace(/\n{2,}/g, '\n').trim()
      }
      return prev ? `${prev}\n${qn}` : qn
    })
  }

  const handleSubmit = () => {
    if (!step) return

    submitReport({
      bridgeId,
      date: today,
      step,
      concurrentStep: concurrentStep ?? undefined,
      note,
      photos,
      reportedBy: currentUser.name,
      weatherCondition: weather,
    })
    setSubmitted(true)
  }

  const canGoNext = () => {
    if (wizardStep === 0) return !!bridgeId
    if (wizardStep === 1) return !!step
    return true
  }

  const goNext = () => {
    if (wizardStep < 2) setWizardStep(wizardStep + 1)
    else handleSubmit()
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-8 text-center">
        <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mb-4 animate-[bounceIn_0.4s_ease-out]">
          <CheckCircle2 size={40} className="text-green-600" />
        </div>
        <h2 className="text-xl font-bold text-gray-900 mb-1">ส่งรายงานแล้ว!</h2>
        <p className="text-gray-500 text-sm mb-6">รายงานของ {bridge?.name} วันนี้ถูกบันทึกเรียบร้อย</p>
        <div className="flex gap-3 w-full max-w-xs">
          <Button variant="secondary" fullWidth onClick={() => navigate(`/bridge/${bridgeId}`)}>
            ดูไทม์ไลน์
          </Button>
          <Button fullWidth onClick={() => navigate('/')}>
            กลับหน้าหลัก
          </Button>
        </div>
      </div>
    )
  }

  const selectedStage = BRIDGE_STAGES.find(s => s.step === step)

  // For step selector: show current ยฑ1 by default, expand to see all
  const relevantStages = showAllStages
    ? BRIDGE_STAGES
    : BRIDGE_STAGES.filter(s => {
        const current = bridge?.currentStep ?? 1
        return s.step >= current - 1 && s.step <= current + 1
      })
  const hiddenCount = BRIDGE_STAGES.length - relevantStages.length

  return (
    <div className="h-full flex flex-col bg-gray-50">
      {/* Header */}
      <div className="shrink-0 bg-white border-b border-gray-200 z-40 px-4 py-3">
        <div className="flex items-center gap-3 mb-3">
          <button onClick={() => wizardStep > 0 ? setWizardStep(wizardStep - 1) : navigate(-1)} className="p-1 -ml-1 text-gray-600">
            <ArrowLeft size={22} />
          </button>
          <h1 className="font-semibold text-gray-900 flex-1">รายงานประจำวัน</h1>
          <span className="text-xs text-gray-400">
            {new Date().toLocaleDateString('th-TH', { day: 'numeric', month: 'short', year: 'numeric' })}
          </span>
        </div>

        {/* Wizard progress */}
        <div className="flex items-center gap-1">
          {WIZARD_STEPS.map((label, i) => (
            <div key={label} className="flex-1 flex flex-col items-center gap-1">
              <div className="w-full h-1.5 rounded-full overflow-hidden bg-gray-100">
                <div
                  className="h-full rounded-full transition-all duration-300"
                  style={{
                    width: wizardStep > i ? '100%' : wizardStep === i ? '50%' : '0%',
                    backgroundColor: wizardStep >= i ? '#2563eb' : '#e5e7eb',
                  }}
                />
              </div>
              <span className={`text-[10px] ${wizardStep >= i ? 'text-blue-600 font-medium' : 'text-gray-400'}`}>
                {label}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Main scrollable area */}
      <div className="flex-1 overflow-y-auto p-4">
        {/* ===== WIZARD STEP 0: Select Bridge ===== */}
        {wizardStep === 0 && (
          <div className="space-y-3">
            <p className="text-lg font-semibold text-gray-800">วันนี้ทำสะพานตัวไหน?</p>
            <div className="grid grid-cols-2 gap-3">
              {bridges.map(b => (
                <button
                  key={b.id}
                  type="button"
                  onClick={() => {
                    handleBridgeChange(b.id)
                    // Auto advance after selecting
                    setTimeout(() => setWizardStep(1), 200)
                  }}
                  className={`p-4 rounded-2xl border-2 text-left transition-all ${
                    bridgeId === b.id ? 'shadow-md scale-[1.02]' : 'border-gray-200'
                  }`}
                  style={bridgeId === b.id ? { borderColor: b.color, backgroundColor: `${b.color}10` } : {}}
                >
                  <div
                    className="text-sm font-bold px-2 py-0.5 rounded-lg text-white inline-block mb-2"
                    style={{ backgroundColor: b.color }}
                  >
                    {b.code}
                  </div>
                  <p className="text-sm font-medium text-gray-800">{b.name}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{b.workerName}</p>
                  <p className="text-[10px] text-gray-400 mt-1">ขั้นตอนที่ {b.currentStep}/10</p>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ===== WIZARD STEP 1: Select Work Step ===== */}
        {wizardStep === 1 && (
          <div className="space-y-3">
            <div>
              <p className="text-lg font-semibold text-gray-800">ขั้นตอนที่ทำวันนี้</p>
              {bridge && (
                <p className="text-xs text-gray-400 mt-0.5">
                  {bridge.name} — ขั้นตอนปัจจุบัน: {BRIDGE_STAGES.find(s => s.step === bridge.currentStep)?.name ?? '-'}
                </p>
              )}
            </div>

            {/* Current step highlight */}
            {selectedStage && (
              <div className="p-4 rounded-2xl bg-blue-50 border-2 border-blue-200">
                <div className="flex items-center gap-2 mb-1">
                  <span className="w-7 h-7 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm font-bold">
                    {selectedStage.step}
                  </span>
                  <span className="font-semibold text-blue-800">{selectedStage.name}</span>
                </div>
                <p className="text-xs text-blue-600 ml-9">{selectedStage.description}</p>
              </div>
            )}

            <div className="space-y-2">
              {relevantStages.map(stage => {
                const isCurrent = bridge?.currentStep === stage.step
                const isDone = (bridge?.currentStep ?? 0) > stage.step
                const isSelected = step === stage.step
                if (isSelected) return null // already shown above
                return (
                  <button
                    key={stage.step}
                    type="button"
                    onClick={() => {
                      setStep(stage.step)
                      setConcurrentStep(stage.concurrentWith ?? null)
                    }}
                    className={`w-full text-left px-4 py-3 rounded-xl border-2 transition-all flex items-center gap-3 ${
                      isDone
                        ? 'border-gray-100 bg-gray-50 opacity-50'
                        : isCurrent
                        ? 'border-orange-300 bg-orange-50'
                        : 'border-gray-200 bg-white'
                    }`}
                  >
                    <span className={`text-xs w-6 h-6 rounded-full flex items-center justify-center font-bold ${
                      isDone ? 'bg-green-100 text-green-600' : isCurrent ? 'bg-orange-200 text-orange-700' : 'bg-gray-200 text-gray-500'
                    }`}>
                      {isDone ? '✓' : stage.step}
                    </span>
                    <div className="flex-1">
                      <span className="text-sm text-gray-800">{stage.name}</span>
                      {isCurrent && <span className="ml-2 text-[10px] text-orange-600 font-semibold bg-orange-100 px-1.5 py-0.5 rounded-full">กำลังทำ</span>}
                    </div>
                  </button>
                )
              })}

              {!showAllStages && hiddenCount > 0 && (
                <button
                  type="button"
                  onClick={() => setShowAllStages(true)}
                  className="w-full py-2 text-center text-sm text-blue-600 flex items-center justify-center gap-1"
                >
                  <ChevronDown size={16} /> ดูขั้นตอนทั้งหมด ({hiddenCount} ขั้นตอน)
                </button>
              )}
              {showAllStages && (
                <button
                  type="button"
                  onClick={() => setShowAllStages(false)}
                  className="w-full py-2 text-center text-sm text-gray-400 flex items-center justify-center gap-1"
                >
                  <ChevronUp size={16} /> ย่อ
                </button>
              )}
            </div>
          </div>
        )}

        {/* ===== WIZARD STEP 2: Details (Weather, Photos, Note) ===== */}
        {wizardStep === 2 && (
          <div className="space-y-5">
            {/* Summary bar */}
            <div className="flex items-center gap-2 p-3 rounded-xl bg-white border border-gray-200">
              {bridge && (
                <>
                  <span className="text-xs font-bold px-2 py-0.5 rounded text-white" style={{ backgroundColor: bridge.color }}>
                    {bridge.code}
                  </span>
                  <span className="text-sm text-gray-700">{bridge.name}</span>
                  <span className="text-gray-300 mx-1">·</span>
                </>
              )}
              <span className="text-sm text-blue-600 font-medium">ขั้นตอน {step}: {selectedStage?.name}</span>
            </div>

            {/* Weather - bigger tap targets */}
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">สภาพอากาศ</label>
              <div className="grid grid-cols-5 gap-2">
                {weatherOptions.map(w => (
                  <button
                    key={w}
                    type="button"
                    onClick={() => setWeather(w)}
                    className={`flex flex-col items-center py-3 rounded-xl border-2 transition-all ${
                      weather === w
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 bg-white'
                    }`}
                  >
                    <span className="text-2xl mb-1">{weatherEmoji[w]}</span>
                    <span className={`text-[10px] leading-tight text-center ${weather === w ? 'text-blue-700 font-medium' : 'text-gray-500'}`}>{w}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Photos */}
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                รูปถ่ายหน้างาน {photos.length > 0 && <span className="text-gray-400 font-normal">({photos.length} รูป)</span>}
              </label>

              <div className="grid grid-cols-3 gap-2">
                {photos.map(photo => (
                  <div key={photo.id} className="relative aspect-square">
                    <img src={photo.url} alt="" className="w-full h-full object-cover rounded-xl" />
                    <button
                      type="button"
                      onClick={() => removePhoto(photo.id)}
                      className="absolute top-1 right-1 w-6 h-6 bg-black/60 rounded-full flex items-center justify-center"
                    >
                      <X size={12} className="text-white" />
                    </button>
                  </div>
                ))}

                {/* Camera button */}
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="aspect-square rounded-xl border-2 border-dashed border-blue-300 bg-blue-50 flex flex-col items-center justify-center text-blue-500 active:bg-blue-100"
                >
                  <Camera size={24} />
                  <span className="text-xs mt-1 font-medium">ถ่ายรูป</span>
                </button>

                {/* Gallery button */}
                <button
                  type="button"
                  onClick={() => {
                    if (fileInputRef.current) {
                      fileInputRef.current.removeAttribute('capture')
                      fileInputRef.current.click()
                      setTimeout(() => fileInputRef.current?.setAttribute('capture', 'environment'), 100)
                    }
                  }}
                  className="aspect-square rounded-xl border-2 border-dashed border-gray-300 flex flex-col items-center justify-center text-gray-400 active:bg-gray-50"
                >
                  <ImagePlus size={24} />
                  <span className="text-xs mt-1">คลังรูป</span>
                </button>
              </div>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple
                capture="environment"
                className="hidden"
                onChange={handlePhotoSelect}
              />
            </div>

            {/* Quick notes */}
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">บันทึกหน้างาน</label>
              <div className="flex gap-2 flex-wrap mb-2">
                {quickNotes.map(qn => (
                  <button
                    key={qn}
                    type="button"
                    onClick={() => toggleQuickNote(qn)}
                    className={`px-3 py-1.5 rounded-full text-xs border transition-all ${
                      note.includes(qn)
                        ? 'border-blue-500 bg-blue-50 text-blue-700 font-medium'
                        : 'border-gray-200 text-gray-600 bg-white'
                    }`}
                  >
                    {qn}
                  </button>
                ))}
              </div>
              <textarea
                className="w-full border border-gray-300 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-blue-500 resize-none bg-white"
                rows={3}
                placeholder="หรือพิมพ์เพิ่มเติม..."
                value={note}
                onChange={e => setNote(e.target.value)}
              />
            </div>
          </div>
        )}
      </div>

      {/* Bottom action bar */}
      <div className="shrink-0 bg-white border-t border-gray-200 p-4">
        {wizardStep < 2 ? (
          <Button
            fullWidth
            size="lg"
            disabled={!canGoNext()}
            onClick={goNext}
          >
            ถัดไป <ArrowRight size={18} className="inline ml-1" />
          </Button>
        ) : (
          <Button
            fullWidth
            size="lg"
            disabled={!step || !bridgeId}
            onClick={handleSubmit}
          >
            <CheckCircle2 size={18} className="inline mr-2" />
            ส่งรายงานวันนี้
          </Button>
        )}
      </div>
    </div>
  )
}





