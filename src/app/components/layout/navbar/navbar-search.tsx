import SearchInput from '@/app/components/search-input'
import { Search } from 'lucide-react'

type NavbarSearchProps = {
  variant?: 'default' | 'navigation'
}

export const NavbarSearch = ({ variant = 'default' }: NavbarSearchProps) => {
  return (
    <div>
      <SearchInput variant={variant} containerClassName="hidden lg:block" />

      <Search className="lg:hidden" />
    </div>
  )
}
