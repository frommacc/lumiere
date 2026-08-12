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
import { PaginationControls } from '../shared/pagination-controls'
import { CategoryWithSubcategories } from './MenuItemEditor'

interface PaginationMeta {
  currentPage: number
  pageSize: number
  totalItems: number
  totalPages: number
}

interface MenuItemWithRelations {
  id: string
  name: string
  description: string
  price: number
  image: string
  imageId: string | null
  isAvailable: boolean
  isOrderable: boolean
  isPopular: boolean
  isExclusive: boolean
  isSpecial: boolean
  ingredients: string[]
  allergens: string[]
  dietary: string[]
  origin: string | null
  preparation: string | null
  pairing: string | null
  categoryId: string | null
  subcategoryId: string | null
  category: { id: string; name: string } | null
  subcategory: {
    id: string
    name: string
    categoryId: string
    category: { id: string; name: string }
  } | null
}

interface MenuTableProps {
  items: MenuItemWithRelations[]
  categories: CategoryWithSubcategories[]
  pagination: PaginationMeta
}

export function MenuTable({ items, categories, pagination }: MenuTableProps) {
  return (
    <div className='overflow-hidden rounded-xl border border-outline-variant/20 bg-surface-container-low/40'>
      <Table className='min-w-200 text-sm'>
        <TableHeader className='border-b border-outline-variant/15 bg-surface-container-low/80'>
          <TableRow className='hover:bg-transparent'>
            <TableHead className='w-16 px-5 py-4 text-[10px] uppercase tracking-[0.16em] text-on-surface-variant font-medium'>              Picture
            </TableHead>
            <TableHead className='px-5 py-4 text-[10px] uppercase tracking-[0.16em] text-on-surface-variant font-medium'>              Eating
            </TableHead>
            <TableHead className='px-5 py-4 text-[10px] uppercase tracking-[0.16em] text-on-surface-variant font-medium'>              Tags
            </TableHead>
            <TableHead className='px-5 py-4 text-[10px] uppercase tracking-[0.16em] text-on-surface-variant font-medium'>              Category / Subcategory
            </TableHead>
            <TableHead className='px-5 py-4 text-[10px] uppercase tracking-[0.16em] text-on-surface-variant font-medium'>              Price
            </TableHead>
            <TableHead className='px-5 py-4 text-[10px] uppercase tracking-[0.16em] text-on-surface-variant font-medium'>              Status
            </TableHead>
            <TableHead className='px-5 py-4 text-[10px] uppercase tracking-[0.16em] text-on-surface-variant font-medium'>              Online availability
            </TableHead>
            <TableHead className='px-5 py-4 text-right text-[10px] uppercase tracking-[0.16em] text-on-surface-variant font-medium'>              Actions
            </TableHead>
          </TableRow>
        </TableHeader>

        <TableBody className='divide-y divide-outline-variant/10'>
          {items.map((item) => {
            const categoryName = item.subcategory
              ? item.subcategory.category.name
              : item.category?.name
            const subcategoryName = item.subcategory?.name

            return (
              <TableRow
                key={item.id}
                className='hover:bg-surface-container/30 transition-colors border-outline-variant/10'
              >                {/* 1st Image */}
                <TableCell className='px-5 py-3'>
                  <div className='relative h-20 w-20 overflow-hidden bg-surface-container border border-outline-variant/20'>
                    {item.image ? (
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        sizes='160px'
                        quality={80}
                        className='object-cover'
                      />
                    ) : (
                      <div className='flex h-full w-full items-center justify-center text-[10px] text-on-surface-variant font-medium'>
                        N/A
                      </div>
                    )}
                  </div>
                </TableCell>                {/* 2. Name and Description */}
                <TableCell className='px-5 py-4 max-w-xs'>
                  <p className='font-medium text-on-surface'>{item.name}</p>
                  {item.description && (
                    <p className='mt-0.5 truncate text-xs text-on-surface-variant'>
                      {item.description}
                    </p>
                  )}
                </TableCell>                {/* 3. Tags */}
                <TableCell className='px-5 py-4'>
                  <div className='flex flex-wrap gap-1'>
                    {item.isPopular && (
                      <span className='inline-flex items-center rounded-full bg-amber-500/10 px-2 py-0.5 text-[10px] font-medium text-amber-400 border border-amber-500/20'>                        Popular
                      </span>
                    )}
                    {item.isSpecial && (
                      <span className='inline-flex items-center rounded-full bg-purple-500/10 px-2 py-0.5 text-[10px] font-medium text-purple-400 border border-purple-500/20'>                        Specialty
                      </span>
                    )}
                    {item.isExclusive && (
                      <span className='inline-flex items-center rounded-full bg-rose-500/10 px-2 py-0.5 text-[10px] font-medium text-rose-400 border border-rose-500/20'>                        Exclusively
                      </span>
                    )}
                    {!item.isPopular &&
                      !item.isSpecial &&
                      !item.isExclusive && (
                        <span className='text-xs text-on-surface-variant/40'>
                          —
                        </span>
                      )}
                  </div>
                </TableCell>                {/* 4. Category and Subcategory */}
                <TableCell className='px-5 py-4 text-on-surface-variant'>
                  <div className='flex flex-col gap-1 items-start'>
                    <span className='inline-flex items-center rounded-md bg-surface-container px-2 py-0.5 text-xs font-medium border border-outline-variant/20'>
                      {categoryName ?? '—'}
                    </span>
                    {subcategoryName && (
                      <span className='inline-flex items-center px-2 pl-4 py-0.5 text-[10px] font-normal text-on-surface-variant'>
                        ↳ {subcategoryName}
                      </span>
                    )}
                  </div>
                </TableCell>                {/* 5. Price */}
                <TableCell className='px-5 py-4 font-semibold text-on-surface whitespace-nowrap'>
                  {formatCurrency(item.price)}
                </TableCell>                {/* 6. Status */}
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
                    />                    {item.isAvailable ? 'Available' : 'Withdrawn'}
                  </span>
                </TableCell>

                {/* 6. Online availability */}
                <TableCell className='px-5 py-4 whitespace-nowrap'>
                  <span
                    className={`inline-flex items-center gap-1.5 text-xs font-medium ${
                      item.isOrderable
                        ? 'text-emerald-400'
                        : 'text-on-surface-variant/60'
                    }`}
                  >
                    <span
                      className={`size-1.5 rounded-full ${
                        item.isOrderable
                          ? 'bg-emerald-400'
                          : 'bg-on-surface-variant/40'
                      }`}
                    />                    {item.isOrderable ? 'Available' : 'only in restaurant'}
                  </span>
                </TableCell>                {/* 7. Actions */}
                <TableCell className='px-5 py-4 text-right'>
                  <div className='flex justify-end'>
                    <MenuItemActions item={item} categories={categories} />
                  </div>
                </TableCell>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>

      <PaginationControls
        currentPage={pagination.currentPage}
        totalPages={pagination.totalPages}
        totalItems={pagination.totalItems}
        pageSize={pagination.pageSize}
      />
    </div>
  )
}
