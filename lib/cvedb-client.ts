// Enhanced CVEDB API Integration with full endpoint coverage
const CVEDB_BASE_URL = "https://cvedb.shodan.io"

export interface CVEDetails {
  cve_id: string
  summary: string | null
  cvss: number | null
  cvss_version: number | null
  cvss_v2: number | null
  cvss_v3: number | null
  epss: number | null
  ranking_epss: number | null
  kev: boolean
  propose_action: string | null
  ransomware_campaign: string | null
  references: string[]
  published_time: string
  cpes?: string[]
}

export interface CVEWithCPEs extends CVEDetails {
  cpes: string[]
}

export interface CVESearchResult {
  cves: CVEDetails[]
  total?: number
}

export interface CPESearchResult {
  cpes: string[]
  total?: number
}

export interface CVEsTotal {
  total: number | null
}

export interface CPEsTotal {
  total: number | null
}

// Enhanced error handling with retry logic
async function makeAPIRequest<T>(url: string, maxRetries = 3): Promise<T> {
  let lastError: Error | null = null

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const response = await fetch(url, {
        method: "GET",
        headers: {
          Accept: "application/json",
          "User-Agent": "CyberWatchVault/2.0",
          "Cache-Control": "no-cache",
        },
      })

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error("Resource not found in CVEDB")
        }
        if (response.status === 429) {
          // Rate limited - wait before retry
          const waitTime = Math.min(1000 * Math.pow(2, attempt), 10000)
          await new Promise((resolve) => setTimeout(resolve, waitTime))
          continue
        }
        if (response.status === 422) {
          const errorData = await response.json().catch(() => ({}))
          throw new Error(`Invalid request parameters: ${JSON.stringify(errorData)}`)
        }
        throw new Error(`CVEDB API error: ${response.status} ${response.statusText}`)
      }

      const data = await response.json()
      return data
    } catch (error) {
      lastError = error instanceof Error ? error : new Error("Unknown error")
      if (attempt === maxRetries) break

      // Wait before retry
      const waitTime = 1000 * attempt
      await new Promise((resolve) => setTimeout(resolve, waitTime))
    }
  }

  throw lastError || new Error("Failed to fetch from CVEDB after multiple attempts")
}

// Get detailed information about a specific CVE
export async function getCVEDetails(cveId: string): Promise<CVEWithCPEs | null> {
  try {
    const cleanCveId = cveId.toUpperCase().trim()
    if (!cleanCveId.match(/^CVE-\d{4}-\d{4,}$/)) {
      throw new Error(`Invalid CVE ID format: ${cveId}`)
    }

    const url = `${CVEDB_BASE_URL}/cve/${cleanCveId}`
    return await makeAPIRequest<CVEWithCPEs>(url)
  } catch (error) {
    console.error(`Failed to fetch CVE ${cveId}:`, error)
    return null
  }
}

// Search for CVEs by product name with comprehensive options
export async function searchCVEsByProduct(
  product: string,
  options: {
    count?: boolean
    isKev?: boolean
    sortByEpss?: boolean
    skip?: number
    limit?: number
    startDate?: string
    endDate?: string
  } = {},
): Promise<CVESearchResult | CVEsTotal> {
  try {
    const cleanProduct = product.toLowerCase().trim()
    if (!cleanProduct) {
      throw new Error("Product name cannot be empty")
    }

    const params = new URLSearchParams({
      product: cleanProduct,
      count: options.count?.toString() || "false",
      is_kev: options.isKev?.toString() || "false",
      sort_by_epss: options.sortByEpss?.toString() || "false",
      skip: options.skip?.toString() || "0",
      limit: Math.min(options.limit || 50, 1000).toString(),
    })

    // Add date filters if provided
    if (options.startDate) {
      if (!options.startDate.match(/^\d{4}-\d{2}-\d{2}(T\d{2}:\d{2}:\d{2})?$/)) {
        throw new Error("Invalid start_date format. Use YYYY-MM-DD or YYYY-MM-DDTHH:MM:SS")
      }
      params.append("start_date", options.startDate)
    }

    if (options.endDate) {
      if (!options.endDate.match(/^\d{4}-\d{2}-\d{2}(T\d{2}:\d{2}:\d{2})?$/)) {
        throw new Error("Invalid end_date format. Use YYYY-MM-DD or YYYY-MM-DDTHH:MM:SS")
      }
      params.append("end_date", options.endDate)
    }

    const url = `${CVEDB_BASE_URL}/cves?${params}`
    return await makeAPIRequest<CVESearchResult | CVEsTotal>(url)
  } catch (error) {
    console.error(`Failed to search CVEs for product ${product}:`, error)
    return { cves: [] }
  }
}

