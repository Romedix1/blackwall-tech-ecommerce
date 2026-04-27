'use client'

import { ReactNode, useEffect, useRef } from 'react'

type InformationModalProps = {
  children: ReactNode
  onClose: () => void
}
export const InformationModal = ({
  children,
  onClose,
}: InformationModalProps) => {
  const dialogRef = useRef<HTMLDialogElement>(null)

  useEffect(() => {
    dialogRef.current?.showModal()
  }, [])

  const handleBackdropClick = (e: React.MouseEvent<HTMLDialogElement>) => {
    if (e.target === dialogRef.current) {
      onClose()
    }
  }

  return (
    <dialog
      ref={dialogRef}
      onClose={onClose}
      onClick={handleBackdropClick}
      className="bg-surface backdrop:bg-background/95 text-text-main border-accent/20 m-auto w-11/12 border-2 shadow-2xl outline-none backdrop:backdrop-blur-sm lg:w-7/12 lg:max-w-200"
    >
      <div className="h-full w-full p-6">
        <button
          onClick={onClose}
          className="text-error-text hover:text-error-text/50 outline-error-text focus-visible:text-error-text/50 mb-6 cursor-pointer font-bold"
        >
          <span aria-hidden="true">[ X ]</span>
          <span className="sr-only">close</span>
        </button>

        {children}
      </div>
    </dialog>
  )
}
