import { Suspense } from 'react'
import { ReportPage } from '@/views/report/ReportPage'

export default function Page() {
  return (
    <Suspense fallback={null}>
      <ReportPage />
    </Suspense>
  )
}
