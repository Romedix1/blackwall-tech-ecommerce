export const getProcessors = (categoryIds: Record<string, string>) => [
  {
    name: 'AMD Ryzen 9 7950X',
    slug: 'amd-ryzen-9-7950x',
    badge: 'zen 4 flagship',
    price: 549.0,
    quantity: 10,
    technical: {
      socket: 'am5',
      ramGen: ['ddr5'],
      cores: '16',
      threads: '32',
      tdp: '170',
      maxTdp: '230',
      integratedGraphics: true,
    },
    specification: [
      {
        id: '01',
        label: 'core engine',
        attributes: [
          { key: 'manufacturer', value: 'amd' },
          { key: 'series', value: 'ryzen 7000' },
          { key: 'chipset', value: 'zen 4' },
          { key: 'core units', value: '16' },
          { key: 'threads', value: '32' },
        ],
      },
      {
        id: '02',
        label: 'platform info',
        attributes: [
          { key: 'socket', value: 'am5' },
          { key: 'memory type', value: 'ddr5' },
          { key: 'pcie lane', value: '5.0' },
        ],
      },
      {
        id: '03',
        label: 'thermal dynamics',
        attributes: [
          { key: 'base tdp', value: '170 w' },
          { key: 'max temp', value: '95 c' },
        ],
      },
    ],
    performance: [
      { gameName: 'cyberpunk 2077', settings: 'cpu heavy', fps: 185 },
      { gameName: 'starfield', settings: 'ultra', fps: 92 },
      { gameName: 'cinebench r23', settings: 'multi-core', fps: 38500 },
    ],
    categoryId: categoryIds['cpu'],
  },
  {
    name: 'Intel Core Ultra 9 285K',
    slug: 'intel-core-ultra-9-285k',
    badge: 'ai ready',
    price: 629.0,
    quantity: 5,
    technical: {
      socket: 'lga1851',
      ramGen: ['ddr5'],
      cores: '24',
      threads: '24',
      tdp: '125',
      maxTdp: '250',
      integratedGraphics: true,
    },
    specification: [
      {
        id: '01',
        label: 'core engine',
        attributes: [
          { key: 'manufacturer', value: 'intel' },
          { key: 'series', value: 'core ultra 200s' },
          { key: 'chipset', value: 'arrow lake' },
          { key: 'core units', value: '24' },
          { key: 'ai npu', value: 'intel ai boost' },
        ],
      },
      {
        id: '02',
        label: 'platform info',
        attributes: [
          { key: 'socket', value: 'lga 1851' },
          { key: 'memory type', value: 'ddr5' },
          { key: 'pcie lane', value: '5.0' },
        ],
      },
      {
        id: '03',
        label: 'thermal dynamics',
        attributes: [
          { key: 'base tdp', value: '125 w' },
          { key: 'max power', value: '250 w' },
        ],
      },
    ],
    performance: [
      { gameName: 'cyberpunk 2077', settings: 'cpu heavy', fps: 198 },
      { gameName: 'starfield', settings: 'ultra', fps: 105 },
      { gameName: 'cinebench r23', settings: 'multi-core', fps: 42500 },
    ],
    categoryId: categoryIds['cpu'],
  },

  {
    name: 'Intel Core i9-13900K',
    slug: 'intel-core-i9-13900k',
    price: 489.0,
    quantity: 7,
    technical: {
      socket: 'lga1700',
      ramGen: ['ddr4', 'ddr5'],
      cores: '24',
      threads: '32',
      tdp: '125',
      maxTdp: '253',
      integratedGraphics: true,
    },
    specification: [
      {
        id: '01',
        label: 'core engine',
        attributes: [
          { key: 'manufacturer', value: 'intel' },
          { key: 'series', value: '13th gen core' },
          { key: 'chipset', value: 'raptor lake' },
          { key: 'core units', value: '24' },
          { key: 'max boost', value: '5.8 ghz' },
        ],
      },
      {
        id: '02',
        label: 'platform info',
        attributes: [
          { key: 'socket', value: 'lga 1700' },
          { key: 'memory type', value: 'ddr5/ddr4' },
          { key: 'pcie lane', value: '5.0' },
        ],
      },
      {
        id: '03',
        label: 'thermal dynamics',
        attributes: [
          { key: 'base tdp', value: '125 w' },
          { key: 'max power', value: '253 w' },
        ],
      },
    ],
    performance: [
      { gameName: 'cyberpunk 2077', settings: 'cpu heavy', fps: 172 },
      { gameName: 'starfield', settings: 'ultra', fps: 88 },
      { gameName: 'cinebench r23', settings: 'multi-core', fps: 39200 },
    ],
    categoryId: categoryIds['cpu'],
  },

  {
    name: 'AMD Ryzen 9 PRO 7945',
    slug: 'amd-ryzen-9-pro-7945',
    price: 579.0,
    quantity: 3,
    technical: {
      socket: 'am5',
      ramGen: ['ddr5'],
      cores: '12',
      threads: '24',
      tdp: '65',
      maxTdp: '88',
      integratedGraphics: true,
    },
    specification: [
      {
        id: '01',
        label: 'core engine',
        attributes: [
          { key: 'manufacturer', value: 'amd' },
          { key: 'series', value: 'ryzen pro 7000' },
          { key: 'chipset', value: 'zen 4 pro' },
          { key: 'core units', value: '12' },
          { key: 'security', value: 'amd pro security' },
        ],
      },
      {
        id: '02',
        label: 'platform info',
        attributes: [
          { key: 'socket', value: 'am5' },
          { key: 'memory type', value: 'ddr5' },
          { key: 'ecc support', value: 'yes' },
        ],
      },
      {
        id: '03',
        label: 'thermal dynamics',
        attributes: [
          { key: 'base tdp', value: '65 w' },
          { key: 'efficiency', value: 'high' },
        ],
      },
    ],
    performance: [
      { gameName: 'cyberpunk 2077', settings: 'cpu heavy', fps: 155 },
      { gameName: 'compilation', settings: 'linux kernel', fps: 112 },
      { gameName: 'cinebench r23', settings: 'multi-core', fps: 28500 },
    ],
    categoryId: categoryIds['cpu'],
  },
]