// Search for CVEs by CPE 2.3 identifier
export async function searchCVEsByCPE(
  cpe23: string,
  options: {
    count?: boolean
    isKev?: boolean
    sortByEpss?: boolean
    skip?: number
    limit?: number
    startDate?: string
    endDate?: string
  } = {},
): Promise<CVESearchResult | CVEsTotal> {
  try {
    // Validate CPE 2.3 format
    const cpePattern =
      /^cpe:2\.3:[aho]:[^:]+:[^:]+:[^:]+(:[^:]*(:[^:]*(:[^:]*(:[^:]*(:[^:]*(:[^:]*(:[^:]*)?)?)?)?)?)?)?$/
    if (!cpe23.match(cpePattern)) {
      throw new Error(`Invalid CPE 2.3 format: ${cpe23}`)
    }

    const params = new URLSearchParams({
      cpe23: cpe23,
      count: options.count?.toString() || "false",
      is_kev: options.isKev?.toString() || "false",
      sort_by_epss: options.sortByEpss?.toString() || "false",
      skip: options.skip?.toString() || "0",
      limit: Math.min(options.limit || 50, 1000).toString(),
    })

    // Add date filters if provided
    if (options.startDate) params.append("start_date", options.startDate)
    if (options.endDate) params.append("end_date", options.endDate)

    const url = `${CVEDB_BASE_URL}/cves?${params}`
    return await makeAPIRequest<CVESearchResult | CVEsTotal>(url)
  } catch (error) {
    console.error(`Failed to search CVEs for CPE ${cpe23}:`, error)
    return { cves: [] }
  }
}

// Get latest CVEs with advanced filtering
export async function getLatestCVEs(
  options: {
    count?: boolean
    isKev?: boolean
    sortByEpss?: boolean
    limit?: number
    skip?: number
    startDate?: string
    endDate?: string
    daysBack?: number
  } = {},
): Promise<CVESearchResult | CVEsTotal> {
  try {
    const params = new URLSearchParams({
      count: options.count?.toString() || "false",
      is_kev: options.isKev?.toString() || "false",
      sort_by_epss: options.sortByEpss?.toString() || "true",
      skip: options.skip?.toString() || "0",
      limit: Math.min(options.limit || 20, 1000).toString(),
    })

    // Set date range - default to last N days if not specified
    if (!options.startDate && !options.endDate) {
      const endDate = new Date()
      const startDate = new Date()
      startDate.setDate(startDate.getDate() - (options.daysBack || 30))

      params.append("start_date", startDate.toISOString().split("T")[0])
      params.append("end_date", endDate.toISOString().split("T")[0])
    } else {
      if (options.startDate) params.append("start_date", options.startDate)
      if (options.endDate) params.append("end_date", options.endDate)
    }

    const url = `${CVEDB_BASE_URL}/cves?${params}`
    return await makeAPIRequest<CVESearchResult | CVEsTotal>(url)
  } catch (error) {
    console.error("Failed to fetch latest CVEs:", error)
    return { cves: [] }
  }
}

