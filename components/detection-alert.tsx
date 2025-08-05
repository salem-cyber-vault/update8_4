import type React from "react"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"

interface DetectionAlertProps {
  title: string
  description: string
  severity: "New" | "Critical" | "High" | "Medium"
  icon: React.ReactNode
}

export function DetectionAlert({ title, description, severity, icon }: DetectionAlertProps) {
  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "Critical":
        return "bg-red-600"
      case "High":
        return "bg-orange-600"
      case "Medium":
        return "bg-yellow-600"
      case "New":
        return "bg-green-600"
      default:
        return "bg-slate-600"
    }
  }

  return (
    <Card className="bg-slate-800/50 border-slate-700 p-4 hover:bg-slate-800/70 transition-colors">
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center gap-2">
          {icon}
          <h3 className="text-white font-medium">{title}</h3>
        </div>
        <Badge className={`${getSeverityColor(severity)} text-white`}>{severity}</Badge>
      </div>
      <p className="text-slate-300 text-sm">{description}</p>
    </Card>
  )
}
