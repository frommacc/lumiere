'use client'

import { useState, useTransition } from 'react'
import { toast } from 'sonner'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import { DeliveryMethod, OrderStatus, Role } from '@/lib/generated/prisma'
import {
  statusActionLabels,
  orderActionLabels,
} from '@/components/Orders/OrderStatusBadge'
import { MoreHorizontal, Trash2, Loader2 } from 'lucide-react'

import { getAllowedOrderStatuses } from '@/lib/constants/operational-status'
import {
  deleteOrderAction,
  updateOrderStatusAction,
} from '@/actions/backoffice/orders'
import { ConfirmDialog } from '../shared/ConfirmDialog'

interface OrderActionsMenuProps {
  orderId: string
  currentStatus: OrderStatus
  role: Role
  deliveryMethod?: DeliveryMethod // To check allowed statuses
}

export function OrderActionsMenu({
  orderId,
  currentStatus,
  role,
}: OrderActionsMenuProps) {
  const [isPending, startTransition] = useTransition()
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  // Allowed statuses according to the roll
  const allowedStatuses = getAllowedOrderStatuses(
    role,
    currentStatus,
    'ADDRESS',
  )

  // Change of status
  const handleStatusChange = (newStatus: OrderStatus) => {
    startTransition(async () => {
      const res = await updateOrderStatusAction({ orderId, status: newStatus })
      if (res.success) {
        toast.success(res.message)
      } else {
        toast.error(res.message)
      }
    })
  }

  // Execution of the deletion
  const handleDeleteConfirm = () => {
    startTransition(async () => {
      const res = await deleteOrderAction(orderId)
      if (res.success) {
        toast.success(res.message)
        setShowDeleteConfirm(false)
      } else {
        toast.error(res.message)
      }
    })
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant='ghost' className='h-8 w-8 p-0' disabled={isPending}>
            <span className='sr-only'>{orderActionLabels.openMenuSr}</span>
            {isPending ? (
              <Loader2 className='h-4 w-4 animate-spin text-muted-foreground' />
            ) : (
              <MoreHorizontal className='h-4 w-4' />
            )}
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align='end' className='w-52'>
          <DropdownMenuLabel className='text-xs text-muted-foreground'>
            {orderActionLabels.changeStatusGroup}
          </DropdownMenuLabel>

          {allowedStatuses.map((status) => (
            <DropdownMenuItem
              key={status}
              disabled={isPending}
              onClick={() => handleStatusChange(status)}
            >
              <span className='text-xs font-medium'>
                {statusActionLabels[status]}
              </span>
            </DropdownMenuItem>          ))}

          {/* Delete order (for ADMIN only) */}
          { role === Role.ADMIN && (
            <>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                disabled={isPending}
                className='text-destructive focus:text-destructive cursor-pointer'
                onSelect={() => setShowDeleteConfirm(true)} // 👈 We open the Confirm Dialog
              >
                <Trash2 className='mr-2 h-4 w-4' />
                {orderActionLabels.deleteOrder}
              </DropdownMenuItem>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      {/* 🎯 Reusable Confirm Dialog */}
      <ConfirmDialog
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={handleDeleteConfirm}
        title='Delete order'
        description={`Are you sure you want to permanently delete the order? This action is irreversible.`}
        confirmText='Delete'
        cancelText='Give up'
        variant='destructive'
        isLoading={isPending}
      />
    </>
  )
}
