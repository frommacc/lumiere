import { MapPin, Phone, CreditCard, FileText } from 'lucide-react'
import { formatPaymentMethod, formatDeliveryMethod } from '@/lib/utils/order'
import { DeliveryMethod, PaymentMethod } from '@/lib/generated/prisma'

interface DeliveryCardProps {
  address?: string | null
  phone: string
  paymentMethod: PaymentMethod
  deliveryMethod: DeliveryMethod
  notes?: string | null
}

export function OrderDeliveryCard({
  address,
  phone,
  paymentMethod,
  deliveryMethod,
  notes,
}: DeliveryCardProps) {
  return (
    <div className='bg-card p-6 md:p-8 rounded-lg border border-border/30 relative overflow-hidden'>
      <div className='absolute top-0 left-0 w-1 h-full bg-primary' />
      <h4 className='text-xs font-semibold text-muted-foreground tracking-[0.2em] uppercase mb-6'>
        Информации за испорака
      </h4>
      <div className='space-y-6 text-sm'>
        <div className='flex gap-3'>
          <MapPin className='w-5 h-5 text-primary shrink-0 mt-0.5' />
          <div>
            <p className='text-[10px] text-muted-foreground uppercase'>
              Начин / Адреса
            </p>
            <p className='text-foreground font-medium'>
              {formatDeliveryMethod(deliveryMethod)}
              {address && (
                <>
                  <br />
                  {address}
                </>
              )}
            </p>
          </div>
        </div>

        <div className='flex gap-3'>
          <Phone className='w-5 h-5 text-primary shrink-0 mt-0.5' />
          <div>
            <p className='text-[10px] text-muted-foreground uppercase'>
              Телефон
            </p>
            <p className='text-foreground font-medium'>{phone}</p>
          </div>
        </div>

        <div className='flex gap-3'>
          <CreditCard className='w-5 h-5 text-primary shrink-0 mt-0.5' />
          <div>
            <p className='text-[10px] text-muted-foreground uppercase'>
              Начин на плаќање
            </p>
            <p className='text-foreground font-medium'>
              {formatPaymentMethod(paymentMethod)}
            </p>
          </div>
        </div>

        {notes && (
          <div className='flex gap-3 pt-2 border-t border-border/20'>
            <FileText className='w-5 h-5 text-primary shrink-0 mt-0.5' />
            <div>
              <p className='text-[10px] text-muted-foreground uppercase'>
                Забелешка
              </p>
              <p className='text-foreground italic'>{notes}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
