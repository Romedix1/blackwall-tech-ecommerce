'use client'

import { DeleteModal } from '@/app/dashboard/(dashboard)/_components/delete-modal'
import { ShareModal } from '@/components/shared'
import { Button } from '@/components/ui'
import { cn, getStatusTextColor } from '@/lib'
import { getStatusData } from '@/lib/dashboard'
import Link from 'next/link'
import { useState } from 'react'

type RecordType = {
  id: string
  status: string
  public: boolean
  name: string
  createdAt: Date
}

type OrderBlockProps = {
  record: RecordType
  type: 'build' | 'order'
}

export const RecordBlock = ({ record, type }: OrderBlockProps) => {
  const [isSharing, setIsSharing] = useState(false)
  const [isDeleting, setIsDeleting] = useState(true)

  const getETA = (createdAt: Date) => {
    const deliveryDate = new Date(createdAt)
    deliveryDate.setDate(deliveryDate.getDate() + 3)

    const now = new Date()
    const diffTime = deliveryDate.getTime() - now.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

    return diffDays > 0 ? `${diffDays}_days` : 'Delivered'
  }

  const status = getStatusData(record.status)

  if (isSharing) {
    return (
      <ShareModal
        buildId={record.id}
        initialIsPublic={record.public}
        onClose={() => setIsSharing(false)}
      />
    )
  }

  if (isDeleting) {
    return (
      <DeleteModal
        buildId={record.id}
        buildName={record.name}
        onClose={() => setIsDeleting(false)}
      />
    )
  }

  return (
    <li
      key={record.id}
      className="bg-surface hover:border-accent focus-within:border-accent border"
    >
      <Link
        href={
          type === 'order'
            ? `/dashboard/order/${record.id}`
            : `/pc-builder/cpu/${record.id}`
        }
        className="mb-6 flex flex-col gap-2.5 p-4 outline-0 lg:flex-row lg:justify-between lg:gap-10 lg:p-6"
      >
        <p className="truncate text-xs uppercase lg:text-sm 2xl:text-base">
          <span className="mr-2" aria-hidden="true">
            &gt;
          </span>
          Directive:{' '}
          {type === 'build'
            ? `configuration ${record.name}`
            : `order #${record.id}`}
        </p>

        <p
          className={cn(
            'text-xs break-all uppercase lg:text-sm 2xl:text-base',
            type === 'build'
              ? `${getStatusTextColor(record.status)}`
              : `text-${status.color}`,
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

      {type === 'build' && (
        <div className="flex flex-col gap-4 p-4 pt-0 sm:flex-row lg:p-6 lg:pt-0">
          <Button onClick={() => setIsSharing(true)}>
            <span className="sr-only">Share build</span>
            <span aria-hidden="true">[ Broadcast ]</span>
          </Button>

          <Button variant="delete" onClick={() => setIsDeleting(true)}>
            <span className="sr-only">Delete build</span>
            <span aria-hidden="true">[ Wipe ]</span>
          </Button>
        </div>
      )}
    </li>
  )
}
