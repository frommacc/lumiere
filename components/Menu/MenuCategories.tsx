import { getCategories } from '@/lib/db/categories.services'
import Link from 'next/link'

interface MenuCategoriesProps {
  activeCategory?: string
}

export default async function MenuCategories({
  activeCategory,
}: MenuCategoriesProps) {
  const categories = await getCategories()

  // Проверуваме совпаѓање и со ID и со Slug
  const currentCategory =
    categories.find(
      (c) => c.id === activeCategory || c.slug === activeCategory,
    ) ?? categories[0]

  return (
    <div className='mb-8 border-b border-outline-variant/30 pb-2 overflow-x-auto no-scrollbar'>
      <nav className='flex space-x-6 sm:space-x-8 min-w-max'>
        {categories.map((cat) => {
          const isActive = currentCategory?.id === cat.id
          const href = `/menu?category=${cat.slug || cat.id}` // Претпочитаме slug

          return (
            <Link
              key={cat.id}
              href={href}
              scroll={false}
              className={`relative pb-3 text-xs font-semibold tracking-widest uppercase transition-colors ${
                isActive
                  ? 'text-primary'
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              {cat.name}
              {isActive && (
                <span className='absolute bottom-0 left-0 h-0.5 w-full bg-primary rounded-full' />
              )}
            </Link>
          )
        })}
      </nav>
    </div>
  )
}
