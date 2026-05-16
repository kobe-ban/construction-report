export type UserRole = 'boss' | 'worker'

export interface User {
  id: string
  name: string
  role: UserRole
  bridgeId?: string // worker is assigned to one bridge
}

// --- Bebo Arch Bridge Stage Definition ---
export interface StageDefinition {
  step: number
  name: string
  durationDays: number
  description: string
  concurrentWith?: number // step number it runs concurrently with
}

export const BRIDGE_STAGES: StageDefinition[] = [
  { step: 1, name: 'ผูกเหล็ก', durationDays: 2, description: 'ผูกเหล็กเสริมฐานรากและตอม่อ' },
  { step: 2, name: 'ประกอบแบบ', durationDays: 2, description: 'ประกอบแบบหล่อคอนกรีต' },
  { step: 3, name: 'เทปูน', durationDays: 1, description: 'เทคอนกรีตฐานรากและตอม่อ' },
  { step: 4, name: 'หยุดพัก (คอนกรีตแข็งตัว)', durationDays: 2, description: 'รอคอนกรีตแข็งตัวได้กำลัง' },
  { step: 5, name: 'ทำ Leveling Pad', durationDays: 2, description: 'ปรับระดับแผ่นรองสะพาน' },
  { step: 6, name: 'ประกอบสะพาน Precast', durationDays: 3, description: 'ยกและประกอบชิ้นส่วนสะพาน Precast' },
  { step: 7, name: 'เทปูนเก๊า', durationDays: 1, description: 'เทปูนเก๊าในวันที่ประกอบ Precast', concurrentWith: 6 },
  { step: 8, name: 'เก็บงานปูนเก๊า + ผูกเหล็กบน', durationDays: 2, description: 'เก็บงานปูนเก๊าด้านล่าง และผูกเหล็กเชื่อม Precast ด้านบน' },
  { step: 9, name: 'ผูกเหล็กด้านข้าง', durationDays: 2, description: 'ผูกเหล็กด้านข้างระหว่างรอยต่อ Precast' },
  { step: 10, name: 'เทปูนปิด', durationDays: 1, description: 'เทคอนกรีตปิดรอยต่อและผิวสะพาน' },
]

export const TOTAL_PLANNED_DAYS = 17 // 2+2+1+2+2+3+2+2+1 (step 7 concurrent)

// --- Bridge ---
export interface Bridge {
  id: string
  name: string       // e.g. "สะพานตัวที่ 1"
  code: string       // e.g. "B01"
  location: string
  workerId: string
  workerName: string
  startDate: string  // ISO date
  currentStep: number  // 1-10, 0 = not started
  currentStepDay: number // which day within current step
  isCompleted: boolean
  color: string // for visual differentiation
}

// --- Daily Report ---
export interface DailyReport {
  id: string
  bridgeId: string
  date: string          // YYYY-MM-DD
  step: number          // which step they're on
  concurrentStep?: number // if running concurrent steps
  note: string
  photos: ReportPhoto[]
  reportedBy: string
  reportedAt: string
  weatherCondition?: WeatherCondition
}

export interface ReportPhoto {
  id: string
  url: string           // base64 or blob URL for demo
  caption?: string
  takenAt: string
}

export type WeatherCondition = 'แดดจัด' | 'มีเมฆ' | 'ฝนตก' | 'ฝนตกเล็กน้อย' | 'มีลม'

// --- Notifications ---
export type NotificationType = 'report' | 'step_complete' | 'system'

export interface Notification {
  id: string
  type: NotificationType
  title: string
  body: string
  isRead: boolean
  createdAt: string
  bridgeId?: string
  linkTo?: string
}

// --- Project ---
export interface Project {
  id: string
  name: string
  location: string
  overallProgress: number // 0-100
  budget: number
  budgetSpent: number
  startDate: string
  plannedEndDate: string
}

// --- Progress Report ---
export type ProgressStatus = 'completed' | 'on_track' | 'delayed' | 'not_started'

export interface ProgressTask {
  id: string
  name: string
  plannedPercent: number
  actualPercent: number
  status: ProgressStatus
  note?: string
}

export interface ProgressReport {
  id: string
  date: string
  note: string
  reportedBy: string
  tasks: ProgressTask[]
}

// --- Problems ---
export type ProblemSeverity = 'critical' | 'high' | 'medium' | 'low'
export type ProblemStatus = 'open' | 'in_progress' | 'resolved' | 'closed'

export interface Problem {
  id: string
  title: string
  description: string
  severity: ProblemSeverity
  status: ProblemStatus
  location?: string
  reportedBy: string
  reportedAt: string
  resolvedAt?: string
}

// --- Materials ---
export type MaterialUnit = 'ถุง' | 'ตัน' | 'กิโลกรัม' | 'ลูกบาศก์เมตร' | 'ตารางเมตร' | 'เมตร' | 'ชิ้น' | 'แผ่น'

export interface MaterialUsage {
  id: string
  date: string
  materialId: string
  materialName: string
  quantity: number
  unit: MaterialUnit
  totalCost: number
  usedFor: string
  requestedBy: string
  approvedBy?: string
  status: 'approved' | 'pending' | 'rejected'
}

// --- Withdrawals (Budget) ---
export type WithdrawalCategory = 'วัสดุ' | 'แรงงาน' | 'เครื่องจักร' | 'ค่าใช้จ่ายอื่นๆ'

export interface WithdrawalRequest {
  id: string
  title: string
  description: string
  category: WithdrawalCategory
  amount: number
  status: 'draft' | 'pending' | 'approved' | 'rejected' | 'paid'
  requestedBy: string
  requestedAt: string
  approvedBy?: string
  approvedAt?: string
}
