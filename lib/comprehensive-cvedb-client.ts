// Comprehensive CVEDB API Integration - Full Implementation
const CVEDB_BASE_URL = "https://cvedb.shodan.io"

// Complete type definitions matching the OpenAPI schema
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
}

export interface CVEWithCPEs extends CVEDetails {
  cpes: string[]
}

export interface CVESearchResult {
  cves: CVEDetails[]
}

export interface CVEsTotal {
  total: number | null
}

export interface CPESearchResult {
  cpes: string[]
}

export interface CPEsTotal {
  total: number | null
}

export interface HTTPValidationError {
  detail: ValidationError[]
}

export interface ValidationError {
  loc: (string | number)[]
  msg: string
  type: string
}

// Advanced request handler with comprehensive error handling and retry logic
async function makeComprehensiveAPIRequest<T>(
  url: string,
  options: {
    maxRetries?: number
    retryDelay?: number
    timeout?: number
  } = {},
): Promise<T> {
  const { maxRetries = 3, retryDelay = 1000, timeout = 30000 } = options
  let lastError: Error | null = null

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      console.log(`[CVEDB] Attempt ${attempt}/${maxRetries}: ${url}`)

      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), timeout)

      const response = await fetch(url, {
        method: "GET",
        headers: {
          Accept: "application/json",
          "User-Agent": "CyberWatchVault/3.0 (Comprehensive)",
          "Cache-Control": "no-cache",
          "Accept-Encoding": "gzip, deflate",
        },
        signal: controller.signal,
      })

      clearTimeout(timeoutId)

      if (!response.ok) {
        if (response.status === 404) {
          console.warn(`[CVEDB] Resource not found: ${url}`)
          throw new Error("Resource not found in CVEDB")
        }

        if (response.status === 422) {
          const errorData = await response.json().catch(() => ({}))
          console.error(`[CVEDB] Validation error:`, errorData)
          throw new Error(`Invalid request parameters: ${JSON.stringify(errorData)}`)
        }

        if (response.status === 429) {
          const retryAfter = response.headers.get("Retry-After")
          const waitTime = retryAfter
            ? Number.parseInt(retryAfter) * 1000
            : Math.min(retryDelay * Math.pow(2, attempt), 30000)
          console.warn(`[CVEDB] Rate limited. Waiting ${waitTime}ms before retry ${attempt}/${maxRetries}`)
          await new Promise((resolve) => setTimeout(resolve, waitTime))
          continue
        }

        if (response.status >= 500) {
          console.warn(`[CVEDB] Server error ${response.status}. Retrying...`)
          await new Promise((resolve) => setTimeout(resolve, retryDelay * attempt))
          continue
        }

        throw new Error(`CVEDB API error: ${response.status} ${response.statusText}`)
      }

      const data = await response.json()
      console.log(`[CVEDB] Success: ${url} - ${JSON.stringify(data).length} bytes`)
      return data
    } catch (error) {
      lastError = error instanceof Error ? error : new Error("Unknown error")
      console.error(`[CVEDB] Attempt ${attempt} failed:`, lastError.message)

      if (attempt === maxRetries) break

      // Progressive backoff
      const waitTime = retryDelay * Math.pow(2, attempt - 1)
      await new Promise((resolve) => setTimeout(resolve, waitTime))
    }
  }

  throw lastError || new Error("Failed to fetch from CVEDB after multiple attempts")
}

// 1. GET /cve/{cve_id} - Get detailed information about a specific CVE
export async function getCVEDetailsComprehensive(cveId: string): Promise<CVEWithCPEs | null> {
  try {
    const cleanCveId = cveId.toUpperCase().trim()
    if (!cleanCveId.match(/^CVE-\d{4}-\d{4,}$/)) {
      throw new Error(`Invalid CVE ID format: ${cveId}. Expected format: CVE-YYYY-NNNNN`)
    }

    const url = `${CVEDB_BASE_URL}/cve/${cleanCveId}`
    const result = await makeComprehensiveAPIRequest<CVEWithCPEs>(url)
    return result
  } catch (error) {
    console.error(`[CVEDB] Failed to fetch CVE ${cveId}:`, error)
    return null
  }
}

