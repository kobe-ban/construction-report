import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Construction Report',
  description: 'ระบบรายงานก่อสร้างสะพาน Bebo Arch',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="th">
      <body>
        <div className="app-frame">{children}</div>
      </body>
    </html>
  )
}
