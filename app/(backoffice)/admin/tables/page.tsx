import { BackofficeHeader } from '@/components/backoffice/BackofficeHeader'
import { TableManager } from '@/components/backoffice/TableManager'
import { requireRouteAccess } from '@/lib/authorization'
import { getAdminTables, getAdminTableTypes } from '@/lib/db/admin.services'
import { formatBackofficeTime } from '@/components/backoffice/formatters'

export default async function AdminTablesPage() {
  await requireRouteAccess('/admin/tables')
  const [tables, types] = await Promise.all([getAdminTables(), getAdminTableTypes()])
  return <><BackofficeHeader eyebrow='Поставување на сала' title='Маси' description='Физичките маси се одвоени од амбиентот и типот, а денешната состојба се чита од резервациите.' />
    <div className='space-y-6 px-6 py-8 md:px-10'><TableManager tableTypes={types.map((type) => ({ id: type.id, name: type.name }))} />
      <div className='grid gap-4 sm:grid-cols-2 xl:grid-cols-3'>{tables.map((table) => { const active = table.reservations[0]; return <article key={table.id} className={`rounded-xl border p-5 ${active ? 'border-primary/40 bg-primary/5' : 'border-outline-variant/20 bg-surface-container-low/40'}`}><div className='flex items-start justify-between'><div><p className='font-display text-2xl'>{table.number}</p><p className='mt-1 text-xs text-on-surface-variant'>{table.tableType.name} · {table.capacity} места</p></div><span className={`rounded-full px-2.5 py-1 text-[10px] uppercase tracking-widest ${active ? 'bg-primary/15 text-primary' : 'bg-surface-container-high text-on-surface-variant'}`}>{active ? 'Резервирана' : 'Слободна'}</span></div>{active ? <p className='mt-5 border-t border-primary/20 pt-4 text-sm text-on-surface-variant'>{formatBackofficeTime(active.startTime)} · {active.guests} гости</p> : <p className='mt-5 border-t border-outline-variant/15 pt-4 text-sm text-on-surface-variant'>Нема активна резервација.</p>}</article> })}</div>
      <section className='rounded-xl border border-outline-variant/20 bg-surface-container-low/40 p-5'><p className='font-label-caps text-[10px] uppercase tracking-[0.2em] text-primary'>Типови на маси</p><div className='mt-4 flex flex-wrap gap-3'>{types.map((type) => <div key={type.id} className='rounded-lg border border-outline-variant/20 bg-surface-container-high/40 px-4 py-3'><p className='font-medium'>{type.name}</p><p className='mt-1 text-xs text-on-surface-variant'>{type._count.tables} маси{type.description ? ` · ${type.description}` : ''}</p></div>)}</div></section>
    </div></>
}
