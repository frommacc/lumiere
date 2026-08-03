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
          <TableRow className='hover:bg-transparent'>
            <TableHead className='px-5 py-4 text-[10px] uppercase tracking-[0.16em] text-on-surface-variant font-medium'>
              Подкатегорија
            </TableHead>
            <TableHead className='px-5 py-4 text-[10px] uppercase tracking-[0.16em] text-on-surface-variant font-medium'>
              Главна Категорија
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
          {subcategories.map((subcategory) => {
            return (
              <TableRow
                key={subcategory.id}
                className='hover:bg-surface-container/30 transition-colors border-outline-variant/10'
              >
                {/* 1. Име и Опис */}
                <TableCell className='px-5 py-4 font-medium text-surface-foreground max-w-50'>
                  <div>
                    <h2>{subcategory.name}</h2>
                    <p className='line-clamp-2 text-sm text-gray-500'>
                      {subcategory.description}
                    </p>
                  </div>
                </TableCell>

                {/* 2. Родител Категорија */}
                <TableCell className='px-5 py-4 text-xs font-semibold text-primary'>
                  {subcategory.category.name}
                </TableCell>

                {/* 3. Slug */}
                <TableCell className='px-5 py-4 text-xs font-mono text-on-surface-variant'>
                  /{subcategory.slug}
                </TableCell>

                {/* 4. Вкупно артикли */}
                <TableCell className='px-5 py-4 text-on-surface-variant'>
                  {subcategory._count.menuItems}{' '}
                  {subcategory._count.menuItems === 1 ? 'артикл' : 'артикли'}
                </TableCell>

                {/* 5. Акции */}
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
