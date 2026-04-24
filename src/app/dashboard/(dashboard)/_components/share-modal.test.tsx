/* eslint-disable @typescript-eslint/no-explicit-any */
import { ShareModal } from '@/app/dashboard/(dashboard)/_components'
import { toggleBuildVisibility } from '@/lib/actions'
import { act, render, screen, fireEvent } from '@testing-library/react'
import { useRouter } from 'next/navigation'
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest'

vi.mock('next/navigation', () => ({
  useRouter: vi.fn(() => ({
    refresh: vi.fn(),
  })),
}))

vi.mock('@/lib/actions', () => ({
  toggleBuildVisibility: vi.fn(),
}))

const writeTextMock = vi.fn(() => Promise.resolve())
Object.assign(navigator, {
  clipboard: {
    writeText: writeTextMock,
  },
})

vi.mock('@/components/shared', () => ({
  InformationModal: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
  TerminalInput: (props: any) => <input {...props} readOnly />,
}))

describe('Share modal', () => {
  const defaultProps = {
    buildId: 'build-123',
    initialIsPublic: false,
    onClose: vi.fn(),
  }

  beforeEach(() => {
    vi.useFakeTimers()
    vi.clearAllMocks()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('Should render private status by default', () => {
    render(<ShareModal {...defaultProps} />)
    expect(screen.getByText(/Connection is private/i)).toBeInTheDocument()
  })

  it('Should handle sharing process with cooldown', async () => {
    const refreshMock = vi.fn()
    vi.mocked(useRouter).mockReturnValue({ refresh: refreshMock } as any)

    render(<ShareModal {...defaultProps} />)

    const publishBtn = screen.getByRole('button', { name: /Publish/i })

    fireEvent.click(publishBtn)

    await act(async () => {
      await Promise.resolve()
    })

    expect(toggleBuildVisibility).toHaveBeenCalledWith('build-123')
    expect(screen.getByText(/System is recalibrating/i)).toBeInTheDocument()
    expect(publishBtn).toBeDisabled()
    expect(screen.getAllByText(/Cooldown: 5S/i)[0]).toBeInTheDocument()

    act(() => {
      vi.advanceTimersByTime(5000)
    })

    expect(publishBtn).not.toBeDisabled()
    expect(screen.getByText(/Broadcast is live/i)).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: /Unpublish/i }),
    ).toBeInTheDocument()
  })

  it('Should copy link to clipboard when clicking copy button', () => {
    render(<ShareModal {...defaultProps} initialIsPublic={true} />)

    const copyBtn = screen.getByRole('button', { name: /Copy link/i })

    fireEvent.click(copyBtn)

    expect(writeTextMock).toHaveBeenCalledWith(
      expect.stringContaining('build-123'),
    )
  })

  it('Should focus the copy button on mount if public', () => {
    render(<ShareModal {...defaultProps} initialIsPublic={true} />)

    const copyBtn = screen.getByRole('button', { name: /Copy link/i })
    expect(copyBtn).toHaveFocus()
  })

  it('Should not allow copying when private', () => {
    render(<ShareModal {...defaultProps} initialIsPublic={false} />)

    const copyBtn = screen.getByRole('button', { name: /Copy link/i })
    expect(copyBtn).toBeDisabled()
  })
})
