import { type NextRequest, NextResponse } from "next/server"
import {
  getComprehensiveThreatIntel,
  getVirusTotalIPReport,
  getAbuseIPDBReport,
  getGreyNoiseContext,
} from "@/lib/api-client"

export async function POST(request: NextRequest) {
  try {
    const { ip, sources } = await request.json()

    if (!ip || typeof ip !== "string") {
      return NextResponse.json({ error: "IP address is required" }, { status: 400 })
    }

    // Validate IP format
    const ipRegex = /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/
    if (!ipRegex.test(ip)) {
      return NextResponse.json({ error: "Invalid IP address format" }, { status: 400 })
    }

    let results
    if (sources && Array.isArray(sources)) {
      // Get specific sources
      const promises = []
      if (sources.includes("virustotal")) promises.push(getVirusTotalIPReport(ip))
      if (sources.includes("abuseipdb")) promises.push(getAbuseIPDBReport(ip))
      if (sources.includes("greynoise")) promises.push(getGreyNoiseContext(ip))

      const settled = await Promise.allSettled(promises)
      results = {
        virustotal: sources.includes("virustotal")
          ? settled[0]?.status === "fulfilled"
            ? settled[0].value
            : null
          : null,
        abuseipdb: sources.includes("abuseipdb")
          ? settled[1]?.status === "fulfilled"
            ? settled[1].value
            : null
          : null,
        greynoise: sources.includes("greynoise")
          ? settled[2]?.status === "fulfilled"
            ? settled[2].value
            : null
          : null,
      }
    } else {
      // Get comprehensive intel from all sources
      results = await getComprehensiveThreatIntel(ip)
    }

    return NextResponse.json({ results })
  } catch (error) {
    console.error("Threat intel API error:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Threat intelligence lookup failed" },
      { status: 500 },
    )
  }
}
