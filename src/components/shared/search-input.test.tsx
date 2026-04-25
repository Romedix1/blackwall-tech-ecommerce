import { describe, expect, it } from 'vitest'
import {
  fireEvent,
  render,
  screen,
  waitFor,
  within,
} from '@testing-library/react'
import '@testing-library/jest-dom'
import { NavbarSearch } from '@/components/layout/navbar/navbar-search'
import { MobileSearchTrigger } from '@/components/layout/navbar/mobile-search-trigger'
import { MobileMenuShell } from '@/components/layout/navbar/mobile-menu-shell'
import { SearchProduct } from '@/app/(home)/products/[productsCategory]/_components/search-product'
import { SearchInput } from '@/components/shared/search-input'
import { SearchInDb } from '@/lib/actions'

vi.mock('@/auth', () => ({
  auth: vi.fn(),
  signIn: vi.fn(),
  signOut: vi.fn(),
}))

vi.mock('next/navigation', () => ({
  useRouter: vi.fn(() => ({
    push: vi.fn(),
    replace: vi.fn(),
    prefetch: vi.fn(),
  })),
  useSearchParams: vi.fn(() => new URLSearchParams()),
  usePathname: vi.fn(() => '/'),
}))

vi.mock('@/lib/actions/search', () => ({
  SearchInDb: vi.fn(),
}))

describe('Search Functionality', () => {
  afterEach(() => {
    vi.clearAllMocks()
  })

  it('should focus the navigation input field when Ctrl+K is pressed', async () => {
    render(<NavbarSearch variant="navigation" />)

    const searchInput = screen.getByLabelText('Search in database')

    expect(searchInput).not.toHaveFocus()

    fireEvent.keyDown(window, { key: 'k', ctrlKey: true })

    expect(searchInput).toHaveFocus()
  })

  it('should open mobile menu and navigation focus input when search icon is clicked', async () => {
    render(
      <>
        <MobileSearchTrigger />
        <MobileMenuShell />
      </>,
    )

    const searchIcon = screen.getByLabelText('Open search')
    fireEvent.click(searchIcon)

    const mobileMenu = await screen.findByTestId('mobile-menu')

    const { findByLabelText } = within(mobileMenu)
    const mobileInput = await findByLabelText('Search in database')

    await waitFor(() => {
      expect(mobileInput).toHaveFocus()
    })
  })

  it('should focus the products input field when / is pressed', async () => {
    render(
      <SearchProduct
        device="desktop"
        searchValue=""
        setSearchValue={() => {}}
      />,
    )

    const searchInput = screen.getByLabelText('Filter products')

    expect(searchInput).not.toHaveFocus()

    fireEvent.keyDown(window, { key: '/' })

    expect(searchInput).toHaveFocus()
  })

  it('should fetch products from db', async () => {
    vi.mocked(SearchInDb).mockResolvedValue({
      products: [
        { name: 'RTX 5090 Blackwall Edition', slug: 'rtx-5090-blackwall' },
      ],
      categories: [],
    })

    render(<SearchInput aria-label="Search database" />)

    const searchInput = screen.getByLabelText('Search database')

    fireEvent.focus(searchInput)
    fireEvent.change(searchInput, { target: { value: 'rtx' } })

    const fetchedProduct = await screen.findByText(
      'RTX 5090 Blackwall Edition',
      {},
      { timeout: 1500 },
    )

    expect(fetchedProduct).toBeInTheDocument()
    expect(SearchInDb).toHaveBeenCalledWith('rtx')
    expect(SearchInDb).toHaveBeenCalledTimes(1)
  })

  it('should fetch categories from db', async () => {
    vi.mocked(SearchInDb).mockResolvedValue({
      products: [],
      categories: [{ name: 'processors', slug: 'cpu' }],
    })

    render(<SearchInput aria-label="Search database" />)

    const searchInput = screen.getByLabelText('Search database')

    fireEvent.focus(searchInput)
    fireEvent.change(searchInput, { target: { value: 'proc' } })

    const fetchedProduct = await screen.findByText(
      'processors',
      {},
      { timeout: 1500 },
    )

    expect(fetchedProduct).toBeInTheDocument()
    expect(SearchInDb).toHaveBeenCalledWith('proc')
    expect(SearchInDb).toHaveBeenCalledTimes(1)
  })

  it('should fetch categories and products from db', async () => {
    vi.mocked(SearchInDb).mockResolvedValue({
      products: [
        { name: 'RTX 5090 Blackwall G Edition', slug: 'rtx-5090-blackwall' },
      ],
      categories: [{ name: 'Graphics Cards', slug: 'gpu' }],
    })

    render(<SearchInput aria-label="Search database" />)

    const searchInput = screen.getByLabelText('Search database')

    fireEvent.focus(searchInput)
    fireEvent.change(searchInput, { target: { value: 'g' } })

    const fetchedProduct = await screen.findByText(
      'RTX 5090 Blackwall G Edition',
      {},
      { timeout: 2000 },
    )

    const fetchedCategory = await screen.findByText(
      'Graphics Cards',
      {},
      { timeout: 2000 },
    )

    expect(fetchedProduct).toBeInTheDocument()
    expect(fetchedCategory).toBeInTheDocument()
    expect(SearchInDb).toHaveBeenCalledWith('g')
    expect(SearchInDb).toHaveBeenCalledTimes(1)
  })
})
