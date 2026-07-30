import {
  getAdminTables,
  getAdminTableTypes,
} from '@/lib/db/backoffice/tables.services'
import { TableCard } from './TableCard'
import { TableModal } from './TableModal'

export async function TablesList() {
  const [tables, types] = await Promise.all([
    getAdminTables(),
    getAdminTableTypes(),
  ])

  const tableTypeOptions = types.map((type) => ({
    id: type.id,
    name: type.name,
  }))

  return (
    <div className='space-y-6'>
      <div className='flex items-center justify-between'>
        <p className='text-sm text-on-surface-variant'>
          Вкупно маси:{' '}
          <span className='font-semibold text-foreground'>{tables.length}</span>
        </p>
        <TableModal tableTypes={tableTypeOptions} />
      </div>

      {tables.length === 0 ? (
        <div className='rounded-xl border border-dashed border-outline-variant/30 p-8 text-center text-sm text-on-surface-variant'>
          Нема внесено маси.
        </div>
      ) : (
        <div className='grid gap-4 sm:grid-cols-2 xl:grid-cols-3'>
          {tables.map((table) => (
            <TableCard
              key={table.id}
              table={table}
              tableTypes={tableTypeOptions}
            />
          ))}
        </div>
      )}
    </div>
  )
}
