import type { User, Bridge, DailyReport, Notification, Project, Problem, MaterialUsage, WithdrawalRequest, ProgressReport } from '@/types'

export const currentUser: User = {
  id: 'boss1',
  name: 'สมชาย ใจดี',
  role: 'boss',
}

export const mockWorkers: User[] = [
  { id: 'w1', name: 'มานะ แข็งใจ', role: 'worker', bridgeId: 'b1' },
  { id: 'w2', name: 'วิทยา ช่างดี', role: 'worker', bridgeId: 'b2' },
  { id: 'w3', name: 'สุดา ขยันทำ', role: 'worker', bridgeId: 'b3' },
  { id: 'w4', name: 'ชัย ตั้งใจ', role: 'worker', bridgeId: 'b4' },
]

export const mockBridges: Bridge[] = [
  {
    id: 'b1', code: 'B01',
    name: 'สะพาน B01',
    location: 'กม. 12+450 ซ้าย',
    workerId: 'w1', workerName: 'มานะ แข็งใจ',
    startDate: '2026-04-14',
    currentStep: 3,
    currentStepDay: 1,
    isCompleted: false,
    color: '#3b82f6',
  },
  {
    id: 'b2', code: 'B02',
    name: 'สะพาน B02',
    location: 'กม. 12+450 ขวา',
    workerId: 'w2', workerName: 'วิทยา ช่างดี',
    startDate: '2026-04-14',
    currentStep: 2,
    currentStepDay: 2,
    isCompleted: false,
    color: '#10b981',
  },
  {
    id: 'b3', code: 'B03',
    name: 'สะพาน B03',
    location: 'กม. 13+200 ซ้าย',
    workerId: 'w3', workerName: 'สุดา ขยันทำ',
    startDate: '2026-04-16',
    currentStep: 2,
    currentStepDay: 1,
    isCompleted: false,
    color: '#f59e0b',
  },
  {
    id: 'b4', code: 'B04',
    name: 'สะพาน B04',
    location: 'กม. 13+200 ขวา',
    workerId: 'w4', workerName: 'ชัย ตั้งใจ',
    startDate: '2026-04-21',
    currentStep: 1,
    currentStepDay: 2,
    isCompleted: false,
    color: '#8b5cf6',
  },
]

// Placeholder colored rectangle as base64 PNG (tiny 1x1 pixel, colored differently per bridge)
// In a real app these would be actual photos from camera
const PHOTO_PLACEHOLDER = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMjAiIGhlaWdodD0iMjQwIiB2aWV3Qm94PSIwIDAgMzIwIDI0MCI+PHJlY3Qgd2lkdGg9IjMyMCIgaGVpZ2h0PSIyNDAiIGZpbGw9IiNlNWU3ZWIiLz48dGV4dCB4PSI1MCUiIHk9IjUwJSIgZG9taW5hbnQtYmFzZWxpbmU9Im1pZGRsZSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzllYTNhZiI+8J+TuSBSZWFsIHBob3RvIGhlcmU8L3RleHQ+PC9zdmc+'

