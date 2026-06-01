import z from 'zod'

export const envSchema = z.object({
  DATABASE_URL: z.string().url(),
  JWT_PUBLIC_KEY: z.string(),
  JWT_SECRET_KEY: z.string(),
})

export type Env = z.infer<typeof envSchema>
