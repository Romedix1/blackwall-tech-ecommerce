import { vi } from 'vitest'

process.env.STRIPE_SECRET_KEY = 'sk_test_mock_key_123'

vi.mock('server-only', () => ({}))
