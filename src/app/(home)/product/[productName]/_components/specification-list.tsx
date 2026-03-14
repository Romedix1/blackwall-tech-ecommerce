'use client'

import { SectionHeader } from '@/app/(home)/product/[productName]/_components'
import { Separator } from '@/components/ui'
import { cn } from '@/lib/utils'
import { SpecSection } from '@/types'
import { Fragment, useState } from 'react'

type SpecificationListProps = {
  specification: SpecSection[]
}

export const SpecificationList = ({
  specification,
}: SpecificationListProps) => {
  const [currentSpecificationSection, setCurrentSpecificationSection] =
    useState(specification[0].label)

  return (
    <>
      <SectionHeader text="System diagnostics log" />
      <div className="flex flex-col gap-6 lg:flex-row lg:gap-8">
        <ul className="flex w-full flex-col gap-2 lg:w-4/12">
          {specification.map((item) => {
            const isActive = item.label === currentSpecificationSection

            return (
              <li key={item.label}>
                <button
                  type="button"
                  onClick={() => setCurrentSpecificationSection(item.label)}
                  className={cn(
                    'w-full cursor-pointer border-2 border-transparent p-2.5 text-left uppercase outline-none',
                    isActive && 'bg-accent/10 text-accent border-accent',
                    !isActive && 'terminal-hover',
                  )}
                >
                  <span aria-hidden="true">
                    {item.label === currentSpecificationSection && (
                      <span className="mr-2">&gt;</span>
                    )}
                    {item.label.replace(/\s+/g, '_')}
                  </span>

                  <span className="sr-only">{item.label}</span>
                </button>
              </li>
            )
          })}
        </ul>

        <ul className="w-full">
          {specification.map(
            (item) =>
              item.label === currentSpecificationSection &&
              item.attributes.map((attribute) => {
                return (
                  <Fragment key={attribute.key}>
                    <li
                      key={attribute.key}
                      className="flex justify-between py-4"
                    >
                      <span className="text-text-second uppercase">
                        <span aria-hidden="true">
                          {attribute.key.replace(/\s+/g, '_')}
                        </span>
                        <span className="sr-only">{attribute.key}</span>
                      </span>

                      <span className="text-text-main uppercase">
                        <span aria-hidden="true">
                          {attribute.value.replace(/\s+/g, '_')}
                        </span>
                        <span className="sr-only">{attribute.value}</span>
                      </span>
                    </li>
                    <Separator />
                  </Fragment>
                )
              }),
          )}
        </ul>
      </div>
    </>
  )
}
