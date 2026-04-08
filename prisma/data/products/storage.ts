export const getStorage = (categoryIds: Record<string, string>) => [
  {
    name: 'Samsung 990 Pro',
    slug: 'samsung-990-pro-2tb',
    badge: 'performance king',
    price: 179.99,
    quantity: 15,
    technical: {
      capacity: '2 TB',
      type: 'NVMe SSD',
      interface: 'PCIe 4.0 x4',
      readSpeed: '7450',
      writeSpeed: '6900',
      formFactor: 'M.2 2280',
    },
    specification: [
      {
        id: '01',
        label: 'performance',
        attributes: [
          { key: 'sequential read', value: '7450 MB/s' },
          { key: 'sequential write', value: '6900 MB/s' },
          { key: 'random read', value: '1.4M IOPS' },
        ],
      },
      {
        id: '02',
        label: 'physical',
        attributes: [
          { key: 'capacity', value: '2000 GB' },
          { key: 'interface', value: 'M.2 PCIe NVMe Gen 4' },
          { key: 'heatsink', value: 'no' },
        ],
      },
    ],
    categoryId: categoryIds['storage'],
  },
  {
    name: 'Crucial T705 Gen5',
    slug: 'crucial-t705-1tb',
    badge: 'next gen',
    price: 239.0,
    quantity: 8,
    technical: {
      capacity: '1 TB',
      type: 'NVMe SSD',
      interface: 'PCIe 5.0 x4',
      readSpeed: '14500',
      writeSpeed: '12700',
      formFactor: 'M.2 2280',
    },
    specification: [
      {
        id: '01',
        label: 'extreme speed',
        attributes: [
          { key: 'interface', value: 'PCIe Gen 5.0 x4' },
          { key: 'max read', value: '14500 MB/s' },
          { key: 'max write', value: '12700 MB/s' },
        ],
      },
    ],
    categoryId: categoryIds['storage'],
  },
  {
    name: 'WD Blue SA510',
    slug: 'wd-blue-sa510-1tb',
    badge: 'budget sata',
    price: 65.0,
    quantity: 40,
    technical: {
      capacity: '1 TB',
      type: 'SATA SSD',
      interface: 'SATA III',
      readSpeed: '560',
      writeSpeed: '520',
      formFactor: '2.5 inch',
    },
    specification: [
      {
        id: '01',
        label: 'standard speed',
        attributes: [
          { key: 'interface', value: 'SATA III' },
          { key: 'read', value: '560 MB/s' },
        ],
      },
    ],
    categoryId: categoryIds['storage'],
  },
  {
    name: 'Kingston NV2',
    slug: 'kingston-nv2-2tb',
    badge: 'best value',
    price: 109.0,
    quantity: 32,
    technical: {
      capacity: '2 TB',
      type: 'NVMe SSD',
      interface: 'PCIe 4.0 x4',
      readSpeed: '3500',
      writeSpeed: '2800',
      formFactor: 'M.2 2280',
    },
    specification: [
      {
        id: '01',
        label: 'performance',
        attributes: [
          { key: 'type', value: 'NVMe PCIe Gen 4.0' },
          { key: 'read', value: '3500 MB/s' },
        ],
      },
    ],
    categoryId: categoryIds['storage'],
  },
]
