'use client'

import { TerminateSingleSessionModal } from '@/app/dashboard/(dashboard)/settings/_components/terminate-single-session-modal'
import { SessionType } from '@/types'
import { useState } from 'react'

type OtherSessionBlockProps = {
  session: SessionType
}

export const OtherSessionBlock = ({ session }: OtherSessionBlockProps) => {
  const [isTerminatingSession, setIsTerminatingSession] = useState(false)

  return (
    <>
      <button
        onClick={() => setIsTerminatingSession(true)}
        className="hover:border-accent hover:bg-accent/30 focus:border-accent focus:bg-accent/30 w-full cursor-pointer border p-3 text-xs outline-none"
      >
        <div className="mb-2 flex items-start justify-between">
          <p className="uppercase">
            {session?.browser} V{session?.browserVersion} / {session?.os}{' '}
            {session?.osVersion}
          </p>
          <div className="text-text-second">{session?.ipAddress}</div>
        </div>

        <p className="text-text-second mt-1 text-left">
          &gt; Uplink_Location: {session?.country}, {session?.city}
        </p>
      </button>

      {isTerminatingSession && (
        <TerminateSingleSessionModal
          session={session}
          onClose={() => setIsTerminatingSession(false)}
        />
      )}
    </>
  )
}
