'use client'

import {
  ChangePasswordModal,
  SettingsHeader,
  SettingsSection,
} from '@/app/dashboard/(dashboard)/settings/_components'
import { Button } from '@/components/ui'
import { useState } from 'react'

export const SecuritySection = () => {
  const [isChangingPassword, setIsChangingPassword] = useState(false)

  return (
    <SettingsSection>
      <SettingsHeader>
        <span aria-hidden="true">[ Security_protocols ]</span>
        <span className="sr-only">Security protocols</span>
      </SettingsHeader>

      <div className="flex flex-col gap-4">
        <Button onClick={() => setIsChangingPassword(true)} className="text-sm">
          <span aria-hidden="true">&gt; Rotate_access_keys</span>
          <span className="sr-only">Change password</span>
        </Button>

        <Button variant="delete" className="px-4 text-sm">
          <span aria-hidden="true" className="inline-block break-all">
            &gt; Terminate_all_remote_sessions
          </span>
          <span className="sr-only">Terminate all sessions</span>
        </Button>
      </div>

      {isChangingPassword && (
        <ChangePasswordModal onClose={() => setIsChangingPassword(false)} />
      )}
    </SettingsSection>
  )
}
