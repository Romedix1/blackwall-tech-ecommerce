'use client'

import { InputHTMLAttributes, KeyboardEvent, MouseEvent } from 'react'

interface RadioInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string
  onToggle: () => void
}

export const RadioInput = ({ label, onToggle, ...props }: RadioInputProps) => {
  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      onToggle()
    }
  }

  return (
    <label className="group flex cursor-pointer items-center gap-x-1 font-mono uppercase">
      <input
        onToggle={onToggle}
        type="radio"
        onChange={() => {}}
        onKeyDown={handleKeyDown}
        className="peer sr-only"
        {...props}
      />

      <span
        className="peer-checked:text-accent peer-focus:text-accent"
        aria-hidden="true"
      >
        [
      </span>

      <span
        className="peer-checked:text-accent peer-focus:text-accent text-center after:content-['_'] peer-checked:after:content-['x']"
        aria-hidden="true"
      ></span>

      <span
        className="peer-checked:text-accent peer-focus:text-accent"
        aria-hidden="true"
      >
        ]
      </span>

      <span className="peer-checked:text-accent peer-focus:text-accent ml-1 text-sm">
        {label}
      </span>
    </label>
  )
}
