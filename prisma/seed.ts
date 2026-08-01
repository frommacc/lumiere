import { prisma } from '@/lib/prisma'

async function main() {
  console.log('🌱 Започнува сеење на категории, подкатегории и мени артикли...')

  // ==========================================
  // 1. КАТЕГОРИИ (8 Категории)
  // ==========================================
  const categories = [
    {
      id: 'appetizer',
      slug: 'appetizer',
      name: 'Предјадења',
      description:
        'Софистицирани предјадења за почеток на вашето гастрономско искуство.',
      image:
        'https://res.cloudinary.com/labellamk/image/upload/v1785336342/categories/z9lhzsrlxyb1mizgwog2.webp',
      imageId: 'categories/z9lhzsrlxyb1mizgwog2',
      displayOrder: 1,
      isPublished: true,
    },
    {
      id: 'main',
      slug: 'main',
      name: 'Главни Јадења',
      description:
        'Премиум парчиња месо, свежа риба и специјалитети подготвени од врвни готвачи.',
      image:
        'https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=800&auto=format&fit=crop',
      imageId: null,
      displayOrder: 2,
      isPublished: true,
    },
    {
      id: 'dessert',
      slug: 'dessert',
      name: 'Десерти',
      description:
        'Уникатни слатки задоволства и деконструирани класични десерти.',
      image:
        'https://images.unsplash.com/photo-1587314168485-3236d6710814?q=80&w=800&auto=format&fit=crop',
      imageId: null,
      displayOrder: 3,
      isPublished: true,
    },
    {
      id: 'wine',
      slug: 'wine',
      name: 'Вина',
      description: 'Селекција на ексклузивни домашни и светски етикети.',
      image:
        'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?q=80&w=800&auto=format&fit=crop',
      imageId: null,
      displayOrder: 4,
      isPublished: true,
    },
    {
      id: 'salads',
      slug: 'salads',
      name: 'Салати',
      description:
        'Свежи органски зеленчуци со артизанални дресинзи и зреени сирења.',
      image:
        'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?q=80&w=800&auto=format&fit=crop',
      imageId: null,
      displayOrder: 5,
      isPublished: true,
    },
    {
      id: 'soups',
      slug: 'soups',
      name: 'Супи & Чорби',
      description:
        'Богати кремасти супи и традиционални бујони со префинет вкус.',
      image:
        'https://images.unsplash.com/photo-1547592166-23ac45744acd?q=80&w=800&auto=format&fit=crop',
      imageId: null,
      displayOrder: 6,
      isPublished: true,
    },
    {
      id: 'cocktails',
      slug: 'cocktails',
      name: 'Авторски Коктели',
      description:
        'Уникатни миксолошки креации со премиум дестилати и свежи билки.',
      image:
        'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?q=80&w=800&auto=format&fit=crop',
      imageId: null,
      displayOrder: 7,
      isPublished: true,
    },
    {
      id: 'drinks',
      slug: 'drinks',
      name: 'Безалкохолни Пијалоци',
      description:
        'Свежо цедени сокови, премиум кафе, чаеви и флаширана минерална вода.',
      image:
        'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?q=80&w=800&auto=format&fit=crop',
      imageId: null,
      displayOrder: 8,
      isPublished: true,
    },
  ]

  for (const category of categories) {
    await prisma.category.upsert({
      where: { id: category.id },
      update: category,
      create: category,
    })
  }

  console.log('✅ Категориите се успешно внесени/ажурирани.')

  // ==========================================
  // 2. ПОДКАТЕГОРИИ (Subcategories)
  // Почитува @@unique([categoryId, slug])
  // ==========================================
  const subcategories = [
    // --- Предјадења ---
    {
      id: 'sub-cold-appetizers',
      slug: 'cold-appetizers',
      name: 'Ладни Предјадења',
      description: 'Ладни специјалитети и карпача',
      displayOrder: 1,
      isPublished: true,
      categoryId: 'appetizer',
    },
    {
      id: 'sub-hot-appetizers',
      slug: 'hot-appetizers',
      name: 'Топли Предјадења',
      description: 'Топли артизанални предјадења и рижото',
      displayOrder: 2,
      isPublished: true,
      categoryId: 'appetizer',
    },

    // --- Главни Јадења ---
    {
      id: 'sub-meat-specialties',
      slug: 'meat-specialties',
      name: 'Месни Специјалитети',
      description: 'Премиум стек и одлежано месо',
      displayOrder: 1,
      isPublished: true,
      categoryId: 'main',
    },
    {
      id: 'sub-fish-seafood',
      slug: 'fish-seafood',
      name: 'Риба и Морски Плодови',
      description: 'Свежа риба од дневниот улов',
      displayOrder: 2,
      isPublished: true,
      categoryId: 'main',
    },

    // --- Десерти ---
    {
      id: 'sub-signature-desserts',
      slug: 'signature-desserts',
      name: 'Авторски Десерти',
      description: 'Слатки задоволства од слаткарот',
      displayOrder: 1,
      isPublished: true,
      categoryId: 'dessert',
    },

    // --- Вина ---
    {
      id: 'sub-red-wines',
      slug: 'red-wines',
      name: 'Црвени Вина',
      description: 'Премиум црвени вина и резерви',
      displayOrder: 1,
      isPublished: true,
      categoryId: 'wine',
    },
    {
      id: 'sub-white-wines',
      slug: 'white-wines',
      name: 'Бели Вина',
      description: 'Освежителни и елегантни бели вина',
      displayOrder: 2,
      isPublished: true,
      categoryId: 'wine',
    },
    {
      id: 'sub-sparkling-wines',
      slug: 'sparkling-wines',
      name: 'Шампањ & Пенливи Вина',
      description: 'Француски шампањ и пенливи етикети',
      displayOrder: 3,
      isPublished: true,
      categoryId: 'wine',
    },

    // --- Салати ---
    {
      id: 'sub-fresh-salads',
      slug: 'fresh-salads',
      name: 'Свежи Органски Салати',
      description: 'Сезонски органски салати',
      displayOrder: 1,
      isPublished: true,
      categoryId: 'salads',
    },

    // --- Супи ---
    {
      id: 'sub-creamy-soups',
      slug: 'creamy-soups',
      name: 'Крем Супи',
      description: 'Богати кремасти супи',
      displayOrder: 1,
      isPublished: true,
      categoryId: 'soups',
    },

    // --- Коктели ---
    {
      id: 'sub-craft-cocktails',
      slug: 'craft-cocktails',
      name: 'Занаетчиски Коктели',
      description: 'Миксолошки авторски пијалаци',
      displayOrder: 1,
      isPublished: true,
      categoryId: 'cocktails',
    },

    // --- Безалкохолни Пијалоци (Ново) ---
    {
      id: 'sub-soft-drinks',
      slug: 'soft-drinks',
      name: 'Освежителни Напитоци',
      description: 'Свежо цедени сокови и природни лимонади',
      displayOrder: 1,
      isPublished: true,
      categoryId: 'drinks',
    },
    {
      id: 'sub-coffee-tea',
      slug: 'coffee-tea',
      name: 'Кафе & Топли Пијалоци',
      description: 'Премиум Arabica кафе и органски чаеви',
      displayOrder: 2,
      isPublished: true,
      categoryId: 'drinks',
    },
    {
      id: 'sub-water',
      slug: 'water',
      name: 'Вода & Минерална Вода',
      description: 'Изворска и газирана природна вода',
      displayOrder: 3,
      isPublished: true,
      categoryId: 'drinks',
    },
  ]

  for (const subcategory of subcategories) {
    await prisma.subcategory.upsert({
      where: { id: subcategory.id },
      update: subcategory,
      create: subcategory,
    })
  }

  console.log('✅ Подкатегориите се успешно внесени/ажурирани.')

  // ==========================================
  // 3. МЕНИ АРТИКЛИ (19 Артикли)
  // ==========================================
  const menuItems = [
    // --- APPETIZERS ---
    {
      id: 'app-carpaccio',
      name: 'Карпачо од Лосос',
      description:
        'Тенко исечен див лосос, прелиен со инфузија од цитруси, капари, див копар и никулци од ротквица.',
      price: 980,
      image:
        'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=800&auto=format&fit=crop',
      imageId: null,
      displayOrder: 1,
      isPublished: true,
      isAvailable: true,
      isOrderable: false,
      isPopular: false,
      isExclusive: true,
      isSpecial: true,
      categoryId: 'appetizer',
      subcategoryId: 'sub-cold-appetizers',
      ingredients: [
        'Див лосос',
        'Лимонов сок',
        'Капари',
        'Див копар',
        'Маслиново масло',
        'Никулци од ротквица',
      ],
      allergens: ['Риба'],
      dietary: ['Keto', 'Gluten-Free', 'High-Protein'],
      origin: 'Осло, Норвешка',
      preparation:
        'Ладно мариниран 12 часа во цитрусен дресинг со цеден бергамот.',
      pairing: 'Château de l’Hermitage (2020)',
    },
    {
      id: 'app-risotto',
      name: 'Тартуф Рижото',
      description:
        'Кремасто Arborio ориз со свежи црни тартуфи, 24-месечен Пармезан и маслиново масло со бели тартуфи.',
      price: 1200,
      image:
        'https://images.unsplash.com/photo-1546549032-9571cd6b27df?q=80&w=800&auto=format&fit=crop',
      imageId: null,
      displayOrder: 2,
      isPublished: true,
      isAvailable: true,
      isOrderable: false,
      isPopular: true,
      isExclusive: false,
      isSpecial: true,
      categoryId: 'appetizer',
      subcategoryId: 'sub-hot-appetizers',
      ingredients: [
        'Arborio ориз',
        'Свеж црн тартуф',
        'Пармезан (Parmigiano Reggiano)',
        'Путер од Алпите',
        'Бело вино',
      ],
      allergens: ['Лактоза'],
      dietary: ['Vegetarian', 'Gluten-Free'],
      origin: 'Пиемонт, Италија',
      preparation:
        'Бавно готвено во зеленчуков бујон и дотерано со пармезан одлежан 24 месеци.',
      pairing: 'Barolo DOCG (2018)',
    },
    {
      id: 'app-burrata',
      name: 'Бурата со Печени Смокви',
      description:
        'Свежа италијанска Бурата со карамелизирани смокви, тостирани пињоли и редукција од балсамико отлежано 12 години.',
      price: 890,
      image:
        'https://images.unsplash.com/photo-1592417817098-8f3d6ef23a85?q=80&w=800&auto=format&fit=crop',
      imageId: null,
      displayOrder: 3,
      isPublished: true,
      isAvailable: true,
      isOrderable: false,
      isPopular: true,
      isExclusive: false,
      isSpecial: false,
      categoryId: 'appetizer',
      subcategoryId: 'sub-cold-appetizers',
      ingredients: [
        'Свежа Бурата',
        'Диви смокви',
        'Пињоли',
        'Балсамико од Модена',
        'Босилек',
      ],
      allergens: ['Лактоза', 'Јаткасти плодови'],
      dietary: ['Vegetarian', 'Gluten-Free'],
      origin: 'Пулија, Италија',
      preparation: 'Смокви карамелизирани на топол мед и свеж босилек.',
      pairing: 'Château de l’Hermitage',
    },

    // --- MAIN COURSES ---
    {
      id: 'main-duck',
      name: 'Паткини Гради со Портокал',
      description:
        'Печени паткини гради со крцкава кожа, придружени со пире од сладок компир и редукција од портокал и ѕвездест анис.',
      price: 1650,
      image:
        'https://images.unsplash.com/photo-1518492104633-130d0cc84637?q=80&w=800&auto=format&fit=crop',
      imageId: null,
      displayOrder: 1,
      isPublished: true,
      isAvailable: true,
      isOrderable: false,
      isPopular: false,
      isExclusive: false,
      isSpecial: true,
      categoryId: 'main',
      subcategoryId: 'sub-meat-specialties',
      ingredients: [
        'Паткини гради',
        'Сладок компир (Batat)',
        'Свеж сок од портокал',
        'Ѕвездест анис',
        'Мајчина душица',
      ],
      allergens: [],
      dietary: ['Gluten-Free', 'High-Protein'],
      origin: 'Бордо, Франција',
      preparation:
        'Sous-vide печење 4 часа на 58°C и завршница на француски туч.',
      pairing: 'Pinot Noir Reserve',
    },
    {
      id: 'main-wagyu',
      name: 'Wagyu Стек (А5)',
      description:
        'Премиум А5 јапонски Wagyu стек, подготвен на традиционален начин со чадена морска сол, путер од билки и аспарагус на скара.',
      price: 3800,
      image:
        'https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=800&auto=format&fit=crop',
      imageId: null,
      displayOrder: 2,
      isPublished: true,
      isAvailable: true,
      isOrderable: false,
      isPopular: true,
      isExclusive: true,
      isSpecial: true,
      categoryId: 'main',
      subcategoryId: 'sub-meat-specialties',
      ingredients: [
        'А5 Wagyu говедско',
        'Чадена морска сол (Maldon)',
        'Француски путер со билки',
        'Зелен аспарагус',
      ],
      allergens: ['Лактоза'],
      dietary: ['Keto', 'Gluten-Free', 'High-Protein'],
      origin: 'Мијазаки, Јапонија',
      preparation:
        'Кратоко печење на ќумур од јапонски даб (Binchotan) со контрола на температура.',
      pairing: 'Аурелијан Резерва (2018)',
    },
    {
      id: 'main-seabass',
      name: 'Див Бранцин во Сол',
      description:
        'Филе од див бранцин печен во оклоп од морска сол, сервиран со сотиран спанаќ, чери домати и путер од капари.',
      price: 2100,
      image:
        'https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?q=80&w=800&auto=format&fit=crop',
      imageId: null,
      displayOrder: 3,
      isPublished: true,
      isAvailable: true,
      isOrderable: false,
      isPopular: false,
      isExclusive: true,
      isSpecial: false,
      categoryId: 'main',
      subcategoryId: 'sub-fish-seafood',
      ingredients: [
        'Див Бранцин',
        'Морска сол од Пиран',
        'Млад спанаќ',
        'Чери домати',
        'Капари',
      ],
      allergens: ['Риба', 'Лактоза'],
      dietary: ['Keto', 'Gluten-Free'],
      origin: 'Јадранско Море, Хрватска',
      preparation:
        'Цела риба печена во оклоп од морска сол и белки за да ја задржи сочноста.',
      pairing: 'Chablis Premier Cru',
    },

    // --- DESSERTS ---
    {
      id: 'des-baklava',
      name: 'Деконструирана Баклава',
      description:
        'Крцкави кори со шеќерен сируп, фин крем од ф’стаци од Сицилија и домашна топка сладолед од мед и смокви.',
      price: 680,
      image:
        'https://images.unsplash.com/photo-1519869325930-281384150729?q=80&w=800&auto=format&fit=crop',
      imageId: null,
      displayOrder: 1,
      isPublished: true,
      isAvailable: true,
      isOrderable: false,
      isPopular: false,
      isExclusive: false,
      isSpecial: false,
      categoryId: 'dessert',
      subcategoryId: 'sub-signature-desserts',
      ingredients: [
        'Рачно печени кори',
        'Бронте ф’стаци',
        'Мед од планина Бистра',
        'Диви смокви',
        'Млечен крем',
      ],
      allergens: ['Глутен', 'Јаткасти плодови', 'Лактоза'],
      dietary: ['Vegetarian'],
      origin: 'Бронте (Сицилија) & Македонија',
      preparation:
        'Специјално деконструирани кори печени на ниска температура со путер од козјо млеко.',
      pairing: 'Порто Винтаж (2015)',
    },
    {
      id: 'des-gold',
      name: 'Златен Десерт',
      description:
        'Сфера од темно белгиско чоколадо, полнета со богат мус од лешник и украсена со 24-каратно јадливо злато.',
      price: 950,
      image:
        'https://images.unsplash.com/photo-1587314168485-3236d6710814?q=80&w=800&auto=format&fit=crop',
      imageId: null,
      displayOrder: 2,
      isPublished: true,
      isAvailable: true,
      isOrderable: false,
      isPopular: true,
      isExclusive: true,
      isSpecial: true,
      categoryId: 'dessert',
      subcategoryId: 'sub-signature-desserts',
      ingredients: [
        '70% Темно белгиско чоколадо',
        'Лешник од Пјемонт',
        '24K Јадливо злато во ливчиња',
        'Ванила од Мадагаскар',
      ],
      allergens: ['Лактоза', 'Јаткасти плодови', 'Соја'],
      dietary: ['Vegetarian'],
      origin: 'Бруге, Белгија',
      preparation:
        'Темперирана сфера од чоколадо со топла редукција од карамела и зачини.',
      pairing: 'Espresso Martini со темна ванила',
    },
    {
      id: 'des-souffle',
      name: 'Чоколадно Суфле (Lava)',
      description:
        'Топло чоколадно суфле со течна средина од 72% какао, придружено со топка сладолед од артизанална ванила.',
      price: 580,
      image:
        'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?q=80&w=800&auto=format&fit=crop',
      imageId: null,
      displayOrder: 3,
      isPublished: true,
      isAvailable: true,
      isOrderable: false,
      isPopular: true,
      isExclusive: false,
      isSpecial: false,
      categoryId: 'dessert',
      subcategoryId: 'sub-signature-desserts',
      ingredients: [
        '72% Еквадорско какао',
        'Јајца од слободен одгледот',
        'Француски путер',
        'Ванила Бурбон',
      ],
      allergens: ['Глутен', 'Јајца', 'Лактоза'],
      dietary: ['Vegetarian'],
      origin: 'Еквадор & Франција',
      preparation:
        'Печено по нарачка точно 11 минути за совршена течна средина.',
      pairing: 'Порто Резерва',
    },

    // --- WINES ---
    {
      id: 'wine-aurelian',
      name: 'Аурелијан Резерва',
      description:
        'Суво црвено вино, сортен Cabernet Sauvignon 2018. Комплексно тело со ноти на шумско овошје, темен чоколадо и француски даб.',
      price: 4500,
      image:
        'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?q=80&w=800&auto=format&fit=crop',
      imageId: null,
      displayOrder: 1,
      isPublished: true,
      isAvailable: true,
      isOrderable: false,
      isPopular: false,
      isExclusive: true,
      isSpecial: false,
      categoryId: 'wine',
      subcategoryId: 'sub-red-wines',
      ingredients: ['Грозје Каберне Совињон 100%'],
      allergens: ['Сулфити'],
      dietary: ['Vegan', 'Gluten-Free'],
      origin: 'Тиквешки Регион, Македонија',
      preparation:
        'Одлежано 24 месеци во нови француски дабови буриња (Barrique).',
      pairing: 'Премиум Wagyu Стек & Зреени сирења',
    },
    {
      id: 'wine-hermitage',
      name: 'Château de l’Hermitage',
      description:
        'Француско суво бело вино со овошни ноти на праска, цитрусен цвет и блага минералност во финишот.',
      price: 790,
      image:
        'https://res.cloudinary.com/labellamk/image/upload/v1785338087/menu-items/kv832guv2ulrdwaz1hfe.webp',
      imageId: 'menu-items/kv832guv2ulrdwaz1hfe',
      displayOrder: 2,
      isPublished: true,
      isAvailable: true,
      isOrderable: false,
      isPopular: false,
      isExclusive: false,
      isSpecial: true,
      categoryId: 'wine',
      subcategoryId: 'sub-white-wines',
      ingredients: ['Грозје Совињон Блан 100%'],
      allergens: ['Сулфити'],
      dietary: ['Vegan', 'Gluten-Free'],
      origin: 'Долина на Лоара, Франција',
      preparation:
        'Ферментација во инокс резервоари со контролирана температура.',
      pairing: 'Карпачо од Лосос & Свежи остриги',
    },
    {
      id: 'wine-dom-perignon',
      name: 'Dom Pérignon Vintage',
      description:
        'Премиум француски шампањ со исклучителна елеганција, ноти на печен бриош, суво овошје и фина перлажа.',
      price: 18500,
      image:
        'https://images.unsplash.com/photo-1569919659476-f0852f6834b7?q=80&w=800&auto=format&fit=crop',
      imageId: null,
      displayOrder: 3,
      isPublished: true,
      isAvailable: true,
      isOrderable: false,
      isPopular: false,
      isExclusive: true,
      isSpecial: true,
      categoryId: 'wine',
      subcategoryId: 'sub-sparkling-wines',
      ingredients: ['Chardonnay', 'Pinot Noir'],
      allergens: ['Сулфити'],
      dietary: ['Vegan', 'Gluten-Free'],
      origin: 'Шампања, Франција',
      preparation:
        'Одлежано во визбите минимум 8 години пред пуштање во промет.',
      pairing: 'Карпачо од Лосос & Свеж Кавијар',
    },

    // --- SALADS ---
    {
      id: 'salad-burrata-beet',
      name: 'Бурата со Печена Цвекло',
      description:
        'Карпачо од црвена и жолта цвекло со свежи лисја спанаќ, тостирани бадеми и дресинг од див мед.',
      price: 720,
      image:
        'https://images.unsplash.com/photo-1540420773420-3366772f4999?q=80&w=800&auto=format&fit=crop',
      imageId: null,
      displayOrder: 1,
      isPublished: true,
      isAvailable: true,
      isOrderable: false,
      isPopular: false,
      isExclusive: false,
      isSpecial: false,
      categoryId: 'salads',
      subcategoryId: 'sub-fresh-salads',
      ingredients: [
        'Органска цвекло',
        'Млад спанаќ',
        'Тостиран бадем',
        'Див мед',
        'Козјо сирење',
      ],
      allergens: ['Лактоза', 'Јаткасти плодови'],
      dietary: ['Vegetarian', 'Gluten-Free'],
      origin: 'Пелагонија, Македонија',
      preparation:
        'Цвеклото се пече во фолија со морска сол и мајчина душица 2 часа.',
      pairing: 'Château de l’Hermitage',
    },

    // --- SOUPS ---
    {
      id: 'soup-lobster-bisque',
      name: 'Крем Супа од Јастог',
      description:
        'Кадифена кремаста супа од јастог со коњак, француска павлака и крцкав кроасан со билки.',
      price: 850,
      image:
        'https://images.unsplash.com/photo-1547592166-23ac45744acd?q=80&w=800&auto=format&fit=crop',
      imageId: null,
      displayOrder: 1,
      isPublished: true,
      isAvailable: true,
      isOrderable: false,
      isPopular: true,
      isExclusive: true,
      isSpecial: true,
      categoryId: 'soups',
      subcategoryId: 'sub-creamy-soups',
      ingredients: [
        'Свеж јастог',
        'Коњак VSOP',
        'Француска павлака',
        'Целер',
        'Шафран',
      ],
      allergens: ['Морски плодови', 'Лактоза', 'Глутен'],
      dietary: ['High-Protein'],
      origin: 'Бретања, Франција',
      preparation:
        'Бавно редуциран бујон од оклоп на јастог со коњак и свежи зачини.',
      pairing: 'Chablis Premier Cru',
    },

    // --- COCKTAILS ---
    {
      id: 'cocktail-smoked-old-fashioned',
      name: 'Smoked Bourbon Old Fashioned',
      description:
        'Премиум Бурбон виски, сируп од јавор, ангостура битер и чаден дабов чип во стаклено ѕвоно.',
      price: 650,
      image:
        'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?q=80&w=800&auto=format&fit=crop',
      imageId: null,
      displayOrder: 1,
      isPublished: true,
      isAvailable: true,
      isOrderable: false,
      isPopular: true,
      isExclusive: true,
      isSpecial: true,
      categoryId: 'cocktails',
      subcategoryId: 'sub-craft-cocktails',
      ingredients: [
        'Woodford Reserve Bourbon',
        'Органски јаворов сируп',
        'Angostura Bitters',
        'Портокалова кора',
      ],
      allergens: [],
      dietary: ['Vegan'],
      origin: 'Кентаки, САД',
      preparation:
        'Инфузиран со чад од американски бела даб непосредно пред сервирање.',
      pairing: 'Златен Десерт',
    },
    {
      id: 'cocktail-truffle-negroni',
      name: 'Тартуф Негрони',
      description:
        'Занаетчиски џин инфузиран со бел тартуф, Campari и Sweet Vermouth отлежан во дабово буре.',
      price: 780,
      image:
        'https://images.unsplash.com/photo-1551024709-8f23befc6f87?q=80&w=800&auto=format&fit=crop',
      imageId: null,
      displayOrder: 2,
      isPublished: true,
      isAvailable: true,
      isOrderable: false,
      isPopular: false,
      isExclusive: true,
      isSpecial: false,
      categoryId: 'cocktails',
      subcategoryId: 'sub-craft-cocktails',
      ingredients: [
        'Dry Gin со бел тартуф',
        'Campari',
        'Carpano Antica Formula Vermouth',
      ],
      allergens: [],
      dietary: ['Vegan'],
      origin: 'Фиренца, Италија',
      preparation: 'Fat-washed џин со масло од бели тартуфи 48 часа.',
      pairing: 'Тартуф Рижото',
    },

    // --- DRINKS (Нови безалкохолни пијалоци) ---
    {
      id: 'drink-fresh-citrus',
      name: 'Занаетчиски Цитрус Микс',
      description:
        'Свежо цеден сок од црвен грејпфрут, сицилијански портокал, лимета и свеж ѓумбир.',
      price: 320,
      image:
        'https://images.unsplash.com/photo-1613478223719-2ab802602423?q=80&w=800&auto=format&fit=crop',
      imageId: null,
      displayOrder: 1,
      isPublished: true,
      isAvailable: true,
      isOrderable: false,
      isPopular: true,
      isExclusive: false,
      isSpecial: false,
      categoryId: 'drinks',
      subcategoryId: 'sub-soft-drinks',
      ingredients: [
        'Црвен грејпфрут',
        'Сицилијански портокал',
        'Лимета',
        'Ѓумбир',
      ],
      allergens: [],
      dietary: ['Vegan', 'Gluten-Free'],
      origin: 'Сицилија, Италија',
      preparation: 'Свежно цедено непосредно пред сервирање.',
      pairing: 'Карпачо од Лосос',
    },
    {
      id: 'drink-specialty-espresso',
      name: 'Single Origin Espresso',
      description:
        '100% Arabica кафе од регионот Yirgacheffe во Етиопија со ноти на јасмин и бергамот.',
      price: 180,
      image:
        'https://images.unsplash.com/photo-1510591509098-f4fdc6d0ff04?q=80&w=800&auto=format&fit=crop',
      imageId: null,
      displayOrder: 2,
      isPublished: true,
      isAvailable: true,
      isOrderable: false,
      isPopular: false,
      isExclusive: true,
      isSpecial: false,
      categoryId: 'drinks',
      subcategoryId: 'sub-coffee-tea',
      ingredients: ['100% Arabica кафе зрна'],
      allergens: [],
      dietary: ['Vegan', 'Gluten-Free'],
      origin: 'Јиргачеф, Етиопија',
      preparation: 'Екстракција од 28 секунди на 93°C.',
      pairing: 'Чоколадно Суфле (Lava)',
    },
    {
      id: 'drink-evian-water',
      name: 'Evian Минерална Вода (0.75l)',
      description:
        'Природна минерална вода од француските Алпи во стаклено пакување.',
      price: 290,
      image:
        'https://images.unsplash.com/photo-1548839140-29a749e1bc4e?q=80&w=800&auto=format&fit=crop',
      imageId: null,
      displayOrder: 3,
      isPublished: true,
      isAvailable: true,
      isOrderable: false,
      isPopular: false,
      isExclusive: false,
      isSpecial: false,
      categoryId: 'drinks',
      subcategoryId: 'sub-water',
      ingredients: ['Природна изворска вода'],
      allergens: [],
      dietary: ['Vegan', 'Gluten-Free'],
      origin: 'Евијан-ле-Бен, Франција',
      preparation: 'Сервирана добро ладена во кристален букaл.',
      pairing: 'Сите главно јадења',
    },
  ]

  for (const item of menuItems) {
    await prisma.menuItem.upsert({
      where: { id: item.id },
      update: item,
      create: item,
    })
  }

  console.log('✅ Сите 19 мени артикли се успешно додадени/ажурирани!')
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error('❌ Грешка при извршување на seed:', e)
    await prisma.$disconnect()
    process.exit(1)
  })
