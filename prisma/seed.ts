import { prisma } from '@/lib/prisma'
import { Role, UserStatus, ReviewStatus } from '../lib/generated/prisma'

async function main() {
  console.log('Cleaning up database...')
  await prisma.scheduleOverride.deleteMany()
  await prisma.workingHours.deleteMany()
  await prisma.reservation.deleteMany()
  await prisma.table.deleteMany()
  await prisma.tableType.deleteMany()
  await prisma.review.deleteMany()
  await prisma.orderItem.deleteMany()
  await prisma.order.deleteMany()
  await prisma.menuItem.deleteMany()
  await prisma.subcategory.deleteMany()
  await prisma.category.deleteMany()
  await prisma.session.deleteMany()
  await prisma.account.deleteMany()
  await prisma.user.deleteMany()

  console.log('Creating users...')
  const admin = await prisma.user.create({
    data: {
      name: 'Alexander Wright',
      email: 'admin@lumiere.com',
      emailVerified: true,
      role: Role.ADMIN,
      status: UserStatus.ACTIVE,
      phone: '+1234567890',
      image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb',
    },
  })

  const user = await prisma.user.create({
    data: {
      name: 'Sophia Bennett',
      email: 'sophia@gmail.com',
      emailVerified: true,
      role: Role.USER,
      status: UserStatus.ACTIVE,
      phone: '+1987654321',
      image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330',
    },
  })

  console.log('Creating 8 categories, subcategories, and 20 menu items...')

  // 1. SALADS
  const saladsCat = await prisma.category.create({
    data: {
      slug: 'salads',
      name: 'Salads',
      description: 'Fresh organic salads with premium artisanal dressings.',
      image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd',
      displayOrder: 1,
      subcategories: {
        create: [
          {
            slug: 'fresh-organic-salads',
            name: 'Fresh Organic Salads',
            displayOrder: 1,
          },
          { slug: 'warm-salads', name: 'Warm Salads', displayOrder: 2 },
        ],
      },
    },
    include: { subcategories: true },
  })
  const freshSaladsSub = saladsCat.subcategories.find(
    (s) => s.slug === 'fresh-organic-salads',
  )!

  // 2. SOUPS
  const soupsCat = await prisma.category.create({
    data: {
      slug: 'soups-and-broths',
      name: 'Soups & Broths',
      description: 'Gourmet cream soups and traditional warm broths.',
      image: 'https://images.unsplash.com/photo-1547592166-23ac45744acd',
      displayOrder: 2,
      subcategories: {
        create: [
          { slug: 'cream-soups', name: 'Cream Soups', displayOrder: 1 },
          {
            slug: 'traditional-broths',
            name: 'Traditional Broths',
            displayOrder: 2,
          },
        ],
      },
    },
    include: { subcategories: true },
  })
  const creamSoupsSub = soupsCat.subcategories.find(
    (s) => s.slug === 'cream-soups',
  )!

  // 3. STARTERS
  const startersCat = await prisma.category.create({
    data: {
      slug: 'starters',
      name: 'Starters',
      description: 'Exquisite cold and warm starters crafted to perfection.',
      image: 'https://images.unsplash.com/photo-1541529086526-db283c563270',
      displayOrder: 3,
      subcategories: {
        create: [
          { slug: 'cold-starters', name: 'Cold Starters', displayOrder: 1 },
          { slug: 'warm-starters', name: 'Warm Starters', displayOrder: 2 },
        ],
      },
    },
    include: { subcategories: true },
  })
  const coldStartersSub = startersCat.subcategories.find(
    (s) => s.slug === 'cold-starters',
  )!
  const warmStartersSub = startersCat.subcategories.find(
    (s) => s.slug === 'warm-starters',
  )!

  // 4. MAIN COURSES
  const mainsCat = await prisma.category.create({
    data: {
      slug: 'main-courses',
      name: 'Main Courses',
      description: 'Prime meat cuts and wild-caught fresh seafood.',
      image: 'https://images.unsplash.com/photo-1544025162-d76694265947',
      displayOrder: 4,
      subcategories: {
        create: [
          { slug: 'meat-specials', name: 'Meat Specials', displayOrder: 1 },
          { slug: 'fish-and-seafood', name: 'Fish & Seafood', displayOrder: 2 },
        ],
      },
    },
    include: { subcategories: true },
  })
  const meatSub = mainsCat.subcategories.find(
    (s) => s.slug === 'meat-specials',
  )!
  const seaSub = mainsCat.subcategories.find(
    (s) => s.slug === 'fish-and-seafood',
  )!

  // 5. DESSERTS
  const dessertsCat = await prisma.category.create({
    data: {
      slug: 'desserts',
      name: 'Desserts',
      description: 'Artisanal sweet creations prepared in-house daily.',
      image: 'https://images.unsplash.com/photo-1551024709-8f23befc6f87',
      displayOrder: 5,
      subcategories: {
        create: [
          {
            slug: 'signature-desserts',
            name: 'Signature Desserts',
            displayOrder: 1,
          },
          {
            slug: 'gelato-and-sorbet',
            name: 'Gelato & Sorbet',
            displayOrder: 2,
          },
        ],
      },
    },
    include: { subcategories: true },
  })
  const customDessertsSub = dessertsCat.subcategories.find(
    (s) => s.slug === 'signature-desserts',
  )!
  const sorbetSub = dessertsCat.subcategories.find(
    (s) => s.slug === 'gelato-and-sorbet',
  )!

  // 6. WINES
  const winesCat = await prisma.category.create({
    data: {
      slug: 'wines',
      name: 'Wines',
      description:
        'Handpicked local reserves and internationally acclaimed vintages.',
      image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3',
      displayOrder: 6,
      subcategories: {
        create: [
          { slug: 'red-wines', name: 'Red Wines', displayOrder: 1 },
          { slug: 'white-wines', name: 'White Wines', displayOrder: 2 },
        ],
      },
    },
    include: { subcategories: true },
  })
  const redWinesSub = winesCat.subcategories.find(
    (s) => s.slug === 'red-wines',
  )!
  const whiteWinesSub = winesCat.subcategories.find(
    (s) => s.slug === 'white-wines',
  )!

  // 7. SIGNATURE COCKTAILS
  const cocktailsCat = await prisma.category.create({
    data: {
      slug: 'signature-cocktails',
      name: 'Signature Cocktails',
      description: 'Unique mixology creations crafted by our head bartender.',
      image: 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b',
      displayOrder: 7,
      subcategories: {
        create: [
          {
            slug: 'craft-cocktails',
            name: 'Craft Signature Cocktails',
            displayOrder: 1,
          },
          {
            slug: 'classic-cocktails',
            name: 'Classic Cocktails',
            displayOrder: 2,
          },
        ],
      },
    },
    include: { subcategories: true },
  })
  const sigCocktailsSub = cocktailsCat.subcategories.find(
    (s) => s.slug === 'craft-cocktails',
  )!

  // 8. NON-ALCOHOLIC BEVERAGES
  const nonAlcCat = await prisma.category.create({
    data: {
      slug: 'non-alcoholic-beverages',
      name: 'Non-Alcoholic Beverages',
      description:
        'Fresh squeezed juices, artisanal lemonades, and specialty coffee.',
      image: 'https://images.unsplash.com/photo-1534778101976-62847782c213',
      displayOrder: 8,
      subcategories: {
        create: [
          {
            slug: 'fresh-juices-and-lemonades',
            name: 'Fresh Juices & Lemonades',
            displayOrder: 1,
          },
          {
            slug: 'coffee-and-hot-drinks',
            name: 'Coffee & Hot Drinks',
            displayOrder: 2,
          },
        ],
      },
    },
    include: { subcategories: true },
  })
  const juicesSub = nonAlcCat.subcategories.find(
    (s) => s.slug === 'fresh-juices-and-lemonades',
  )!
  const hotDrinksSub = nonAlcCat.subcategories.find(
    (s) => s.slug === 'coffee-and-hot-drinks',
  )!

  // TOTAL 20 MENU ITEMS
  await prisma.menuItem.createMany({
    data: [
      // Salads (2)
      {
        name: 'Lumière Burrata Salad',
        description:
          'Fresh artisanal burrata, wild arugula, vine tomatoes, pine nuts, and pesto dressing.',
        price: 480,
        image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd',
        displayOrder: 1,
        isPopular: true,
        isOrderable: true,
        ingredients: ['Burrata', 'Arugula', 'Cherry Tomatoes', 'Pine Nuts'],
        allergens: ['Dairy', 'Nuts'],
        dietary: ['Vegetarian'],
        categoryId: saladsCat.id,
        subcategoryId: freshSaladsSub.id,
      },
      {
        name: 'Grilled Chicken Caesar',
        description:
          'Crisp iceberg lettuce, grilled chicken breast, herb croutons, parmesan, and Caesar dressing.',
        price: 390,
        image: 'https://images.unsplash.com/photo-1550304943-4f24f54ddde9',
        displayOrder: 2,
        isOrderable: true,
        ingredients: ['Chicken Breast', 'Iceberg', 'Parmesan', 'Croutons'],
        allergens: ['Gluten', 'Dairy', 'Eggs'],
        dietary: [],
        categoryId: saladsCat.id,
        subcategoryId: freshSaladsSub.id,
      },

      // Soups (2)
      {
        name: 'Porcini & Truffle Cream Soup',
        description:
          'Velvety soup crafted from wild porcini mushrooms infused with black truffle oil.',
        price: 320,
        image: 'https://images.unsplash.com/photo-1547592166-23ac45744acd',
        displayOrder: 1,
        isPopular: true,
        isOrderable: true,
        ingredients: [
          'Porcini Mushrooms',
          'Heavy Cream',
          'Black Truffle',
          'Butter',
        ],
        allergens: ['Dairy'],
        dietary: ['Vegetarian'],
        categoryId: soupsCat.id,
        subcategoryId: creamSoupsSub.id,
      },
      {
        name: 'Roasted Pumpkin Cream Soup',
        description:
          'Silky roasted butternut squash soup finished with toasted pumpkin seeds and olive oil.',
        price: 280,
        image: 'https://images.unsplash.com/photo-1476718406336-bb5a9690ee2a',
        displayOrder: 2,
        isOrderable: true,
        ingredients: ['Pumpkin', 'Pumpkin Seeds', 'Coconut Milk'],
        allergens: [],
        dietary: ['Vegan', 'Gluten-Free'],
        categoryId: soupsCat.id,
        subcategoryId: creamSoupsSub.id,
      },

      // Starters (3)
      {
        name: 'Atlantic Salmon Tartare',
        description:
          'Fresh Atlantic salmon, avocado mousse, capers, lemon juice, and buttered brioche.',
        price: 580,
        image: 'https://images.unsplash.com/photo-1534422298391-e4f8c172dddb',
        displayOrder: 1,
        isExclusive: true,
        isOrderable: true,
        ingredients: ['Salmon', 'Avocado', 'Capers', 'Lemon'],
        allergens: ['Fish', 'Gluten'],
        dietary: ['Keto'],
        categoryId: startersCat.id,
        subcategoryId: coldStartersSub.id,
      },
      {
        name: 'Lumière Bruschetta',
        description:
          'Toasted sourdough bread topped with vine cherry tomatoes, basil, and fresh mozzarella.',
        price: 320,
        image: 'https://images.unsplash.com/photo-1572695157366-5e585ab2b69f',
        displayOrder: 2,
        isOrderable: true,
        ingredients: ['Tomato', 'Basil', 'Mozzarella'],
        allergens: ['Gluten', 'Dairy'],
        dietary: ['Vegetarian'],
        categoryId: startersCat.id,
        subcategoryId: coldStartersSub.id,
      },
      {
        name: 'Baked Feta with Honey & Chili',
        description:
          'Oven-baked sheep feta in a clay dish with oregano, wildflower honey, and black olives.',
        price: 390,
        image: 'https://images.unsplash.com/photo-1559847844-5315695dadae',
        displayOrder: 3,
        isOrderable: true,
        ingredients: ['Sheep Feta', 'Honey', 'Olives'],
        allergens: ['Dairy'],
        dietary: ['Vegetarian'],
        categoryId: startersCat.id,
        subcategoryId: warmStartersSub.id,
      },

      // Main Courses (4)
      {
        name: 'Red Wine Beef Tenderloin',
        description:
          '250g prime beef tenderloin served with red wine demi-glace and truffle mashed potatoes.',
        price: 1450,
        image: 'https://images.unsplash.com/photo-1558030006-450675393462',
        displayOrder: 1,
        isPopular: true,
        isExclusive: true,
        isSpecial: true,
        isOrderable: true,
        ingredients: ['Beef Tenderloin', 'Red Wine', 'Truffle', 'Butter'],
        allergens: ['Dairy'],
        dietary: ['Gluten-Free'],
        origin: 'Local Organic Farm',
        preparation: 'Grilled to preference',
        pairing: 'Vranec Barrique Reserve',
        categoryId: mainsCat.id,
        subcategoryId: meatSub.id,
      },
      {
        name: 'Pork Tenderloin in Mushroom Sauce',
        description:
          'Succulent pork medallion served with wild porcini sauce and herb-roasted potatoes.',
        price: 720,
        image: 'https://images.unsplash.com/photo-1432139555190-58524dae6a55',
        displayOrder: 2,
        isOrderable: true,
        ingredients: ['Pork Tenderloin', 'Porcini Mushrooms', 'Cream'],
        allergens: ['Dairy'],
        dietary: [],
        categoryId: mainsCat.id,
        subcategoryId: meatSub.id,
      },
      {
        name: 'Grilled Salmon Filet',
        description:
          'Fresh Atlantic salmon filet drizzled with lemon butter, served alongside grilled vegetables.',
        price: 980,
        image: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2',
        displayOrder: 3,
        isOrderable: true,
        ingredients: ['Salmon', 'Zucchini', 'Bell Peppers'],
        allergens: ['Fish'],
        dietary: ['Gluten-Free', 'Keto'],
        categoryId: mainsCat.id,
        subcategoryId: seaSub.id,
      },
      {
        name: 'Grilled Adriatic Calamari',
        description:
          'Char-grilled squid rings tossed in olive oil, garlic, and fresh parsley dressing.',
        price: 820,
        image: 'https://images.unsplash.com/photo-1599488615731-7e5c2823ff28',
        displayOrder: 4,
        isOrderable: true,
        ingredients: ['Squid', 'Olive Oil', 'Garlic', 'Parsley'],
        allergens: ['Seafood'],
        dietary: ['Gluten-Free'],
        categoryId: mainsCat.id,
        subcategoryId: seaSub.id,
      },

      // Desserts (3)
      {
        name: 'Lumière Molten Lava Cake',
        description:
          'Warm dark chocolate cake with a gooey center, served with Madagascar vanilla ice cream.',
        price: 340,
        image: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c',
        displayOrder: 1,
        isPopular: true,
        isOrderable: true,
        ingredients: ['Belgian Chocolate', 'Eggs', 'Vanilla Ice Cream'],
        allergens: ['Gluten', 'Dairy', 'Eggs'],
        dietary: ['Vegetarian'],
        categoryId: dessertsCat.id,
        subcategoryId: customDessertsSub.id,
      },
      {
        name: 'Classic Venetian Tiramisu',
        description:
          'Traditional Italian tiramisu with whipped mascarpone cream, espresso, and cocoa.',
        price: 290,
        image: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9',
        displayOrder: 2,
        isOrderable: true,
        ingredients: ['Mascarpone', 'Ladyfingers', 'Espresso'],
        allergens: ['Gluten', 'Dairy', 'Eggs'],
        dietary: ['Vegetarian'],
        categoryId: dessertsCat.id,
        subcategoryId: customDessertsSub.id,
      },
      {
        name: 'Lemon & Mint Sorbet',
        description:
          'Refreshing dairy-free house-made sorbet made from organic lemons and fresh mint.',
        price: 240,
        image: 'https://images.unsplash.com/photo-1560008511-11c63416e52d',
        displayOrder: 3,
        isOrderable: true,
        ingredients: ['Lemon', 'Fresh Mint', 'Sugar'],
        allergens: [],
        dietary: ['Vegan', 'Gluten-Free'],
        categoryId: dessertsCat.id,
        subcategoryId: sorbetSub.id,
      },

      // Wines (2)
      {
        name: 'Vranec Barrique Reserve (0.75l)',
        description:
          'Full-bodied premium red wine with notes of dried plum, dark chocolate, and oak.',
        price: 1800,
        image: 'https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb',
        displayOrder: 1,
        isExclusive: true,
        isOrderable: true,
        ingredients: ['Vranec Grapes'],
        allergens: ['Sulfites'],
        dietary: ['Vegan'],
        origin: 'Tikves Region, Macedonia',
        categoryId: winesCat.id,
        subcategoryId: redWinesSub.id,
      },
      {
        name: 'Chardonnay Special Selection (0.75l)',
        description:
          'Crisp white wine featuring citrus undertones, white tea aromas, and ripe pear.',
        price: 1400,
        image: 'https://images.unsplash.com/photo-1558001373-7b93ee48ffa0',
        displayOrder: 2,
        isOrderable: true,
        ingredients: ['Chardonnay Grapes'],
        allergens: ['Sulfites'],
        dietary: ['Vegan'],
        origin: 'Macedonia',
        categoryId: winesCat.id,
        subcategoryId: whiteWinesSub.id,
      },

      // Signature Cocktails (2)
      {
        name: 'Lumière Smoked Old Fashioned',
        description:
          'Bourbon whiskey, Angostura bitters, caramelized sugar syrup, and oakwood smoke.',
        price: 450,
        image: 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b',
        displayOrder: 1,
        isPopular: true,
        isSpecial: true,
        isOrderable: true,
        ingredients: ['Bourbon', 'Angostura', 'Orange Peel', 'Oak Smoke'],
        allergens: [],
        dietary: [],
        categoryId: cocktailsCat.id,
        subcategoryId: sigCocktailsSub.id,
      },
      {
        name: 'Elderflower Botanical Tonic',
        description:
          'Cucumber-infused gin, elderflower liqueur, fresh lemon, and botanical tonic.',
        price: 420,
        image: 'https://images.unsplash.com/photo-1551024709-8f23befc6f87',
        displayOrder: 2,
        isOrderable: true,
        ingredients: ['Gin', 'Elderflower Liqueur', 'Cucumber', 'Tonic'],
        allergens: [],
        dietary: [],
        categoryId: cocktailsCat.id,
        subcategoryId: sigCocktailsSub.id,
      },

      // Non-Alcoholic Beverages (2)
      {
        name: 'Raspberry House Lemonade',
        description:
          'Freshly squeezed lemons with wild raspberry puree and fresh basil leaves.',
        price: 220,
        image: 'https://images.unsplash.com/photo-1621263764928-df1444c5e859',
        displayOrder: 1,
        isOrderable: true,
        ingredients: ['Lemon', 'Raspberries', 'Basil'],
        allergens: [],
        dietary: ['Vegan', 'Gluten-Free'],
        categoryId: nonAlcCat.id,
        subcategoryId: juicesSub.id,
      },
      {
        name: 'Arabica Premium Espresso',
        description:
          '100% Arabica espresso with a velvety crema and rich roasted hazelnut notes.',
        price: 120,
        image: 'https://images.unsplash.com/photo-1510591509098-f4fdc6d0ff04',
        displayOrder: 2,
        isOrderable: true,
        ingredients: ['Arabica Coffee Beans'],
        allergens: [],
        dietary: ['Vegan'],
        categoryId: nonAlcCat.id,
        subcategoryId: hotDrinksSub.id,
      },
    ],
  })

  console.log('Creating table types and tables...')
  const vipType = await prisma.tableType.create({
    data: {
      slug: 'vip-booth',
      name: 'VIP Booth',
      description: 'Private and intimate seating area.',
    },
  })

  const mainHallType = await prisma.tableType.create({
    data: {
      slug: 'main-hall',
      name: 'Main Hall',
      description: 'Spacious dining tables in the central room.',
    },
  })

  await prisma.table.createMany({
    data: [
      { number: 'T-01', capacity: 2, tableTypeId: mainHallType.id },
      { number: 'T-02', capacity: 4, tableTypeId: mainHallType.id },
      { number: 'VIP-01', capacity: 6, tableTypeId: vipType.id },
    ],
  })

  console.log('Creating reviews...')
  await prisma.review.create({
    data: {
      name: 'Sophia Bennett',
      role: 'Food Critic',
      text: 'The atmosphere is incredible! The Burrata salad and Beef Tenderloin were perfection.',
      rating: 5,
      status: ReviewStatus.APPROVED,
      userId: user.id,
    },
  })

  console.log('Creating working hours and schedule overrides...')
  for (let day = 0; day <= 6; day++) {
    const isSunday = day === 0
    await prisma.workingHours.create({
      data: {
        dayOfWeek: day,
        isWorking: true,
        slots: isSunday
          ? [{ open: '12:00', close: '22:00' }]
          : [{ open: '09:00', close: '00:00' }],
      },
    })
  }

  await prisma.scheduleOverride.create({
    data: {
      dateString: '2026-12-31',
      isWorking: true,
      slots: [{ open: '18:00', close: '04:00' }],
      reason: 'New Year Gala Event',
    },
  })

  console.log('English seed completed successfully!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
