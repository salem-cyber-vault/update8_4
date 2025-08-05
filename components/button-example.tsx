"use client"

import type React from "react"

import { cn } from "@/lib/utils"

interface ButtonProps {
  variant?: "primary" | "secondary" | "danger"
  size?: "sm" | "md" | "lg"
  disabled?: boolean
  className?: string
  children: React.ReactNode
  onClick?: () => void
}

export function CustomButton({
  variant = "primary",
  size = "md",
  disabled = false,
  className,
  children,
  onClick,
}: ButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={cn(
        // Base styles
        "font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2",

        // Variant styles
        {
          "bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500": variant === "primary",
          "bg-gray-200 text-gray-900 hover:bg-gray-300 focus:ring-gray-500": variant === "secondary",
          "bg-red-600 text-white hover:bg-red-700 focus:ring-red-500": variant === "danger",
        },

        // Size styles
        {
          "px-3 py-1.5 text-sm": size === "sm",
          "px-4 py-2 text-base": size === "md",
          "px-6 py-3 text-lg": size === "lg",
        },

        // Disabled styles
        disabled && "opacity-50 cursor-not-allowed hover:bg-current",

        // Custom className prop
        className,
      )}
    >
      {children}
    </button>
  )
}
