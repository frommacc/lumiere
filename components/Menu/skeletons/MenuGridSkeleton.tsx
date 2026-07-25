import MenuItemCardSkeleton from './MenuItemCardSkeleton'

interface MenuGridSkeletonProps {
  count?: number
}

export default function MenuGridSkeleton({ count = 8 }: MenuGridSkeletonProps) {
  return (
    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10'>
      {Array.from({ length: count }).map((_, index) => (
        <MenuItemCardSkeleton key={index} />
      ))}
    </div>
  )
}
