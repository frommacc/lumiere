import { ReviewStatus, Role } from '@/lib/generated/prisma'
import { prisma } from '@/lib/prisma'

async function main() {
  console.log('🌱 Започнува внесувањето на податоците...')

  // 1. Креираме тест корисници со слики и улоги
  const user1 = await prisma.user.upsert({
    where: { email: 'aleksandar@example.com' },
    update: {},
    create: {
      email: 'mile@example.com',
      name: 'Mile Atanasov',
      phone: '070727525',
      role: Role.USER,
      image:
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=300&auto=format&fit=crop',
    },
  })

  const user2 = await prisma.user.upsert({
    where: { email: 'elena@example.com' },
    update: {},
    create: {
      email: 'silvana@example.com',
      name: 'Silvana Atanasova',
      phone: '070254763',
      role: Role.USER,
      image:
        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=300&auto=format&fit=crop',
    },
  })

  const user3 = await prisma.user.upsert({
    where: { email: 'marko@example.com' },
    update: {},
    create: {
      email: 'atanas@example.com',
      name: 'Atanas Atanasov',
      phone: '072243525',
      role: Role.USER,
      image:
        'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=300&auto=format&fit=crop',
    },
  })

  console.log('✅ Корисниците се успешно креирани.')

  // 2. Креираме рецензии поврзани со тие корисници
  const REVIEWS = [
    {
      id: 'rev-1',
      text: 'Најдобрата вечера што некогаш сум ја имал. Услугата е беспрекорна, а храната е вистинска уметност на чинија.',
      name: 'Александар Петров',
      role: 'Критичар за храна',
      rating: 5,
      status: ReviewStatus.APPROVED,
      userId: user1.id, // Поврзување со креираниот корисник
    },
    {
      id: 'rev-2',
      text: 'Амбиент кој те пренесува во друга димензија. Силно го препорачувам десертот со злато - неверојатно софистицирано искуство.',
      name: 'Елена Стојанова',
      role: 'Уредник на гастро-магазин',
      rating: 5,
      status: ReviewStatus.APPROVED,
      userId: user2.id,
    },
    {
      id: 'rev-3',
      text: 'Врвен квалитет на состојките и фантастичен избор на вина. Дефинитивно најдоброто место за прослави и приватен луксузен ручек.',
      name: 'Марко Иванов',
      role: 'Претприемач',
      rating: 5,
      status: ReviewStatus.APPROVED,
      userId: user3.id,
    },
  ]

  for (const review of REVIEWS) {
    await prisma.review.upsert({
      where: { id: review.id },
      update: review,
      create: review,
    })
  }

  console.log('✅ Рецензиите се успешно внесени.')
}

main()
  .catch((e) => {
    console.error('❌ Грешка при извршување на seed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
