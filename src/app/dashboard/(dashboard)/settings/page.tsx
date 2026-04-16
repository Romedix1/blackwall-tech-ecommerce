import { DashboardHeader } from '@/app/dashboard/(dashboard)/_components'
import {
  SettingsHeader,
  SettingsSection,
} from '@/app/dashboard/(dashboard)/settings/_components'
import { TerminalInput } from '@/components/shared'
import { Button } from '@/components/ui'

export default async function SettingsPage() {
  return (
    <>
      <DashboardHeader>
        <span aria-hidden="true">{'//'} User_settings_v1</span>
        <span className="sr-only">User settings</span>
      </DashboardHeader>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        <SettingsSection>
          <SettingsHeader>
            <span aria-hidden="true">[ Identity ]</span>
            <span className="sr-only">User nick</span>
          </SettingsHeader>

          <div className="flex flex-col gap-4">
            <TerminalInput
              placeholder={`Change_username`}
              ariaLabel={`Change username`}
            />
            <Button className="text-sm" variant="secondary">
              <span aria-hidden="true">[ Change ]</span>
              <span className="sr-only">Change</span>
            </Button>
          </div>
        </SettingsSection>

        <SettingsSection>
          <SettingsHeader>
            <span aria-hidden="true">[ Security_protocols ]</span>
            <span className="sr-only">Security protocols</span>
          </SettingsHeader>

          <div className="flex flex-col gap-4 md:flex-row lg:flex-col">
            <Button className="text-sm">
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
        </SettingsSection>

        <SettingsSection>
          <SettingsHeader>
            <span aria-hidden="true">[ Logistic ]</span>
            <span className="sr-only">Logistic</span>
          </SettingsHeader>

          <div className="flex flex-col gap-4">
            <TerminalInput
              placeholder="Shipping_address"
              ariaLabel="Shipping address"
              className="col-span-2"
            />

            <div className="flex gap-2">
              <TerminalInput placeholder="Zip_code" ariaLabel="Zip code" />
              <TerminalInput placeholder="City" ariaLabel="City" />
            </div>

            <Button className="text-sm">
              <span aria-hidden="true">[ Update_data]</span>
              <span className="sr-only">Update data</span>
            </Button>
          </div>
        </SettingsSection>

        <SettingsSection>
          <SettingsHeader>
            <span aria-hidden="true">[ Active_uplinks ]</span>
            <span className="sr-only">Active uplinks</span>
          </SettingsHeader>

          <div className="border-accent bg-accent/10 border p-3 text-xs">
            <div className="mb-2 flex items-start justify-between">
              <div className="text-accent font-bold">CURRENT_SESSION</div>
              <div className="text-text-second">{'192.168.1.1'} </div>
            </div>
            <p className="uppercase">Chrome / Windows 11</p>
            <p className="text-text-second mt-1">
              &gt; Uplink_Location: {'city'}, {'country'}
            </p>
          </div>

          <div className="my-3 text-xs font-bold">Other_sessions</div>

          <div className="border p-3 text-xs">
            <div className="mb-1 flex justify-between">
              <span>Mobile_App_Node</span>
              <span>192.168.1.44</span>
            </div>
            <p className="uppercase">Safari / iPhone 15</p>
          </div>
        </SettingsSection>

        <section className="border-error-text/40 bg-error-bg/15 mt-10 border p-6 lg:col-span-2">
          <div className="flex flex-col gap-4">
            <div>
              <h2 className="text-error-text text-sm font-bold uppercase">
                <span aria-hidden="true">[ Critical_action: System_wipe ]</span>
                <span className="sr-only">Critial action: system wipe</span>
              </h2>
              <p className="text-error-text/70 mt-1 text-xs uppercase">
                Permanently delete all directives, logs, and identity records.
              </p>
            </div>
            <Button className="text-sm" variant="delete">
              <span aria-hidden="true">Initiate_Self_Destruct</span>
              <span className="sr-only">Delete account</span>
            </Button>
          </div>
        </section>
      </div>
    </>
  )
}
