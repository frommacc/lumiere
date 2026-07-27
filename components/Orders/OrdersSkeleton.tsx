export function OrdersSkeleton() {
  return (
    <div className='flex flex-col gap-12 animate-pulse'>
      {[1, 2, 3].map((i) => (
        <div key={i} className='w-full h-48 bg-outline-variant/10 rounded-lg' />
      ))}
    </div>
  )
}
