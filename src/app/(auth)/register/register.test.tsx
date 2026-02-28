import { AuthForm } from '@/app/(auth)/_components'
import { RegisterUser } from '@/lib/actions'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { mock } from 'node:test'

vi.mock('@/lib/actions/auth', () => ({
  RegisterUser: vi.fn(),
}))

describe('Register logic', () => {
  it('should submit with valid data and show email confirmation', async () => {
    const user = userEvent.setup()

    const mockedRegisterUser = vi.mocked(RegisterUser)
    mockedRegisterUser.mockResolvedValue({
      success: true,
      message: 'Email confirmation sent',
    })

    render(<AuthForm mode={'register'} />)

    const userNameInput = screen.getByLabelText(/username/i)
    const emailInput = screen.getByLabelText(/email/i)
    const passwordInput = screen.getByLabelText(/insert password/i)
    const confirmPasswordInput = screen.getByLabelText(/confirm password/i)

    const submitButton = screen.getByRole('button', { name: /register/i })

    await user.type(userNameInput, 'Johny silverhand')
    await user.type(emailInput, 'johny.silverhand@samurai.nc')
    await user.type(passwordInput, 'Samurai@2024')
    await user.type(confirmPasswordInput, 'Samurai@2024')

    await user.click(submitButton)

    expect(mockedRegisterUser).toHaveBeenCalledTimes(1)

    const sentData = mockedRegisterUser.mock.calls[0]![1] as FormData
    expect(sentData.get('username')).toBe('Johny silverhand')
  })
})