// 2. GET /cpes - Search for CPEs by product name with full pagination support
export async function searchCPEsComprehensive(
  product: string,
  options: {
    count?: boolean
    skip?: number
    limit?: number
    getAllPages?: boolean
  } = {},
): Promise<CPESearchResult | CPEsTotal> {
  try {
    const cleanProduct = product.toLowerCase().trim()
    if (!cleanProduct) {
      throw new Error("Product name cannot be empty")
    }

    // First, get count if requested or if we need to get all pages
    if (options.count || options.getAllPages) {
      const countParams = new URLSearchParams({
        product: cleanProduct,
        count: "true",
      })

      const countUrl = `${CVEDB_BASE_URL}/cpes?${countParams}`
      const countResult = await makeComprehensiveAPIRequest<CPEsTotal>(countUrl)

      if (options.count && !options.getAllPages) {
        return countResult
      }

      // If getting all pages, use the total to determine pagination
      if (options.getAllPages && countResult.total) {
        const allCPEs: string[] = []
        const limit = 1000 // Maximum allowed by API
        const totalPages = Math.ceil(countResult.total / limit)

        console.log(`[CVEDB] Fetching ${totalPages} pages of CPEs for product: ${product}`)

        for (let page = 0; page < totalPages; page++) {
          const skip = page * limit
          const pageParams = new URLSearchParams({
            product: cleanProduct,
            count: "false",
            skip: skip.toString(),
            limit: limit.toString(),
          })

          const pageUrl = `${CVEDB_BASE_URL}/cpes?${pageParams}`
          const pageResult = await makeComprehensiveAPIRequest<CPESearchResult>(pageUrl)

          if ("cpes" in pageResult) {
            allCPEs.push(...pageResult.cpes)
          }

          // Small delay between pages to be respectful
          if (page < totalPages - 1) {
            await new Promise((resolve) => setTimeout(resolve, 200))
          }
        }

        return { cpes: allCPEs }
      }
    }

    // Standard single page request
    const params = new URLSearchParams({
      product: cleanProduct,
      count: "false",
      skip: (options.skip || 0).toString(),
      limit: Math.min(options.limit || 1000, 1000).toString(),
    })

    const url = `${CVEDB_BASE_URL}/cpes?${params}`
    return await makeComprehensiveAPIRequest<CPESearchResult>(url)
  } catch (error) {
    console.error(`[CVEDB] Failed to search CPEs for product ${product}:`, error)
    return { cpes: [] }
  }
}

