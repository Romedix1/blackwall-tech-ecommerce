type MissingDataProps =
  | {
      type: 'id'
      traceId: string
      orderId?: never
    }
  | {
      type: 'order'
      traceId: string
      orderId: string
    }

export const MissingData = ({ type, traceId, orderId }: MissingDataProps) => {
  return (
    <div className="flex items-center justify-center p-6 uppercase">
      <div
        role="alert"
        className="border-error-text bg-error-bg/20 w-full border px-6 py-10"
      >
        <h1 className="text-error-text text-sm font-bold tracking-widest lg:text-base">
          <span
            aria-hidden="true"
            className="border-error-text/20 mb-4 block border-b pb-2 text-xs lg:text-sm"
          >
            [ SYSTEM_ALERT //{' '}
            {type === 'id' ? 'Security_critical' : 'Data_retrieval_failure'}]
          </span>

          <span aria-hidden="true" className="wrap-break-word">
            &gt; ERROR:
            {type === 'id'
              ? 'Missing_critical_data_order_id'
              : 'Record_not_found_in_database'}
          </span>

          <span className="sr-only">
            {type === 'id'
              ? 'Critical Error: Missing order identification data. Access denied.'
              : `Error: Order with ID ${orderId} could not be retrieved or access is denied.`}
          </span>
        </h1>

        <div
          aria-hidden="true"
          className="text-error-text/70 mt-6 text-xs lg:text-sm"
        >
          <p>Trace_ID: {traceId}</p>
          <p>
            {type === 'id'
              ? 'Source: PROCUREMENT_MODULE // Unauthorized_Access_Attempt'
              : 'Status: 404_not_found // Access_restricted'}
          </p>
        </div>
      </div>
    </div>
  )
}
