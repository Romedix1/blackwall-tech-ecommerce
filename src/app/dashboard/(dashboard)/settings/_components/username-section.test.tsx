/* eslint-disable @typescript-eslint/no-explicit-any */
import { render, screen, fireEvent, act } from '@testing-library/react'
import { UsernameSection } from './username-section'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { vi, describe, it, expect, beforeEach } from 'vitest'
import { changeUsername } from '@/lib/actions/dashboard'

vi.mock('@/lib/actions/dashboard', () => ({
  changeUsername: vi.fn(),
}))

vi.mock('@/components/shared', () => ({
  TerminalInput: (props: any) => (
    <input
      data-testid="username-input"
      name={props.name}
      value={props.value}
      onChange={props.onChange}
      placeholder={props.placeholder}
    />
  ),
  StatusAlert: ({ text, variant }: any) => (
    <div data-testid="status-alert" data-variant={variant}>
      {text}
    </div>
  ),
}))

vi.mock('@/app/dashboard/(dashboard)/settings/_components', () => ({
  SettingsHeader: ({ children }: any) => <div>{children}</div>,
  SettingsSection: ({ children }: any) => <div>{children}</div>,
}))

vi.mock('next-auth/react', () => ({
  useSession: vi.fn(),
}))

vi.mock('next/navigation', () => ({
  useRouter: vi.fn(),
}))

describe('Username section', () => {
  const mockUpdate = vi.fn(() => Promise.resolve())
  const mockRefresh = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()

    vi.mocked(useSession).mockReturnValue({
      update: mockUpdate,
      data: null,
      status: 'authenticated',
    } as any)

    vi.mocked(useRouter).mockReturnValue({
      refresh: mockRefresh,
    } as any)
  })

  it('Should update input value on change', () => {
    render(<UsernameSection />)
    const input = screen.getByTestId('username-input')

    fireEvent.change(input, { target: { value: 'New_Identity' } })
    expect(input).toHaveValue('New_Identity')
  })

  it('Should handle successful username change flow', async () => {
    const successResult = {
      success: true,
      newUsername: 'V',
      message: 'Identity_updated',
    }

    vi.mocked(changeUsername).mockResolvedValue(successResult as any)

    render(<UsernameSection />)

    const input = screen.getByTestId('username-input')
    fireEvent.change(input, { target: { value: 'V' } })

    const submitBtn = screen.getByRole('button', { name: /change username/i })

    await act(async () => {
      fireEvent.click(submitBtn)
    })

    expect(changeUsername).toHaveBeenCalledWith('V')
    expect(mockUpdate).toHaveBeenCalled()
    expect(mockRefresh).toHaveBeenCalled()

    expect(screen.getByTestId('status-alert')).toHaveTextContent(
      'Identity_updated',
    )
  })

  it('Should display error and not update session on failure', async () => {
    vi.mocked(changeUsername).mockResolvedValue({
      success: false,
      message: 'Username_taken',
    } as any)

    render(<UsernameSection />)

    const input = screen.getByTestId('username-input')
    fireEvent.change(input, { target: { value: 'taken_nick' } })

    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: /change username/i }))
    })

    expect(mockUpdate).not.toHaveBeenCalled()
    expect(screen.getByTestId('status-alert')).toHaveAttribute(
      'data-variant',
      'error',
    )
  })

  it('Should show synchronizing state during transition', async () => {
    let resolveAction: any
    const promise = new Promise((resolve) => {
      resolveAction = resolve
    })
    vi.mocked(changeUsername).mockReturnValue(promise as any)

    render(<UsernameSection />)

    const input = screen.getByTestId('username-input')
    fireEvent.change(input, { target: { value: 'New_Node' } })

    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: /change username/i }))
    })

    const submitBtn = screen.getByRole('button', { name: /changing username/i })
    expect(submitBtn).toBeDisabled()
    expect(screen.getByText(/\[ SYNCHRONIZING... \]/i)).toBeInTheDocument()

    await act(async () => {
      resolveAction({ success: true, message: 'Done', newUsername: 'New_Node' })
    })

    expect(submitBtn).not.toBeDisabled()
  })
})
