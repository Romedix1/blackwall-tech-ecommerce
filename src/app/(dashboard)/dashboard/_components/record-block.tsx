import { cn, getStatusTextColor } from '@/lib'
import Link from 'next/link'

type RecordType = {
  id: string
  status: string
  createdAt: Date
}

type OrderBlockProps = {
  record: RecordType
  type: 'build' | 'order'
}

export const RecordBlock = ({ record, type }: OrderBlockProps) => {
  const getStatusData = (status: string) => {
    const statusMap: Record<string, { label: string; color: string }> = {
      pending: { label: 'AWAITING_HANDSHAKE', color: 'text-blue-400' },
      paid: { label: 'CREDITS_AUTHORIZED', color: 'text-cyan-400' },
      shipped: { label: 'IN_TRANSIT', color: 'text-amber-200' },
      complete: { label: 'OPERATION_SUCCESSFUL', color: 'text-accent' },
      failed: { label: 'LINK_ABORTED', color: 'text-error-text' },
      cancelled: { label: 'SESSION_TERMINATED', color: 'text-text-second/80' },
    }

    return (
      statusMap[status] ?? {
        label: 'UNKNOWN_LOG_ENTRY',
        color: 'text-zinc-400',
      }
    )
  }

  const getETA = (createdAt: Date) => {
    const deliveryDate = new Date(createdAt)
    deliveryDate.setDate(deliveryDate.getDate() + 3)

    const now = new Date()
    const diffTime = deliveryDate.getTime() - now.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

    return diffDays > 0 ? `${diffDays}_days` : 'Delivered'
  }

  const status = getStatusData(record.status)

  return (
    <li key={record.id}>
      <Link
        href={'/'}
        className="bg-surface flex flex-col gap-2.5 border p-4 lg:flex-row lg:justify-between lg:gap-10 lg:p-6"
      >
        <p className="truncate text-xs uppercase lg:text-sm 2xl:text-base">
          <span className="mr-2" aria-hidden="true">
            &gt;
          </span>
          Directive: {type === 'build' ? 'configuration' : 'order'} #{record.id}
        </p>

        <p
          className={cn(
            'text-xs break-all uppercase lg:text-sm 2xl:text-base',
            type === 'build' ? getStatusTextColor(record.status) : status.color,
          )}
        >
          {type === 'order' ? (
            <>
              <span className="mr-2" aria-hidden="true">
                &gt;
              </span>
              Status: {status.label}
              <span aria-hidden="true">(Eta: {getETA(record.createdAt)})</span>
              <span className="sr-only">
                Estimated time of arrival: {getETA(record.createdAt)}
              </span>
            </>
          ) : (
            <>
              <span className="mr-2" aria-hidden="true">
                &gt;
              </span>
              Status: {record.status}
            </>
          )}
        </p>
      </Link>
    </li>
  )
}
