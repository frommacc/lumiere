'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { OrderStatus } from '@/lib/generated/prisma'
import { orderStatusLabels } from '@/components/Orders/OrderStatusBadge'

export function OrderStatusFilter({
  currentStatus,
}: {
  currentStatus?: string
}) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const handleStatusChange = (value: string) => {
    const params = new URLSearchParams(searchParams.toString())

    // We always clear or reset 'page' when the filter changes
    params.delete('page')

    if (value && value !== 'ALL') {
      params.set('status', value)
    } else {
      params.delete('status')
    }

    router.push(`?${params.toString()}`)
  }

  return (
    <Select
      defaultValue={currentStatus ?? 'ALL'}
      onValueChange={handleStatusChange}
    >
      <SelectTrigger className='w-full md:w-auto'>
        <SelectValue placeholder='All statuses' />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value='ALL'>All statuses</SelectItem>
        {Object.values(OrderStatus).map((val) => (
          <SelectItem key={val} value={val}>
            {orderStatusLabels[val]}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