// 3. GET /cves - Comprehensive CVE search with all parameters
export async function searchCVEsComprehensive(
  searchOptions: {
    product?: string
    cpe23?: string
    count?: boolean
    isKev?: boolean
    sortByEpss?: boolean
    skip?: number
    limit?: number
    startDate?: string
    endDate?: string
    getAllPages?: boolean
    daysBack?: number
  } = {},
): Promise<CVESearchResult | CVEsTotal> {
  try {
    // Validate that only one of product or cpe23 is specified
    if (searchOptions.product && searchOptions.cpe23) {
      throw new Error("Cannot specify both product and cpe23 parameters")
    }

    // Validate CPE format if provided
    if (searchOptions.cpe23) {
      const cpePattern =
        /^cpe:2\.3:[aho]:[^:]+:[^:]+:[^:]+(:[^:]*(:[^:]*(:[^:]*(:[^:]*(:[^:]*(:[^:]*(:[^:]*)?)?)?)?)?)?)?$/
      if (!searchOptions.cpe23.match(cpePattern)) {
        throw new Error(`Invalid CPE 2.3 format: ${searchOptions.cpe23}`)
      }
    }

    // Set up date range
    let startDate = searchOptions.startDate
    let endDate = searchOptions.endDate

    if (!startDate && !endDate && searchOptions.daysBack) {
      const end = new Date()
      const start = new Date()
      start.setDate(start.getDate() - searchOptions.daysBack)
      startDate = start.toISOString().split("T")[0]
      endDate = end.toISOString().split("T")[0]
    }

    // Validate date formats
    const datePattern = /^\d{4}-\d{2}-\d{2}(T\d{2}:\d{2}:\d{2})?$/
    if (startDate && !startDate.match(datePattern)) {
      throw new Error("Invalid start_date format. Use YYYY-MM-DD or YYYY-MM-DDTHH:MM:SS")
    }
    if (endDate && !endDate.match(datePattern)) {
      throw new Error("Invalid end_date format. Use YYYY-MM-DD or YYYY-MM-DDTHH:MM:SS")
    }

    // Build parameters
    const params = new URLSearchParams()

    if (searchOptions.product) {
      params.append("product", searchOptions.product.toLowerCase().trim())
    }
    if (searchOptions.cpe23) {
      params.append("cpe23", searchOptions.cpe23)
    }

    params.append("count", (searchOptions.count || false).toString())
    params.append("is_kev", (searchOptions.isKev || false).toString())
    params.append("sort_by_epss", (searchOptions.sortByEpss || false).toString())
    params.append("skip", (searchOptions.skip || 0).toString())
    params.append("limit", Math.min(searchOptions.limit || 1000, 1000).toString())

    if (startDate) params.append("start_date", startDate)
    if (endDate) params.append("end_date", endDate)

    // Handle pagination for comprehensive data retrieval
    if (searchOptions.getAllPages && !searchOptions.count) {
      // First get the count
      const countParams = new URLSearchParams(params)
      countParams.set("count", "true")
      const countUrl = `${CVEDB_BASE_URL}/cves?${countParams}`
      const countResult = await makeComprehensiveAPIRequest<CVEsTotal>(countUrl)

      if (countResult.total && countResult.total > 0) {
        const allCVEs: CVEDetails[] = []
        const limit = 1000
        const totalPages = Math.ceil(countResult.total / limit)

        console.log(`[CVEDB] Fetching ${totalPages} pages of CVEs`)

        for (let page = 0; page < totalPages; page++) {
          const skip = page * limit
          const pageParams = new URLSearchParams(params)
          pageParams.set("count", "false")
          pageParams.set("skip", skip.toString())
          pageParams.set("limit", limit.toString())

          const pageUrl = `${CVEDB_BASE_URL}/cves?${pageParams}`
          const pageResult = await makeComprehensiveAPIRequest<CVESearchResult>(pageUrl)

          if ("cves" in pageResult) {
            allCVEs.push(...pageResult.cves)
          }

          // Rate limiting delay
          if (page < totalPages - 1) {
            await new Promise((resolve) => setTimeout(resolve, 300))
          }
        }

        return { cves: allCVEs }
      }
    }

    // Standard request
    const url = `${CVEDB_BASE_URL}/cves?${params}`
    return await makeComprehensiveAPIRequest<CVESearchResult | CVEsTotal>(url)
  } catch (error) {
    console.error(`[CVEDB] Failed to search CVEs:`, error)
    return { cves: [] }
  }
}

