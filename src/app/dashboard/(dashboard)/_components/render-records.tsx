import { RecordBlock } from '@/app/dashboard/(dashboard)/_components'
import { BaseRecordType, BuildRecordType } from '@/types'

type RenderRecordsProps =
  | { type: 'build'; records: BuildRecordType[] }
  | { type: 'order'; records: BaseRecordType[] }

export const RenderRecords = ({ records, type }: RenderRecordsProps) => {
  if (!records || records.length === 0) {
    return (
      <div className="text-warning text-sm lg:text-base">
        <p className="uppercase">
          <span aria-hidden="true">[ No_{type}s_found_in_history ] </span>
          <span className="sr-only">No {type}s found in history</span>
        </p>
      </div>
    )
  }

  return (
    <ul className="flex max-h-100 flex-col gap-4 overflow-y-auto">
      {type === 'build'
        ? records.map((record) => (
            <RecordBlock key={record.id} type="build" record={record} />
          ))
        : records.map((record) => (
            <RecordBlock key={record.id} type="order" record={record} />
          ))}
    </ul>
  )
}
