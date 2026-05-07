import { InformationModal } from '@/components/shared'
import { Button } from '@/components/ui'
import { cn } from '@/lib'

type systemStatusType = {
  status: string
  message: string
}

type WarningModalProps = {
  onClose: () => void
  systemStatus: systemStatusType
  handleAdd: (alert: boolean) => void
}

export const WarningModal = ({
  onClose,
  systemStatus,
  handleAdd,
}: WarningModalProps) => {
  const isError = systemStatus.status === 'failed'

  return (
    <InformationModal onClose={onClose}>
      <h3 className="text-sm font-bold break-all uppercase lg:text-xl">
        <span aria-hidden="true">
          [ {isError ? 'critical_build_error' : 'incomplete_configuration'} ]
        </span>
        <span className="sr-only">
          {isError ? 'Critical build error' : 'Incomplete configuration'}
        </span>
      </h3>

      <div className="my-6 space-y-2 text-sm">
        <p className={cn(isError ? 'text-error-text' : 'text-warning')}>
          <span aria-hidden="true">&gt; status: {systemStatus.status}</span>
          <span className="sr-only">Status: {systemStatus.status}</span>
        </p>
        <p className="text-text-second">
          <span aria-hidden="true">
            &gt; detected_issue: {systemStatus.message.replaceAll(' ', '_')}
          </span>
          <span className="sr-only">
            Detected issue: {systemStatus.message}
          </span>
        </p>
        <p className="mt-4 border-t pt-4 text-xs break-all">
          <span aria-hidden="true">
            {isError
              ? '!! alert: adding_incompatible_hardware_may_result_in_system_failure'
              : '?? notice: proceeding_with_incomplete_system_configuration'}
          </span>
          <span className="sr-only">
            {isError
              ? 'Alert: adding incompatible hardware may result in system failure'
              : 'Notice: proceeding with incomplete system configuration'}
          </span>
        </p>
      </div>

      <div className="flex flex-col gap-3 lg:flex-row">
        <Button
          variant="secondary"
          onClick={onClose}
          className="w-full py-4 text-center"
        >
          <span aria-hidden="true">
            [ {isError ? 'return_to_telemetry' : 'cancel_action'} ]
          </span>
          <span className="sr-only">
            {isError ? 'Return to telemetry' : 'Cancel action'}
          </span>
        </Button>

        <Button
          onClick={() => handleAdd(true)}
          className="w-full py-4 text-center"
        >
          <span aria-hidden="true">
            [ {isError ? 'force_add_broken_build' : 'add_incomplete_build'} ]
          </span>
          <span className="sr-only">
            {isError ? 'Force add broken build' : 'Add incomplete build'}
          </span>
        </Button>
      </div>
    </InformationModal>
  )
}
