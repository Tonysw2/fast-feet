import { execSync } from 'node:child_process'
import { randomUUID } from 'node:crypto'
import { config } from 'dotenv'
import { Client } from 'pg'
import { DomainEvents } from 'src/core/events/domain-events'
import { envSchema } from 'src/infra/env/env'
import { afterAll, beforeAll } from 'vitest'

config({ path: '.env', override: true })
config({ path: '.env.test', override: true })

const env = envSchema.parse(process.env)

function generateUrl(schema: string) {
  if (!env.DATABASE_URL) {
    throw new Error('Please provide a DATABASE_URL env variable')
  }

  const url = new URL(env.DATABASE_URL)

  url.searchParams.set('schema', schema)

  return url.toString()
}

const schema = randomUUID()
const databaseUrl = generateUrl(schema)

beforeAll(async () => {
  process.env.DATABASE_URL = databaseUrl

  execSync('pnpm exec prisma migrate deploy')

  DomainEvents.shouldRun = false
})

afterAll(async () => {
  const client = new Client({ connectionString: databaseUrl })

  await client.connect()
  await client.query(`DROP SCHEMA IF EXISTS "${schema}" CASCADE`)
  await client.end()
})
