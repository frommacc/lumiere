import { Suspense } from 'react'
import { ProfileUserContent } from '@/components/Profile/ProfileUserContent'
import { ProfileOrdersContent } from '@/components/Profile/ProfileOrdersContent'
import {
  ProfileOrdersSkeleton,
  ProfileUserSkeleton,
} from '@/components/Profile/ProfileSkeleton'

export default function ProfilePage() {
  return (
    <main className='grow pt-16 w-full bg-surface min-h-screen'>
      <Suspense fallback={<ProfileUserSkeleton />}>
        <ProfileUserContent />
      </Suspense>

      <Suspense fallback={<ProfileOrdersSkeleton />}>
        <ProfileOrdersContent />
      </Suspense>
    </main>
  )
}
