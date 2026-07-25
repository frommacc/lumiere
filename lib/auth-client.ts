import { createAuthClient } from 'better-auth/react'
import { adminClient, inferAdditionalFields } from 'better-auth/client/plugins'
import type { auth } from '@/lib/auth'

export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
  plugins: [inferAdditionalFields<typeof auth>(), adminClient()],
})

export type Session = typeof authClient.$Infer.Session
export type SessionUser = Session['user']

export const {
  signIn,
  signUp,
  useSession,
  signOut,
  requestPasswordReset,
  resetPassword,
} = authClient