// Comprehensive product vulnerability intelligence with full data retrieval
export async function getComprehensiveProductIntelligence(product: string) {
  try {
    const cleanProduct = product
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, "")
      .trim()

    if (!cleanProduct) {
      return {
        product: product,
        totalCVEs: 0,
        totalCPEs: 0,
        criticalCVEs: [],
        highCVEs: [],
        mediumCVEs: [],
        lowCVEs: [],
        kevCVEs: [],
        recentCVEs: [],
        ransomwareCVEs: [],
        highEpssCVEs: [],
        topEpssCVEs: [],
        affectedCPEs: [],
        summary: {
          criticalCount: 0,
          highCount: 0,
          mediumCount: 0,
          lowCount: 0,
          kevCount: 0,
          ransomwareCount: 0,
          highEpssCount: 0,
          recentCount: 0,
        },
        analytics: {
          averageCvss: 0,
          averageEpss: 0,
          exploitationLikelihood: "unknown",
          riskLevel: "unknown",
          patchPriority: "low",
        },
      }
    }

    console.log(`[CVEDB] Starting comprehensive analysis for product: ${product}`)

    // Parallel requests for comprehensive data gathering
    const [
      totalCvesResult,
      allCvesResult,
      kevCvesResult,
      recentCvesResult,
      highEpssCvesResult,
      totalCpesResult,
      cpesResult,
    ] = await Promise.allSettled([
      // Get total CVE count
      searchCVEsComprehensive({
        product: cleanProduct,
        count: true,
      }),

      // Get comprehensive CVE data (up to 500 most relevant)
      searchCVEsComprehensive({
        product: cleanProduct,
        sortByEpss: true,
        limit: 500,
      }),

      // Get KEV CVEs
      searchCVEsComprehensive({
        product: cleanProduct,
        isKev: true,
        sortByEpss: true,
        limit: 100,
      }),

      // Get recent CVEs (last 90 days)
      searchCVEsComprehensive({
        product: cleanProduct,
        daysBack: 90,
        sortByEpss: true,
        limit: 50,
      }),

      // Get high EPSS CVEs
      searchCVEsComprehensive({
        product: cleanProduct,
        sortByEpss: true,
        limit: 100,
      }),

      // Get total CPE count
      searchCPEsComprehensive(cleanProduct, { count: true }),

      // Get CPE data
      searchCPEsComprehensive(cleanProduct, { limit: 50 }),
    ])

    // Extract results with proper error handling
    const totalCVEs =
      totalCvesResult.status === "fulfilled" && "total" in totalCvesResult.value ? totalCvesResult.value.total || 0 : 0

    const allCves =
      allCvesResult.status === "fulfilled" && "cves" in allCvesResult.value ? allCvesResult.value.cves : []

    const kevCVEs =
      kevCvesResult.status === "fulfilled" && "cves" in kevCvesResult.value ? kevCvesResult.value.cves : []

    const recentCVEs =
      recentCvesResult.status === "fulfilled" && "cves" in recentCvesResult.value ? recentCvesResult.value.cves : []

    const highEpssCVEs =
      highEpssCvesResult.status === "fulfilled" && "cves" in highEpssCvesResult.value
        ? highEpssCvesResult.value.cves.filter((cve) => (cve.epss || 0) > 0.3)
        : []

    const totalCPEs =
      totalCpesResult.status === "fulfilled" && "total" in totalCpesResult.value ? totalCpesResult.value.total || 0 : 0

    const cpes = cpesResult.status === "fulfilled" && "cpes" in cpesResult.value ? cpesResult.value.cpes : []

    // Categorize CVEs by severity
    const criticalCVEs = allCves.filter((cve) => (cve.cvss || 0) >= 9.0)
    const highCVEs = allCves.filter((cve) => (cve.cvss || 0) >= 7.0 && (cve.cvss || 0) < 9.0)
    const mediumCVEs = allCves.filter((cve) => (cve.cvss || 0) >= 4.0 && (cve.cvss || 0) < 7.0)
    const lowCVEs = allCves.filter((cve) => (cve.cvss || 0) > 0.0 && (cve.cvss || 0) < 4.0)
    const ransomwareCVEs = allCves.filter((cve) => cve.ransomware_campaign)

    // Get top EPSS CVEs
    const topEpssCVEs = allCves
      .filter((cve) => cve.epss !== null)
      .sort((a, b) => (b.epss || 0) - (a.epss || 0))
      .slice(0, 20)

    // Calculate analytics
    const validCvssScores = allCves.filter((cve) => cve.cvss !== null).map((cve) => cve.cvss!)
    const validEpssScores = allCves.filter((cve) => cve.epss !== null).map((cve) => cve.epss!)

    const averageCvss =
      validCvssScores.length > 0 ? validCvssScores.reduce((a, b) => a + b, 0) / validCvssScores.length : 0
    const averageEpss =
      validEpssScores.length > 0 ? validEpssScores.reduce((a, b) => a + b, 0) / validEpssScores.length : 0

    // Determine risk levels
    const exploitationLikelihood =
      averageEpss > 0.7
        ? "very-high"
        : averageEpss > 0.4
          ? "high"
          : averageEpss > 0.1
            ? "medium"
            : averageEpss > 0.01
              ? "low"
              : "very-low"

    const riskLevel =
      criticalCVEs.length > 0 || kevCVEs.length > 5
        ? "critical"
        : highCVEs.length > 10 || kevCVEs.length > 0
          ? "high"
          : mediumCVEs.length > 20
            ? "medium"
            : "low"

    const patchPriority =
      kevCVEs.length > 0 || criticalCVEs.length > 0
        ? "immediate"
        : highCVEs.length > 0 || ransomwareCVEs.length > 0
          ? "high"
          : mediumCVEs.length > 0
            ? "medium"
            : "low"

    const result = {
      product: product,
      totalCVEs,
      totalCPEs,
      criticalCVEs,
      highCVEs,
      mediumCVEs,
      lowCVEs,
      kevCVEs,
      recentCVEs,
      ransomwareCVEs,
      highEpssCVEs,
      topEpssCVEs,
      affectedCPEs: cpes,
      summary: {
        criticalCount: criticalCVEs.length,
        highCount: highCVEs.length,
        mediumCount: mediumCVEs.length,
        lowCount: lowCVEs.length,
        kevCount: kevCVEs.length,
        ransomwareCount: ransomwareCVEs.length,
        highEpssCount: highEpssCVEs.length,
        recentCount: recentCVEs.length,
      },
      analytics: {
        averageCvss,
        averageEpss,
        exploitationLikelihood,
        riskLevel,
        patchPriority,
      },
    }

    console.log(`[CVEDB] Comprehensive analysis complete for ${product}:`, {
      totalCVEs,
      totalCPEs,
      criticalCount: criticalCVEs.length,
      kevCount: kevCVEs.length,
      riskLevel,
    })

    return result
  } catch (error) {
    console.error(`[CVEDB] Failed to get comprehensive intelligence for ${product}:`, error)
    return {
      product: product,
      totalCVEs: 0,
      totalCPEs: 0,
      criticalCVEs: [],
      highCVEs: [],
      mediumCVEs: [],
      lowCVEs: [],
      kevCVEs: [],
      recentCVEs: [],
      ransomwareCVEs: [],
      highEpssCVEs: [],
      topEpssCVEs: [],
      affectedCPEs: [],
      summary: {
        criticalCount: 0,
        highCount: 0,
        mediumCount: 0,
        lowCount: 0,
        kevCount: 0,
        ransomwareCount: 0,
        highEpssCount: 0,
        recentCount: 0,
      },
      analytics: {
        averageCvss: 0,
        averageEpss: 0,
        exploitationLikelihood: "unknown" as const,
        riskLevel: "unknown" as const,
        patchPriority: "low" as const,
      },
    }
  }
}

