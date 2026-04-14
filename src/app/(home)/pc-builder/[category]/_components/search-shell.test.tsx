import { SearchShell } from '@/app/(home)/pc-builder/[category]/_components'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

const mockPush = vi.fn()

vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
  }),
  usePathname: () => '/pc-builder/motherboards',
  useSearchParams: vi.fn(() => new URLSearchParams()),
}))

describe('Pc builder search input', () => {
  it("Should focus search input when '/' is pressed", async () => {
    render(<SearchShell />)

    const user = userEvent.setup()
    const searchInput = screen.getByLabelText('Filter products by name')

    expect(searchInput).not.toHaveFocus()
    await user.keyboard('/')

    expect(searchInput).toHaveFocus()
  })

  it('Should redirect with search param when user types', async () => {
    mockPush.mockClear()
    render(<SearchShell />)

    const user = userEvent.setup()
    const searchInput = screen.getByLabelText('Filter products by name')

    await user.type(searchInput, 'asus')

    await waitFor(
      () => {
        expect(mockPush).toHaveBeenLastCalledWith(
          '/pc-builder/motherboards?search=asus',
          expect.any(Object),
        )
      },
      { timeout: 1500 },
    )
  })
})
