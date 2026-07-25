export default function MenuItemCardSkeleton() {
  return (
    <div className='flex flex-col justify-between'>
      {/* 1. Media Container (со совпаѓање на aspect-4/5) */}
      <div className='relative aspect-4/5 overflow-hidden mb-6 bg-surface-container-high rounded-xl animate-pulse'>
        {/* Фејк значка за Популарно/Ексклузивно */}
        <div className='absolute top-4 left-4 h-5 w-20 bg-surface-container rounded-sm' />
      </div>

      {/* 2. Header & Details */}
      <div>
        {/* Наслов, Dot leader и Цена */}
        <div className='flex items-end justify-between mb-3 gap-2'>
          {/* Фејк наслов */}
          <div className='h-6 w-1/2 bg-surface-container rounded animate-pulse' />

          {/* Дотасто растојание за десктоп */}
          <div className='hidden sm:block flex-1 border-b border-dashed border-outline-variant/30 mb-1 mx-2' />

          {/* Фејк цена */}
          <div className='h-5 w-16 bg-surface-container rounded animate-pulse shrink-0' />
        </div>

        {/* Фејк опис (2 линии со различна должина) */}
        <div className='space-y-2 mb-4'>
          <div className='h-3.5 w-full bg-surface-container rounded animate-pulse' />
          <div className='h-3.5 w-3/4 bg-surface-container rounded animate-pulse' />
        </div>

        {/* 3. Мобилни акции (се прикажуваат само на мали екрани sm:hidden) */}
        <div className='flex justify-between items-center sm:hidden pt-3 border-t border-outline-variant/10'>
          <div className='h-4 w-16 bg-surface-container rounded animate-pulse' />
          <div className='h-4 w-16 bg-surface-container rounded animate-pulse' />
        </div>
      </div>
    </div>
  )
}