// Get comprehensive trending vulnerabilities
export async function getComprehensiveTrendingVulnerabilities(
  options: {
    daysBack?: number
    limit?: number
    minEpss?: number
    includeKevOnly?: boolean
    getAllData?: boolean
  } = {},
) {
  try {
    const { daysBack = 7, limit = 50, minEpss, includeKevOnly = false, getAllData = false } = options

    console.log(`[CVEDB] Fetching trending vulnerabilities for last ${daysBack} days`)

    const searchOptions = {
      daysBack,
      sortByEpss: true,
      limit: getAllData ? 1000 : limit,
      isKev: includeKevOnly,
      getAllPages: getAllData,
    }

    const result = await searchCVEsComprehensive(searchOptions)

    if ("cves" in result) {
      let cves = result.cves

      // Apply EPSS filter if specified
      if (minEpss !== undefined) {
        cves = cves.filter((cve) => (cve.epss || 0) >= minEpss)
      }

      // Calculate comprehensive analytics
      const analytics = {
        totalFound: cves.length,
        criticalCount: cves.filter((cve) => (cve.cvss || 0) >= 9.0).length,
        highCount: cves.filter((cve) => (cve.cvss || 0) >= 7.0 && (cve.cvss || 0) < 9.0).length,
        mediumCount: cves.filter((cve) => (cve.cvss || 0) >= 4.0 && (cve.cvss || 0) < 7.0).length,
        lowCount: cves.filter((cve) => (cve.cvss || 0) > 0.0 && (cve.cvss || 0) < 4.0).length,
        kevCount: cves.filter((cve) => cve.kev).length,
        ransomwareCount: cves.filter((cve) => cve.ransomware_campaign).length,
        highEpssCount: cves.filter((cve) => (cve.epss || 0) > 0.5).length,
        averageEpss: cves.reduce((sum, cve) => sum + (cve.epss || 0), 0) / cves.length || 0,
        averageCvss: cves.reduce((sum, cve) => sum + (cve.cvss || 0), 0) / cves.length || 0,
        topEpssScore: Math.max(...cves.map((cve) => cve.epss || 0)),
        topCvssScore: Math.max(...cves.map((cve) => cve.cvss || 0)),
      }

      return {
        cves: cves.slice(0, limit), // Limit final results if needed
        analytics,
        metadata: {
          searchPeriod: `${daysBack} days`,
          minEpssFilter: minEpss,
          kevOnlyFilter: includeKevOnly,
          totalAvailable: cves.length,
        },
      }
    }

    return { cves: [], analytics: null, metadata: null }
  } catch (error) {
    console.error("[CVEDB] Failed to get comprehensive trending vulnerabilities:", error)
    return { cves: [], analytics: null, metadata: null }
  }
}

