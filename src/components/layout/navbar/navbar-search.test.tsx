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

vi.mock('@/auth', () => ({
  auth: vi.fn(),
  signIn: vi.fn(),
  signOut: vi.fn(),
}))

describe('Search Functionality', () => {
  it('should focus the input field when Ctrl+K is pressed', async () => {
    render(<NavbarSearch variant="navigation" />)

    const searchInput = screen.getByLabelText('Search in database')

    expect(searchInput).not.toHaveFocus()

    fireEvent.keyDown(window, { key: 'k', ctrlKey: true })

    expect(searchInput).toHaveFocus()
  })

  it('should open mobile menu and focus input when search icon is clicked', async () => {
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
})
