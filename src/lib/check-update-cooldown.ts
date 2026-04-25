export const checkUpdateCooldown = (lastUpdated: number, cooldown: number) => {
  const now = Date.now()
  const diff = now - lastUpdated

  if (diff < cooldown) {
    const remainingMin = Math.ceil((cooldown - diff) / (1000 * 60))

    return {
      remainingMin: remainingMin,
      success: false,
    }
  }

  return { success: true }
}
