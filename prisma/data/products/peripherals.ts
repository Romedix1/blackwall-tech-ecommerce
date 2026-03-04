export const getPeripherals = (categoryIds: Record<string, string>) => [
  {
    name: 'ROG Strix Morph 96 Wireless',
    slug: 'rog-strix-morph-96-wireless',
    badge: 'enthusiast grade',
    price: 229.0,
    quantity: 12,
    specification: [
      {
        id: '01',
        label: 'global filters',
        attributes: [
          { key: 'manufacturer', value: 'asus rog' },
          { key: 'type', value: 'keyboard' },
          { key: 'connectivity', value: 'wireless' },
        ],
      },
      {
        id: '02',
        label: 'keyboard details',
        attributes: [
          { key: 'switches', value: 'rog nx mechanical' },
          { key: 'layout', value: '96% compact' },
          { key: 'hot-swap', value: 'yes' },
        ],
      },
    ],
    categoryId: categoryIds['peripherals'],
  },

  {
    name: 'ROG Strix Scope RX EVA-02 Edition',
    slug: 'rog-strix-scope-rx-eva-02',
    badge: 'limited release',
    price: 199.0,
    quantity: 5,
    specification: [
      {
        id: '01',
        label: 'global filters',
        attributes: [
          { key: 'manufacturer', value: 'asus rog' },
          { key: 'type', value: 'keyboard' },
          { key: 'connectivity', value: 'wired' },
        ],
      },
      {
        id: '02',
        label: 'keyboard details',
        attributes: [
          { key: 'switches', value: 'rog rx optical' },
          { key: 'theme', value: 'evangelion unit-02' },
          { key: 'protection', value: 'ip57 waterproof' },
        ],
      },
    ],
    categoryId: categoryIds['peripherals'],
  },

  {
    name: 'SteelSeries Aerox 5 Wired',
    slug: 'steelseries-aerox-5-wired',
    price: 79.0,
    quantity: 30,
    specification: [
      {
        id: '01',
        label: 'global filters',
        attributes: [
          { key: 'manufacturer', value: 'steelseries' },
          { key: 'type', value: 'mouse' },
          { key: 'connectivity', value: 'wired' },
        ],
      },
      {
        id: '02',
        label: 'mouse details',
        attributes: [
          { key: 'sensor', value: 'truemove air' },
          { key: 'resolution', value: '18000 cpi' },
          { key: 'weight', value: '66g' },
        ],
      },
    ],
    categoryId: categoryIds['peripherals'],
  },

  {
    name: 'ROG Raikiri II Wireless Controller',
    slug: 'rog-raikiri-ii-wireless',
    price: 169.0,
    quantity: 15,
    specification: [
      {
        id: '01',
        label: 'global filters',
        attributes: [
          { key: 'manufacturer', value: 'asus rog' },
          { key: 'type', value: 'controller' },
          { key: 'connectivity', value: 'wireless' },
        ],
      },
      {
        id: '02',
        label: 'controller details',
        attributes: [
          { key: 'platform', value: 'xbox & pc' },
          { key: 'display', value: '1.3" oled' },
          { key: 'triggers', value: 'selectable step' },
        ],
      },
    ],
    categoryId: categoryIds['peripherals'],
  },
]
