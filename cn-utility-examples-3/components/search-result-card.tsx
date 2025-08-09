import type React from "react"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { ExternalLink, Shield } from "lucide-react"

interface SearchResultProps {
  title: string
  description: string
  count: string
  warning?: string
  icon: React.ReactNode
}

export function SearchResultCard({ title, description, count, warning, icon }: SearchResultProps) {
  return (
    <Card className="bg-slate-800/50 border-slate-700 p-4 hover:bg-slate-800/70 transition-colors cursor-pointer">
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center gap-2">
          {icon}
          <h3 className="text-white font-medium">{title}</h3>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="bg-blue-600 text-white">
            {count}
          </Badge>
          <ExternalLink className="w-4 h-4 text-slate-400" />
        </div>
      </div>
      <p className="text-slate-300 text-sm mb-2">{description}</p>
      {warning && (
        <div className="flex items-start gap-2 text-blue-400 text-sm">
          <Shield className="w-4 h-4 mt-0.5 flex-shrink-0" />
          <span>{warning}</span>
        </div>
      )}
    </Card>
  )
}
