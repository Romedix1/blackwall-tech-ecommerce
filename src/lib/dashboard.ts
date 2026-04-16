export const getStatusData = (status: string) => {
  const statusMap: Record<string, { label: string; color: string }> = {
    pending: { label: 'AWAITING_HANDSHAKE', color: 'blue-400' },
    paid: { label: 'CREDITS_AUTHORIZED', color: 'cyan-400' },
    shipped: { label: 'IN_TRANSIT', color: 'amber-200' },
    complete: { label: 'OPERATION_SUCCESSFUL', color: 'accent' },
    failed: { label: 'LINK_ABORTED', color: 'error-text' },
    cancelled: { label: 'SESSION_TERMINATED', color: 'text-second/80' },
  }

  return (
    statusMap[status] ?? {
      label: 'UNKNOWN_LOG_ENTRY',
      color: 'zinc-400',
    }
  )
}
