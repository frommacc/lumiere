'use client'

import { usePathname, useSearchParams } from 'next/navigation'
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination'

interface PaginationControlsProps {
  currentPage: number
  totalPages: number
  totalItems: number
  pageSize: number
}

export function PaginationControls({
  currentPage,
  totalPages,
  totalItems,
  pageSize,
}: PaginationControlsProps) {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  if (totalPages <= 1) return null

  const createPageUrl = (pageNumber: number) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set('page', pageNumber.toString())
    return `${pathname}?${params.toString()}`
  }

  const startItem = (currentPage - 1) * pageSize + 1
  const endItem = Math.min(currentPage * pageSize, totalItems)

  const getPageNumbers = () => {
    const pages: (number | string)[] = []
    const showMax = 5

    if (totalPages <= showMax) {
      for (let i = 1; i <= totalPages; i++) pages.push(i)
    } else {
      pages.push(1)

      if (currentPage > 3) {
        pages.push('ellipsis-start')
      }

      const start = Math.max(2, currentPage - 1)
      const end = Math.min(totalPages - 1, currentPage + 1)

      for (let i = start; i <= end; i++) {
        pages.push(i)
      }

      if (currentPage < totalPages - 2) {
        pages.push('ellipsis-end')
      }

      pages.push(totalPages)
    }

    return pages
  }

  return (
    <div className='flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-outline-variant/15 px-5 py-3 bg-surface-container-low/60'>
      <p className='text-xs text-on-surface-variant whitespace-nowrap'>        Shown{' '}
        <span className='font-medium text-on-surface'>
          {startItem}-{endItem}
        </span>{' '}
        from <span className='font-medium text-on-surface'>{totalItems}</span>{' '}
        records
      </p>

      <Pagination className='justify-center sm:justify-end w-auto mx-0'>
        <PaginationContent>          {/* Previous */}
          <PaginationItem>
            {currentPage <= 1 ? (
              <PaginationPrevious
                aria-disabled='true'
                className='pointer-events-none opacity-50'
              />
            ) : (
              <PaginationPrevious href={createPageUrl(currentPage - 1)} />
            )}
          </PaginationItem>

          {/* Numbered pages */}
          {getPageNumbers().map((page, idx) => {
            if (typeof page === 'string') {
              return (
                <PaginationItem key={`${page}-${idx}`}>
                  <PaginationEllipsis />
                </PaginationItem>
              )
            }

            return (
              <PaginationItem key={page}>
                <PaginationLink
                  href={createPageUrl(page)}
                  isActive={currentPage === page}
                >
                  {page}
                </PaginationLink>
              </PaginationItem>            )
          })}

          {/* Next */}
          <PaginationItem>
            {currentPage >= totalPages ? (
              <PaginationNext
                aria-disabled='true'
                className='pointer-events-none opacity-50'
              />
            ) : (
              <PaginationNext href={createPageUrl(currentPage + 1)} />
            )}
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  )
}
