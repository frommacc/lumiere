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

//       // Проверка на објавеност врз основа на структурите:
//       AND: [
//         {
//           OR: [
//             // Случај 1: Артиклот е директно во Категорија (нема поткатегорија)
//             {
//               subcategory: null,
//               category: {
//                 isPublished: true,
//               },
//             },
//             // Случај 2: Артиклот е во Поткатегорија (category е null)
//             {
//               category: null,
//               subcategory: {
//                 isPublished: true,
//                 category: {
//                   isPublished: true, // Родителската категорија исто така мора да е објавена
//                 },
//               },
//             },
//           ],
//         },

//         // Филтрирање по специфичен categoryId/slug ако е проследен
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

      // Секогаш мора да биде објавена и нејзината главна категорија
      category: {
        isPublished: true,
      },

      // Ако има поткатегорија, и таа мора да е објавена
      OR: [{ subcategory: null }, { subcategory: { isPublished: true } }],

      // Филтрирањето е директно и екстремно брзо
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
