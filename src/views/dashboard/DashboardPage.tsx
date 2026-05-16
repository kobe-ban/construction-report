'use client'

import { useRouter } from 'next/navigation'
import { ChevronRight, CheckCircle2, Clock, Image } from 'lucide-react'
import { useAppStore } from '@/store/appStore'
import { BRIDGE_STAGES } from '@/types'
import { timeAgo } from '@/lib/utils'

const weatherEmoji: Record<string, string> = {
  'แดดจัด': '☀️', 'มีเมฆ': '⛅', 'ฝนตก': '🌧️', 'ฝนตกเล็กน้อย': '🌦️', 'มีลม': '💨',
}

export function DashboardPage() {
  const { bridges, getLatestReport, getTodayReport } = useAppStore()
  const router = useRouter()

  const allReported = bridges.filter(b => getTodayReport(b.id)).length

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      {/* Top Header */}
      <div className="bg-white border-b border-gray-200 px-4 pt-12 pb-4">
        <p className="text-xs text-gray-400 mb-0.5">
          {new Date().toLocaleDateString('th-TH', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
        </p>
        <h1 className="text-xl font-bold text-gray-900">สะพาน Bebo Arch</h1>
        <p className="text-sm text-gray-500 mt-0.5">รายงานวันนี้ {allReported}/{bridges.length} สะพาน</p>

        {/* Progress dots */}
        <div className="flex gap-2 mt-3">
          {bridges.map(b => {
            const reported = !!getTodayReport(b.id)
            return (
              <div key={b.id} className="flex items-center gap-1.5">
                <div
                  className={`w-2.5 h-2.5 rounded-full ${reported ? '' : 'opacity-30'}`}
                  style={{ backgroundColor: b.color }}
                />
                <span className="text-xs text-gray-500">{b.code}</span>
              </div>
            )
          })}
        </div>
      </div>

      <div className="p-4 space-y-3">
        {bridges.map(b => {
          const stage = BRIDGE_STAGES.find(s => s.step === b.currentStep)
          const latestReport = getLatestReport(b.id)
          const todayReport = getTodayReport(b.id)
          const progressPct = Math.round(((b.currentStep - 1) / 10) * 100)

          return (
            <button
              key={b.id}
              onClick={() => router.push(`/bridge/${b.id}`)}
              className="w-full text-left bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden active:bg-gray-50 transition-colors"
            >
              {/* Color bar top */}
              <div className="h-1.5" style={{ backgroundColor: b.color }} />

              <div className="p-4">
                {/* Header row */}
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span
                        className="text-xs font-bold px-2 py-0.5 rounded-full text-white"
                        style={{ backgroundColor: b.color }}
                      >
                        {b.code}
                      </span>
                      {todayReport ? (
                        <span className="text-xs text-green-600 font-medium flex items-center gap-1">
                          <CheckCircle2 size={12} />รายงานแล้ว
                        </span>
                      ) : (
                        <span className="text-xs text-orange-500 font-medium flex items-center gap-1">
                          <Clock size={12} />รอรายงาน
                        </span>
                      )}
                    </div>
                    <p className="font-semibold text-gray-900 mt-1">{b.name}</p>
                    <p className="text-xs text-gray-400">{b.location}</p>
                  </div>
                  <ChevronRight size={18} className="text-gray-300 mt-1" />
                </div>

                {/* Current step */}
                <div className="bg-gray-50 rounded-xl p-3 mb-3">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs text-gray-500">ขั้นตอนปัจจุบัน</span>
                    <span className="text-xs text-gray-400">วันที่ {b.currentStepDay}/{stage?.durationDays ?? '?'} ในขั้นนี้</span>
                  </div>
                  <p className="text-sm font-semibold text-gray-900">
                    {b.currentStep}. {stage?.name ?? 'เสร็จสิ้น'}
                  </p>
                  {stage?.description && (
                    <p className="text-xs text-gray-500 mt-0.5">{stage.description}</p>
                  )}
                </div>

                {/* Progress bar */}
                <div className="mb-3">
                  <div className="flex justify-between text-xs text-gray-400 mb-1">
                    <span>ความคืบหน้าโดยรวม</span>
                    <span>ขั้น {b.currentStep}/10</span>
                  </div>
                  <div className="bg-gray-100 rounded-full h-2 overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all"
                      style={{ width: `${progressPct}%`, backgroundColor: b.color }}
                    />
                  </div>
                </div>

                {/* Bottom row */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center text-xs font-bold text-gray-600">
                      {b.workerName[0]}
                    </div>
                    <span className="text-xs text-gray-600">{b.workerName}</span>
                  </div>

                  <div className="flex items-center gap-3">
                    {latestReport && (
                      <div className="flex items-center gap-1 text-xs text-gray-400">
                        <Image size={12} />
                        <span>{latestReport.photos.length} รูป</span>
                        {latestReport.weatherCondition && (
                          <span className="ml-1">{weatherEmoji[latestReport.weatherCondition]}</span>
                        )}
                      </div>
                    )}
                    {latestReport && (
                      <span className="text-xs text-gray-400">{timeAgo(latestReport.reportedAt)}</span>
                    )}
                  </div>
                </div>

                {/* Latest photo preview */}
                {latestReport?.photos[0] && (
                  <div className="mt-3 flex gap-2">
                    {latestReport.photos.slice(0, 3).map(photo => (
                      <div
                        key={photo.id}
                        className="w-16 h-16 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0 relative"
                      >
                        <img src={photo.url} alt={photo.caption} className="w-full h-full object-cover" />
                        {latestReport.photos.length > 3 && photo === latestReport.photos[2] && (
                          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                            <span className="text-white text-xs font-bold">+{latestReport.photos.length - 3}</span>
                          </div>
                        )}
                      </div>
                    ))}
                    {latestReport.note && (
                      <div className="flex-1 bg-gray-50 rounded-xl p-2 min-w-0">
                        <p className="text-xs text-gray-600 line-clamp-3">{latestReport.note}</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}
