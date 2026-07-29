// components/backoffice/Menu/MenuTable.tsx

import Image from 'next/image'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { formatCurrency } from '@/lib/utils/order'
import MenuItemActions from './MenuItemActions'
import { MenuItemWithCategory } from '@/types/menu-item'
import { PaginationControls } from '../shared/pagination-controls'

interface PaginationMeta {
  currentPage: number
  pageSize: number
  totalItems: number
  totalPages: number
}

interface MenuTableProps {
  items: MenuItemWithCategory[]
  categories: { id: string; name: string }[]
  pagination: PaginationMeta
}

export function MenuTable({ items, categories, pagination }: MenuTableProps) {
  return (
    <div className='overflow-hidden rounded-xl border border-outline-variant/20 bg-surface-container-low/40'>
      <Table className='min-w-200 text-sm'>
        <TableHeader className='border-b border-outline-variant/15 bg-surface-container-low/80'>
          <TableRow className='hover:bg-transparent'>
            <TableHead className='w-16 px-5 py-4 text-[10px] uppercase tracking-[0.16em] text-on-surface-variant font-medium'>
              Слика
            </TableHead>
            <TableHead className='px-5 py-4 text-[10px] uppercase tracking-[0.16em] text-on-surface-variant font-medium'>
              Јадење
            </TableHead>
            <TableHead className='px-5 py-4 text-[10px] uppercase tracking-[0.16em] text-on-surface-variant font-medium'>
              Ознаки
            </TableHead>
            <TableHead className='px-5 py-4 text-[10px] uppercase tracking-[0.16em] text-on-surface-variant font-medium'>
              Категорија
            </TableHead>
            <TableHead className='px-5 py-4 text-[10px] uppercase tracking-[0.16em] text-on-surface-variant font-medium'>
              Цена
            </TableHead>
            <TableHead className='px-5 py-4 text-[10px] uppercase tracking-[0.16em] text-on-surface-variant font-medium'>
              Статус
            </TableHead>
            <TableHead className='px-5 py-4 text-right text-[10px] uppercase tracking-[0.16em] text-on-surface-variant font-medium'>
              Акции
            </TableHead>
          </TableRow>
        </TableHeader>

        <TableBody className='divide-y divide-outline-variant/10'>
          {items.map((item) => (
            <TableRow
              key={item.id}
              className='hover:bg-surface-container/30 transition-colors border-outline-variant/10'
            >
              {/* 1. Слика */}
              <TableCell className='px-5 py-3'>
                <div className='relative h-14 w-14 overflow-hidden rounded-lg bg-surface-container border border-outline-variant/20'>
                  {item.image ? (
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      sizes='100px'
                      className='object-cover'
                    />
                  ) : (
                    <div className='flex h-full w-full items-center justify-center text-[10px] text-on-surface-variant font-medium'>
                      N/A
                    </div>
                  )}
                </div>
              </TableCell>

              {/* 2. Име и Опис */}
              <TableCell className='px-5 py-4 max-w-xs'>
                <p className='font-medium text-on-surface'>{item.name}</p>
                {item.description && (
                  <p className='mt-0.5 truncate text-xs text-on-surface-variant'>
                    {item.description}
                  </p>
                )}
              </TableCell>

              {/* 3. Ознаки */}
              <TableCell className='px-5 py-4'>
                <div className='flex flex-col gap-1.5'>
                  {item.isPopular && (
                    <span className='w-fit inline-flex items-center rounded-full bg-amber-500/10 px-2 py-0.5 text-[10px] font-medium text-amber-400 border border-amber-500/20'>
                      Популарно
                    </span>
                  )}
                  {item.isSpecial && (
                    <span className='w-fit inline-flex items-center rounded-full bg-purple-500/10 px-2 py-0.5 text-[10px] font-medium text-purple-400 border border-purple-500/20'>
                      Специјалитет
                    </span>
                  )}
                  {item.isExclusive && (
                    <span className='w-fit inline-flex items-center rounded-full bg-rose-500/10 px-2 py-0.5 text-[10px] font-medium text-rose-400 border border-rose-500/20'>
                      Ексклузивно
                    </span>
                  )}
                  {!item.isPopular && !item.isSpecial && !item.isExclusive && (
                    <span className='text-xs text-on-surface-variant/40'>
                      —
                    </span>
                  )}
                </div>
              </TableCell>

              {/* 4. Категорија */}
              <TableCell className='px-5 py-4 text-on-surface-variant'>
                <span className='inline-flex items-center rounded-md bg-surface-container px-2 py-1 text-xs font-medium border border-outline-variant/20'>
                  {item.category?.name}
                </span>
              </TableCell>

              {/* 5. Цена */}
              <TableCell className='px-5 py-4 font-semibold text-on-surface whitespace-nowrap'>
                {formatCurrency(item.price)}
              </TableCell>

              {/* 6. Статус */}
              <TableCell className='px-5 py-4 whitespace-nowrap'>
                <span
                  className={`inline-flex items-center gap-1.5 text-xs font-medium ${
                    item.isAvailable
                      ? 'text-emerald-400'
                      : 'text-on-surface-variant/60'
                  }`}
                >
                  <span
                    className={`size-1.5 rounded-full ${
                      item.isAvailable
                        ? 'bg-emerald-400'
                        : 'bg-on-surface-variant/40'
                    }`}
                  />
                  {item.isAvailable ? 'Достапно' : 'Повлечено'}
                </span>
              </TableCell>

              {/* 7. Акции */}
              <TableCell className='px-5 py-4 text-right'>
                <div className='flex justify-end'>
                  <MenuItemActions item={item} categories={categories} />
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Shadcn Pagination Контроли */}
      <PaginationControls
        currentPage={pagination.currentPage}
        totalPages={pagination.totalPages}
        totalItems={pagination.totalItems}
        pageSize={pagination.pageSize}
      />
    </div>
  )
}
