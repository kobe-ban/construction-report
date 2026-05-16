'use client'

import { useState, type FormEvent } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { useAuthStore, type AuthRole } from '@/store/authStore'

const ROLES: { value: AuthRole; label: string }[] = [
  { value: 'worker', label: 'ช่างหน้างาน' },
  { value: 'engineer', label: 'วิศวกร' },
  { value: 'boss', label: 'หัวหน้าโครงการ' },
  { value: 'accountant', label: 'บัญชี' },
  { value: 'admin', label: 'ผู้ดูแลระบบ' },
]

export function RegisterPage() {
  const router = useRouter()
  const register = useAuthStore((s) => s.register)
  const status = useAuthStore((s) => s.status)
  const error = useAuthStore((s) => s.error)

  const [form, setForm] = useState({
    username: '',
    password: '',
    fullName: '',
    role: 'worker' as AuthRole,
    email: '',
    phone: '',
    employeeCode: '',
  })

  function update<K extends keyof typeof form>(key: K, value: (typeof form)[K]) {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    try {
      await register({
        username: form.username,
        password: form.password,
        fullName: form.fullName,
        role: form.role,
        email: form.email || undefined,
        phone: form.phone || undefined,
        employeeCode: form.employeeCode || undefined,
      })
      router.replace('/')
    } catch {
      // error already in store
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-8">
      <Card className="w-full max-w-sm">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">สมัครสมาชิก</h1>
          <p className="text-sm text-gray-500 mt-1">สร้างบัญชีใหม่</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          <Field label="ชื่อ-นามสกุล *">
            <input
              type="text"
              required
              value={form.fullName}
              onChange={(e) => update('fullName', e.target.value)}
              className={inputClass}
            />
          </Field>

          <Field label="ชื่อผู้ใช้ *">
            <input
              type="text"
              required
              minLength={3}
              value={form.username}
              onChange={(e) => update('username', e.target.value)}
              className={inputClass}
              autoComplete="username"
            />
          </Field>

          <Field label="รหัสผ่าน *">
            <input
              type="password"
              required
              minLength={6}
              value={form.password}
              onChange={(e) => update('password', e.target.value)}
              className={inputClass}
              autoComplete="new-password"
            />
          </Field>

          <Field label="บทบาท *">
            <select
              value={form.role}
              onChange={(e) => update('role', e.target.value as AuthRole)}
              className={inputClass}
            >
              {ROLES.map((r) => (
                <option key={r.value} value={r.value}>
                  {r.label}
                </option>
              ))}
            </select>
          </Field>

          <Field label="อีเมล">
            <input
              type="email"
              value={form.email}
              onChange={(e) => update('email', e.target.value)}
              className={inputClass}
            />
          </Field>

          <Field label="เบอร์โทร">
            <input
              type="tel"
              value={form.phone}
              onChange={(e) => update('phone', e.target.value)}
              className={inputClass}
            />
          </Field>

          <Field label="รหัสพนักงาน">
            <input
              type="text"
              value={form.employeeCode}
              onChange={(e) => update('employeeCode', e.target.value)}
              className={inputClass}
            />
          </Field>

          {error && (
            <div className="bg-red-50 text-red-700 text-sm rounded-lg px-3 py-2">{error}</div>
          )}

          <Button type="submit" fullWidth disabled={status === 'loading'}>
            {status === 'loading' ? 'กำลังสมัคร...' : 'สมัครสมาชิก'}
          </Button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-4">
          มีบัญชีอยู่แล้ว?{' '}
          <Link href="/login" className="text-blue-600 font-medium">
            เข้าสู่ระบบ
          </Link>
        </p>
      </Card>
    </div>
  )
}

const inputClass =
  'w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500'

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      {children}
    </div>
  )
}