// Search for CPEs by product name
export async function searchCPEsByProduct(
  product: string,
  options: {
    count?: boolean
    skip?: number
    limit?: number
  } = {},
): Promise<CPESearchResult | CPEsTotal> {
  try {
    const cleanProduct = product.toLowerCase().trim()
    if (!cleanProduct) {
      throw new Error("Product name cannot be empty")
    }

    const params = new URLSearchParams({
      product: cleanProduct,
      count: options.count?.toString() || "false",
      skip: options.skip?.toString() || "0",
      limit: Math.min(options.limit || 50, 1000).toString(),
    })

    const url = `${CVEDB_BASE_URL}/cpes?${params}`
    return await makeAPIRequest<CPESearchResult | CPEsTotal>(url)
  } catch (error) {
    console.error(`Failed to search CPEs for product ${product}:`, error)
    return { cpes: [] }
  }
}

// Get comprehensive vulnerability intelligence for a detected product
export async function getProductVulnerabilityIntel(product: string) {
  try {
    const cleanProduct = product
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, "")
      .trim()

    if (!cleanProduct) {
      return {
        totalCVEs: 0,
        criticalCVEs: [],
        highCVEs: [],
        mediumCVEs: [],
        lowCVEs: [],
        kevCVEs: [],
        recentCVEs: [],
        affectedCPEs: [],
        ransomwareCVEs: [],
        highEpssCVEs: [],
        topEpssCVEs: [],
        summary: {
          criticalCount: 0,
          highCount: 0,
          mediumCount: 0,
          lowCount: 0,
          kevCount: 0,
          ransomwareCount: 0,
          highEpssCount: 0,
        },
      }
    }

    // Parallel requests for comprehensive data
    const [allCvesResult, kevCvesResult, recentCvesResult, cpesResult, totalCountResult] = await Promise.allSettled([
      searchCVEsByProduct(cleanProduct, {
        sortByEpss: true,
        limit: 100,
        isKev: false,
      }),
      searchCVEsByProduct(cleanProduct, {
        isKev: true,
        limit: 20,
      }),
      searchCVEsByProduct(cleanProduct, {
        sortByEpss: true,
        limit: 10,
        daysBack: 30,
      }),
      searchCPEsByProduct(cleanProduct, { limit: 20 }),
      searchCVEsByProduct(cleanProduct, { count: true }),
    ])

    // Extract results with proper type checking
    const allCves =
      allCvesResult.status === "fulfilled" && "cves" in allCvesResult.value ? allCvesResult.value.cves : []
    const kevCVEs =
      kevCvesResult.status === "fulfilled" && "cves" in kevCvesResult.value ? kevCvesResult.value.cves : []
    const recentCVEs =
      recentCvesResult.status === "fulfilled" && "cves" in recentCvesResult.value ? recentCvesResult.value.cves : []
    const cpes = cpesResult.status === "fulfilled" && "cpes" in cpesResult.value ? cpesResult.value.cpes : []
    const totalCount =
      totalCountResult.status === "fulfilled" && "total" in totalCountResult.value
        ? totalCountResult.value.total || 0
        : 0

    // Categorize CVEs by severity
    const criticalCVEs = allCves.filter((cve) => (cve.cvss || 0) >= 9.0)
    const highCVEs = allCves.filter((cve) => (cve.cvss || 0) >= 7.0 && (cve.cvss || 0) < 9.0)
    const mediumCVEs = allCves.filter((cve) => (cve.cvss || 0) >= 4.0 && (cve.cvss || 0) < 7.0)
    const lowCVEs = allCves.filter((cve) => (cve.cvss || 0) > 0.0 && (cve.cvss || 0) < 4.0)
    const ransomwareCVEs = allCves.filter((cve) => cve.ransomware_campaign)
    const highEpssCVEs = allCves.filter((cve) => (cve.epss || 0) > 0.5)
    const topEpssCVEs = allCves
      .filter((cve) => cve.epss !== null)
      .sort((a, b) => (b.epss || 0) - (a.epss || 0))
      .slice(0, 10)

    return {
      totalCVEs: totalCount,
      criticalCVEs,
      highCVEs,
      mediumCVEs,
      lowCVEs,
      kevCVEs,
      recentCVEs,
      affectedCPEs: cpes,
      ransomwareCVEs,
      highEpssCVEs,
      topEpssCVEs,
      summary: {
        criticalCount: criticalCVEs.length,
        highCount: highCVEs.length,
        mediumCount: mediumCVEs.length,
        lowCount: lowCVEs.length,
        kevCount: kevCVEs.length,
        ransomwareCount: ransomwareCVEs.length,
        highEpssCount: highEpssCVEs.length,
      },
    }
  } catch (error) {
    console.error(`Failed to get vulnerability intel for ${product}:`, error)
    return {
      totalCVEs: 0,
      criticalCVEs: [],
      highCVEs: [],
      mediumCVEs: [],
      lowCVEs: [],
      kevCVEs: [],
      recentCVEs: [],
      affectedCPEs: [],
      ransomwareCVEs: [],
      highEpssCVEs: [],
      topEpssCVEs: [],
      summary: {
        criticalCount: 0,
        highCount: 0,
        mediumCount: 0,
        lowCount: 0,
        kevCount: 0,
        ransomwareCount: 0,
        highEpssCount: 0,
      },
    }
  }
}

