/* eslint-disable @typescript-eslint/no-explicit-any */
import { render, screen, fireEvent } from '@testing-library/react'
import { SecuritySection } from './security-section'
import { vi, describe, it, expect } from 'vitest'

vi.mock('./change-password-modal', () => ({
  ChangePasswordModal: ({ onClose }: any) => (
    <div data-testid="password-modal">
      <button onClick={onClose}>Close_Password_Modal</button>
    </div>
  ),
}))

vi.mock('./terminate-sessions-modal', () => ({
  TerminateSessionsModal: ({ onClose }: any) => (
    <div data-testid="sessions-modal">
      <button onClick={onClose}>Close_Sessions_Modal</button>
    </div>
  ),
}))

describe('Security section', () => {
  it('Should not show any modals by default', () => {
    render(<SecuritySection />)

    expect(screen.queryByTestId('password-modal')).not.toBeInTheDocument()
    expect(screen.queryByTestId('sessions-modal')).not.toBeInTheDocument()
  })

  it('Should open and close ChangePasswordModal', () => {
    render(<SecuritySection />)

    const openBtn = screen.getByRole('button', { name: /change password/i })
    fireEvent.click(openBtn)
    expect(screen.getByTestId('password-modal')).toBeInTheDocument()

    const closeBtn = screen.getByText('Close_Password_Modal')
    fireEvent.click(closeBtn)
    expect(screen.queryByTestId('password-modal')).not.toBeInTheDocument()
  })

  it('Should open and close TerminateSessionsModal', () => {
    render(<SecuritySection />)

    const openBtn = screen.getByRole('button', {
      name: /terminate all sessions/i,
    })
    fireEvent.click(openBtn)
    expect(screen.getByTestId('sessions-modal')).toBeInTheDocument()

    const closeBtn = screen.getByText('Close_Sessions_Modal')
    fireEvent.click(closeBtn)
    expect(screen.queryByTestId('sessions-modal')).not.toBeInTheDocument()
  })
})
