import { describe, expect, it } from 'vitest'
import { fireEvent, render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import { NavbarSearch } from '@/app/components/layout/navbar/navbar-search'

describe('NavbarSearch Shortcut', () => {
  it('should focus the input field when Ctrl+K is pressed', async () => {
    render(<NavbarSearch variant="navigation" />)

    const searchInput = screen.getByLabelText('Search in database')

    expect(searchInput).not.toHaveFocus()

    fireEvent.keyDown(window, { key: 'k', ctrlKey: true })

    expect(searchInput).toHaveFocus()
  })
})