// Get trending vulnerabilities with advanced analytics
export async function getTrendingVulnerabilities(
  options: {
    daysBack?: number
    limit?: number
    minEpss?: number
    includeKevOnly?: boolean
  } = {},
) {
  try {
    const endDate = new Date()
    const startDate = new Date()
    startDate.setDate(startDate.getDate() - (options.daysBack || 7))

    const result = await getLatestCVEs({
      startDate: startDate.toISOString().split("T")[0],
      endDate: endDate.toISOString().split("T")[0],
      sortByEpss: true,
      limit: options.limit || 20,
      isKev: options.includeKevOnly || false,
    })

    if ("cves" in result) {
      let cves = result.cves

      // Filter by minimum EPSS score if specified
      if (options.minEpss !== undefined) {
        cves = cves.filter((cve) => (cve.epss || 0) >= options.minEpss!)
      }

      return {
        cves,
        analytics: {
          totalFound: cves.length,
          criticalCount: cves.filter((cve) => (cve.cvss || 0) >= 9.0).length,
          highCount: cves.filter((cve) => (cve.cvss || 0) >= 7.0 && (cve.cvss || 0) < 9.0).length,
          kevCount: cves.filter((cve) => cve.kev).length,
          ransomwareCount: cves.filter((cve) => cve.ransomware_campaign).length,
          averageEpss: cves.reduce((sum, cve) => sum + (cve.epss || 0), 0) / cves.length || 0,
          averageCvss: cves.reduce((sum, cve) => sum + (cve.cvss || 0), 0) / cves.length || 0,
        },
      }
    }

    return { cves: [], analytics: null }
  } catch (error) {
    console.error("Failed to get trending vulnerabilities:", error)
    return { cves: [], analytics: null }
  }
}

// Batch CVE lookup for multiple CVE IDs
export async function batchGetCVEDetails(cveIds: string[]): Promise<(CVEWithCPEs | null)[]> {
  const batchSize = 5 // Limit concurrent requests to avoid rate limiting
  const results: (CVEWithCPEs | null)[] = []

  for (let i = 0; i < cveIds.length; i += batchSize) {
    const batch = cveIds.slice(i, i + batchSize)
    const batchPromises = batch.map((cveId) => getCVEDetails(cveId))
    const batchResults = await Promise.all(batchPromises)
    results.push(...batchResults)

    // Small delay between batches to be respectful to the API
    if (i + batchSize < cveIds.length) {
      await new Promise((resolve) => setTimeout(resolve, 500))
    }
  }

  return results
}

