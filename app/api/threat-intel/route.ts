import { type NextRequest, NextResponse } from "next/server"
import {
  getComprehensiveThreatIntel,
  analyzeWithVirusTotal,
  getAbuseIPDBReport,
  getGreyNoiseContext,
  getCurrentBotnets,
  getThreatMapData,
  getLiveThreatFeed,
} from "@/lib/api-integrations"

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

  let results: Record<string, any> = {}
    if (sources && Array.isArray(sources)) {
      // Get specific sources, always real data
      if (sources.includes("virustotal")) {
        results.virustotal = await analyzeWithVirusTotal(ip, "ip")
      }
      if (sources.includes("abuseipdb")) {
        results.abuseipdb = await getAbuseIPDBReport(ip)
      }
      if (sources.includes("greynoise")) {
        results.greynoise = await getGreyNoiseContext(ip)
      }
      if (sources.includes("botnets")) {
        results.botnets = await getCurrentBotnets()
      }
      if (sources.includes("threatmap")) {
        results.threatmap = await getThreatMapData()
      }
      if (sources.includes("livefeed")) {
        results.livefeed = await getLiveThreatFeed()
      }
    } else {
      // Get comprehensive intel from all sources, always real data
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
