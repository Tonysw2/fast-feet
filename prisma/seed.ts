import 'dotenv/config'

import { PrismaPg } from '@prisma/adapter-pg'
import { hash } from 'bcryptjs'
import { PrismaClient } from './generated/client'

const connectionString = process.env.DATABASE_URL!
const schema = new URL(connectionString).searchParams.get('schema') ?? undefined

const adapter = new PrismaPg({ connectionString }, { schema })

const prisma = new PrismaClient({ adapter })

async function main() {
  const admin = await prisma.admin.upsert({
    where: { cpf: '123.123.123-12' },
    update: {},
    create: {
      name: 'anthony admin',
      cpf: '123.123.123-12',
      password: await hash('Anthony@123', 8),
    },
  })

  console.log('Admin created:', admin)

  const courier = await prisma.courier.upsert({
    where: { cpf: '456.456.456-45' },
    update: {},
    create: {
      name: 'anthony courier',
      cpf: '456.456.456-45',
      password: await hash('Anthony@123', 8),
    },
  })

  console.log('Courier created:', courier)
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
