import { LoginSchema } from '@/lib/zod/login-schema'

describe('Login schema', () => {
  it('should validate a correct data', () => {
    const data = {
      email: 'johny.silverhand@samurai.nc',
      password: 'Samurai@2024',
    }

    const result = LoginSchema.safeParse(data)

    expect(result.success).toBe(true)
  })

  it('should fail is email is incorrect', () => {
    const data = {
      email: 'johny.silverhand@samurai',
      password: 'Samurai@2024',
    }

    const result = LoginSchema.safeParse(data)

    expect(result.success).toBe(false)
  })

  it('should fail if password is empty', () => {
    const data = {
      email: 'johny.silverhand@samurai.nc',
      password: '',
    }

    const result = LoginSchema.safeParse(data)

    expect(result.success).toBe(false)
  })
})
