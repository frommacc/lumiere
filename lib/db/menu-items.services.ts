import { cacheLife, cacheTag } from 'next/cache'
import { prisma } from '@/lib/prisma'

export const menuItemSelect = {
  id: true,
  name: true,
  description: true,
  price: true,
  image: true,

  isPublished: true,
  isAvailable: true,
  isOrderable: true,

  isPopular: true,
  isExclusive: true,
  isSpecial: true,

  ingredients: true,
  allergens: true,
  dietary: true,
  origin: true,
  preparation: true,
  pairing: true,

  categoryId: true,
  subcategoryId: true,

  category: {
    select: {
      id: true,
      slug: true,
      name: true,
    },
  },

  subcategory: {
    select: {
      id: true,
      slug: true,
      name: true,
    },
  },
} as const

// export async function getMenuItems(categoryId?: string) {
//   'use cache'

//   cacheLife('weeks')
//   cacheTag('menu-items')

//   const filterCategory = categoryId && categoryId !== 'all'

//   if (filterCategory) {
//     cacheTag(`menu-items-${categoryId}`)
//   }

//   return await prisma.menuItem.findMany({
//     where: {
//       isPublished: true,

//       // Validity check based on structures:
//       AND: [
//         {
//           OR: [
//             // Case 1: Item is directly in Category (no subcategory)
//             {
//               subcategory: null,
//               category: {
//                 isPublished: true,
//               },
//             },
//             // Case 2: The article is in a Subcategory (category is null)
//             {
//               category: null,
//               subcategory: {
//                 isPublished: true,
//                 category: {
//                   isPublished: true, // The parent category must also be published
//                 },
//               },
//             },
//           ],
//         },

//         // Filter by specific categoryId/slug if forwarded
//         ...(filterCategory
//           ? [
//               {
//                 OR: [
//                   {
//                     category: {
//                       OR: [{ id: categoryId }, { slug: categoryId }],
//                     },
//                   },
//                   {
//                     subcategory: {
//                       category: {
//                         OR: [{ id: categoryId }, { slug: categoryId }],
//                       },
//                     },
//                   },
//                 ],
//               },
//             ]
//           : []),
//       ],
//     },
//     select: menuItemSelect,
//     orderBy: [
//       { subcategory: { displayOrder: 'asc' } },
//       { displayOrder: 'asc' },
//       { createdAt: 'desc' },
//     ],
//   })
// }

export async function getMenuItems(categoryId?: string) {
  'use cache'

  cacheLife('weeks')
  cacheTag('menu-items')

  const filterCategory = categoryId && categoryId !== 'all'

  if (filterCategory) {
    cacheTag(`menu-items-${categoryId}`)
  }

  return await prisma.menuItem.findMany({
    where: {
      isPublished: true,

      // Its main category must always be published as well
      category: {
        isPublished: true,
      },

      // If there is a subcategory, it must be published as well
      OR: [{ subcategory: null }, { subcategory: { isPublished: true } }],

      // Filtering is straightforward and extremely fast
      ...(filterCategory
        ? {
            OR: [
              { categoryId: categoryId },
              { category: { slug: categoryId } },
              { subcategoryId: categoryId },
              { subcategory: { slug: categoryId } },
            ],
          }
        : {}),
    },
    select: menuItemSelect,
    orderBy: [
      { subcategory: { displayOrder: 'asc' } },
      { displayOrder: 'asc' },
      { createdAt: 'desc' },
    ],
  })
}

export async function getSpecialties() {
  return await prisma.menuItem.findMany({
    where: {
      isSpecial: true,
      isPublished: true,
      isAvailable: true,
    },
    take: 8,
    select: menuItemSelect,
    orderBy: [{ displayOrder: 'asc' }, { createdAt: 'desc' }],
  })
}
