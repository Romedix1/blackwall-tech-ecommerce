export const getGraphicsCards = (categoryIds: Record<string, string>) => [
  {
    name: 'GeForce RTX 5070 Windforce OC',
    slug: 'geforce-rtx-5070-wf-oc',
    badge: 'new gen',
    price: 3499.0,
    quantity: 12,
    specification: [
      {
        id: '01',
        label: 'core engine',
        attributes: [
          { key: 'manufacturer', value: 'nvidia' },
          { key: 'series', value: 'rtx 50' },
          { key: 'chipset', value: 'rtx 5070' },
          { key: 'core units', value: '6144' },
          { key: 'upscaling', value: 'dlss 4' },
        ],
      },
      {
        id: '02',
        label: 'memory subsystem',
        attributes: [
          { key: 'memory size', value: '12 gb' },
          { key: 'memory type', value: 'gddr7' },
          { key: 'memory bus', value: '192 bit' },
        ],
      },
      {
        id: '03',
        label: 'connectivity',
        attributes: [
          { key: 'interface', value: 'pcie 5.0' },
          { key: 'power connector', value: '16-pin' },
          { key: 'recommended psu', value: '750 w' },
        ],
      },
    ],
    performance: [
      { gameName: 'cyberpunk 2077', settings: 'rt overdrive', fps: 145 },
      { gameName: 'alan wake 2', settings: 'path tracing', fps: 118 },
      { gameName: 'wukong', settings: 'cinematic', fps: 92 },
    ],
    categoryId: categoryIds['gpu'],
  },

  {
    name: 'GeForce RTX 4070 Super Dual',
    slug: 'geforce-rtx-4070-super',
    badge: 'stable',
    price: 2849.0,
    quantity: 24,
    specification: [
      {
        id: '01',
        label: 'core engine',
        attributes: [
          { key: 'manufacturer', value: 'nvidia' },
          { key: 'series', value: 'rtx 40' },
          { key: 'chipset', value: 'rtx 4070 super' },
          { key: 'core units', value: '7168' },
          { key: 'upscaling', value: 'dlss 3.5' },
        ],
      },
      {
        id: '02',
        label: 'memory subsystem',
        attributes: [
          { key: 'memory size', value: '12 gb' },
          { key: 'memory type', value: 'gddr6x' },
          { key: 'memory bus', value: '192 bit' },
        ],
      },
      {
        id: '03',
        label: 'connectivity',
        attributes: [
          { key: 'interface', value: 'pcie 4.0' },
          { key: 'power connector', value: '16-pin' },
          { key: 'recommended psu', value: '650 w' },
        ],
      },
    ],
    performance: [
      { gameName: 'cyberpunk 2077', settings: 'rt ultra', fps: 105 },
      { gameName: 'alan wake 2', settings: 'rt high', fps: 88 },
      { gameName: 'wukong', settings: 'ultra', fps: 74 },
    ],
    categoryId: categoryIds['gpu'],
  },

  {
    name: 'GeForce RTX 4090 Phantom',
    slug: 'geforce-rtx-4090',
    badge: 'enthusiast',
    price: 8999.0,
    quantity: 5,
    specification: [
      {
        id: '01',
        label: 'core engine',
        attributes: [
          { key: 'manufacturer', value: 'nvidia' },
          { key: 'series', value: 'rtx 40' },
          { key: 'chipset', value: 'rtx 4090' },
          { key: 'core units', value: '16384' },
          { key: 'upscaling', value: 'dlss 3.5' },
        ],
      },
      {
        id: '02',
        label: 'memory subsystem',
        attributes: [
          { key: 'memory size', value: '24 gb' },
          { key: 'memory type', value: 'gddr6x' },
          { key: 'memory bus', value: '384 bit' },
        ],
      },
      {
        id: '03',
        label: 'connectivity',
        attributes: [
          { key: 'interface', value: 'pcie 4.0' },
          { key: 'power connector', value: '16-pin' },
          { key: 'recommended psu', value: '1000 w' },
        ],
      },
    ],
    performance: [
      { gameName: 'cyberpunk 2077', settings: 'rt overdrive', fps: 162 },
      { gameName: 'alan wake 2', settings: 'path tracing', fps: 134 },
      { gameName: 'wukong', settings: 'cinematic', fps: 110 },
    ],
    categoryId: categoryIds['gpu'],
  },

  {
    name: 'Radeon RX 7900 XTX Phantom Gaming',
    slug: 'radeon-rx-7900-xtx',
    badge: 'amd elite',
    price: 4599.0,
    quantity: 9,
    specification: [
      {
        id: '01',
        label: 'core engine',
        attributes: [
          { key: 'manufacturer', value: 'amd' },
          { key: 'series', value: 'rx 7000' },
          { key: 'chipset', value: 'rx 7900 xtx' },
          { key: 'core units', value: '6144' },
          { key: 'upscaling', value: 'fsr 3.1' },
        ],
      },
      {
        id: '02',
        label: 'memory subsystem',
        attributes: [
          { key: 'memory size', value: '24 gb' },
          { key: 'memory type', value: 'gddr6' },
          { key: 'memory bus', value: '384 bit' },
        ],
      },
      {
        id: '03',
        label: 'connectivity',
        attributes: [
          { key: 'interface', value: 'pcie 4.0' },
          { key: 'power connector', value: '3x 8-pin' },
          { key: 'recommended psu', value: '850 w' },
        ],
      },
    ],
    performance: [
      { gameName: 'cyberpunk 2077', settings: 'raster ultra', fps: 158 },
      { gameName: 'flight simulator', settings: 'ultra', fps: 122 },
      { gameName: 'wukong', settings: 'cinematic', fps: 84 },
    ],
    categoryId: categoryIds['gpu'],
  },
]