// Batch CVE lookup with comprehensive error handling
export async function batchGetCVEDetailsComprehensive(cveIds: string[]): Promise<(CVEWithCPEs | null)[]> {
  const batchSize = 3 // Conservative batch size to avoid rate limiting
  const results: (CVEWithCPEs | null)[] = []

  console.log(`[CVEDB] Starting batch lookup for ${cveIds.length} CVEs`)

  for (let i = 0; i < cveIds.length; i += batchSize) {
    const batch = cveIds.slice(i, i + batchSize)
    console.log(`[CVEDB] Processing batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(cveIds.length / batchSize)}`)

    const batchPromises = batch.map((cveId) => getCVEDetailsComprehensive(cveId))
    const batchResults = await Promise.all(batchPromises)
    results.push(...batchResults)

    // Rate limiting delay between batches
    if (i + batchSize < cveIds.length) {
      await new Promise((resolve) => setTimeout(resolve, 1000))
    }
  }

  const successCount = results.filter(Boolean).length
  console.log(`[CVEDB] Batch lookup complete: ${successCount}/${cveIds.length} successful`)

  return results
}

// Enhanced helper functions
export function getCVSSSeverityComprehensive(cvss: number | null): {
  level: "none" | "low" | "medium" | "high" | "critical"
  color: string
  label: string
  description: string
  priority: number
  actionRequired: string
} {
  if (!cvss) {
    return {
      level: "none",
      color: "text-slate-400",
      label: "Unknown",
      description: "No CVSS score available",
      priority: 0,
      actionRequired: "Monitor for updates",
    }
  }

  if (cvss >= 9.0) {
    return {
      level: "critical",
      color: "text-red-400",
      label: "Critical",
      description: "Immediate action required",
      priority: 5,
      actionRequired: "Patch immediately",
    }
  }
  if (cvss >= 7.0) {
    return {
      level: "high",
      color: "text-orange-400",
      label: "High",
      description: "High priority patching needed",
      priority: 4,
      actionRequired: "Patch within 24-48 hours",
    }
  }
  if (cvss >= 4.0) {
    return {
      level: "medium",
      color: "text-yellow-400",
      label: "Medium",
      description: "Moderate risk, plan patching",
      priority: 3,
      actionRequired: "Patch within 1-2 weeks",
    }
  }
  if (cvss > 0.0) {
    return {
      level: "low",
      color: "text-green-400",
      label: "Low",
      description: "Low risk, monitor for updates",
      priority: 2,
      actionRequired: "Patch during maintenance window",
    }
  }

  return {
    level: "none",
    color: "text-slate-400",
    label: "None",
    description: "No risk identified",
    priority: 1,
    actionRequired: "No action required",
  }
}

export function formatEPSSScoreComprehensive(epss: number | null): {
  percentage: string
  riskLevel: "very-low" | "low" | "medium" | "high" | "very-high"
  description: string
  exploitLikelihood: string
  recommendedAction: string
} {
  if (!epss) {
    return {
      percentage: "N/A",
      riskLevel: "very-low",
      description: "No exploitation prediction available",
      exploitLikelihood: "Unknown",
      recommendedAction: "Monitor for updates",
    }
  }

  const percentage = `${(epss * 100).toFixed(1)}%`

  if (epss >= 0.8) {
    return {
      percentage,
      riskLevel: "very-high",
      description: "Very high likelihood of exploitation",
      exploitLikelihood: "Extremely likely within 30 days",
      recommendedAction: "Immediate patching required",
    }
  }
  if (epss >= 0.5) {
    return {
      percentage,
      riskLevel: "high",
      description: "High likelihood of exploitation",
      exploitLikelihood: "Likely within 30 days",
      recommendedAction: "Priority patching within 24-48 hours",
    }
  }
  if (epss >= 0.2) {
    return {
      percentage,
      riskLevel: "medium",
      description: "Moderate likelihood of exploitation",
      exploitLikelihood: "Possible within 30 days",
      recommendedAction: "Plan patching within 1 week",
    }
  }
  if (epss >= 0.05) {
    return {
      percentage,
      riskLevel: "low",
      description: "Low likelihood of exploitation",
      exploitLikelihood: "Unlikely within 30 days",
      recommendedAction: "Routine patching schedule",
    }
  }

  return {
    percentage,
    riskLevel: "very-low",
    description: "Very low likelihood of exploitation",
    exploitLikelihood: "Very unlikely within 30 days",
    recommendedAction: "Standard maintenance window",
  }
}

