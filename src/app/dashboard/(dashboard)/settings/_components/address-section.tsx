'use client'

import { SettingsHeader } from '@/app/dashboard/(dashboard)/settings/_components/settings-header'
import { SettingsSection } from '@/app/dashboard/(dashboard)/settings/_components/settings-section'
import { StatusAlert, TerminalInput } from '@/components/shared'
import { Button } from '@/components/ui'
import { ChangeAddress } from '@/lib/actions/dashboard'
import { useActionState } from 'react'

type address = {
  shippingAddress: string | null
  zipCode: string | null
  city: string | null
}

type AddresSection = {
  userAddress: address | null
}

export const AddressSection = ({ userAddress }: AddresSection) => {
  const [state, formAction, isPending] = useActionState(ChangeAddress, null)

  return (
    <SettingsSection>
      <SettingsHeader>
        <span aria-hidden="true">[ Logistic ]</span>
        <span className="sr-only">Logistic</span>
      </SettingsHeader>

      <form action={formAction} className="flex flex-col gap-4">
        <TerminalInput
          name="shippingAddress"
          defaultValue={
            state?.fields?.shippingAddress || userAddress?.shippingAddress || ''
          }
          placeholder="Shipping_address"
          ariaLabel="Shipping address"
          className="col-span-2"
        />

        <div className="flex gap-2">
          <TerminalInput
            name="city"
            defaultValue={state?.fields?.city || userAddress?.city || ''}
            placeholder="City"
            ariaLabel="City"
          />
          <TerminalInput
            name="zipCode"
            defaultValue={state?.fields?.zipCode || userAddress?.zipCode || ''}
            placeholder="Zip_code"
            ariaLabel="Zip code"
          />
        </div>

        <Button className="text-sm">
          <span aria-hidden="true">
            {isPending ? '[ Synchronizing... ]' : '[ Update_data ]'}
          </span>
          <span className="sr-only">
            {isPending ? 'Updating logistics' : 'Update data'}
          </span>
        </Button>

        {state && (
          <StatusAlert
            variant={state.success ? 'success' : 'error'}
            text={state.success ? state.message : state.error}
          />
        )}
      </form>
    </SettingsSection>
  )
}
