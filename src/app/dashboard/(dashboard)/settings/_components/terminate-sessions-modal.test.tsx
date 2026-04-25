/* eslint-disable @typescript-eslint/no-explicit-any */
import { render, screen, fireEvent, act } from '@testing-library/react'
import { TerminateSessionsModal } from './terminate-sessions-modal'
import { LogoutAllSessions } from '@/lib/actions/dashboard'
import { useDesktopMenu } from '@/hooks'
import { vi, describe, it, expect, beforeEach } from 'vitest'

vi.mock('@/lib/actions/dashboard', () => ({
  LogoutAllSessions: vi.fn(),
}))

vi.mock('@/hooks', () => ({
  useDesktopMenu: vi.fn(),
}))

vi.mock('@/components/shared', () => ({
  InformationModal: ({ children, onClose }: any) => (
    <div data-testid="modal">
      <button onClick={onClose}>X</button>
      {children}
    </div>
  ),
}))

describe('Terminate sessions modal', () => {
  const mockOnClose = vi.fn()
  const mockCloseMenu = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
    vi.mocked(useDesktopMenu).mockReturnValue({
      close: mockCloseMenu,
    } as any)
  })

  it('Should render warning messages correctly', () => {
    render(<TerminateSessionsModal onClose={mockOnClose} />)

    expect(screen.getByText(/CRITICAL_SESSION_PURGE/i)).toBeInTheDocument()
    expect(screen.getByRole('note')).toHaveTextContent(
      /All active access keys/i,
    )
  })

  it('Should call onClose when Abort is clicked', () => {
    render(<TerminateSessionsModal onClose={mockOnClose} />)

    const abortBtn = screen.getByRole('button', { name: /abort mission/i })
    fireEvent.click(abortBtn)

    expect(mockOnClose).toHaveBeenCalled()
  })

  it('Should execute purge and close menu on success', async () => {
    vi.mocked(LogoutAllSessions).mockResolvedValue({ success: true } as any)

    render(<TerminateSessionsModal onClose={mockOnClose} />)

    const executeBtn = screen.getByRole('button', {
      name: /confirm and execute/i,
    })

    await act(async () => {
      fireEvent.click(executeBtn)
    })

    expect(LogoutAllSessions).toHaveBeenCalled()
    expect(mockCloseMenu).toHaveBeenCalled()
  })

  it('Should disable buttons during transition', async () => {
    let resolveAction: (val: any) => void
    const promise = new Promise((resolve) => {
      resolveAction = resolve
    })
    vi.mocked(LogoutAllSessions).mockReturnValue(promise as any)

    render(<TerminateSessionsModal onClose={mockOnClose} />)

    const executeBtn = screen.getByRole('button', {
      name: /confirm and execute/i,
    })
    const abortBtn = screen.getByRole('button', { name: /abort mission/i })

    await act(async () => {
      fireEvent.click(executeBtn)
    })

    expect(executeBtn).toBeDisabled()
    expect(abortBtn).toBeDisabled()
    expect(executeBtn).toHaveTextContent(/EXECUTE_PURGE/i)

    await act(async () => {
      resolveAction({ success: true })
    })

    expect(executeBtn).not.toBeDisabled()
  })
})
