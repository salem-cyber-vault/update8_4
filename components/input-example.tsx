"use client"

import { cn } from "@/lib/utils"
import { useState } from "react"

interface InputProps {
  label?: string
  error?: string
  className?: string
  placeholder?: string
  value?: string
  onChange?: (value: string) => void
}

export function CustomInput({ label, error, className, placeholder, value, onChange }: InputProps) {
  const [focused, setFocused] = useState(false)

  return (
    <div className="space-y-1">
      {label && <label className="block text-sm font-medium text-gray-700">{label}</label>}

      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        className={cn(
          // Base input styles
          "w-full px-3 py-2 border rounded-md shadow-sm placeholder-gray-400 transition-colors",

          // Focus styles
          "focus:outline-none focus:ring-2 focus:ring-offset-0",

          // Conditional styles based on state
          {
            "border-gray-300 focus:border-blue-500 focus:ring-blue-200": !error,
            "border-red-500 focus:border-red-500 focus:ring-red-200": error,
          },

          // Dynamic focus state (you can also use focus: variants)
          focused && !error && "border-blue-500",

          // Custom className
          className,
        )}
      />

      {error && <p className="text-sm text-red-600">{error}</p>}
    </div>
  )
}
