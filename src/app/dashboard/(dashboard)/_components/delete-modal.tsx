'use client'

import { InformationModal } from '@/components/shared'
import { Button } from '@/components/ui'
import { deleteBuild } from '@/lib/actions'
import { useEffect, useRef, useState } from 'react'

type DeleteModalProps = {
  buildId: string
  buildName: string
  onClose: () => void
}

export const DeleteModal = ({
  buildId,
  buildName,
  onClose,
}: DeleteModalProps) => {
  const [isDeleting, setIsDeleting] = useState(false)

  const cancelBtnRef = useRef<HTMLButtonElement | null>(null)

  useEffect(() => {
    cancelBtnRef.current?.focus()
  }, [])

  const handleDelete = async () => {
    setIsDeleting(true)

    await deleteBuild(buildId)

    setIsDeleting(false)
  }

  return (
    <InformationModal onClose={onClose}>
      <div
        className="flex flex-col gap-6 uppercase"
        role="alertdialog"
        aria-labelledby="delete-title"
      >
        <div className="flex flex-col gap-2 border-b pb-4">
          <span className="text-text-second text-xs leading-none lg:text-xs">
            <span aria-hidden="true">Directive:</span>
            <span className="sr-only">Action required:</span>
          </span>
          <h2
            id="delete-title"
            className="text-error-text text-lg font-bold tracking-tighter break-all lg:text-2xl"
          >
            [ SYSTEM_PURGE_INITIATED ]
          </h2>
        </div>

        <div className="flex flex-col gap-4">
          <p className="text-text-main text-sm leading-relaxed">
            You are about to permanently deconstruct the following
            configuration:
            <span className="text-accent bg-accent/5 border-accent/20 mt-2 block border p-2">
              &gt; {buildName || 'UNNAMED_UNIT_SEGMENT'}
            </span>
          </p>

          <p className="text-text-second text-xs">
            All associated metadata, component links, and authorization keys
            will be wiped from the local database. This action cannot be
            intercepted.
          </p>
        </div>

        <div className="bg-error-text/5 border-error-text/20 text-error-text border-2 p-4 text-xs leading-relaxed lg:text-sm">
          <span className="font-bold">CRITICAL_WARNING: </span>
          Data reconstruction is impossible once the purge directive is
          executed. Confirm sector wipe.
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
          <Button
            variant="secondary"
            onClick={onClose}
            ref={cancelBtnRef}
            className="sm:w-32"
            disabled={isDeleting}
          >
            <span className="sr-only">Cancel deletion</span>
            <span aria-hidden="true">[ Abort ]</span>
          </Button>

          <Button
            variant="delete"
            onClick={handleDelete}
            className="sm:w-48"
            disabled={isDeleting}
          >
            {isDeleting ? (
              <span aria-hidden="true">WIPING_DATA...</span>
            ) : (
              <>
                <span className="sr-only">Confirm delete</span>
                <span aria-hidden="true">[ Confirm_Purge ]</span>
              </>
            )}
          </Button>
        </div>
      </div>
    </InformationModal>
  )
}
