import Image from 'next/image'
import { formatCurrency } from '@/lib/utils/order'

interface OrderItemData {
  id: string
  name: string
  quantity: number
  price: number
  menuItem?: {
    image?: string | null
    description?: string | null
  }
}

interface OrderItemsListProps {
  items: OrderItemData[]
}

export function OrderItemsList({ items }: OrderItemsListProps) {
  return (
    <div className='flex flex-col'>
      <h2 className='text-xl font-bold text-foreground mb-6 border-b border-border/20 pb-4'>        Your Choice
      </h2>
      <div className='flex flex-col divide-y divide-border/20'>
        {items.map((item) => {
          const itemTotal = item.price * item.quantity
          const imageUrl = item.menuItem?.image || '/placeholder-food.jpg'

          return (
            <div key={item.id} className='group py-6 flex items-center gap-6'>
              <div className='relative w-20 h-20 md:w-24 md:h-24 overflow-hidden rounded-md bg-muted shrink-0'>
                <Image
                  src={imageUrl}
                  alt={item.name}
                  fill
                  className='object-cover transition-transform duration-500 group-hover:scale-105'
                />
              </div>
              <div className='grow'>
                <h3 className='text-base md:text-lg font-semibold text-foreground'>
                  {item.name}
                </h3>
                {item.menuItem?.description && (
                  <p className='text-xs md:text-sm text-muted-foreground italic mt-0.5 line-clamp-1'>
                    {item.menuItem.description}
                  </p>
                )}
              </div>
              <div className='flex flex-col items-end gap-1 shrink-0'>
                <span className='text-xs text-muted-foreground'>
                  {item.quantity} x {formatCurrency(item.price)}
                </span>
                <span className='text-sm md:text-base text-primary font-bold'>
                  {formatCurrency(itemTotal)}
                </span>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
