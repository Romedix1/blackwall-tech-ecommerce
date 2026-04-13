export const getPowerSupplies = (categoryIds: Record<string, string>) => [
  {
    name: 'Seasonic PRIME TX-1300 ATX 3.0',
    slug: 'seasonic-prime-tx-1300',
    price: 459.0,
    quantity: 50,
    technical: {
      wattage: '1300',
      efficiency: '80 plus titanium',
      formFactor: 'atx',
      atx3_0: true,
      modularity: 'full',
      length: '210',
    },
    specification: [
      {
        id: '01',
        label: 'performance',
        attributes: [
          { key: 'total power', value: '1300 W' },
          { key: 'efficiency', value: '80 Plus Titanium' },
          { key: 'standard', value: 'ATX 3.0 / PCIe 5.0' },
        ],
      },
      {
        id: '02',
        label: 'design',
        attributes: [
          { key: 'modularity', value: 'fully modular' },
          { key: 'form factor', value: 'atx' },
          { key: 'length', value: '210 mm' },
        ],
      },
    ],
    categoryId: categoryIds['psu'],
  },
  {
    name: 'be quiet! Dark Power 13 1000W',
    slug: 'be-quiet-dark-power-13',
    price: 289.0,
    quantity: 50,
    technical: {
      wattage: '1000',
      efficiency: '80 plus titanium',
      formFactor: 'atx',
      atx3_0: true,
      modularity: 'full',
      length: '175',
    },
    specification: [
      {
        id: '01',
        label: 'performance',
        attributes: [
          { key: 'total power', value: '1000 W' },
          { key: 'efficiency', value: '80 Plus Titanium' },
        ],
      },
      {
        id: '02',
        label: 'acoustics',
        attributes: [
          { key: 'fan', value: 'Silent Wings 135mm' },
          { key: 'noise level', value: 'extremely silent' },
        ],
      },
      {
        id: '03',
        label: 'features',
        attributes: [
          { key: 'topology', value: 'Full Bridge + LLC' },
          { key: 'atx version', value: '3.0' },
        ],
      },
    ],
    categoryId: categoryIds['psu'],
  },
  {
    name: 'Corsair RM1000x Shift',
    slug: 'corsair-rm1000x-shift',
    price: 209.0,
    quantity: 50,
    technical: {
      wattage: '1000',
      efficiency: '80 plus gold',
      formFactor: 'atx',
      atx3_0: true,
      modularity: 'full',
      length: '180',
      special: 'side interface',
    },
    specification: [
      {
        id: '01',
        label: 'performance',
        attributes: [
          { key: 'total power', value: '1000 W' },
          { key: 'efficiency', value: '80 Plus Gold' },
        ],
      },
      {
        id: '02',
        label: 'innovations',
        attributes: [
          { key: 'connector location', value: 'Side Interface' },
          { key: 'cables', value: 'Type 5 Gen 1' },
        ],
      },
      {
        id: '03',
        label: 'physical',
        attributes: [
          { key: 'length', value: '180 mm' },
          { key: 'capacitor type', value: 'Japanese 105°C' },
        ],
      },
    ],
    categoryId: categoryIds['psu'],
  },
  {
    name: 'EVGA SuperNOVA 1000 G7',
    slug: 'evga-supernova-1000-g7',
    price: 189.0,
    quantity: 50,
    technical: {
      wattage: '1000',
      efficiency: '80 plus gold',
      formFactor: 'atx',
      atx3_0: false,
      modularity: 'full',
      length: '130',
    },
    specification: [
      {
        id: '01',
        label: 'performance',
        attributes: [
          { key: 'total power', value: '1000 W' },
          { key: 'efficiency', value: '80 Plus Gold' },
        ],
      },
      {
        id: '02',
        label: 'compact design',
        attributes: [
          { key: 'length', value: '130 mm (Ultra Compact)' },
          { key: 'fan size', value: '120 mm FDB' },
        ],
      },
      {
        id: '03',
        label: 'protection',
        attributes: [
          { key: 'warranty', value: '10 years' },
          { key: 'safety', value: 'OVP, UVP, OCP, OPP, SCP, OTP' },
        ],
      },
    ],
    categoryId: categoryIds['psu'],
  },
]
