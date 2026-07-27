import Link from 'next/link'
import { CalendarDays } from 'lucide-react'

import { Button } from '@/components/ui/button'

export function EmptyReservationsState() {
  return (
    <div className='mt-10 flex flex-col items-center space-y-4 rounded-2xl border border-dashed border-outline-variant/30 py-16 text-center'>
      <CalendarDays className='size-16 text-primary' />
      <p className='font-headline-sm text-foreground'>Сè уште немате направено резервација.</p>
      <Button asChild><Link href='/'>Направи резервација</Link></Button>
    </div>
  )
}
