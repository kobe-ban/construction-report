---
name: construction-report
description: 'อธิบายโครงสร้างโปรเจค Construction Bridge Report ใช้เมื่อต้องการ context ของโปรเจค, สร้าง page/component ใหม่, หรือแก้ไขโค้ดในโปรเจคนี้. Use when: creating new pages, adding components, understanding project architecture, working with bridge data, Thai localization.'
argument-hint: 'ถามเกี่ยวกับโครงสร้างหรือ convention ของโปรเจค'
---

# Construction Bridge Report - Project Overview

ระบบจัดการรายงานก่อสร้างสะพาน Bebo Arch Bridge เป็น React + TypeScript SPA สำหรับติดตามความคืบหน้าการก่อสร้างสะพานแบบ precast 4 ตัว (B01-B04) แต่ละตัวมี 10 ขั้นตอน

## Tech Stack

| เทคโนโลยี | เวอร์ชัน | หน้าที่ |
|-----------|---------|--------|
| React | 19 | UI framework |
| TypeScript | 6 | Type safety |
| Vite | 8 | Build tool |
| Zustand | 5 | State management |
| TanStack Query | 5 | Server state (planned) |
| Tailwind CSS | 4 | Styling |
| React Router | 7 | Routing |
| Lucide React | - | Icons |
| date-fns | 4 | Date utilities |
| clsx | 2 | ClassName utility |

## Project Structure

```
src/
├── components/
│   ├── layout/          # BottomNav, Header (layout คงที่)
│   └── ui/              # Card, Button, Badge, ProgressBar (atomic components)
├── pages/               # หนึ่งโฟลเดอร์ต่อหนึ่ง feature
│   ├── bridge/          # BridgeDetailPage
│   ├── budget/          # BudgetPage + AddWithdrawalModal
│   ├── chat/            # ChatPage
│   ├── dashboard/       # DashboardPage (หน้าหลัก)
│   ├── materials/       # MaterialsPage + AddMaterialModal
│   ├── notifications/   # NotificationsPage
│   ├── problems/        # ProblemsPage + AddProblemModal
│   ├── progress/        # ProgressPage + AddProgressModal
│   └── report/          # ReportPage
├── store/appStore.ts    # Zustand global store
├── types/index.ts       # TypeScript interfaces ทั้งหมด
├── lib/
│   ├── mockData.ts      # ข้อมูลจำลอง
│   └── utils.ts         # cn(), formatThaiDate(), formatThaiCurrency(), timeAgo()
├── hooks/               # Custom hooks (ว่าง, พร้อมขยาย)
├── App.tsx              # Routes + Layout
└── main.tsx             # Entry point
```

## Naming Conventions

- **Pages**: PascalCase + `Page` suffix → `DashboardPage.tsx`
- **Modals**: PascalCase + `Modal` suffix → `AddProgressModal.tsx`
- **Components**: PascalCase → `BottomNav.tsx`, `Card.tsx`
- **Store hook**: `useAppStore`
- **Utilities**: camelCase → `formatThaiDate()`

## Routing (App.tsx)

| Path | Component | คำอธิบาย |
|------|-----------|---------|
| `/` | DashboardPage | หน้าหลัก แสดงสะพานทั้งหมด |
| `/bridge/:id` | BridgeDetailPage | รายละเอียดสะพาน + timeline |
| `/report` | ReportPage | ส่งรายงานประจำวัน |
| `/notifications` | NotificationsPage | ศูนย์แจ้งเตือน |
| `/chat` | ChatPage | แชท |

## User Roles

| Role | คำอธิบาย |
|------|---------|
| `boss` | หัวหน้าโปรเจค ดูรายงาน ติดตามความคืบหน้า |
| `worker` | คนงาน ส่งรายงานประจำวัน + ถ่ายรูป |

## Key Types (types/index.ts)

```typescript
type UserRole = 'boss' | 'worker'
interface User { id, name, role, bridgeId? }
interface Bridge { id, name, code, location, workerId, workerName, startDate, currentStep, currentStepDay, isCompleted, color }
interface DailyReport { id, bridgeId, date, step, note, photos[], reportedBy, reportedAt, weatherCondition?, concurrentStep? }
interface Notification { id, type, title, body, isRead, createdAt, bridgeId?, linkTo? }
interface ChatMessage { id, senderId, senderName, senderRole, content, sentAt, attachmentUrl?, bridgeId? }
```

## Store (Zustand - store/appStore.ts)

Store เดียว `useAppStore` แบ่งเป็น:

1. **User** - currentUser (hardcoded boss1)
2. **Bridges** - bridges[], getBridge(), advanceBridgeStep()
3. **Reports** - reports[], getReportsForBridge(), getLatestReport(), getTodayReport(), submitReport()
4. **Notifications** - notifications[], unreadCount(), markAsRead(), markAllAsRead(), addNotification()
5. **Chat** - messages[], sendMessage()

## UI Conventions

- **Mobile-first** ออกแบบสำหรับมือถือ, bottom nav navigation
- **Tailwind classes**: rounded-2xl, shadow-sm, border-gray-100
- **Color-coded bridges**: แต่ละสะพานมี color hex ใช้ทั่ว UI
- **Icons**: ใช้ Lucide React เท่านั้น
- **Language**: ภาษาไทยทั้งหมดใน UI
- **Layout**: Header ด้านบน + BottomNav ด้านล่าง (fixed), content scroll ได้ (pb-24)

## Weather Options

| Emoji | Value |
|-------|-------|
| ☀️ | แดดจัด |
| ⛅ | มีเมฆ |
| 🌧️ | ฝนตก |
| 🌦️ | ฝนตกเล็กน้อย |
| 💨 | มีลม |

## Bridge Stages (10 ขั้นตอน)

สะพานแต่ละตัวผ่าน 10 steps: ผูกเหล็ก → เทปูน → ประกอบสะพาน → ฯลฯ (รวม ~17 วัน)

## Creating New Pages

เมื่อสร้าง page ใหม่:
1. สร้างโฟลเดอร์ใน `src/pages/<feature>/`
2. สร้าง `<Feature>Page.tsx` เป็น main page
3. สร้าง `Add<Feature>Modal.tsx` ถ้ามี form เพิ่มข้อมูล
4. เพิ่ม route ใน `App.tsx`
5. เพิ่ม type ใน `types/index.ts`
6. เพิ่ม state + actions ใน `store/appStore.ts`

## Creating New Components

เมื่อสร้าง component ใหม่:
1. UI atoms → `src/components/ui/`
2. Layout → `src/components/layout/`
3. ใช้ `cn()` สำหรับ conditional classes
4. ใช้ Tailwind เท่านั้น ห้ามใช้ inline styles
5. รับ `className?` prop สำหรับ override
