import { ReactNode } from 'react'

type InformationModalProps = {
  children: ReactNode
}
// TODO: LOCK TAB IN MODAL
export const InformationModal = ({ children }: InformationModalProps) => {
  return (
    <div className="bg-background/90 absolute top-0 left-0 flex h-full w-full items-center justify-center">
      <section className="bg-surface relative w-11/12 p-6 lg:w-7/12 lg:max-w-200">
        {children}
      </section>
    </div>
  )
}
