import { RegisterSchema } from '@/lib/zod/register-schema'

describe('Register schema', () => {
  it('should validate a correct data', () => {
    const data = {
      username: 'Johny silverhand',
      email: 'johny.silverhand@samurai.nc',
      password: 'Samurai@2024',
      confirmPassword: 'Samurai@2024',
    }

    const result = RegisterSchema.safeParse(data)

    expect(result.success).toBe(true)
  })

  it("should fail if passwords don't match", () => {
    const data = {
      username: 'Johny silverhand',
      email: 'johny.silverhand@samurai.nc',
      password: 'Samurai@2024',
      confirmPassword: 'Arasaka@2024',
    }

    const result = RegisterSchema.safeParse(data)

    expect(result.success).toBe(false)
  })

  it('should fail if email is incorrect', () => {
    const data = {
      username: 'Alt Cunningham',
      email: 'access@blackwall',
      password: 'Blackwall_2077',
      confirmPassword: 'Blackwall_2077',
    }

    const result = RegisterSchema.safeParse(data)

    expect(result.success).toBe(false)
  })

  it('should fail if username is too short', () => {
    const data = {
      username: 'V',
      email: 'v@nightcity.com',
      password: 'Blackwall_2077',
      confirmPassword: 'Blackwall_2077',
    }

    const result = RegisterSchema.safeParse(data)

    expect(result.success).toBe(false)
  })
})
