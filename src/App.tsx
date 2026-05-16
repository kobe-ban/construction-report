import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { BottomNav } from '@/components/layout/BottomNav'
import { DashboardPage } from '@/pages/dashboard/DashboardPage'
import { BridgeDetailPage } from '@/pages/bridge/BridgeDetailPage'
import { ReportPage } from '@/pages/report/ReportPage'
import { NotificationsPage } from '@/pages/notifications/NotificationsPage'
import { ProgressPage } from '@/pages/progress/ProgressPage'
import { ProblemsPage } from '@/pages/problems/ProblemsPage'
import { MaterialsPage } from '@/pages/materials/MaterialsPage'
import { BudgetPage } from '@/pages/budget/BudgetPage'
import { MorePage } from '@/pages/more/MorePage'

export default function App() {
  return (
    <BrowserRouter>
      <div className="h-screen flex flex-col">
        <div className="flex-1 overflow-y-auto">
        <Routes>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/bridge/:id" element={<BridgeDetailPage />} />
          <Route path="/report" element={<ReportPage />} />
          <Route path="/notifications" element={<NotificationsPage />} />
          <Route path="/progress" element={<ProgressPage />} />
          <Route path="/problems" element={<ProblemsPage />} />
          <Route path="/materials" element={<MaterialsPage />} />
          <Route path="/budget" element={<BudgetPage />} />
          <Route path="/more" element={<MorePage />} />
        </Routes>
        </div>
        <BottomNav />
      </div>
    </BrowserRouter>
  )
}
