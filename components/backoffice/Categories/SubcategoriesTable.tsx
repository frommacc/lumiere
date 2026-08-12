import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import SubcategoryActions from '@/components/backoffice/Categories/SubcategoryActions'
import { SubcategoryWithRelations } from '@/types/categories'
import { Category } from '@/lib/generated/prisma'

interface SubcategoriesTableProps {
  subcategories: SubcategoryWithRelations[]
  categories: Pick<Category, 'id' | 'name'>[]
}

export function SubcategoriesTable({
  subcategories,
  categories,
}: SubcategoriesTableProps) {
  return (
    <div className='overflow-hidden rounded-xl border border-outline-variant/20 bg-surface-container-low/40'>
      <Table className='min-w-125 text-sm'>
        <TableHeader className='border-b border-outline-variant/15 bg-surface-container-low/80'>
          <TableRow className='hover:bg-transparent'>            {/* 0. Order */}
            <TableHead className='w-12 px-5 py-4 text-center text-[10px] uppercase tracking-[0.16em] text-on-surface-variant font-medium'>
              #
            </TableHead>
            <TableHead className='px-5 py-4 text-[10px] uppercase tracking-[0.16em] text-on-surface-variant font-medium'>              Subcategory
            </TableHead>
            <TableHead className='px-5 py-4 text-[10px] uppercase tracking-[0.16em] text-on-surface-variant font-medium'>              Main Category
            </TableHead>
            <TableHead className='px-5 py-4 text-[10px] uppercase tracking-[0.16em] text-on-surface-variant font-medium'>              Status
            </TableHead>

            <TableHead className='px-5 py-4 text-[10px] uppercase tracking-[0.16em] text-on-surface-variant font-medium'>              Total items
            </TableHead>
            <TableHead className='px-5 py-4 text-right text-[10px] uppercase tracking-[0.16em] text-on-surface-variant font-medium'>              Actions
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody className='divide-y divide-outline-variant/10'>
          {subcategories.map((subcategory) => {
            return (
              <TableRow
                key={subcategory.id}
                className='hover:bg-surface-container/30 transition-colors border-outline-variant/10'
              >                {/* 0. Order (displayOrder) */}
                <TableCell className='px-5 py-4 text-center font-mono text-xs text-on-surface-variant font-medium'>
                  {subcategory.displayOrder}
                </TableCell>                {/* 1. Name and Description */}
                <TableCell className='px-5 py-4 font-medium text-surface-foreground max-w-50'>
                  <div>
                    <h2 className='font-semibold'>{subcategory.name}</h2>
                    {subcategory.description && (
                      <p className='line-clamp-2 text-xs text-gray-500 font-normal mt-0.5'>
                        {subcategory.description}
                      </p>
                    )}
                  </div>
                </TableCell>                {/* 2. Parent Category */}<TableCell className='px-5 py-4 text-xs font-semibold text-primary'>
                  {subcategory.category.name}
                </TableCell>                {/* 3. Status (isPublished) */}
                <TableCell className='px-5 py-4 text-xs'>
                  {subcategory.isPublished ? (
                    <span className='inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-2.5 py-1 text-xs font-medium text-emerald-600 border border-emerald-500/20'>
                      <span className='h-1.5 w-1.5 rounded-full bg-emerald-500' />                      Published
                    </span>
                  ) : (
                    <span className='inline-flex items-center gap-1.5 rounded-full bg-zinc-500/10 px-2.5 py-1 text-xs font-medium text-zinc-500 border border-zinc-500/20'>
                      <span className='h-1.5 w-1.5 rounded-full bg-zinc-400' />                      Hidden
                    </span>
                  )}
                </TableCell>                {/* 5. Total items */}
                <TableCell className='px-5 py-4 text-xs text-on-surface-variant'>
                  <span className='font-medium text-surface-foreground'>
                    {subcategory._count.menuItems}
                  </span>{' '}
                  {subcategory._count.menuItems === 1 ? 'article' : 'articles'}
                </TableCell>                {/* 6. Actions */}
                <TableCell className='px-5 py-4 text-right'>
                  <div className='flex justify-end'>
                    <SubcategoryActions
                      subcategory={subcategory}
                      categories={categories}
                    />
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
