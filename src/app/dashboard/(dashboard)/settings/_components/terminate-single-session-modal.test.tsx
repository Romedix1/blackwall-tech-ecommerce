/* eslint-disable @typescript-eslint/no-explicit-any */
import { render, screen, fireEvent } from '@testing-library/react'
import { TerminateSingleSessionModal } from './terminate-single-session-modal'
import { vi, describe, it, expect, beforeEach } from 'vitest'
import * as React from 'react'

vi.mock('@/lib/actions/dashboard', () => ({
  TerminateSession: vi.fn(),
}))

vi.mock('react', async (importOriginal) => {
  const actual = (await importOriginal()) as any
  return {
    ...actual,
    useActionState: vi.fn().mockReturnValue([null, vi.fn(), false]),
  }
})

vi.mock('@/components/shared', () => ({
  InformationModal: ({ children, onClose }: any) => (
    <div data-testid="modal">
      <button onClick={onClose}>X</button>
      {children}
    </div>
  ),
  StatusAlert: ({ text, variant }: any) => (
    <div data-testid="status-alert" data-variant={variant}>
      {text}
    </div>
  ),
}))

describe('Terminate single session modal', () => {
  const mockOnClose = vi.fn()
  const mockSession = {
    ipAddress: '192.168.1.1',
    os: 'Windows',
    osVersion: '11',
    browser: 'Chrome',
    browserVersion: '124',
    city: 'Warsaw',
    country: 'Poland',
    sessionToken: 'token-123',
  }

  const mockFormAction = vi.fn()

  it('Should render session details correctly', () => {
    render(
      <TerminateSingleSessionModal
        session={mockSession}
        onClose={mockOnClose}
      />,
    )

    expect(screen.getByText(/NODE_IP: 192.168.1.1/i)).toBeInTheDocument()
    expect(screen.getByText(/Windows 11/i)).toBeInTheDocument()
    expect(screen.getByText(/Chrome 124/i)).toBeInTheDocument()
    expect(screen.getByText(/Warsaw, Poland/i)).toBeInTheDocument()
  })

  it('Should have a hidden input with the correct session token', () => {
    render(
      <TerminateSingleSessionModal
        session={mockSession}
        onClose={mockOnClose}
      />,
    )

    const hiddenInput = screen.getByDisplayValue('token-123')
    expect(hiddenInput).toHaveAttribute('type', 'hidden')
    expect(hiddenInput).toHaveAttribute('name', 'connectionId')
  })

  it('Should focus the abort button on mount', () => {
    render(
      <TerminateSingleSessionModal
        session={mockSession}
        onClose={mockOnClose}
      />,
    )

    const abortBtn = screen.getByRole('button', { name: /cancel procedure/i })
    expect(abortBtn).toHaveFocus()
  })

  it('Should handle pending state (severing connection)', () => {
    vi.mocked(React.useActionState).mockReturnValue([
      null,
      mockFormAction,
      true,
    ])

    render(
      <TerminateSingleSessionModal
        session={mockSession}
        onClose={mockOnClose}
      />,
    )

    const submitBtn = screen.getByRole('button', {
      name: /confirm termination/i,
    })
    expect(submitBtn).toBeDisabled()
    expect(screen.getByText(/\[ Severing... \]/i)).toBeInTheDocument()
  })

  it('Should show success message and disable submit button on success', () => {
    const successState = { success: true, fields: {} }
    vi.mocked(React.useActionState).mockReturnValue([
      successState,
      mockFormAction,
      false,
    ])

    render(
      <TerminateSingleSessionModal
        session={mockSession}
        onClose={mockOnClose}
      />,
    )

    expect(screen.getByTestId('status-alert')).toHaveAttribute(
      'data-variant',
      'success',
    )
    expect(screen.getByText(/Uplink severed successfully/i)).toBeInTheDocument()

    const submitBtn = screen.getByRole('button', {
      name: /confirm termination/i,
    })
    expect(submitBtn).toBeDisabled()
  })

  it('Should call onClose when abort button is clicked', () => {
    render(
      <TerminateSingleSessionModal
        session={mockSession}
        onClose={mockOnClose}
      />,
    )

    const abortBtn = screen.getByRole('button', { name: /cancel procedure/i })
    fireEvent.click(abortBtn)

    expect(mockOnClose).toHaveBeenCalled()
  })
})
