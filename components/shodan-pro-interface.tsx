import React from "react"
import type { ShodanHost } from "@/lib/api-integrations"

interface ShodanProInterfaceProps {
  initialHost?: ShodanHost
}

export function ShodanProInterface({ initialHost }: ShodanProInterfaceProps) {
  return (
    <div className="p-4 text-slate-300 text-sm">
      {initialHost ? (
        <div>
          <div>IP: {initialHost.ip_str}</div>
          <div>Port: {initialHost.port}</div>
          {initialHost.product && <div>Product: {initialHost.product}</div>}
        </div>
      ) : (
        <div>No host selected.</div>
      )}
    </div>
  )
}
