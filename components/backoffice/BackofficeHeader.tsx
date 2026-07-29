import { ReactNode } from 'react'

export function BackofficeHeader({
  eyebrow,
  title,
  description,
  actions,
}: {
  eyebrow: string
  title: string
  description?: string
  actions?: ReactNode
}) {
  return (
    <header className='flex flex-col gap-5 border-b border-outline-variant/15 px-6 py-8 md:px-10 lg:flex-row lg:items-end lg:justify-between'>
      <div>
        <p className='font-label-caps text-[10px] uppercase tracking-[0.26em] text-primary'>{eyebrow}</p>
        <h1 className='mt-2 font-display text-3xl text-on-surface md:text-4xl'>{title}</h1>
        {description ? <p className='mt-2 max-w-2xl text-sm leading-relaxed text-on-surface-variant'>{description}</p> : null}
      </div>
      {actions ? <div className='shrink-0'>{actions}</div> : null}
    </header>
  )
}
