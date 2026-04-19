'use client'

import { InformationModal, TerminalInput } from '@/components/shared'
import { Button } from '@/components/ui'
import { toggleBuildVisibility } from '@/lib/actions'
import { useRouter } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'

type ShareModalProps = {
  buildId: string
  initialIsPublic: boolean
  onClose: () => void
}

export const ShareModal = ({
  buildId,
  initialIsPublic,
  onClose,
}: ShareModalProps) => {
  const router = useRouter()

  const [isPublic, setIsPublic] = useState(initialIsPublic)

  const [isCooldown, setIsCooldown] = useState(false)
  const [timer, setTimer] = useState(0)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  const containerRef = useRef<HTMLDivElement | null>(null)
  const copyBtnRef = useRef<HTMLButtonElement>(null)

  const COOLDOWN_TIME = 5

  useEffect(() => {
    if (copyBtnRef.current) {
      copyBtnRef.current.focus()
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [])

  const handleSwitchAccess = async () => {
    if (isCooldown) return

    try {
      setIsCooldown(true)
      setTimer(COOLDOWN_TIME)

      await toggleBuildVisibility(buildId)
      setIsPublic(!isPublic)

      router.refresh()

      const interval = setInterval(() => {
        setTimer((prev) => {
          if (prev <= 1) {
            if (intervalRef.current) clearInterval(intervalRef.current)
            clearInterval(interval)
            setIsCooldown(false)
            return 0
          }
          return prev - 1
        })
      }, 1000)
    } catch (error) {
      setIsCooldown(false)
      setTimer(0)
    }
  }

  const shareLink = `${process.env.NEXT_PUBLIC_APP_URL}/shared-build/${buildId}`

  return (
    <InformationModal onClose={onClose}>
      <div
        ref={containerRef}
        className="flex flex-col gap-6 uppercase"
        role="status"
        aria-live="polite"
      >
        <div className="flex flex-col justify-between gap-4 border-b pb-4 sm:flex-row lg:items-center">
          <div className="flex flex-col">
            <span className="text-text-second text-[10px] leading-none lg:text-xs">
              <span className="sr-only">Connection_Status:</span>
              <span aria-hidden="true">Current status:</span>
            </span>
            <span
              className={`text-sm font-bold tracking-wider lg:text-base ${
                isCooldown
                  ? 'text-warning'
                  : isPublic
                    ? 'text-accent'
                    : 'text-text-disabled'
              }`}
            >
              {isCooldown ? (
                <>
                  <span className="sr-only">
                    System is recalibrating. Please wait.
                  </span>
                  <span aria-hidden="true">RECALIBRATING...</span>
                </>
              ) : isPublic ? (
                <>
                  <span className="sr-only">Broadcast is live.</span>
                  <span aria-hidden="true">LIVE_UPLINK_ACTIVE</span>
                </>
              ) : (
                <>
                  <span className="sr-only">Connection is private.</span>
                  <span aria-hidden="true">LOCAL_ENCRYPTION_ONLY</span>
                </>
              )}
            </span>
          </div>
          <Button
            variant={isPublic ? 'delete' : 'secondary'}
            className="h-10 text-[10px] sm:h-12 sm:w-60 lg:text-sm"
            onClick={handleSwitchAccess}
            disabled={isCooldown}
          >
            {isCooldown ? (
              <>
                <span aria-hidden="true">[ COOLDOWN: {timer}S ]</span>
                <span className="sr-only">Cooldown: {timer}S</span>
              </>
            ) : isPublic ? (
              <>
                <span className="sr-only">Unpublish</span>
                <span aria-hidden="true">[ Stop_broadcasting ]</span>
              </>
            ) : (
              <>
                <span className="sr-only">Publish</span>
                <span aria-hidden="true">[ Start_broadcasting ]</span>
              </>
            )}
          </Button>
        </div>

        <div className="flex flex-col gap-3">
          <label className="text-text-second flex justify-between text-xs lg:text-sm">
            <span>Direct_Access_Path:</span>
            <span className="text-text-disabled text-[10px] lg:text-xs">
              v1.0_stable
            </span>
          </label>
          <div className="flex flex-col gap-2">
            <TerminalInput
              readOnly
              value={shareLink}
              ariaLabel="Publish link"
              className="text-text-main"
            />
            <Button
              onClick={() => navigator.clipboard.writeText(shareLink)}
              ref={copyBtnRef}
              disabled={!isPublic}
            >
              <span className="sr-only">Copy link</span>
              <span aria-hidden="true">[ Copy ]</span>
            </Button>
          </div>
        </div>

        <div className="bg-warning/5 border-warning/20 text-text-second border-2 p-4 text-xs leading-relaxed lg:text-sm">
          <span className="text-warning font-bold">Warning: </span>
          Establishing a public uplink allows other operators full access to the
          build specification and authorization to clone the schema into their
          local databases.
        </div>
      </div>
    </InformationModal>
  )
}
