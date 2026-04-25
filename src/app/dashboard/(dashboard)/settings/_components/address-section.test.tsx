/* eslint-disable @typescript-eslint/no-explicit-any */
import { render, screen } from '@testing-library/react'
import { AddressSection } from './address-section'
import { vi, describe, it, expect } from 'vitest'
import * as React from 'react'

vi.mock('@/lib/actions/dashboard', () => ({
  ChangeAddress: vi.fn(),
}))

vi.mock('react', async (importOriginal) => {
  const actual = (await importOriginal()) as any
  return {
    ...actual,
    useActionState: vi.fn().mockReturnValue([null, vi.fn(), false]),
  }
})

vi.mock('@/components/shared', () => ({
  TerminalInput: (props: any) => (
    <input
      data-testid={`input-${props.name}`}
      name={props.name}
      defaultValue={props.defaultValue}
      aria-label={props.ariaLabel}
    />
  ),
  StatusAlert: ({ text, variant }: any) => (
    <div data-testid="status-alert" data-variant={variant}>
      {text}
    </div>
  ),
}))

describe('Address section', () => {
  const mockAddress = {
    shippingAddress: 'Cyber-Alley 404',
    city: 'Night City',
    zipCode: '20-77',
  }

  const mockFormAction = vi.fn()

  it('Should render initial address data from props', () => {
    render(<AddressSection userAddress={mockAddress} />)

    expect(screen.getByTestId('input-shippingAddress')).toHaveValue(
      mockAddress.shippingAddress,
    )
    expect(screen.getByTestId('input-city')).toHaveValue(mockAddress.city)
    expect(screen.getByTestId('input-zipCode')).toHaveValue(mockAddress.zipCode)
  })

  it('Should show synchronizing state when isPending is true', () => {
    vi.mocked(React.useActionState).mockReturnValue([
      null,
      mockFormAction,
      true,
    ])

    render(<AddressSection userAddress={mockAddress} />)

    expect(screen.getByText(/Updating logistics/i)).toBeInTheDocument()
    expect(screen.getByText(/\[ Synchronizing... \]/i)).toBeInTheDocument()
  })

  it('Should render success status alert when action is successful', () => {
    const successState = {
      success: true,
      message: 'Uplink_synchronized',
      fields: mockAddress,
    }
    vi.mocked(React.useActionState).mockReturnValue([
      successState,
      mockFormAction,
      false,
    ])

    render(<AddressSection userAddress={mockAddress} />)

    const alert = screen.getByTestId('status-alert')
    expect(alert).toHaveTextContent('Uplink_synchronized')
    expect(alert).toHaveAttribute('data-variant', 'success')
  })

  it('Should render error status alert when action fails', () => {
    const errorState = {
      success: false,
      error: 'Connection_timeout',
      fields: mockAddress,
    }
    vi.mocked(React.useActionState).mockReturnValue([
      errorState,
      mockFormAction,
      false,
    ])

    render(<AddressSection userAddress={mockAddress} />)

    const alert = screen.getByTestId('status-alert')
    expect(alert).toHaveTextContent('Connection_timeout')
    expect(alert).toHaveAttribute('data-variant', 'error')
  })

  it('Should use data from state over props if available (after failed attempt)', () => {
    const stateWithNewData = {
      success: false,
      error: 'Invalid_zip',
      fields: {
        shippingAddress: 'New Address',
        city: 'New City',
        zipCode: '99-99',
      },
    }
    vi.mocked(React.useActionState).mockReturnValue([
      stateWithNewData,
      mockFormAction,
      false,
    ])

    render(<AddressSection userAddress={mockAddress} />)

    expect(screen.getByTestId('input-shippingAddress')).toHaveValue(
      'New Address',
    )
  })
})
