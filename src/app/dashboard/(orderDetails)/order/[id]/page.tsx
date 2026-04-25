import {
  MissingData,
  OrderDetailsHeader,
} from '@/app/dashboard/(orderDetails)/order/[id]/_components'
import { auth } from '@/auth'
import { cn } from '@/lib'
import { getStatusData } from '@/lib/dashboard'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'

type OrderDetailsPageProps = {
  params: Promise<{
    id: string
  }>
}
export default async function orderDetailsPage({
  params,
}: OrderDetailsPageProps) {
  const session = await auth()

  if (!session) redirect('/login')

  const { id: orderId } = await params

  if (!orderId) {
    const traceId = Math.random().toString(36).substring(7)
    return <MissingData type="id" traceId={traceId} />
  }

  const order = await prisma.order.findUnique({
    where: { id: orderId, AND: { userId: session.user.id } },
    select: {
      email: true,
      fullName: true,
      phoneNumber: true,
      totalAmount: true,
      address: true,
      zipCode: true,
      status: true,
      createdAt: true,
      items: {
        select: {
          name: true,
          quantity: true,
          price: true,
          productId: true,
        },
      },
    },
  })

  if (!order) {
    const traceId = Math.random().toString(36).substring(7)
    return <MissingData type="order" traceId={traceId} orderId={orderId} />
  }

  const productIds = order.items.map((item) => item.productId)

  const products = await prisma.product.findMany({
    where: {
      id: { in: productIds },
    },
    select: {
      id: true,
      category: { select: { name: true } },
    },
  })

  const orderWithCategories = {
    ...order,
    items: order.items.map((item) => {
      const matchingProduct = products.find(
        (product) => product.id === item.productId,
      )

      return {
        id: item.productId,
        name: item.name,
        quantity: item.quantity,
        price: item.price,
        category: matchingProduct?.category.name || 'Hardware_Component',
      }
    }),
  }

  const STATUS_THEMES = {
    'blue-400': {
      border: 'border-blue-400/70',
      bg: 'bg-blue-400/15',
      indicator: 'bg-blue-400',
      text: 'text-blue-400',
    },
    'cyan-400': {
      border: 'border-cyan-400/70',
      bg: 'bg-cyan-400/15',
      indicator: 'bg-cyan-400',
      text: 'text-cyan-400',
    },
    accent: {
      border: 'border-accent/70',
      bg: 'bg-accent/15',
      indicator: 'bg-accent',
      text: 'text-accent',
    },
    'error-text': {
      border: 'border-error-text/70',
      bg: 'bg-error-text/15',
      indicator: 'bg-error-text',
      text: 'text-error-text',
    },
    'zinc-400': {
      border: 'border-zinc-500/70',
      bg: 'bg-zinc-500/15',
      indicator: 'bg-zinc-500',
      text: 'text-zinc-500',
    },
  } as const

  const status = getStatusData(orderWithCategories.status)
  const theme =
    STATUS_THEMES[status.color as keyof typeof STATUS_THEMES] ??
    STATUS_THEMES['zinc-400']

  const formattedDate = orderWithCategories.createdAt
    .toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    })
    .toUpperCase()

  return (
    <>
      <header
        className={cn(
          'bg-surface/80 mb-8 border-l-4 p-6 lg:border-l-6',
          theme.border,
        )}
      >
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <p className="text-text-second mb-1 text-xs uppercase lg:text-sm">
              <span aria-hidden="true">Procurement_Manifest</span>
              <span className="sr-only">Order Details Manifest</span>
            </p>
            <h1 className="text-2xl font-black tracking-tighter break-all uppercase md:text-3xl">
              <span className="sr-only">Order Identification Number:</span>
              <span aria-hidden="true">#</span>
              {orderId}
            </h1>
          </div>
          <div className="flex flex-col items-start md:items-end">
            <p className="text-text-second mb-2 text-xs uppercase lg:text-sm">
              <span aria-hidden="true">Status_Registry</span>
              <span className="sr-only">Current System Status</span>
            </p>
            <div
              role="status"
              className={cn(
                'flex items-center gap-2 border px-4 py-1',
                theme.border,
                theme.bg,
              )}
            >
              <span
                aria-hidden="true"
                className={cn(
                  'h-2 w-2 animate-pulse rounded-full',
                  theme.indicator,
                )}
              />
              <span
                className={cn(
                  'text-xs font-bold uppercase lg:text-sm',
                  theme.text,
                )}
              >
                {orderWithCategories.status}
              </span>
            </div>
          </div>
        </div>
      </header>

      <div className="grid gap-8 lg:grid-cols-12">
        <aside className="flex flex-col gap-4 lg:col-span-4">
          <section
            className="bg-surface border p-5"
            aria-labelledby="customer-uplink-title"
          >
            <OrderDetailsHeader level={3}>
              <span aria-hidden="true">{'//'} Customer_Uplink</span>
              <span className="sr-only">Customer Contact Information</span>
            </OrderDetailsHeader>

            <dl className="mt-4 flex flex-col gap-4">
              <div>
                <OrderDetailsHeader level={4}>
                  <span aria-hidden="true">Subject_Identity</span>
                  <span className="sr-only">Full Name</span>
                </OrderDetailsHeader>

                <dd className="text-sm break-all lg:text-base">
                  {orderWithCategories.fullName}
                </dd>
              </div>
              <div>
                <OrderDetailsHeader level={4}>
                  <span aria-hidden="true">Comm_Channel</span>
                  <span className="sr-only">Contact Details</span>
                </OrderDetailsHeader>

                <dd className="text-sm break-all lg:text-base">
                  <span className="sr-only">Email: </span>
                  {orderWithCategories.email}
                </dd>
                <dd className="text-text-second mt-1 text-xs lg:text-sm">
                  <span className="sr-only">Phone Number: </span>
                  {orderWithCategories.phoneNumber}
                </dd>
              </div>
            </dl>
          </section>

          <section
            className="bg-surface border p-5"
            aria-labelledby="drop-point-title"
          >
            <OrderDetailsHeader level={3} id="drop-point-title">
              <span aria-hidden="true">{'//'} </span>Drop_Point_Coordinates
              <span className="sr-only">Shipping Address</span>
            </OrderDetailsHeader>

            <div className="mt-4">
              <address className="not-italic">
                <dl>
                  <dt className="sr-only">Street Address</dt>
                  <dd className="text-sm leading-relaxed">
                    {orderWithCategories.address}
                  </dd>
                  <dt className="sr-only">Postal Code</dt>
                  <dd className="text-accent mt-2 text-sm font-bold lg:text-base">
                    {orderWithCategories.zipCode}
                  </dd>
                </dl>
              </address>

              <div className="mt-6 border-t border-white/5 pt-4">
                <p className="text-text-second flex items-center gap-2 text-[10px] uppercase">
                  <span
                    className="bg-accent h-1 w-1 animate-ping rounded-full"
                    aria-hidden="true"
                  />
                  <span aria-hidden="true">Geo_validation: passed</span>
                  <span className="sr-only">
                    Geographical location verified successfully
                  </span>
                </p>
              </div>
            </div>
          </section>
        </aside>

        <div className="lg:col-span-8">
          <section
            aria-labelledby="manifest-listing-title"
            className="bg-surface border"
          >
            <div className="bg-text-main/5 border-b p-3 sm:px-6">
              <OrderDetailsHeader level={3} id="manifest-listing-title">
                <span aria-hidden="true">{'//'} </span>
                Manifest_Inventory_Listing
                <span className="sr-only">List of purchased items</span>
              </OrderDetailsHeader>
            </div>

            <div className="mt-2">
              <table className="w-full border-collapse">
                <thead className="text-text-second hidden text-xs uppercase sm:table-header-group lg:text-sm">
                  <tr className="border-b">
                    <th className="p-4 text-left font-medium sm:px-6">
                      <span aria-hidden="true">Unit_Description</span>
                      <span className="sr-only">Unit description</span>
                    </th>
                    <th className="p-4 text-center font-medium sm:px-6">
                      <span aria-hidden="true">Qty</span>
                      <span className="sr-only">Quantity</span>
                    </th>
                    <th className="p-4 text-right font-medium sm:px-6">
                      <span aria-hidden="true">Unit_Value</span>
                      <span className="sr-only">Unit value</span>
                    </th>
                    <th className="p-4 text-right font-medium sm:px-6">
                      <span aria-hidden="true">Serial_Hash</span>
                      <span className="sr-only">Product id</span>
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-border block divide-y sm:table-row-group">
                  {orderWithCategories.items.map((item) => (
                    <tr
                      key={item.id}
                      className="group hover:bg-accent/15 flex flex-col p-4 sm:table-row sm:p-0"
                    >
                      <td className="pb-2 sm:px-6 sm:py-5">
                        <p className="group-hover:text-accent text-sm font-bold tracking-tight uppercase lg:text-base">
                          {item.name}
                        </p>
                        <p className="text-text-second mt-1 text-xs lg:text-sm">
                          <span aria-hidden="true">Type: {item.category}</span>
                          <span className="sr-only">
                            Category: {item.category.replace('_', ' ')}
                          </span>
                        </p>
                      </td>

                      <td className="my-2 pb-2 sm:px-2 sm:py-5 sm:text-center">
                        <p className="inline-block text-xs font-bold lg:text-base">
                          <span className="sr-only">
                            Quantity: {item.quantity}
                          </span>
                          <span aria-hidden="true">
                            <span className="sm:hidden">Quantity: </span>[{' '}
                            {item.quantity} ]
                          </span>
                        </p>
                      </td>

                      <td className="my-2 pb-2 uppercase sm:px-6 sm:py-5 sm:text-right">
                        <p className="text-accent font-mono text-sm lg:text-base">
                          <span className="sm:hidden">Price: </span>
                          <span className="inline-block">
                            $ {item.price.toFixed(2)}
                          </span>
                        </p>
                      </td>

                      <td className="sm:px-6 sm:py-5 sm:text-right">
                        <div
                          aria-hidden="true"
                          className="text-text-second mb-1 text-xs uppercase opacity-50 sm:hidden lg:text-sm"
                        >
                          Serial_Hash:
                        </div>
                        <p className="text-text-second text-sm break-all lg:text-base">
                          <span className="sr-only">
                            Product Serial Number:
                          </span>
                          {item.id.toUpperCase()}
                        </p>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="border-accent/20 bg-accent/5 border-t p-6 sm:p-8">
              <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                <div>
                  <h4 className="text-text-second text-center text-sm uppercase sm:text-left lg:text-base">
                    <span aria-hidden="true">Grand_Total_Value</span>
                    <span className="sr-only">Total Order Value</span>
                  </h4>
                  <p className="text-text-second/60 mt-1 text-center text-xs sm:text-left lg:text-sm">
                    <span aria-hidden="true">
                      Currency: USD // Encrypted_Tx
                    </span>
                    <span className="sr-only">
                      Transaction Currency: US Dollars. Secure transaction.
                    </span>
                  </p>
                </div>
                <div className="text-center sm:text-right">
                  <span className="text-accent text-3xl font-black tracking-tighter">
                    {orderWithCategories.totalAmount.toFixed(2)}
                  </span>
                  <span className="text-accent ml-2 text-xs font-bold lg:text-sm">
                    USD
                  </span>
                </div>
              </div>
            </div>
          </section>

          <section className="text-text-second/70 mt-6 flex flex-col justify-between gap-2 px-2 text-center text-xs uppercase sm:flex-row sm:text-left lg:text-sm">
            <p>
              <span aria-hidden="true">Generated: </span>
              <span className="sr-only">Order generated on: </span>
              {formattedDate}
            </p>
            <p>
              <span aria-hidden="true">Blackwall_Secure_Terminal v1.0.4</span>
              <span className="sr-only">
                Secure Terminal System Version 1.0.4
              </span>
            </p>
          </section>
        </div>
      </div>
    </>
  )
}
