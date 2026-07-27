export function ReservationsSkeleton() {
  return (
    <div className='flex animate-pulse flex-col gap-5'>
      {[1, 2, 3].map((item) => <div key={item} className='h-52 w-full rounded-lg bg-outline-variant/10' />)}
    </div>
  )
}
