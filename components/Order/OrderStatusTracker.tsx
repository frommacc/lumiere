import { OrderStatus } from '@/lib/generated/prisma'
import { STATUS_STEPS, getStatusStepIndex } from '@/lib/utils/order'

interface OrderStatusTrackerProps {
  status: OrderStatus
}

export function OrderStatusTracker({ status }: OrderStatusTrackerProps) {
  const currentIndex = getStatusStepIndex(status)
  const progressPercent = (currentIndex / (STATUS_STEPS.length - 1)) * 100

  return (
    <section className='w-full py-12 px-6 md:px-12 bg-card border-b border-border/20'>
      <div className='max-w-4xl mx-auto'>
        <div className='relative flex items-center justify-between'>
          {/* Background Line */}
          <div className='absolute top-1/2 left-0 w-full h-0.5 bg-border/40 -translate-y-1/2 z-0' />

          {/* Active Progress Line */}
          <div
            className='absolute top-1/2 left-0 h-0.5 bg-primary -translate-y-1/2 z-0 transition-all duration-700 ease-out shadow-[0_0_12px_rgba(242,202,80,0.4)]'
            style={{ width: `${progressPercent}%` }}
          />

          {/* Steps */}
          {STATUS_STEPS.map((step, idx) => {
            const isCompleted = idx < currentIndex
            const isCurrent = idx === currentIndex
            const IconComponent = step.icon

            return (
              <div
                key={step.key}
                className='relative z-10 flex flex-col items-center gap-3 bg-card px-2'
              >
                <div
                  className={`w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center transition-all duration-300 ${
                    isCompleted
                      ? 'bg-primary text-primary-foreground font-bold'
                      : isCurrent
                        ? 'border-2 border-primary text-primary bg-background shadow-[0_0_15px_rgba(242,202,80,0.3)] animate-pulse'
                        : 'border border-border text-muted-foreground bg-background'
                  }`}
                >
                  <IconComponent className='w-5 h-5 md:w-6 md:h-6' />
                </div>
                <span
                  className={`text-[11px] uppercase tracking-wider text-center whitespace-pre-line ${
                    isCurrent
                      ? 'text-primary font-bold'
                      : 'text-muted-foreground'
                  }`}
                >
                  {step.label}
                </span>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
