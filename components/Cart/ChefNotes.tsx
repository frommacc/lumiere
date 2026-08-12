export const ChefNotes = () => {
  return (
    <div className='mt-8'>
      <label className='text-xs font-semibold text-muted-foreground mb-4 block uppercase tracking-widest'>        A note to the head chef
      </label>
      <div className='relative group'>
        <textarea
          className='w-full bg-surface-container/50 border-b border-outline-variant/50 focus:border-primary outline-none py-4 px-2 text-foreground placeholder:text-outline/50 transition-all resize-none h-24'
          placeholder='Specific allergies or wishes when preparing...'
        />
        <div className='absolute bottom-0 left-0 w-0 h-px bg-primary transition-all duration-500 group-focus-within:w-full' />
      </div>
    </div>
  )
}
