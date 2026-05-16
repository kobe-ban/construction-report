import { describe, it, expect, beforeEach } from 'vitest'
import { useAppStore } from '@/store/appStore'

describe('appStore', () => {
  beforeEach(() => {
    // Reset store to initial state
    useAppStore.setState(useAppStore.getInitialState())
  })

  describe('project', () => {
    it('should have project data', () => {
      const { project } = useAppStore.getState()
      expect(project).toBeDefined()
      expect(project.name).toContain('Bebo')
      expect(project.budget).toBeGreaterThan(0)
      expect(project.budgetSpent).toBeLessThanOrEqual(project.budget)
    })
  })

  describe('problems', () => {
    it('should have initial problems', () => {
      const { problems } = useAppStore.getState()
      expect(problems.length).toBeGreaterThan(0)
    })

    it('should add a new problem', () => {
      const { addProblem } = useAppStore.getState()
      const before = useAppStore.getState().problems.length

      addProblem({
        title: 'ท่อน้ำแตก',
        description: 'ท่อน้ำประปาแตกบริเวณฐานราก',
        severity: 'high',
        status: 'open',
        location: 'B01 โซน A',
        reportedBy: 'ทดสอบ',
      })

      const after = useAppStore.getState().problems.length
      expect(after).toBe(before + 1)
      expect(useAppStore.getState().problems[0].title).toBe('ท่อน้ำแตก')
    })

    it('should update problem status', () => {
      const { problems, updateProblemStatus } = useAppStore.getState()
      const openProblem = problems.find(p => p.status === 'open')!

      updateProblemStatus(openProblem.id, 'resolved')

      const updated = useAppStore.getState().problems.find(p => p.id === openProblem.id)!
      expect(updated.status).toBe('resolved')
      expect(updated.resolvedAt).toBeDefined()
    })
  })

  describe('materials', () => {
    it('should have initial materials', () => {
      const { materials } = useAppStore.getState()
      expect(materials.length).toBeGreaterThan(0)
    })

    it('should add a new material request', () => {
      const { addMaterial } = useAppStore.getState()
      const before = useAppStore.getState().materials.length

      addMaterial({
        date: '2026-05-06',
        materialId: 'test01',
        materialName: 'ทรายหยาบ',
        quantity: 10,
        unit: 'ลูกบาศก์เมตร',
        totalCost: 15000,
        usedFor: 'งานฐานราก B03',
        requestedBy: 'ทดสอบ',
        status: 'pending',
      })

      const after = useAppStore.getState().materials.length
      expect(after).toBe(before + 1)
      expect(useAppStore.getState().materials[0].materialName).toBe('ทรายหยาบ')
    })
  })

  describe('withdrawals', () => {
    it('should have initial withdrawals', () => {
      const { withdrawals } = useAppStore.getState()
      expect(withdrawals.length).toBeGreaterThan(0)
    })

    it('should add a new withdrawal request', () => {
      const { addWithdrawal } = useAppStore.getState()
      const before = useAppStore.getState().withdrawals.length

      addWithdrawal({
        title: 'ค่าวัสดุเพิ่มเติม',
        category: 'วัสดุ',
        amount: 50000,
        description: 'ซื้อปูนเพิ่ม',
        requestedBy: 'ทดสอบ',
      })

      const after = useAppStore.getState().withdrawals.length
      expect(after).toBe(before + 1)

      const newWithdrawal = useAppStore.getState().withdrawals[0]
      expect(newWithdrawal.title).toBe('ค่าวัสดุเพิ่มเติม')
      expect(newWithdrawal.status).toBe('pending')
      expect(newWithdrawal.requestedAt).toBeDefined()
    })
  })

  describe('bridges', () => {
    it('should have 4 bridges', () => {
      const { bridges } = useAppStore.getState()
      expect(bridges).toHaveLength(4)
    })

    it('should get bridge by id', () => {
      const { getBridge } = useAppStore.getState()
      const bridge = getBridge('b1')
      expect(bridge).toBeDefined()
      expect(bridge!.code).toBe('B01')
    })

    it('should advance bridge step', () => {
      const { advanceBridgeStep } = useAppStore.getState()
      const before = useAppStore.getState().bridges.find(b => b.id === 'b1')!.currentStep

      advanceBridgeStep('b1')

      const after = useAppStore.getState().bridges.find(b => b.id === 'b1')!.currentStep
      expect(after).toBe(before + 1)
    })
  })

  describe('reports', () => {
    it('should submit report and create notification', () => {
      const { submitReport } = useAppStore.getState()
      const beforeReports = useAppStore.getState().reports.length
      const beforeNotifs = useAppStore.getState().notifications.length

      submitReport({
        bridgeId: 'b1',
        date: '2026-05-06',
        step: 3,
        note: 'test report',
        photos: [],
        reportedBy: 'ทดสอบ',
      })

      expect(useAppStore.getState().reports.length).toBe(beforeReports + 1)
      expect(useAppStore.getState().notifications.length).toBe(beforeNotifs + 1)
    })
  })

  describe('notifications', () => {
    it('should count unread', () => {
      const { unreadCount } = useAppStore.getState()
      expect(unreadCount()).toBeGreaterThan(0)
    })

    it('should mark as read', () => {
      const { notifications, markAsRead } = useAppStore.getState()
      const unread = notifications.find(n => !n.isRead)!

      markAsRead(unread.id)

      const updated = useAppStore.getState().notifications.find(n => n.id === unread.id)!
      expect(updated.isRead).toBe(true)
    })

    it('should mark all as read', () => {
      const { markAllAsRead } = useAppStore.getState()
      markAllAsRead()

      const { unreadCount } = useAppStore.getState()
      expect(unreadCount()).toBe(0)
    })
  })

})
