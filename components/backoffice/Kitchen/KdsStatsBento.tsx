interface KdsStatsProps {
  totalOrders: number
  avgTimeMinutes: number
  delayedOrders: number
}

export function KdsStatsBento({
  totalOrders,
  avgTimeMinutes,
  delayedOrders,
}: KdsStatsProps) {
  return (
    <div className='grid grid-cols-3 gap-2 rounded-2xl bg-surface-container-high/60 p-2 shadow-xl backdrop-blur-md'>
      <div className='flex flex-col border-r border-outline-variant/20 px-4 py-2'>
        <span className='text-[9px] font-medium uppercase tracking-wider text-muted-foreground'>
          ВКУПНО СЕГА
        </span>
        <span className='font-heading text-xl font-bold text-foreground'>
          {totalOrders}
        </span>
      </div>

      <div className='flex flex-col border-r border-outline-variant/20 px-4 py-2'>
        <span className='text-[9px] font-medium uppercase tracking-wider text-primary'>
          ПРОСЕЧНО ВРЕМЕ
        </span>
        <span className='font-heading text-xl font-bold text-primary'>
          {avgTimeMinutes}
          <span className='text-xs font-normal'>m</span>
        </span>
      </div>

      <div className='flex flex-col px-4 py-2'>
        <span className='text-[9px] font-medium uppercase tracking-wider text-destructive'>
          ДОЦНАТИ
        </span>
        <span className='font-heading text-xl font-bold text-destructive animate-pulse'>
          {String(delayedOrders).padStart(2, '0')}
        </span>
      </div>
    </div>
  )
}
