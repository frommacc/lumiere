import Image from 'next/image'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import CategoryActions from '@/components/backoffice/Categories/CategoryActions'
import { CategoryWithCount } from '@/types/categories'

interface CategoriesTableProps {
  categories: CategoryWithCount[]
}

export function CategoriesTable({ categories }: CategoriesTableProps) {
  return (
    <div className='overflow-hidden rounded-xl border border-outline-variant/20 bg-surface-container-low/40'>
      <Table className='min-w-125 text-sm'>
        <TableHeader className='border-b border-outline-variant/15 bg-surface-container-low/80'>
          <TableRow className='hover:bg-transparent'>
            {/* 0. Редослед */}
            <TableHead className='w-12 px-5 py-4 text-[10px] uppercase tracking-[0.16em] text-on-surface-variant font-medium text-center'>
              #
            </TableHead>
            <TableHead className='w-16 px-5 py-4 text-[10px] uppercase tracking-[0.16em] text-on-surface-variant font-medium'>
              Слика
            </TableHead>
            <TableHead className='px-5 py-4 text-[10px] uppercase tracking-[0.16em] text-on-surface-variant font-medium'>
              Категорија
            </TableHead>
            <TableHead className='px-5 py-4 text-[10px] uppercase tracking-[0.16em] text-on-surface-variant font-medium'>
              Статус
            </TableHead>
            <TableHead className='px-5 py-4 text-[10px] uppercase tracking-[0.16em] text-on-surface-variant font-medium'>
              Поткатегории
            </TableHead>
            <TableHead className='px-5 py-4 text-[10px] uppercase tracking-[0.16em] text-on-surface-variant font-medium'>
              Вкупно артикли
            </TableHead>
            <TableHead className='px-5 py-4 text-right text-[10px] uppercase tracking-[0.16em] text-on-surface-variant font-medium'>
              Акции
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody className='divide-y divide-outline-variant/10'>
          {categories.map((category) => {
            return (
              <TableRow
                key={category.id}
                className='hover:bg-surface-container/30 transition-colors border-outline-variant/10'
              >
                {/* 0. Редослед (displayOrder) */}
                <TableCell className='px-5 py-4 text-center font-mono text-xs text-on-surface-variant font-medium'>
                  {category.displayOrder}
                </TableCell>

                {/* 1. Слика */}
                <TableCell className='px-5 py-3'>
                  <div className='relative h-20 w-20 overflow-hidden bg-surface-container border border-outline-variant/20'>
                    {category.image ? (
                      <Image
                        src={category.image}
                        alt={category.name}
                        fill
                        sizes='160px'
                        quality={80}
                        className='object-cover'
                      />
                    ) : (
                      <div className='flex h-full w-full items-center justify-center text-xs text-on-surface-variant font-medium'>
                        N/A
                      </div>
                    )}
                  </div>
                </TableCell>

                {/* 2. Име и Опис */}
                <TableCell className='px-5 py-4 font-medium text-surface-foreground max-w-50'>
                  <div>
                    <h2 className='font-semibold'>{category.name}</h2>
                    {category.description && (
                      <p className='line-clamp-2 text-xs text-gray-500 font-normal mt-0.5'>
                        {category.description}
                      </p>
                    )}
                  </div>
                </TableCell>

                {/* 3. Статус (isPublished) */}
                <TableCell className='px-5 py-4 text-xs'>
                  {category.isPublished ? (
                    <span className='inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-2.5 py-1 text-xs font-medium text-emerald-600 border border-emerald-500/20'>
                      <span className='h-1.5 w-1.5 rounded-full bg-emerald-500' />
                      Објавено
                    </span>
                  ) : (
                    <span className='inline-flex items-center gap-1.5 rounded-full bg-zinc-500/10 px-2.5 py-1 text-xs font-medium text-zinc-500 border border-zinc-500/20'>
                      <span className='h-1.5 w-1.5 rounded-full bg-zinc-400' />
                      Скриено
                    </span>
                  )}
                </TableCell>

                {/* 4. Поткатегории */}
                <TableCell className='px-5 py-4 text-on-surface-variant text-xs'>
                  <span className='font-medium text-surface-foreground'>
                    {category._count.subcategories}
                  </span>{' '}
                  {category._count.subcategories === 1
                    ? 'поткатегорија'
                    : 'поткатегории'}
                </TableCell>

                {/* 5. Вкупно артикли */}
                <TableCell className='px-5 py-4 text-on-surface-variant text-xs'>
                  <span className='font-medium text-surface-foreground'>
                    {category._count.menuItems}
                  </span>{' '}
                  {category._count.menuItems === 1 ? 'артикл' : 'артикли'}
                </TableCell>

                {/* 6. Акции */}
                <TableCell className='px-5 py-4 text-right'>
                  <div className='flex justify-end'>
                    <CategoryActions category={category} />
                  </div>
                </TableCell>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
    </div>
  )
}
