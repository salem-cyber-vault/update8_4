import type React from "react"
import { cn } from "@/lib/utils"

interface CardProps {
  children: React.ReactNode
  className?: string
  hover?: boolean
  selected?: boolean
  padding?: "sm" | "md" | "lg"
}

export function CustomCard({ children, className, hover = false, selected = false, padding = "md" }: CardProps) {
  return (
    <div
      className={cn(
        // Base card styles
        "bg-white border border-gray-200 rounded-lg shadow-sm",

        // Conditional hover effect
        hover && "hover:shadow-md hover:border-gray-300 transition-all duration-200 cursor-pointer",

        // Selected state
        selected && "border-blue-500 ring-2 ring-blue-200",

        // Padding variants
        {
          "p-3": padding === "sm",
          "p-6": padding === "md",
          "p-8": padding === "lg",
        },

        // Custom classes
        className,
      )}
    >
      {children}
    </div>
  )
}
