export const getMotherboards = (categoryIds: Record<string, string>) => [
  {
    name: 'ASUS ROG Maximus Z890 Hero',
    slug: 'asus-rog-maximus-z890-hero',
    price: 799.0,
    quantity: 0,
    technical: {
      socket: 'lga1851',
      chipset: 'z890',
      ramGen: 'ddr5',
      formFactor: 'atx',
      pcieGen: '5.0',
      m2Slots: '5',
    },
    specification: [
      {
        id: '01',
        label: 'platform',
        attributes: [
          { key: 'socket', value: 'lga 1851' },
          { key: 'chipset', value: 'intel z890' },
          { key: 'memory', value: 'ddr5 (8000+ mt/s)' },
        ],
      },
      {
        id: '02',
        label: 'expansion',
        attributes: [
          { key: 'pcie version', value: '5.0 x16' },
          { key: 'm.2 slots', value: '5x (1x pcie 5.0)' },
        ],
      },
    ],
    categoryId: categoryIds['motherboards'],
  },
  {
    name: 'MSI MAG X870E Tomahawk WiFi',
    slug: 'msi-mag-x870e-tomahawk',
    price: 349.0,
    quantity: 0,
    technical: {
      socket: 'am5',
      chipset: 'x870e',
      ramGen: 'ddr5',
      formFactor: 'atx',
      pcieGen: '5.0',
      m2Slots: '4',
    },
    specification: [
      {
        id: '01',
        label: 'platform',
        attributes: [
          { key: 'socket', value: 'am5' },
          { key: 'chipset', value: 'amd x870e' },
          { key: 'power phase', value: '14+2+1' },
        ],
      },
    ],
    categoryId: categoryIds['motherboards'],
  },
  {
    name: 'Gigabyte Z890 AORUS ELITE WiFi7',
    slug: 'gigabyte-z890-aorus-elite',
    price: 429.0,
    quantity: 0,
    technical: {
      socket: 'lga1851',
      chipset: 'z890',
      ramGen: 'ddr5',
      formFactor: 'atx',
      pcieGen: '5.0',
      m2Slots: '4',
    },
    specification: [
      {
        id: '01',
        label: 'connectivity',
        attributes: [
          { key: 'wifi', value: 'wifi 7' },
          { key: 'lan', value: '5 gbe' },
          { key: 'usb', value: 'usb4 / thunderbolt 4' },
        ],
      },
    ],
    categoryId: categoryIds['motherboards'],
  },
  {
    name: 'ASRock X870 Steel Legend',
    slug: 'asrock-x870-steel-legend',
    price: 299.0,
    quantity: 0,
    technical: {
      socket: 'am5',
      chipset: 'x870',
      ramGen: 'ddr5',
      formFactor: 'atx',
      pcieGen: '5.0',
      m2Slots: '3',
    },
    specification: [
      {
        id: '01',
        label: 'general',
        attributes: [
          { key: 'form factor', value: 'atx' },
          { key: 'audio', value: 'realtek alc4082' },
        ],
      },
    ],
    categoryId: categoryIds['motherboards'],
  },
]
