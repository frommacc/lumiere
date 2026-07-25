export default function MenuCategoriesSkeleton() {
  const placeholderWidths = [50, 70, 90, 65, 80, 60]

  return (
    <div className='mb-8 border-b border-outline-variant/30 pb-2 overflow-x-auto no-scrollbar'>
      <nav className='flex space-x-6 sm:space-x-8 min-w-max items-center'>
        {placeholderWidths.map((width, index) => (
          <div
            key={index}
            className='relative pb-3 flex flex-col items-center justify-center'
          >
            <div
              className='h-4 bg-surface-container rounded animate-pulse'
              style={{ width: `${width}px` }}
            />

            {index === 0 && (
              <span className='absolute bottom-0 left-0 h-0.5 w-full bg-surface-container rounded-full animate-pulse' />
            )}
          </div>
        ))}
      </nav>
    </div>
  )
}
