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
            <TableHead className='w-16 px-5 py-4 text-[10px] uppercase tracking-[0.16em] text-on-surface-variant font-medium'>
              Слика
            </TableHead>
            <TableHead className='px-5 py-4 text-[10px] uppercase tracking-[0.16em] text-on-surface-variant font-medium'>
              Категорија
            </TableHead>
            <TableHead className='px-5 py-4 text-[10px] uppercase tracking-[0.16em] text-on-surface-variant font-medium'>
              Слаг (Slug)
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
                {/* 1. Слика */}
                <TableCell className='px-5 py-3'>
                  <div className='relative h-15 w-15 overflow-hidden rounded-lg bg-surface-container border border-outline-variant/20'>
                    {category.image ? (
                      <Image
                        src={category.image}
                        alt={category.name}
                        fill
                        sizes='120px'
                        className='object-cover'
                      />
                    ) : (
                      <div className='flex h-full w-full items-center justify-center text-xs text-on-surface-variant font-medium'>
                        N/A
                      </div>
                    )}
                  </div>
                </TableCell>

                {/* 2. Име */}
                <TableCell className='px-5 py-4 font-medium text-surface-foreground max-w-50'>
                  <div>
                    <h2>{category.name}</h2>
                    {/* line-clamp-2 го ограничува текстот на точно 2 реда */}
                    <p className='line-clamp-2 text-sm text-gray-500'>
                      {category.description}
                    </p>
                  </div>
                </TableCell>

                {/* 3. Slug */}
                <TableCell className='px-5 py-4 text-xs font-mono text-on-surface-variant'>
                  /{category.slug}
                </TableCell>

                {/* 4. Вкупно артикли */}
                <TableCell className='px-5 py-4 text-on-surface-variant'>
                  {category._count.menuItems}{' '}
                  {category._count.menuItems === 1 ? 'артикл' : 'артикли'}
                </TableCell>

                {/* 5. Акции */}
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
