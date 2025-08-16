import { type NextRequest, NextResponse } from "next/server"

// Alternative search providers for when Google API is not available
const ALTERNATIVE_SEARCH_PROVIDERS = {
  duckduckgo: "https://api.duckduckgo.com/",
  bing: "https://api.bing.microsoft.com/v7.0/search",
  searx: "https://searx.org/search",
}

export async function POST(request: NextRequest) {
  try {
    const { query, provider = "duckduckgo" } = await request.json()

    if (!query || typeof query !== "string") {
      return NextResponse.json({ error: "Query is required" }, { status: 400 })
    }

    let results = []

    switch (provider) {
      case "duckduckgo":
        results = await searchDuckDuckGo(query)
        break
      case "bing":
        results = await searchBing(query)
        break
      case "searx":
        results = await searchSearx(query)
        break
      default:
        return NextResponse.json({ error: "Invalid search provider" }, { status: 400 })
    }

    return NextResponse.json({ results, provider })
  } catch (error) {
    console.error("Alternative search API error:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Alternative search failed" },
      { status: 500 },
    )
  }
}

async function searchDuckDuckGo(query: string) {
  try {
    // DuckDuckGo Instant Answer API
    const response = await fetch(
      `https://api.duckduckgo.com/?q=${encodeURIComponent(query)}&format=json&no_html=1&skip_disambig=1`,
    )

    if (!response.ok) {
      throw new Error(`DuckDuckGo API error: ${response.status}`)
    }

    const data = await response.json()

    // Format results to match Google dork format
    const results = []

    if (data.AbstractText) {
      results.push({
        title: data.Heading || "DuckDuckGo Result",
        link: data.AbstractURL || "#",
        snippet: data.AbstractText,
        displayLink: data.AbstractSource || "duckduckgo.com",
        riskLevel: "info" as const,
        category: "General",
      })
    }

    // Add related topics
    if (data.RelatedTopics) {
      data.RelatedTopics.slice(0, 5).forEach((topic: any) => {
        if (topic.Text && topic.FirstURL) {
          results.push({
            title: topic.Text.split(" - ")[0] || "Related Topic",
            link: topic.FirstURL,
            snippet: topic.Text,
            displayLink: new URL(topic.FirstURL).hostname,
            riskLevel: "info" as const,
            category: "Related",
          })
        }
      })
    }

    return results
  } catch (error) {
    console.error("DuckDuckGo search failed:", error)
    return []
  }
}

async function searchBing(query: string) {
  const bingApiKey = process.env.BING_API_KEY

  if (!bingApiKey) {
    throw new Error("Bing API key not configured")
  }

  try {
    const response = await fetch(`https://api.bing.microsoft.com/v7.0/search?q=${encodeURIComponent(query)}&count=10`, {
      headers: {
        "Ocp-Apim-Subscription-Key": bingApiKey,
        Accept: "application/json",
      },
    })

    if (!response.ok) {
      throw new Error(`Bing API error: ${response.status}`)
    }

    const data = await response.json()

    return (data.webPages?.value || []).map((item: any) => ({
      title: item.name,
      link: item.url,
      snippet: item.snippet,
      displayLink: item.displayUrl,
      riskLevel: assessRiskLevel(item.url, item.snippet),
      category: categorizeResult(item.url, item.snippet),
    }))
  } catch (error) {
    console.error("Bing search failed:", error)
    return []
  }
}

async function searchSearx(query: string) {
  try {
    // Using public SearX instance
    const response = await fetch(
      `https://searx.org/search?q=${encodeURIComponent(query)}&format=json&categories=general`,
    )

    if (!response.ok) {
      throw new Error(`SearX API error: ${response.status}`)
    }

    const data = await response.json()

    return (data.results || []).slice(0, 10).map((item: any) => ({
      title: item.title,
      link: item.url,
      snippet: item.content || "",
      displayLink: new URL(item.url).hostname,
      riskLevel: assessRiskLevel(item.url, item.content || ""),
      category: categorizeResult(item.url, item.content || ""),
    }))
  } catch (error) {
    console.error("SearX search failed:", error)
    return []
  }
}

function assessRiskLevel(link: string, snippet: string): "info" | "low" | "medium" | "high" {
  const highRiskIndicators = ["password", "admin", "login", "database", "config"]
  const mediumRiskIndicators = ["index of", "directory listing", "server-status"]

  const text = (link + " " + snippet).toLowerCase()

  if (highRiskIndicators.some((indicator) => text.includes(indicator))) return "high"
  if (mediumRiskIndicators.some((indicator) => text.includes(indicator))) return "medium"
  return "low"
}

function categorizeResult(link: string, snippet: string): string {
  if (link.includes("admin") || snippet.includes("admin")) return "Admin Panel"
  if (link.includes("login") || snippet.includes("login")) return "Login Page"
  if (snippet.includes("index of")) return "Directory Listing"
  if (link.includes("config") || snippet.includes("config")) return "Configuration"
  return "General"
}
