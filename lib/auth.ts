import { betterAuth } from 'better-auth'
import { prismaAdapter } from 'better-auth/adapters/prisma'
import { prisma } from './prisma'
import { getResetPasswordEmailHtml } from './templates/reset-password'
import { getVerifyEmailHtml } from './templates/verify-email'
import { FROM_EMAIL, resend } from './resend'
import { nextCookies } from 'better-auth/next-js'

export const auth = betterAuth({
  baseURL: process.env.BETTER_AUTH_URL,

  // DATABASE CONFIG
  database: prismaAdapter(prisma, {
    provider: 'postgresql',
  }),

  user: {
    additionalFields: {
      role: {
        type: 'string',
        required: false,
        defaultValue: 'USER',
        input: false,
      },
      phone: {
        type: 'string',
        required: false,
      },
    },
  },

  // EMAIL AND PASSWORD
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true,
    sendResetPassword: async ({ user, url }) => {
      try {
        const emailHtml = getResetPasswordEmailHtml(user.email, url)

        // Send the email using Resend
        const { error } = await resend.emails.send({
          from: FROM_EMAIL,
          to: user.email,
          subject: 'Reset Your Password',
          html: emailHtml,
        })

        if (error) {
          console.error('Failed to send reset password email:', error)
          throw new Error('Failed to send reset password email')
        }
      } catch (error) {
        console.error('Error in sendResetPassword:', error)
        throw error
      }
    },
    onPasswordReset: async ({ user }) => {
      console.log(`Password for user ${user.email} has been reset.`)
    },
  },

  // EMAIL VIRIFICATION
  emailVerification: {
    sendVerificationEmail: async ({ user, url }) => {
      try {
        const emailHtml = getVerifyEmailHtml(user.email, url)

        // Send the email using Resend
        const { error } = await resend.emails.send({
          from: FROM_EMAIL,
          to: user.email,
          subject: 'Verify your email address',
          html: emailHtml,
        })

        if (error) {
          console.error('Failed to send verification email:', error)
          throw new Error('Failed to send verification email')
        }
      } catch (error) {
        console.error('Error in sendResetPassword:', error)
        throw error
      }
    },
  },

  // PLUGINS
  plugins: [nextCookies()],
})

export type Session = typeof auth.$Infer.Session
export type SessionUser = Session['user']