export const mockReports: DailyReport[] = [
  // B01 - currently on step 3
  {
    id: 'r1', bridgeId: 'b1', date: '2026-04-14', step: 1,
    note: 'เริ่มผูกเหล็กฐานราก ผ่านได้ดีครับ',
    photos: [{ id: 'p1', url: PHOTO_PLACEHOLDER, caption: 'เริ่มผูกเหล็ก', takenAt: '2026-04-14T08:30:00' }],
    reportedBy: 'มานะ แข็งใจ', reportedAt: '2026-04-14T17:00:00', weatherCondition: 'แดดจัด',
  },
  {
    id: 'r2', bridgeId: 'b1', date: '2026-04-15', step: 1,
    note: 'ผูกเหล็กเสร็จแล้วครับ พร้อมประกอบแบบ',
    photos: [{ id: 'p2', url: PHOTO_PLACEHOLDER, caption: 'ผูกเหล็กเสร็จ', takenAt: '2026-04-15T09:00:00' }],
    reportedBy: 'มานะ แข็งใจ', reportedAt: '2026-04-15T17:00:00', weatherCondition: 'มีเมฆ',
  },
  {
    id: 'r3', bridgeId: 'b1', date: '2026-04-16', step: 2,
    note: 'ประกอบแบบด้านซ้าย เสร็จ 60%',
    photos: [{ id: 'p3', url: PHOTO_PLACEHOLDER, caption: 'ประกอบแบบด้านซ้าย', takenAt: '2026-04-16T10:00:00' }],
    reportedBy: 'มานะ แข็งใจ', reportedAt: '2026-04-16T17:00:00', weatherCondition: 'แดดจัด',
  },
  {
    id: 'r4', bridgeId: 'b1', date: '2026-04-17', step: 2,
    note: 'ประกอบแบบเสร็จทั้งหมดแล้วครับ',
    photos: [{ id: 'p4', url: PHOTO_PLACEHOLDER, caption: 'แบบครบทุกด้าน', takenAt: '2026-04-17T11:00:00' }],
    reportedBy: 'มานะ แข็งใจ', reportedAt: '2026-04-17T17:00:00', weatherCondition: 'มีเมฆ',
  },
  {
    id: 'r5', bridgeId: 'b1', date: '2026-04-23', step: 3,
    note: 'เทปูนเช้า เสร็จแล้ว รอแข็งตัวครับ',
    photos: [
      { id: 'p5', url: PHOTO_PLACEHOLDER, caption: 'กำลังเทปูน', takenAt: '2026-04-23T07:30:00' },
      { id: 'p6', url: PHOTO_PLACEHOLDER, caption: 'เทปูนเสร็จ', takenAt: '2026-04-23T12:00:00' },
    ],
    reportedBy: 'มานะ แข็งใจ', reportedAt: '2026-04-23T14:00:00', weatherCondition: 'แดดจัด',
  },

  // B02 - step 2
  {
    id: 'r6', bridgeId: 'b2', date: '2026-04-14', step: 1,
    note: 'เริ่มงานครับ ผูกเหล็กไปได้ครึ่งหนึ่งแล้ว',
    photos: [{ id: 'p7', url: PHOTO_PLACEHOLDER, caption: 'เริ่มผูกเหล็ก B02', takenAt: '2026-04-14T09:00:00' }],
    reportedBy: 'วิทยา ช่างดี', reportedAt: '2026-04-14T17:00:00', weatherCondition: 'แดดจัด',
  },
  {
    id: 'r7', bridgeId: 'b2', date: '2026-04-15', step: 1,
    note: 'ผูกเหล็กเสร็จ เตรียมประกอบแบบพรุ่งนี้',
    photos: [{ id: 'p8', url: PHOTO_PLACEHOLDER, caption: 'เหล็กครบแล้ว', takenAt: '2026-04-15T15:00:00' }],
    reportedBy: 'วิทยา ช่างดี', reportedAt: '2026-04-15T17:00:00', weatherCondition: 'ฝนตกเล็กน้อย',
  },
  {
    id: 'r8', bridgeId: 'b2', date: '2026-04-16', step: 2,
    note: 'ประกอบแบบด้านหน้า ฝนตกช่วงบ่ายหยุดพัก',
    photos: [{ id: 'p9', url: PHOTO_PLACEHOLDER, caption: 'แบบด้านหน้า', takenAt: '2026-04-16T08:00:00' }],
    reportedBy: 'วิทยา ช่างดี', reportedAt: '2026-04-16T16:00:00', weatherCondition: 'ฝนตก',
  },
  {
    id: 'r9', bridgeId: 'b2', date: '2026-04-23', step: 2,
    note: 'ประกอบแบบที่เหลือ รุ่งเช้าพร้อมเทปูนได้เลย',
    photos: [{ id: 'p10', url: PHOTO_PLACEHOLDER, caption: 'แบบเสร็จทั้งหมด', takenAt: '2026-04-23T14:00:00' }],
    reportedBy: 'วิทยา ช่างดี', reportedAt: '2026-04-23T16:30:00', weatherCondition: 'มีเมฆ',
  },

  // B03 - step 2
  {
    id: 'r10', bridgeId: 'b3', date: '2026-04-16', step: 1,
    note: 'เริ่มงานช้ากว่า B01-02 สองวัน ผูกเหล็กวันแรก',
    photos: [{ id: 'p11', url: PHOTO_PLACEHOLDER, caption: 'เริ่มผูกเหล็ก B03', takenAt: '2026-04-16T08:30:00' }],
    reportedBy: 'สุดา ขยันทำ', reportedAt: '2026-04-16T17:00:00', weatherCondition: 'มีเมฆ',
  },
  {
    id: 'r11', bridgeId: 'b3', date: '2026-04-23', step: 2,
    note: 'ผูกเหล็กเสร็จ เริ่มประกอบแบบครับ',
    photos: [{ id: 'p12', url: PHOTO_PLACEHOLDER, caption: 'เริ่มประกอบแบบ', takenAt: '2026-04-23T09:00:00' }],
    reportedBy: 'สุดา ขยันทำ', reportedAt: '2026-04-23T17:00:00', weatherCondition: 'แดดจัด',
  },

  // B04 - step 1
  {
    id: 'r12', bridgeId: 'b4', date: '2026-04-21', step: 1,
    note: 'เริ่มโครงการ B04 วันแรก ผูกเหล็กฐาน',
    photos: [{ id: 'p13', url: PHOTO_PLACEHOLDER, caption: 'วันแรก B04', takenAt: '2026-04-21T08:00:00' }],
    reportedBy: 'ชัย ตั้งใจ', reportedAt: '2026-04-21T17:00:00', weatherCondition: 'แดดจัด',
  },
  {
    id: 'r13', bridgeId: 'b4', date: '2026-04-23', step: 1,
    note: 'ผูกเหล็กวันที่ 2 เกือบเสร็จแล้วครับ',
    photos: [{ id: 'p14', url: PHOTO_PLACEHOLDER, caption: 'เหล็กวันที่ 2', takenAt: '2026-04-23T10:00:00' }],
    reportedBy: 'ชัย ตั้งใจ', reportedAt: '2026-04-23T16:00:00', weatherCondition: 'มีเมฆ',
  },
]

