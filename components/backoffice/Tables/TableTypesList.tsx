import { getAdminTableTypes } from '@/lib/db/backoffice/tables.services'
import { TableTypeCard } from './TableTypeCard'
import { TableTypeModal } from './TableTypeModal'

export async function TableTypesList() {
  const types = await getAdminTableTypes()

  return (
    <div className='space-y-6'>
      <div className='flex items-center justify-between'>
        <p className='text-sm text-on-surface-variant'>
          Вкупно типови:{' '}
          <span className='font-semibold text-foreground'>{types.length}</span>
        </p>
        <TableTypeModal />
      </div>

      {types.length === 0 ? (
        <div className='rounded-xl border border-dashed border-outline-variant/30 p-8 text-center text-sm text-on-surface-variant'>
          Нема внесено типови на маси.
        </div>
      ) : (
        <div className='grid gap-4 sm:grid-cols-2 xl:grid-cols-3'>
          {types.map((type) => (
            <TableTypeCard key={type.id} type={type} />
          ))}
        </div>
      )}
    </div>
  )
}
