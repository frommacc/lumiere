'use client'

import { useState, useTransition } from 'react'
import { Check, LoaderCircle, MoreHorizontal, Trash2, X } from 'lucide-react'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'

import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'

import { getAllowedReservationStatuses } from '@/lib/constants/operational-status'
import { ReservationStatus, Role } from '@/lib/generated/prisma'
import {
  updateReservationStatusAction,
  deleteReservationAction,
} from '@/actions/backoffice/reservations'

const reservationLabels: Partial<Record<ReservationStatus, string>> = {
  CONFIRMED: 'Прифати',
  SEATED: 'Седнати',
  COMPLETED: 'Заврши',
  CANCELLED: 'Откажи',
  NO_SHOW: 'Не се појави',
}

export function ReservationActions({
  reservationId,
  status,
  role,
}: {
  reservationId: string
  status: ReservationStatus
  role: Role
}) {
  const [pending, startTransition] = useTransition()
  const router = useRouter()
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)

  // Следење која акција моментално се извршува
  const [activeAction, setActiveAction] = useState<string | null>(null)

  const nextStatuses = getAllowedReservationStatuses(role, status)
  const canDelete = role === Role.ADMIN || role === Role.MANAGER

  const update = (nextStatus: ReservationStatus) => {
    setActiveAction(nextStatus)
    startTransition(async () => {
      const result = await updateReservationStatusAction({
        reservationId,
        status: nextStatus,
      })
      if (result.success) toast.success(result.message)
      else toast.error(result.message)

      if (result.success) router.refresh()
      setActiveAction(null)
    })
  }

  const handleDelete = () => {
    setActiveAction('DELETE')
    startTransition(async () => {
      const result = await deleteReservationAction(reservationId)
      if (result.success) {
        toast.success(result.message)
        router.refresh()
      } else {
        toast.error(result.message)
      }
      setActiveAction(null)
      setDeleteDialogOpen(false)
    })
  }

  // 1. СЛУЧАЈ: Резервацијата е PENDING - Директни копчиња
  if (status === ReservationStatus.PENDING) {
    const isConfirming = pending && activeAction === ReservationStatus.CONFIRMED
    const isCancelling = pending && activeAction === ReservationStatus.CANCELLED

    return (
      <div className='flex items-center gap-2'>
        <Button
          type='button'
          size='sm'
          disabled={pending}
          onClick={() => update(ReservationStatus.CONFIRMED)}
        >
          {isConfirming ? (
            <LoaderCircle className='size-3.5 animate-spin' />
          ) : (
            <Check className='size-3.5' />
          )}
          Прифати
        </Button>

        <Button
          type='button'
          size='sm'
          variant='ghost'
          disabled={pending}
          onClick={() => update(ReservationStatus.CANCELLED)}
        >
          {isCancelling ? (
            <LoaderCircle className='size-3.5 animate-spin' />
          ) : (
            <X className='size-3.5' />
          )}
          Откажи
        </Button>
      </div>
    )
  }

  // Нема акции ниту за промена на статус ниту за бришење
  if (!nextStatuses.length && !canDelete) return null

  // Проверка за конкретни акции
  const isDeleting = pending && activeAction === 'DELETE'
  const isSeating = pending && activeAction === ReservationStatus.SEATED
  const isFinishing = pending && activeAction === ReservationStatus.COMPLETED

  // Loader во менито со 3 точки се прикажува САМО ако акцијата доаѓа од менито или при бришење
  const isDropdownLoading =
    pending &&
    activeAction !== null &&
    activeAction !== ReservationStatus.SEATED &&
    activeAction !== ReservationStatus.COMPLETED

  return (
    <div className='flex items-center gap-2'>
      {/* SHOW ON CONFIRMED */}
      {status === ReservationStatus.CONFIRMED && (
        <Button
          type='button'
          size='sm'
          disabled={pending}
          onClick={() => update(ReservationStatus.SEATED)}
        >
          {isSeating ? (
            <LoaderCircle className='size-3.5 animate-spin' />
          ) : (
            <Check className='size-3.5' />
          )}
          Седнати
        </Button>
      )}

      {/* SHOW ON SEATED */}
      {status === ReservationStatus.SEATED && (
        <Button
          type='button'
          size='sm'
          disabled={pending}
          onClick={() => update(ReservationStatus.COMPLETED)}
        >
          {isFinishing ? (
            <LoaderCircle className='size-3.5 animate-spin' />
          ) : (
            <Check className='size-3.5' />
          )}
          Заврши
        </Button>
      )}

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant='ghost'
            size='sm'
            disabled={pending}
            className='h-8 w-8 p-0 border border-outline-variant/20 hover:bg-surface-container-high'
          >
            {isDropdownLoading ? (
              <LoaderCircle className='size-4 animate-spin' />
            ) : (
              <MoreHorizontal className='size-4' />
            )}
            <span className='sr-only'>Мени за акции</span>
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align='end' className='w-40'>
          {/* Статусни промени */}
          {nextStatuses.map((nextStatus) => {
            const isItemLoading = pending && activeAction === nextStatus

            return (
              <DropdownMenuItem
                key={nextStatus}
                disabled={pending}
                onClick={() => update(nextStatus)}
                className='cursor-pointer flex items-center justify-between'
              >
                <span>{reservationLabels[nextStatus] ?? nextStatus}</span>
                {isItemLoading && (
                  <LoaderCircle className='size-3.5 animate-spin' />
                )}
              </DropdownMenuItem>
            )
          })}

          {/* Разделник пред бришење */}
          {nextStatuses.length > 0 && canDelete && <DropdownMenuSeparator />}

          {/* Бришење */}
          {canDelete && (
            <DropdownMenuItem
              disabled={pending}
              onClick={() => setDeleteDialogOpen(true)}
              className='cursor-pointer text-destructive focus:text-destructive focus:bg-destructive/10'
            >
              <Trash2 className='mr-2 size-4' />
              Избриши
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Потврда за бришење преку AlertDialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Дали сте сигурни?</AlertDialogTitle>
            <AlertDialogDescription>
              Оваа акција е трајна и резервацијата ќе биде целосно избришана од
              системот.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Откажи</AlertDialogCancel>
            <AlertDialogAction
              onClick={(e) => {
                e.preventDefault()
                handleDelete()
              }}
              disabled={isDeleting}
              className='bg-destructive text-destructive-foreground hover:bg-destructive/90'
            >
              {isDeleting ? (
                <div className='flex items-center gap-2'>
                  <LoaderCircle className='size-3.5 animate-spin' />
                  <span>Се брише...</span>
                </div>
              ) : (
                'Избриши'
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
