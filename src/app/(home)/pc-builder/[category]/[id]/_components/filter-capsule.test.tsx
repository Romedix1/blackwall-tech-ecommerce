import { FilterCapsule } from '@/app/(home)/pc-builder/[category]/[id]/_components/filter-capsule'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

const mockPush = vi.fn()

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: mockPush }),
  usePathname: () => '/pc-builder/cpu',
  useSearchParams: () => new URLSearchParams('search=intel'),
}))

describe('filter capsule', () => {
  it('Should render the option capsule', () => {
    render(<FilterCapsule categoryKey="socket" option="LGA1700" />)

    expect(screen.getByText('LGA1700')).toBeInTheDocument()
  })

  it('Should update URL when capsule is clicked', async () => {
    const user = userEvent.setup()
    render(<FilterCapsule categoryKey="socket" option="LGA1700" />)

    const filterCapsule = screen.getByText('LGA1700')

    await user.click(filterCapsule)

    expect(mockPush).toHaveBeenCalledWith(
      expect.stringContaining('socket=LGA1700'),
      expect.any(Object),
    )
  })
})
