export type FormState =
  | {
      error: string[] | string
      fields?: Record<string, string>
      success?: never
    }
  | {
      success: true
      fields?: Record<string, string>
      message: string
      error?: never
    }
  | null
