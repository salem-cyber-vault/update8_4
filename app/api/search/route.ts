import { type NextRequest, NextResponse } from "next/server"
import { searchShodan, performGoogleDork } from "@/lib/api-client"

export async function POST(request: NextRequest) {
  try {
    const { query, type } = await request.json()

    if (!query || typeof query !== "string") {
      return NextResponse.json({ error: "Query is required" }, { status: 400 })
    }

    let results
    switch (type) {
      case "shodan":
        results = await searchShodan(query)
        break
      case "google":
        results = await performGoogleDork(query)
        break
      default:
        return NextResponse.json({ error: "Invalid search type" }, { status: 400 })
    }

    return NextResponse.json({ results })
  } catch (error) {
    console.error("Search API error:", error)
    return NextResponse.json({ error: error instanceof Error ? error.message : "Search failed" }, { status: 500 })
  }
}