export const mockNotifications: Notification[] = [
  { id: 'n1', type: 'report', title: 'รายงานใหม่ - B01', body: 'มานะ ส่งรายงานพร้อมรูปถ่าย เทปูนเสร็จแล้ว', isRead: false, createdAt: '2026-04-23T14:05:00', bridgeId: 'b1', linkTo: '/bridge/b1' },
  { id: 'n2', type: 'report', title: 'รายงานใหม่ - B02', body: 'วิทยา ประกอบแบบเสร็จแล้ว พร้อมเทปูนพรุ่งนี้', isRead: false, createdAt: '2026-04-23T16:35:00', bridgeId: 'b2', linkTo: '/bridge/b2' },
  { id: 'n3', type: 'report', title: 'รายงานใหม่ - B03', body: 'สุดา เริ่มประกอบแบบแล้ว', isRead: false, createdAt: '2026-04-23T17:05:00', bridgeId: 'b3', linkTo: '/bridge/b3' },
  { id: 'n4', type: 'report', title: 'รายงานใหม่ - B04', body: 'ชัย ผูกเหล็กวันที่ 2 เกือบเสร็จ', isRead: true, createdAt: '2026-04-23T16:05:00', bridgeId: 'b4', linkTo: '/bridge/b4' },
  { id: 'n5', type: 'step_complete', title: 'B01 เสร็จขั้นตอน: ผูกเหล็ก', body: 'สะพาน B01 ผ่านขั้นตอนผูกเหล็กแล้ว', isRead: true, createdAt: '2026-04-15T17:05:00', bridgeId: 'b1' },
]

// --- Project ---
export const mockProject: Project = {
  id: 'proj1',
  name: 'โครงการก่อสร้างสะพาน Bebo Arch',
  location: 'ทางหลวงหมายเลข 304 กม.12-13',
  overallProgress: 35,
  budget: 12000000,
  budgetSpent: 4200000,
  startDate: '2026-04-14',
  plannedEndDate: '2026-06-30',
}

// --- Problems ---
export const mockProblems: Problem[] = [
  {
    id: 'prob1', title: 'เหล็กเสริมไม่ตรง spec', description: 'เหล็กที่ส่งมาเป็น SD40 แทน SD50 ตามแบบ ต้องส่งกลับ',
    severity: 'high', status: 'open', location: 'สะพาน B02 โซน A',
    reportedBy: 'วิทยา ช่างดี', reportedAt: '2026-04-22T09:00:00',
  },
  {
    id: 'prob2', title: 'น้ำท่วมหน้างาน B03', description: 'ฝนตกหนักเมื่อคืน น้ำท่วมบ่อฐานรากประมาณ 30 ซม. ต้องสูบน้ำออกก่อนทำงานได้',
    severity: 'medium', status: 'in_progress', location: 'สะพาน B03',
    reportedBy: 'สุดา ขยันทำ', reportedAt: '2026-04-20T07:30:00',
  },
  {
    id: 'prob3', title: 'รถเครนเสีย', description: 'รถเครนไฮดรอลิครั่ว ต้องซ่อมใหญ่ กระทบแผนยก Precast',
    severity: 'critical', status: 'open', location: 'หน้างาน กม.12+450',
    reportedBy: 'มานะ แข็งใจ', reportedAt: '2026-05-05T08:00:00',
  },
  {
    id: 'prob4', title: 'แบบหล่อบิดงอ', description: 'แบบหล่อด้านซ้ายบิดงอจากการใช้ซ้ำ ต้องดัดก่อนใช้',
    severity: 'low', status: 'resolved', location: 'สะพาน B01',
    reportedBy: 'มานะ แข็งใจ', reportedAt: '2026-04-16T10:00:00', resolvedAt: '2026-04-16T15:00:00',
  },
]

