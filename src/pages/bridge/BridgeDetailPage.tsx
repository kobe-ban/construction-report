import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Camera, CheckCircle2, Clock, ChevronDown, ChevronUp, Image } from 'lucide-react'
import { useState } from 'react'
import { useAppStore } from '@/store/appStore'
import { BRIDGE_STAGES } from '@/types'
import { formatThaiDate } from '@/lib/utils'
import type { DailyReport } from '@/types'

const weatherEmoji: Record<string, string> = {
  'แดดจัด': '☀️', 'มีเมฆ': '⛅', 'ฝนตก': '🌧️', 'ฝนตกเล็กน้อย': '🌦️', 'มีลม': '💨',
}

export function BridgeDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { getBridge, getReportsForBridge } = useAppStore()
  const [expandedReport, setExpandedReport] = useState<string | null>(null)
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<'timeline' | 'photos'>('timeline')

  const bridge = getBridge(id ?? '')
  const reports = getReportsForBridge(id ?? '')

  if (!bridge) return <div className="p-4">ไม่พบสะพาน</div>

  const progressPct = Math.round(((bridge.currentStep - 1) / 10) * 100)

  // Group reports by step
  const reportsByStep = new Map<number, DailyReport[]>()
  reports.forEach(r => {
    const arr = reportsByStep.get(r.step) ?? []
    arr.push(r)
    reportsByStep.set(r.step, arr)
  })

  // All photos across all reports
  const allPhotos = reports.flatMap(r => r.photos.map(p => ({ ...p, date: r.date, step: r.step, note: r.note })))

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-white border-b border-gray-200">
        <div className="px-4 py-3 flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="p-1 -ml-1 text-gray-600">
            <ArrowLeft size={22} />
          </button>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <span
                className="text-xs font-bold px-2 py-0.5 rounded-full text-white"
                style={{ backgroundColor: bridge.color }}
              >
                {bridge.code}
              </span>
              <h1 className="font-semibold text-gray-900">{bridge.name}</h1>
            </div>
            <p className="text-xs text-gray-500">{bridge.location} · {bridge.workerName}</p>
          </div>
          <button
            onClick={() => navigate(`/report?bridgeId=${bridge.id}`)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-white text-sm font-medium"
            style={{ backgroundColor: bridge.color }}
          >
            <Camera size={16} />รายงาน
          </button>
        </div>

        {/* Overall progress */}
        <div className="px-4 pb-3">
          <div className="flex justify-between text-xs text-gray-500 mb-1">
            <span>ขั้นตอน {bridge.currentStep}/10</span>
            <span>{progressPct}%</span>
          </div>
          <div className="bg-gray-100 rounded-full h-2 overflow-hidden">
            <div
              className="h-full rounded-full transition-all"
              style={{ width: `${progressPct}%`, backgroundColor: bridge.color }}
            />
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-t border-gray-100">
          {(['timeline', 'photos'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 py-2.5 text-sm font-medium transition-colors ${
                activeTab === tab
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-500'
              }`}
            >
              {tab === 'timeline' ? '📋 ไทม์ไลน์' : `📷 รูปถ่าย (${allPhotos.length})`}
            </button>
          ))}
        </div>
      </div>

      {activeTab === 'timeline' && (
        <div className="p-4">
          {/* Timeline */}
          <div className="relative">
            {/* Vertical line */}
            <div className="absolute left-5 top-0 bottom-0 w-0.5 bg-gray-200" />

            <div className="space-y-0">
              {BRIDGE_STAGES.map(stage => {
                const isDone = bridge.currentStep > stage.step
                const isCurrent = bridge.currentStep === stage.step
                const isUpcoming = bridge.currentStep < stage.step
                const stageReports = reportsByStep.get(stage.step) ?? []
                const isConcurrent = stage.concurrentWith != null

                return (
                  <div key={stage.step} className="flex gap-4 pb-6">
                    {/* Icon */}
                    <div className="relative z-10 flex-shrink-0">
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all ${
                          isDone
                            ? 'border-transparent'
                            : isCurrent
                            ? 'border-transparent shadow-md'
                            : 'border-gray-200 bg-white'
                        }`}
                        style={
                          isDone
                            ? { backgroundColor: bridge.color }
                            : isCurrent
                            ? { backgroundColor: bridge.color }
                            : {}
                        }
                      >
                        {isDone ? (
                          <CheckCircle2 size={18} className="text-white" />
                        ) : isCurrent ? (
                          <Clock size={18} className="text-white" />
                        ) : (
                          <span className="text-xs text-gray-400 font-medium">{stage.step}</span>
                        )}
                      </div>
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0 pt-1">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <p className={`font-medium text-sm ${isUpcoming ? 'text-gray-400' : 'text-gray-900'}`}>
                              {stage.step}. {stage.name}
                            </p>
                            {isConcurrent && (
                              <span className="text-[10px] bg-purple-100 text-purple-600 px-1.5 py-0.5 rounded-full">
                                ทำพร้อมขั้น {stage.concurrentWith}
                              </span>
                            )}
                            {isCurrent && (
                              <span className="text-[10px] text-white px-1.5 py-0.5 rounded-full" style={{ backgroundColor: bridge.color }}>
                                กำลังทำ วันที่ {bridge.currentStepDay}/{stage.durationDays}
                              </span>
                            )}
                          </div>
                          <p className={`text-xs mt-0.5 ${isUpcoming ? 'text-gray-300' : 'text-gray-500'}`}>
                            {stage.description} · {stage.durationDays} วัน
                          </p>
                        </div>
                        {stageReports.length > 0 && (
                          <span className="text-xs text-gray-400 shrink-0">{stageReports.length} รายงาน</span>
                        )}
                      </div>

                      {/* Reports for this step */}
                      {stageReports.length > 0 && (
                        <div className="mt-2 space-y-2">
                          {stageReports.map(report => {
                            const isExpanded = expandedReport === report.id
                            return (
                              <div key={report.id} className="bg-white border border-gray-100 rounded-xl overflow-hidden">
                                <button
                                  className="w-full flex items-center justify-between px-3 py-2.5 text-left"
                                  onClick={() => setExpandedReport(isExpanded ? null : report.id)}
                                >
                                  <div className="flex items-center gap-2">
                                    <span className="text-xs font-medium text-gray-700">
                                      {formatThaiDate(report.date)}
                                    </span>
                                    {report.weatherCondition && (
                                      <span>{weatherEmoji[report.weatherCondition]}</span>
                                    )}
                                    <span className="text-xs text-gray-400 flex items-center gap-1">
                                      <Image size={11} />{report.photos.length}
                                    </span>
                                  </div>
                                  {isExpanded ? <ChevronUp size={14} className="text-gray-400" /> : <ChevronDown size={14} className="text-gray-400" />}
                                </button>

                                {isExpanded && (
                                  <div className="px-3 pb-3 space-y-2 border-t border-gray-50">
                                    {report.note && (
                                      <p className="text-sm text-gray-700 pt-2">{report.note}</p>
                                    )}
                                    {report.photos.length > 0 && (
                                      <div className="flex gap-2 overflow-x-auto pb-1">
                                        {report.photos.map(photo => (
                                          <button
                                            key={photo.id}
                                            onClick={() => setSelectedPhoto(photo.url)}
                                            className="flex-shrink-0 w-20 h-20 rounded-xl overflow-hidden bg-gray-100"
                                          >
                                            <img
                                              src={photo.url}
                                              alt={photo.caption}
                                              className="w-full h-full object-cover"
                                            />
                                          </button>
                                        ))}
                                      </div>
                                    )}
                                  </div>
                                )}
                              </div>
                            )
                          })}
                        </div>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'photos' && (
        <div className="p-4">
          {allPhotos.length === 0 ? (
            <div className="text-center py-12 text-gray-400">
              <Camera size={32} className="mx-auto mb-2" />
              <p className="text-sm">ยังไม่มีรูปถ่าย</p>
            </div>
          ) : (
            <div className="space-y-4">
              {reports.map(report => (
                <div key={report.id}>
                  <div className="flex items-center gap-2 mb-2">
                    <p className="text-sm font-medium text-gray-700">{formatThaiDate(report.date)}</p>
                    <span className="text-xs text-gray-400">
                      ขั้น {report.step}: {BRIDGE_STAGES.find(s => s.step === report.step)?.name}
                    </span>
                    {report.weatherCondition && <span>{weatherEmoji[report.weatherCondition]}</span>}
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    {report.photos.map(photo => (
                      <button
                        key={photo.id}
                        onClick={() => setSelectedPhoto(photo.url)}
                        className="aspect-square rounded-xl overflow-hidden bg-gray-100"
                      >
                        <img src={photo.url} alt={photo.caption} className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                  {report.note && (
                    <p className="text-xs text-gray-500 mt-2">{report.note}</p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Fullscreen photo viewer */}
      {selectedPhoto && (
        <div
          className="fixed inset-0 z-50 bg-black flex items-center justify-center"
          onClick={() => setSelectedPhoto(null)}
        >
          <img src={selectedPhoto} alt="" className="max-w-full max-h-full object-contain" />
          <button className="absolute top-4 right-4 text-white text-2xl">✕</button>
        </div>
      )}
    </div>
  )
}


