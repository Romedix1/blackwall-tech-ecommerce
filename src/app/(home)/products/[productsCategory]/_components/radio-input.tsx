'use client'

import { InputHTMLAttributes, KeyboardEvent, MouseEvent, useRef } from 'react'

interface RadioInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string
  onToggle: () => void
}

export const RadioInput = ({ label, onToggle, ...props }: RadioInputProps) => {
  const inputRef = useRef<HTMLInputElement>(null)

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      onToggle()
    }
  }

  const handleClick = (e: MouseEvent<HTMLLabelElement>) => {
    if (e.detail > 0) {
      e.preventDefault()
      inputRef.current?.focus()
      onToggle()
    }
  }

  return (
    <label
      className="group flex cursor-pointer items-center gap-x-1 font-mono uppercase"
      onClick={handleClick}
    >
      <input
        type="radio"
        ref={inputRef}
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
