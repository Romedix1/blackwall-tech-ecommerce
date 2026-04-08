export const getMemory = (categoryIds: Record<string, string>) => [
  {
    name: 'G.Skill Trident Z5 CK Black',
    slug: 'gskill-trident-z5-ck-black',
    price: 269.0,
    quantity: 5,
    technical: {
      type: 'ddr5',
      speed: '8200',
      capacity: '48',
      modules: '2',
      profile: 'xmp',
      voltage: '1.35',
    },
    specification: [
      {
        id: '01',
        label: 'performance profile',
        attributes: [
          { key: 'manufacturer', value: 'g.skill' },
          { key: 'type', value: 'ddr5 cudimm' },
          { key: 'speed', value: '8200 mt/s' },
          { key: 'latency', value: 'cl40' },
        ],
      },
      {
        id: '02',
        label: 'capacity & tech',
        attributes: [
          { key: 'total capacity', value: '48 gb' },
          { key: 'module kit', value: '2 x 24 gb' },
          { key: 'profile', value: 'intel xmp 3.0' },
        ],
      },
    ],
    categoryId: categoryIds['memory'],
  },

  {
    name: 'T-Force XTREEM DDR5 White',
    slug: 't-force-xtreem-ddr5-white',
    badge: 'overclocking master',
    price: 389.0,
    quantity: 8,
    technical: {
      type: 'ddr5',
      speed: '6800',
      capacity: '96',
      modules: '2',
      profile: 'xmp',
      voltage: '1.4',
    },
    specification: [
      {
        id: '01',
        label: 'performance profile',
        attributes: [
          { key: 'manufacturer', value: 'teamgroup' },
          { key: 'type', value: 'ddr5' },
          { key: 'speed', value: '6800 mt/s' },
          { key: 'latency', value: 'cl36' },
        ],
      },
      {
        id: '02',
        label: 'design & build',
        attributes: [
          { key: 'total capacity', value: '96 gb' },
          { key: 'module kit', value: '2 x 48 gb' },
          { key: 'heatsink', value: '2mm white aluminum' },
        ],
      },
    ],
    categoryId: categoryIds['memory'],
  },

  {
    name: 'T-Force DELTA RGB DDR4 Black',
    slug: 't-force-delta-rgb-ddr4-black',
    price: 94.0,
    quantity: 20,
    technical: {
      type: 'ddr4',
      speed: '4000',
      capacity: '16',
      modules: '2',
      profile: 'xmp',
      voltage: '1.35',
    },
    specification: [
      {
        id: '01',
        label: 'legacy performance',
        attributes: [
          { key: 'manufacturer', value: 'teamgroup' },
          { key: 'type', value: 'ddr4' },
          { key: 'speed', value: '4000 mt/s' },
          { key: 'latency', value: 'cl20' },
        ],
      },
      {
        id: '02',
        label: 'visuals & capacity',
        attributes: [
          { key: 'total capacity', value: '16 gb' },
          { key: 'module kit', value: '2 x 8 gb' },
          { key: 'lighting', value: 'wide angle rgb' },
        ],
      },
    ],
    categoryId: categoryIds['memory'],
  },

  {
    name: 'G.Skill Flare X5 Black',
    slug: 'gskill-flare-x5-ddr5-black',
    price: 184.0,
    quantity: 15,
    technical: {
      type: 'ddr5',
      speed: '5200',
      capacity: '64',
      modules: '2',
      profile: 'expo',
      voltage: '1.25',
    },
    specification: [
      {
        id: '01',
        label: 'performance profile',
        attributes: [
          { key: 'manufacturer', value: 'g.skill' },
          { key: 'type', value: 'ddr5' },
          { key: 'speed', value: '5200 mt/s' },
          { key: 'latency', value: 'cl36' },
        ],
      },
      {
        id: '02',
        label: 'platform data',
        attributes: [
          { key: 'total capacity', value: '64 gb' },
          { key: 'module kit', value: '2 x 32 gb' },
          { key: 'profile', value: 'amd expo' },
        ],
      },
    ],
    categoryId: categoryIds['memory'],
  },
]
