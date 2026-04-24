import { fireEvent, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { DeleteModal } from './delete-modal'
import { deleteBuild } from '@/lib/actions'
import { vi, describe, it, expect, beforeEach } from 'vitest'

vi.mock('@/lib/actions', () => ({
  deleteBuild: vi.fn(),
}))

vi.mock('@/components/shared', () => ({
  InformationModal: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
  TerminalInput: () => <input />,
}))

describe('DeleteModal', () => {
  const defaultProps = {
    buildId: 'build-123',
    buildName: 'Netrunner Setup',
    onClose: vi.fn(),
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('Should render build name correctly', () => {
    render(<DeleteModal {...defaultProps} />)

    expect(screen.getByText(/> Netrunner Setup/i)).toBeInTheDocument()
    expect(screen.getByText(/System_purge_initiated/i)).toBeInTheDocument()
  })

  it('Should focus the Abort button on mount', () => {
    render(<DeleteModal {...defaultProps} />)

    const abortBtn = screen.getByRole('button', { name: /cancel deletion/i })
    expect(abortBtn).toHaveFocus()
  })

  it('Should call onClose when Abort is clicked', async () => {
    const user = userEvent.setup()
    render(<DeleteModal {...defaultProps} />)

    const abortBtn = screen.getByRole('button', { name: /cancel deletion/i })
    await user.click(abortBtn)

    expect(defaultProps.onClose).toHaveBeenCalledTimes(1)
  })

  it('Should trigger delete action and show loading state', async () => {
    vi.mocked(deleteBuild).mockReturnValue(
      Promise.resolve({ success: true }) as unknown as Promise<{
        success: boolean
      }>,
    )

    render(<DeleteModal {...defaultProps} />)

    const confirmBtn = screen.getByRole('button', { name: /confirm delete/i })
    const abortBtn = screen.getByRole('button', { name: /cancel deletion/i })

    fireEvent.click(confirmBtn)

    expect(confirmBtn).toBeDisabled()
    expect(abortBtn).toBeDisabled()
    expect(screen.getByText(/Wiping_data.../i)).toBeInTheDocument()

    expect(deleteBuild).toHaveBeenCalledWith('build-123')
  })
})
