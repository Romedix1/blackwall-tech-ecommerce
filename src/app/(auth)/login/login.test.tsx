import { AuthForm } from '@/app/(auth)/_components'
import { LoginUser } from '@/lib/actions'
import { act, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

vi.mock('@/lib/actions/auth', () => ({
  LoginUser: vi.fn(),
}))

const mockedLoginUser = vi.mocked(LoginUser)

describe('Login logic', () => {
  it('should submit and redirect on success', async () => {
    const user = userEvent.setup()

    mockedLoginUser.mockImplementation(async () => {
      await new Promise((resolve) => setTimeout(resolve, 100))
      return { success: true, message: 'User logged in' }
    })

    render(<AuthForm mode={'login'} />)

    const emailInput = screen.getByLabelText(/email/i)
    const passwordInput = screen.getByLabelText(/insert password/i)

    const submitButton = screen.getByRole('button', { name: /login/i })

    await user.type(emailInput, 'johny.silverhand@samurai.nc')
    await user.type(passwordInput, 'Samurai@2024')

    await user.click(submitButton)

    expect(mockedLoginUser).toHaveBeenCalledTimes(1)

    expect(submitButton).toBeDisabled()
    expect(screen.getByText(/Synchronizing/i)).toBeInTheDocument()
  })

  it('should show error message on invalid credentials', async () => {
    const user = userEvent.setup()

    mockedLoginUser.mockResolvedValue({
      error: 'Access denied: invalid credentials',
    })

    render(<AuthForm mode="login" />)

    const emailInput = screen.getByLabelText(/email/i)
    const passwordInput = screen.getByLabelText(/insert password/i)

    const submitButton = screen.getByRole('button', { name: /login/i })

    await user.type(emailInput, 'intruder@netwatch.com')
    await user.type(passwordInput, 'samurai!2022')

    await user.click(submitButton)

    const errorMsg = await screen.findByText(/invalid credentials/i)
    expect(errorMsg).toBeInTheDocument()
  })

  it('should show verification error if email is not confirmed', async () => {
    const user = userEvent.setup()

    mockedLoginUser.mockResolvedValue({
      error: 'Protocol error: email not verified',
    })

    render(<AuthForm mode="login" />)

    const emailInput = screen.getByLabelText(/email/i)
    const passwordInput = screen.getByLabelText(/insert password/i)

    const submitButton = screen.getByRole('button', { name: /login/i })

    await user.type(emailInput, 'intruder@netwatch.com')
    await user.type(passwordInput, 'samurai!2022')

    await user.click(submitButton)

    const errorMsg = await screen.findByText(/email not verified/i)
    expect(errorMsg).toBeInTheDocument()
  })
})
