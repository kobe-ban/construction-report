'use client'

import { useState, type FormEvent } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { useAuthStore } from '@/store/authStore'

export function LoginPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const login = useAuthStore((s) => s.login)
  const status = useAuthStore((s) => s.status)
  const error = useAuthStore((s) => s.error)

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    try {
      await login(username, password)
      const from = searchParams.get('from') ?? '/'
      router.replace(from)
    } catch {
      // error already in store
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <Card className="w-full max-w-sm">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">เข้าสู่ระบบ</h1>
          <p className="text-sm text-gray-500 mt-1">Construction Report</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">ชื่อผู้ใช้</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              autoComplete="username"
              className="w-full px-3 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="username"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">รหัสผ่าน</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
              className="w-full px-3 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="••••••••"
            />
          </div>

          {error && (
            <div className="bg-red-50 text-red-700 text-sm rounded-lg px-3 py-2">{error}</div>
          )}

          <Button type="submit" fullWidth disabled={status === 'loading'}>
            {status === 'loading' ? 'กำลังเข้าสู่ระบบ...' : 'เข้าสู่ระบบ'}
          </Button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-4">
          ยังไม่มีบัญชี?{' '}
          <Link href="/register" className="text-blue-600 font-medium">
            สมัครสมาชิก
          </Link>
        </p>
      </Card>
    </div>
  )
}
