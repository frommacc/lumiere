import { Suspense } from 'react'
import { LoaderCircle } from 'lucide-react'

import { BackofficeHeader } from '@/components/backoffice/BackofficeHeader'

import { requireRouteAccess } from '@/lib/authorization'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { TablesList } from '@/components/backoffice/Tables/TablesList'
import { TableTypesList } from '@/components/backoffice/Tables/TableTypesList'

function ComponentSkeleton() {
  return (
    <div className='flex h-40 items-center justify-center rounded-xl border border-outline-variant/20 bg-surface-container-low/20'>
      <LoaderCircle className='size-6 animate-spin text-primary' />
    </div>
  )
}

export default async function AdminTablesPage() {
  await requireRouteAccess('/admin/tables')

  return (
    <>
      <BackofficeHeader
        eyebrow='Поставување на сала'
        title='Маси'
        description='Физичките маси се одвоени од амбиентот и типот, а денешната состојба се чита од резервациите.'
      />
      <div className='space-y-6 px-6 py-8 md:px-10'>
        <Tabs defaultValue='tables' className='w-full space-y-6'>
          <TabsList>
            <TabsTrigger value='tables'>Маси</TabsTrigger>
            <TabsTrigger value='types'>Типови на маси</TabsTrigger>
          </TabsList>

          <TabsContent value='tables'>
            <Suspense fallback={<ComponentSkeleton />}>
              <TablesList />
            </Suspense>
          </TabsContent>

          <TabsContent value='types'>
            <Suspense fallback={<ComponentSkeleton />}>
              <TableTypesList />
            </Suspense>
          </TabsContent>
        </Tabs>
      </div>
    </>
  )
}
