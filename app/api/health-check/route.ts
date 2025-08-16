import { NextResponse } from "next/server"

export async function GET() {
  try {
    // Check if API keys are configured (server-side only)
    const apiStatus = {
      shodan: !!process.env.SHODAN_API_KEY && process.env.SHODAN_API_KEY.length > 10,
      virustotal: !!process.env.VIRUSTOTAL_API_KEY && process.env.VIRUSTOTAL_API_KEY.length > 10,
      abuseipdb: !!process.env.ABUSEIPDB_API_KEY && process.env.ABUSEIPDB_API_KEY.length > 10,
      greynoise: !!process.env.GREYNOISE_API_KEY && process.env.GREYNOISE_API_KEY.length > 10,
      google: !!process.env.GOOGLE_API_KEY && !!process.env.GOOGLE_CSE_ID,
    }

    return NextResponse.json(apiStatus)
  } catch (error) {
    console.error("Health check failed:", error)
    return NextResponse.json({ error: "Health check failed" }, { status: 500 })
  }
}
