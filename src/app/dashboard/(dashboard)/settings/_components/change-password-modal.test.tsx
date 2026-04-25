/* eslint-disable @typescript-eslint/no-explicit-any */
import { render, screen, fireEvent, act } from '@testing-library/react'
import { ChangePasswordModal } from './change-password-modal'
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest'
import * as React from 'react'
import { useSession } from 'next-auth/react'

vi.mock('@/lib/actions/dashboard', () => ({
  ResetPassword: vi.fn(),
}))

vi.mock('next-auth/react', () => ({
  useSession: vi.fn(),
}))

vi.mock('react', async (importOriginal) => {
  const actual = (await importOriginal()) as any
  return {
    ...actual,
    useActionState: vi.fn().mockReturnValue([null, vi.fn(), false]),
  }
})

vi.mock('@/components/shared', () => ({
  InformationModal: ({ children }: any) => (
    <div data-testid="modal">{children}</div>
  ),
  StatusAlert: ({ text, variant }: any) => (
    <div data-testid="status-alert" data-variant={variant}>
      {text}
    </div>
  ),
  TerminalInput: (props: any) => (
    <input data-testid={`input-${props.name}`} {...props} />
  ),
}))

describe('Change password modal', () => {
  const mockOnClose = vi.fn()
  const mockUpdate = vi.fn(() => Promise.resolve())

  beforeEach(() => {
    vi.clearAllMocks()
    vi.useFakeTimers()
    vi.mocked(useSession).mockReturnValue({
      update: mockUpdate,
      data: null,
      status: 'authenticated',
    } as any)
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('Should focus the abort button on mount', () => {
    render(<ChangePasswordModal onClose={mockOnClose} />)
    const abortBtn = screen.getByRole('button', {
      name: /cancel password change/i,
    })
    expect(abortBtn).toHaveFocus()
  })

  it('Should show processing state when pending', () => {
    vi.mocked(React.useActionState).mockReturnValue([null, vi.fn(), true])

    render(<ChangePasswordModal onClose={mockOnClose} />)

    expect(screen.getByText(/\[ PROCESSING... \]/i)).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: /confirm password change/i }),
    ).toBeDisabled()
  })

  it('Should display error message from state', () => {
    const errorState = {
      success: false,
      error: 'Wrong_old_password',
      fields: {},
    }
    vi.mocked(React.useActionState).mockReturnValue([
      errorState,
      vi.fn(),
      false,
    ])

    render(<ChangePasswordModal onClose={mockOnClose} />)

    const alert = screen.getByTestId('status-alert')
    expect(alert).toHaveTextContent('Wrong_old_password')
    expect(alert).toHaveAttribute('data-variant', 'error')
  })

  it('should trigger session update and close modal on success', async () => {
    const successState = {
      success: true,
      message: 'Password_overridden',
      fields: {},
    }
    vi.mocked(React.useActionState).mockReturnValue([
      successState,
      vi.fn(),
      false,
    ])

    render(<ChangePasswordModal onClose={mockOnClose} />)

    expect(mockUpdate).toHaveBeenCalledWith({
      passwordChangedAt: expect.any(Date),
    })

    await act(async () => {
      await Promise.resolve()
    })

    act(() => {
      vi.advanceTimersByTime(2000)
    })

    expect(mockOnClose).toHaveBeenCalled()
  })

  it('Should close modal when clicking abort button', () => {
    render(<ChangePasswordModal onClose={mockOnClose} />)

    const abortBtn = screen.getByRole('button', {
      name: /cancel password change/i,
    })
    fireEvent.click(abortBtn)

    expect(mockOnClose).toHaveBeenCalled()
  })
})
