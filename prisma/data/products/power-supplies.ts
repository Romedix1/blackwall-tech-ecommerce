export const getPowerSupplies = (categoryIds: Record<string, string>) => [
  {
    name: 'Seasonic PRIME TX-1300 ATX 3.0',
    slug: 'seasonic-prime-tx-1300',
    price: 459.0,
    quantity: 0,
    technical: {
      wattage: 1300,
      efficiency: '80 plus titanium',
      formFactor: 'atx',
      atx3_0: true,
      modularity: 'full',
      length: 210,
    },
    specification: [
      {
        id: '01',
        label: 'performance',
        attributes: [
          { key: 'power', value: '1300 W' },
          { key: 'efficiency', value: '80 Plus Titanium' },
          { key: 'standard', value: 'ATX 3.0 / PCIe 5.0' },
        ],
      },
    ],
    categoryId: categoryIds['psu'],
  },
  {
    name: 'be quiet! Dark Power 13 1000W',
    slug: 'be-quiet-dark-power-13',
    price: 289.0,
    quantity: 0,
    technical: {
      wattage: 1000,
      efficiency: '80 plus titanium',
      formFactor: 'atx',
      atx3_0: true,
      modularity: 'full',
      length: 175,
    },
    specification: [
      {
        id: '01',
        label: 'acoustics',
        attributes: [
          { key: 'fan', value: 'Silent Wings 135mm' },
          { key: 'noise level', value: 'Under 25 dB(A)' },
        ],
      },
    ],
    categoryId: categoryIds['psu'],
  },
  {
    name: 'Corsair RM1000x Shift',
    slug: 'corsair-rm1000x-shift',
    price: 209.0,
    quantity: 0,
    technical: {
      wattage: 1000,
      efficiency: '80 plus gold',
      formFactor: 'atx',
      atx3_0: true,
      modularity: 'full',
      length: 180,
      special: 'side interface',
    },
    specification: [
      {
        id: '01',
        label: 'design',
        attributes: [
          { key: 'connector location', value: 'Side Interface' },
          { key: 'modularity', value: 'Fully Modular' },
        ],
      },
    ],
    categoryId: categoryIds['psu'],
  },
  {
    name: 'EVGA SuperNOVA 1000 G7',
    slug: 'evga-supernova-1000-g7',
    price: 189.0,
    quantity: 0,
    technical: {
      wattage: 1000,
      efficiency: '80 plus gold',
      formFactor: 'atx',
      atx3_0: false,
      modularity: 'full',
      length: 130,
    },
    specification: [
      {
        id: '01',
        label: 'general',
        attributes: [
          { key: 'length', value: '130 mm' },
          { key: 'warranty', value: '10 years' },
        ],
      },
    ],
    categoryId: categoryIds['psu'],
  },
]