// Helper function to get CVSS severity level with enhanced details
export function getCVSSSeverity(cvss: number | null): {
  level: "none" | "low" | "medium" | "high" | "critical"
  color: string
  label: string
  description: string
  priority: number
} {
  if (!cvss) {
    return {
      level: "none",
      color: "text-slate-400",
      label: "Unknown",
      description: "No CVSS score available",
      priority: 0,
    }
  }

  if (cvss >= 9.0) {
    return {
      level: "critical",
      color: "text-red-400",
      label: "Critical",
      description: "Immediate action required",
      priority: 5,
    }
  }
  if (cvss >= 7.0) {
    return {
      level: "high",
      color: "text-orange-400",
      label: "High",
      description: "High priority patching needed",
      priority: 4,
    }
  }
  if (cvss >= 4.0) {
    return {
      level: "medium",
      color: "text-yellow-400",
      label: "Medium",
      description: "Moderate risk, plan patching",
      priority: 3,
    }
  }
  if (cvss > 0.0) {
    return {
      level: "low",
      color: "text-green-400",
      label: "Low",
      description: "Low risk, monitor for updates",
      priority: 2,
    }
  }

  return {
    level: "none",
    color: "text-slate-400",
    label: "None",
    description: "No risk identified",
    priority: 1,
  }
}

// Helper function to format EPSS score with risk interpretation
export function formatEPSSScore(epss: number | null): {
  percentage: string
  riskLevel: "very-low" | "low" | "medium" | "high" | "very-high"
  description: string
} {
  if (!epss) {
    return {
      percentage: "N/A",
      riskLevel: "very-low",
      description: "No exploitation prediction available",
    }
  }

  const percentage = `${(epss * 100).toFixed(1)}%`

  if (epss >= 0.8) {
    return {
      percentage,
      riskLevel: "very-high",
      description: "Very high likelihood of exploitation",
    }
  }
  if (epss >= 0.5) {
    return {
      percentage,
      riskLevel: "high",
      description: "High likelihood of exploitation",
    }
  }
  if (epss >= 0.2) {
    return {
      percentage,
      riskLevel: "medium",
      description: "Moderate likelihood of exploitation",
    }
  }
  if (epss >= 0.05) {
    return {
      percentage,
      riskLevel: "low",
      description: "Low likelihood of exploitation",
    }
  }

  return {
    percentage,
    riskLevel: "very-low",
    description: "Very low likelihood of exploitation",
  }
}

// Helper function to check if CVE is recent
export function isRecentCVE(publishedTime: string, daysThreshold = 30): boolean {
  const publishedDate = new Date(publishedTime)
  const thresholdDate = new Date()
  thresholdDate.setDate(thresholdDate.getDate() - daysThreshold)
  return publishedDate > thresholdDate
}

// Helper function to calculate risk score
export function calculateRiskScore(cve: CVEDetails): number {
  let score = 0

  // CVSS contribution (0-40 points)
  if (cve.cvss) {
    score += (cve.cvss / 10) * 40
  }

  // EPSS contribution (0-30 points)
  if (cve.epss) {
    score += cve.epss * 30
  }

  // KEV bonus (20 points)
  if (cve.kev) {
    score += 20
  }

  // Ransomware bonus (10 points)
  if (cve.ransomware_campaign) {
    score += 10
  }

  return Math.min(score, 100) // Cap at 100
}

// API Health Check for CVEDB
export async function checkCVEDBHealth(): Promise<{
  status: "online" | "offline" | "degraded"
  responseTime: number
  lastCheck: Date
}> {
  const startTime = Date.now()
  try {
    // Test with a simple CVE lookup
    await makeAPIRequest(`${CVEDB_BASE_URL}/cve/CVE-2024-1234`, 1)
    const responseTime = Date.now() - startTime

    return {
      status: responseTime < 2000 ? "online" : "degraded",
      responseTime,
      lastCheck: new Date(),
    }
  } catch (error) {
    return {
      status: "offline",
      responseTime: Date.now() - startTime,
      lastCheck: new Date(),
    }
  }
}
