import { create } from 'zustand'
import type { Bridge, DailyReport, Notification, Project, Problem, MaterialUsage, WithdrawalRequest } from '@/types'
import { mockBridges, mockReports, mockNotifications, mockProject, mockProblems, mockMaterials, mockWithdrawals, currentUser } from '@/lib/mockData'

interface AppStore {
  currentUser: typeof currentUser

  // Project
  project: Project

  // Bridges
  bridges: Bridge[]
  getBridge: (id: string) => Bridge | undefined
  advanceBridgeStep: (bridgeId: string) => void

  // Daily Reports
  reports: DailyReport[]
  getReportsForBridge: (bridgeId: string) => DailyReport[]
  getLatestReport: (bridgeId: string) => DailyReport | undefined
  getTodayReport: (bridgeId: string) => DailyReport | undefined
  submitReport: (report: Omit<DailyReport, 'id' | 'reportedAt'>) => void

  // Notifications
  notifications: Notification[]
  unreadCount: () => number
  markAsRead: (id: string) => void
  markAllAsRead: () => void
  addNotification: (n: Omit<Notification, 'id' | 'createdAt' | 'isRead'>) => void

  // Problems
  problems: Problem[]
  addProblem: (p: Omit<Problem, 'id' | 'reportedAt'>) => void
  updateProblemStatus: (id: string, status: Problem['status']) => void

  // Materials
  materials: MaterialUsage[]
  addMaterial: (m: Omit<MaterialUsage, 'id'>) => void

  // Withdrawals
  withdrawals: WithdrawalRequest[]
  addWithdrawal: (w: Omit<WithdrawalRequest, 'id' | 'requestedAt' | 'status'> & { requestedBy: string }) => void
}

export const useAppStore = create<AppStore>((set, get) => ({
  currentUser,

  bridges: mockBridges,
  getBridge: (id) => get().bridges.find(b => b.id === id),
  advanceBridgeStep: (bridgeId) =>
    set(s => ({
      bridges: s.bridges.map(b => {
        if (b.id !== bridgeId) return b
        const nextStep = Math.min(b.currentStep + 1, 10)
        return { ...b, currentStep: nextStep, currentStepDay: 1, isCompleted: nextStep >= 10 }
      }),
    })),

  reports: mockReports,
  getReportsForBridge: (bridgeId) =>
    get().reports.filter(r => r.bridgeId === bridgeId).sort((a, b) => b.date.localeCompare(a.date)),
  getLatestReport: (bridgeId) => {
    const sorted = get().reports.filter(r => r.bridgeId === bridgeId).sort((a, b) => b.date.localeCompare(a.date))
    return sorted[0]
  },
  getTodayReport: (bridgeId) => {
    const today = new Date().toISOString().split('T')[0]
    return get().reports.find(r => r.bridgeId === bridgeId && r.date === today)
  },
  submitReport: (report) => {
    const id = `r${Date.now()}`
    const newReport: DailyReport = { ...report, id, reportedAt: new Date().toISOString() }
    set(s => ({ reports: [...s.reports, newReport] }))

    // Add notification for boss
    const bridge = get().bridges.find(b => b.id === report.bridgeId)
    get().addNotification({
      type: 'report',
      title: `รายงานใหม่ - ${bridge?.code ?? report.bridgeId}`,
      body: `${report.reportedBy} ส่งรายงานพร้อมรูป ${report.photos.length} ใบ`,
      bridgeId: report.bridgeId,
      linkTo: `/bridge/${report.bridgeId}`,
    })
  },

  notifications: mockNotifications,
  unreadCount: () => get().notifications.filter(n => !n.isRead).length,
  markAsRead: (id) =>
    set(s => ({
      notifications: s.notifications.map(n => n.id === id ? { ...n, isRead: true } : n),
    })),
  markAllAsRead: () =>
    set(s => ({ notifications: s.notifications.map(n => ({ ...n, isRead: true })) })),
  addNotification: (n) =>
    set(s => ({
      notifications: [
        { ...n, id: `notif${Date.now()}`, createdAt: new Date().toISOString(), isRead: false },
        ...s.notifications,
      ],
    })),



  // Project
  project: mockProject,

  // Problems
  problems: mockProblems,
  addProblem: (p) =>
    set(s => ({
      problems: [
        { ...p, id: `prob${Date.now()}`, reportedAt: new Date().toISOString() },
        ...s.problems,
      ],
    })),
  updateProblemStatus: (id, status) =>
    set(s => ({
      problems: s.problems.map(p =>
        p.id === id
          ? { ...p, status, ...(status === 'resolved' ? { resolvedAt: new Date().toISOString() } : {}) }
          : p
      ),
    })),

  // Materials
  materials: mockMaterials,
  addMaterial: (m) =>
    set(s => ({
      materials: [{ ...m, id: `mat${Date.now()}` }, ...s.materials],
    })),

  // Withdrawals
  withdrawals: mockWithdrawals,
  addWithdrawal: (w) =>
    set(s => ({
      withdrawals: [
        { ...w, id: `wd${Date.now()}`, status: 'pending', requestedAt: new Date().toISOString() },
        ...s.withdrawals,
      ],
    })),
}))

