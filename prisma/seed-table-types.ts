import 'dotenv/config'

import { prisma } from '@/lib/prisma'

const TABLE_TYPES = [
  {
    slug: 'standard',
    name: 'Стандардна сала',
    description: 'Удобна маса во средишниот главен дел на ресторанот.',
  },
  {
    slug: 'window',
    name: 'До прозорец',
    description: 'Маса со поглед кон центарот на Скопје.',
  },
  {
    slug: 'vip_lounge',
    name: 'ВИП салон',
    description: 'Приватен и дискретен простор за посебни пригоди.',
  },
  {
    slug: 'outdoor',
    name: 'Летна тераса',
    description: 'Маса на отворено за пријатни вечери.',
  },
] as const

async function main() {
  await Promise.all(
    TABLE_TYPES.map((tableType) =>
      prisma.tableType.upsert({
        where: { slug: tableType.slug },
        update: tableType,
        create: tableType,
      }),
    ),
  )

  console.log(`Seeded ${TABLE_TYPES.length} table types.`)
}

main()
  .catch((error) => {
    console.error('Unable to seed table types:', error)
    process.exitCode = 1
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