// Calculate comprehensive risk score
export function calculateComprehensiveRiskScore(cve: CVEDetails): {
  score: number
  level: "low" | "medium" | "high" | "critical"
  factors: {
    cvssContribution: number
    epssContribution: number
    kevBonus: number
    ransomwareBonus: number
    recentBonus: number
  }
} {
  let score = 0
  const factors = {
    cvssContribution: 0,
    epssContribution: 0,
    kevBonus: 0,
    ransomwareBonus: 0,
    recentBonus: 0,
  }

  // CVSS contribution (0-40 points)
  if (cve.cvss) {
    factors.cvssContribution = (cve.cvss / 10) * 40
    score += factors.cvssContribution
  }

  // EPSS contribution (0-30 points)
  if (cve.epss) {
    factors.epssContribution = cve.epss * 30
    score += factors.epssContribution
  }

  // KEV bonus (20 points)
  if (cve.kev) {
    factors.kevBonus = 20
    score += factors.kevBonus
  }

  // Ransomware bonus (10 points)
  if (cve.ransomware_campaign) {
    factors.ransomwareBonus = 10
    score += factors.ransomwareBonus
  }

  // Recent publication bonus (5 points if published within 30 days)
  const publishedDate = new Date(cve.published_time)
  const thirtyDaysAgo = new Date()
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
  if (publishedDate > thirtyDaysAgo) {
    factors.recentBonus = 5
    score += factors.recentBonus
  }

  const finalScore = Math.min(score, 100) // Cap at 100

  const level = finalScore >= 80 ? "critical" : finalScore >= 60 ? "high" : finalScore >= 30 ? "medium" : "low"

  return {
    score: finalScore,
    level,
    factors,
  }
}

// API Health Check
export async function checkCVEDBHealthComprehensive(): Promise<{
  status: "online" | "offline" | "degraded"
  responseTime: number
  lastCheck: Date
  endpoints: {
    cveEndpoint: boolean
    cvesEndpoint: boolean
    cpesEndpoint: boolean
  }
}> {
  const startTime = Date.now()
  const endpoints = {
    cveEndpoint: false,
    cvesEndpoint: false,
    cpesEndpoint: false,
  }

  try {
    // Test CVE endpoint
    try {
      await makeComprehensiveAPIRequest(`${CVEDB_BASE_URL}/cve/CVE-2024-0001`, { maxRetries: 1, timeout: 5000 })
      endpoints.cveEndpoint = true
    } catch {
      // Expected to fail for non-existent CVE, but endpoint should respond
    }

    // Test CVEs endpoint
    try {
      await makeComprehensiveAPIRequest(`${CVEDB_BASE_URL}/cves?limit=1`, { maxRetries: 1, timeout: 5000 })
      endpoints.cvesEndpoint = true
    } catch {
      // Endpoint test failed
    }

    // Test CPEs endpoint
    try {
      await makeComprehensiveAPIRequest(`${CVEDB_BASE_URL}/cpes?product=test&limit=1`, { maxRetries: 1, timeout: 5000 })
      endpoints.cpesEndpoint = true
    } catch {
      // Endpoint test failed
    }

    const responseTime = Date.now() - startTime
    const workingEndpoints = Object.values(endpoints).filter(Boolean).length

    let status: "online" | "offline" | "degraded"
    if (workingEndpoints === 3) {
      status = responseTime < 3000 ? "online" : "degraded"
    } else if (workingEndpoints > 0) {
      status = "degraded"
    } else {
      status = "offline"
    }

    return {
      status,
      responseTime,
      lastCheck: new Date(),
      endpoints,
    }
  } catch (error) {
    return {
      status: "offline",
      responseTime: Date.now() - startTime,
      lastCheck: new Date(),
      endpoints,
    }
  }
}