// --- Materials ---
export const mockMaterials: MaterialUsage[] = [
  {
    id: 'mat1', date: '2026-04-14', materialId: 'cement01', materialName: 'ปูนซีเมนต์ตราช้าง',
    quantity: 200, unit: 'ถุง', totalCost: 70000, usedFor: 'งานฐานราก B01-B02',
    requestedBy: 'มานะ แข็งใจ', approvedBy: 'สมชาย ใจดี', status: 'approved',
  },
  {
    id: 'mat2', date: '2026-04-16', materialId: 'steel01', materialName: 'เหล็กเส้น SD50 ขนาด 16mm',
    quantity: 5, unit: 'ตัน', totalCost: 125000, usedFor: 'ผูกเหล็กฐานราก B01-B04',
    requestedBy: 'วิทยา ช่างดี', approvedBy: 'สมชาย ใจดี', status: 'approved',
  },
  {
    id: 'mat3', date: '2026-04-23', materialId: 'gravel01', materialName: 'หินคลุก',
    quantity: 30, unit: 'ลูกบาศก์เมตร', totalCost: 45000, usedFor: 'ปรับพื้นที่ Leveling Pad',
    requestedBy: 'สุดา ขยันทำ', status: 'pending',
  },
  {
    id: 'mat4', date: '2026-05-01', materialId: 'wood01', materialName: 'ไม้แบบ',
    quantity: 100, unit: 'แผ่น', totalCost: 35000, usedFor: 'แบบหล่อ B03-B04',
    requestedBy: 'ชัย ตั้งใจ', status: 'pending',
  },
]

// --- Withdrawals ---
export const mockWithdrawals: WithdrawalRequest[] = [
  {
    id: 'wd1', title: 'ค่าวัสดุก่อสร้างเดือนเมษายน', description: 'ปูนซีเมนต์ + เหล็กเส้น สำหรับงานฐานราก B01-B04',
    category: 'วัสดุ', amount: 195000, status: 'paid',
    requestedBy: 'สมชาย ใจดี', requestedAt: '2026-04-14T08:00:00', approvedBy: 'ผู้จัดการโครงการ', approvedAt: '2026-04-14T10:00:00',
  },
  {
    id: 'wd2', title: 'ค่าแรงงานสัปดาห์ที่ 1-2', description: 'ค่าแรงคนงาน 12 คน x 14 วัน',
    category: 'แรงงาน', amount: 336000, status: 'approved',
    requestedBy: 'สมชาย ใจดี', requestedAt: '2026-04-28T09:00:00', approvedBy: 'ผู้จัดการโครงการ', approvedAt: '2026-04-29T08:00:00',
  },
  {
    id: 'wd3', title: 'ค่าเช่ารถเครน', description: 'เช่ารถเครน 25 ตัน สำหรับยก Precast 5 วัน',
    category: 'เครื่องจักร', amount: 150000, status: 'pending',
    requestedBy: 'สมชาย ใจดี', requestedAt: '2026-05-03T10:00:00',
  },
  {
    id: 'wd4', title: 'ค่าหินคลุกและทราย', description: 'หินคลุก 30 คิว + ทรายหยาบ 20 คิว',
    category: 'วัสดุ', amount: 65000, status: 'pending',
    requestedBy: 'สมชาย ใจดี', requestedAt: '2026-05-05T08:00:00',
  },
]

// --- Progress Reports ---
export const mockProgressReports: ProgressReport[] = [
  {
    id: 'pr1', date: '2026-05-05', note: 'สัปดาห์นี้ B01 เดินหน้าดี B02-B04 ตามแผน',
    reportedBy: 'สมชาย ใจดี',
    tasks: [
      { id: 'pt1', name: 'งานฐานราก B01-B04', plannedPercent: 60, actualPercent: 55, status: 'on_track' },
      { id: 'pt2', name: 'ประกอบแบบหล่อ', plannedPercent: 50, actualPercent: 45, status: 'on_track' },
      { id: 'pt3', name: 'เทคอนกรีต', plannedPercent: 30, actualPercent: 25, status: 'delayed' },
      { id: 'pt4', name: 'ประกอบ Precast', plannedPercent: 0, actualPercent: 0, status: 'not_started' },
    ],
  },
]
