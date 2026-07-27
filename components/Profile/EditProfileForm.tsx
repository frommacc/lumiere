'use client'

import { useEffect, useTransition } from 'react'
import { useForm, useWatch } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { LoaderCircle, Save } from 'lucide-react'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'

import { updateProfileAction } from '@/actions/profile'
import {
  editProfileSchema,
  type EditProfileFormValues,
} from '@/lib/validations/profile'
import { getUserInitials } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ImageUploadField } from '@/components/shared/ImageUploadField'

type EditableUser = {
  name?: string | null
  email?: string | null
  phone?: string | null
  image?: string | null
}

interface EditProfileFormProps {
  user: EditableUser
  onSuccess: () => void
}

export function EditProfileForm({ user, onSuccess }: EditProfileFormProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const form = useForm<EditProfileFormValues>({
    resolver: zodResolver(editProfileSchema),
    defaultValues: {
      name: user.name ?? '',
      phone: user.phone ?? '',
      image: undefined,
    },
    mode: 'onTouched',
  })

  useEffect(() => {
    form.reset({
      name: user.name ?? '',
      phone: user.phone ?? '',
      image: undefined,
    })
  }, [form, user.image, user.name, user.phone])

  const onSubmit = (data: EditProfileFormValues) => {
    const formData = new FormData()
    formData.set('name', data.name)
    formData.set('phone', data.phone)
    if (data.image) formData.set('image', data.image)

    startTransition(async () => {
      const result = await updateProfileAction(formData)

      if (!result.success) {
        Object.entries(result.fieldErrors ?? {}).forEach(
          ([field, messages]) => {
            form.setError(field as keyof EditProfileFormValues, {
              message: messages?.[0],
            })
          },
        )
        toast.error(result.message)
        return
      }

      toast.success(result.message)
      router.refresh()

      onSuccess()
    })
  }

  const nameError = form.formState.errors.name?.message
  const phoneError = form.formState.errors.phone?.message
  const selectedImage = useWatch({
    control: form.control,
    name: 'image',
  })

  return (
    <form
      onSubmit={form.handleSubmit(onSubmit)}
      className='space-y-6'
      noValidate
    >
      <ImageUploadField
        value={selectedImage}
        currentImage={user.image}
        fallback={getUserInitials(user.name)}
        error={form.formState.errors.image?.message}
        disabled={isPending}
        onChange={(file) =>
          form.setValue('image', file, { shouldValidate: true })
        }
      />

      <div className='grid grid-cols-1 gap-5 sm:grid-cols-2'>
        <div className='space-y-2'>
          <Label htmlFor='edit-profile-name'>Име и презиме</Label>
          <Input
            id='edit-profile-name'
            autoComplete='name'
            disabled={isPending}
            aria-invalid={!!nameError}
            {...form.register('name')}
          />
          {nameError && <p className='text-xs text-destructive'>{nameError}</p>}
        </div>

        <div className='space-y-2'>
          <Label htmlFor='edit-profile-phone'>Телефонски број</Label>
          <Input
            id='edit-profile-phone'
            type='tel'
            autoComplete='tel'
            disabled={isPending}
            aria-invalid={!!phoneError}
            {...form.register('phone')}
          />
          {phoneError && (
            <p className='text-xs text-destructive'>{phoneError}</p>
          )}
        </div>
      </div>

      <div className='rounded-lg border border-outline-variant/20 bg-surface-container-low/50 p-4'>
        <p className='font-label-caps text-[10px] tracking-widest uppercase text-outline'>
          Е-пошта
        </p>
        <p className='mt-1 text-sm text-on-surface'>{user.email ?? '—'}</p>
        <p className='mt-1 text-xs text-on-surface-variant'>
          Промената на е-пошта ќе биде достапна со посебен безбеден процес.
        </p>
      </div>

      <div className='flex justify-end gap-3 border-t border-outline-variant/20 pt-5'>
        <Button type='submit' disabled={isPending} className='min-w-40'>
          {isPending ? <LoaderCircle className='animate-spin' /> : <Save />}
          {isPending ? 'Зачувување...' : 'Зачувај промени'}
        </Button>
      </div>
    </form>
  )
}
