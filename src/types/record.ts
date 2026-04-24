export type BaseRecordType = {
  id: string
  status: string
  createdAt: Date
}

export type BuildRecordType = BaseRecordType & {
  public: boolean
  name: string
}
