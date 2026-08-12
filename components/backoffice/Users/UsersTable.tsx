'use client'

import { useState, useTransition } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import {
  CheckCircle2,
  XCircle,
  User as UserIcon,
  LoaderCircle,
  UserX,
} from 'lucide-react'

import { User, UserStatus } from '@/lib/generated/prisma'
import { getRoleLabel } from '@/lib/constants/user-roles'
import { deleteUserAction } from '@/actions/backoffice/users'
import { formatBackofficeDateTime } from '@/components/backoffice/formatters'

import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
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

import { UserActions } from './UserActions'
import { EditUserModal } from './EditUserModal'

interface UsersTableProps {
  users: User[]
  currentUserId: string
}

export function UsersTable({ users, currentUserId }: UsersTableProps) {
  const router = useRouter()
  const [pending, startTransition] = useTransition()

  // Only ONE user is kept for editing and ONE for deletion
  const [editingUser, setEditingUser] = useState<User | null>(null)
  const [deletingUser, setDeletingUser] = useState<User | null>(null)

  const handleDelete = () => {
    if (!deletingUser) return

    startTransition(async () => {
      const res = await deleteUserAction(deletingUser.id)
      if (res.success) {
        toast.success(res.message)
        setDeletingUser(null)
        router.refresh()
      } else {
        toast.error(res.message)
      }
    })
  }

  return (
    <>
      <div className='overflow-hidden rounded-xl border border-outline-variant/20 bg-surface-container-low/40'>
        <Table className='min-w-230'>
          <TableHeader className='border-b border-outline-variant/15 text-[10px] uppercase tracking-[0.16em] text-on-surface-variant'>
            <TableRow>
              <TableHead className='px-5 py-4'>User</TableHead>
              <TableHead className='px-5 py-4'>Verified</TableHead>
              <TableHead className='px-5 py-4'>Telephone</TableHead>
              <TableHead className='px-5 py-4'>Member of</TableHead>
              <TableHead className='px-5 py-4'>Role</TableHead>
              <TableHead className='px-5 py-4'>Status</TableHead>
              <TableHead className='px-5 py-4 text-right'>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className='divide-y divide-outline-variant/10'>
            {users.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className='py-12 text-center'>
                  <div className='flex flex-col items-center justify-center gap-2'>
                    <div className='flex size-12 items-center justify-center rounded-full bg-surface-container-high text-on-surface-variant/70'>
                      <UserX className='size-6' />
                    </div>
                    <p className='font-medium text-on-surface'>                      No users found
                    </p>
                    <p className='text-xs text-on-surface-variant'>                      Try a different search term.
                    </p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              users.map((user) => (
                <TableRow
                  key={user.id}
                  className={
                    user.status === UserStatus.BLOCKED
                      ? 'bg-destructive/5 opacity-80'
                      : ''
                  }
                >
                  <TableCell className='px-5 py-4'>
                    <div className='flex items-center gap-3'>
                      <div className='relative size-20 shrink-0 overflow-hidden rounded-full border border-outline-variant/20 bg-surface-container-high'>
                        {user.image ? (
                          <Image
                            src={user.image}
                            alt={user.name || 'User'}
                            fill
                            sizes='160px'
                            className='object-cover'
                          />
                        ) : (
                          <div className='flex size-full items-center justify-center text-on-surface-variant'>
                            <UserIcon className='size-5' />
                          </div>
                        )}
                      </div>
                      <div>
                        <p className='font-medium'>{user.name}</p>
                        <p className='mt-0.5 text-xs text-on-surface-variant'>
                          {user.email}
                        </p>
                      </div>
                    </div>
                  </TableCell>

                  <TableCell className='px-5 py-4'>
                    {user.emailVerified ? (
                      <span className='inline-flex items-center gap-1 text-xs text-emerald-600 dark:text-emerald-400'>
                        <CheckCircle2 className='size-3.5' /> Verified
                      </span>
                    ) : (
                      <span className='inline-flex items-center gap-1 text-xs text-on-surface-variant/70'>
                        <XCircle className='size-3.5' /> Unverified
                      </span>
                    )}
                  </TableCell>

                  <TableCell className='px-5 py-4 text-xs'>
                    {user.phone || '/'}
                  </TableCell>

                  <TableCell
                    className='px-5 py-4 text-xs text-on-surface-variant'
                    suppressHydrationWarning
                  >
                    {formatBackofficeDateTime(user.createdAt)}
                  </TableCell>

                  <TableCell className='px-5 py-4'>
                    <Badge
                      variant='outline'
                      className='border-outline-variant/30 text-xs font-normal'
                    >
                      {getRoleLabel(user.role, true)}
                    </Badge>
                  </TableCell>

                  <TableCell className='px-5 py-4'>
                    {user.status === UserStatus.BLOCKED ? (
                      <Badge
                        variant='destructive'
                        className='px-2 py-0.5 text-[10px]'
                      >                        Blocked
                      </Badge>
                    ) : (
                      <Badge
                        variant='secondary'
                        className='bg-emerald-500/10 px-2 py-0.5 text-[10px] text-emerald-600 dark:text-emerald-400'
                      >                        Active</Badge>
                    )}
                  </TableCell>

                  <TableCell className='px-5 py-4 text-right'>
                    <UserActions
                      user={user}
                      isSelf={user.id === currentUserId}
                      onEdit={(selectedUser) => setEditingUser(selectedUser)}
                      onDelete={(selectedUser) => setDeletingUser(selectedUser)}
                    />
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>      {/* 1. ONLY ONE EDIT MODAL */}
      { editingUser && (
        <EditUserModal
          key={editingUser.id}
          user={editingUser}
          isSelf={editingUser.id === currentUserId}
          open={!!editingUser}
          onOpenChange={(open) => !open && setEditingUser(null)}
        />      )}

      {/* 2. ONLY ONE DELETE DIALOG */}
      <AlertDialog
        open={!!deletingUser}
        onOpenChange={(open) => !open && setDeletingUser(null)}
      >
        <AlertDialogContent className='bg-surface-container text-on-surface'>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>              This action is permanent. User{' '}
              <strong>{deletingUser?.name}</strong> will be deleted.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={pending}>Give up</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={pending}
              className='bg-destructive text-destructive-foreground hover:bg-destructive/90'
            >
              {pending && <LoaderCircle className='mr-2 size-4 animate-spin' />}
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
