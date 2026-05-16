import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  const adminHash = await bcrypt.hash('admin1234', 10)
  const workerHash = await bcrypt.hash('worker1234', 10)

  const admin = await prisma.user.upsert({
    where: { username: 'admin' },
    update: {},
    create: {
      username: 'admin',
      passwordHash: adminHash,
      fullName: 'ผู้ดูแลระบบ',
      role: 'admin',
      email: 'admin@example.com',
      employeeCode: 'EMP-0001',
    },
  })

  const boss = await prisma.user.upsert({
    where: { username: 'boss' },
    update: {},
    create: {
      username: 'boss',
      passwordHash: adminHash,
      fullName: 'หัวหน้าโครงการ',
      role: 'boss',
      email: 'boss@example.com',
      employeeCode: 'EMP-0002',
    },
  })

  const worker = await prisma.user.upsert({
    where: { username: 'worker' },
    update: {},
    create: {
      username: 'worker',
      passwordHash: workerHash,
      fullName: 'ช่างหน้างาน',
      role: 'worker',
      email: 'worker@example.com',
      employeeCode: 'EMP-0003',
    },
  })

  console.log('Seeded users:', { admin: admin.username, boss: boss.username, worker: worker.username })
  console.log('Default passwords -> admin/boss: admin1234, worker: worker1234')
}

main()
  .catch((err) => {
    console.error(err)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
