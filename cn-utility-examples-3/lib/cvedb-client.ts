// CVEDB API Integration for vulnerability intelligence
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

export interface CVESearchResult {
  cves: CVEDetails[]
  total?: number
}

export interface CPESearchResult {
  cpes: string[]
  total?: number
}

// Get detailed information about a specific CVE
export async function getCVEDetails(cveId: string): Promise<CVEDetails | null> {
  try {
    const response = await fetch(`${CVEDB_BASE_URL}/cve/${cveId}`)

    if (!response.ok) {
      if (response.status === 404) {
        console.warn(`CVE ${cveId} not found`)
        return null
      }
      throw new Error(`CVEDB API error: ${response.status}`)
    }

    return await response.json()
  } catch (error) {
    console.error(`Failed to fetch CVE ${cveId}:`, error)
    return null
  }
}

// Search for CVEs by product name
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
): Promise<CVESearchResult> {
  try {
    const params = new URLSearchParams({
      product,
      count: options.count?.toString() || "false",
      is_kev: options.isKev?.toString() || "false",
      sort_by_epss: options.sortByEpss?.toString() || "false",
      skip: options.skip?.toString() || "0",
      limit: options.limit?.toString() || "100",
    })

    if (options.startDate) params.append("start_date", options.startDate)
    if (options.endDate) params.append("end_date", options.endDate)

    const response = await fetch(`${CVEDB_BASE_URL}/cves?${params}`)

    if (!response.ok) {
      throw new Error(`CVEDB API error: ${response.status}`)
    }

    return await response.json()
  } catch (error) {
    console.error(`Failed to search CVEs for product ${product}:`, error)
    return { cves: [] }
  }
}

// Search for CVEs by CPE identifier
export async function searchCVEsByCPE(
  cpe23: string,
  options: {
    count?: boolean
    isKev?: boolean
    sortByEpss?: boolean
    skip?: number
    limit?: number
  } = {},
): Promise<CVESearchResult> {
  try {
    const params = new URLSearchParams({
      cpe23,
      count: options.count?.toString() || "false",
      is_kev: options.isKev?.toString() || "false",
      sort_by_epss: options.sortByEpss?.toString() || "false",
      skip: options.skip?.toString() || "0",
      limit: options.limit?.toString() || "100",
    })

    const response = await fetch(`${CVEDB_BASE_URL}/cves?${params}`)

    if (!response.ok) {
      throw new Error(`CVEDB API error: ${response.status}`)
    }

    return await response.json()
  } catch (error) {
    console.error(`Failed to search CVEs for CPE ${cpe23}:`, error)
    return { cves: [] }
  }
}

// Get latest CVEs (trending vulnerabilities)
export async function getLatestCVEs(
  options: {
    isKev?: boolean
    sortByEpss?: boolean
    limit?: number
    startDate?: string
    endDate?: string
  } = {},
): Promise<CVESearchResult> {
  try {
    const params = new URLSearchParams({
      is_kev: options.isKev?.toString() || "false",
      sort_by_epss: options.sortByEpss?.toString() || "true",
      limit: options.limit?.toString() || "50",
    })

    if (options.startDate) params.append("start_date", options.startDate)
    if (options.endDate) params.append("end_date", options.endDate)

    const response = await fetch(`${CVEDB_BASE_URL}/cves?${params}`)

    if (!response.ok) {
      throw new Error(`CVEDB API error: ${response.status}`)
    }

    return await response.json()
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
): Promise<CPESearchResult> {
  try {
    const params = new URLSearchParams({
      product,
      count: options.count?.toString() || "false",
      skip: options.skip?.toString() || "0",
      limit: options.limit?.toString() || "100",
    })

    const response = await fetch(`${CVEDB_BASE_URL}/cpes?${params}`)

    if (!response.ok) {
      throw new Error(`CVEDB API error: ${response.status}`)
    }

    return await response.json()
  } catch (error) {
    console.error(`Failed to search CPEs for product ${product}:`, error)
    return { cpes: [] }
  }
}

// Get vulnerability intelligence for a detected product
export async function getProductVulnerabilityIntel(product: string) {
  try {
    const [cveResults, cpeResults] = await Promise.all([
      searchCVEsByProduct(product, {
        sortByEpss: true,
        limit: 10,
        isKev: false,
      }),
      searchCPEsByProduct(product, { limit: 5 }),
    ])

    // Get KEV (Known Exploited Vulnerabilities) separately
    const kevResults = await searchCVEsByProduct(product, {
      isKev: true,
      limit: 5,
    })

    return {
      totalCVEs: cveResults.cves.length,
      criticalCVEs: cveResults.cves.filter((cve) => (cve.cvss || 0) >= 9.0),
      highCVEs: cveResults.cves.filter((cve) => (cve.cvss || 0) >= 7.0 && (cve.cvss || 0) < 9.0),
      kevCVEs: kevResults.cves,
      recentCVEs: cveResults.cves.slice(0, 5),
      affectedCPEs: cpeResults.cpes,
      ransomwareCVEs: cveResults.cves.filter((cve) => cve.ransomware_campaign),
      highEpssCVEs: cveResults.cves.filter((cve) => (cve.epss || 0) > 0.5),
    }
  } catch (error) {
    console.error(`Failed to get vulnerability intel for ${product}:`, error)
    return {
      totalCVEs: 0,
      criticalCVEs: [],
      highCVEs: [],
      kevCVEs: [],
      recentCVEs: [],
      affectedCPEs: [],
      ransomwareCVEs: [],
      highEpssCVEs: [],
    }
  }
}

// Helper function to get CVSS severity level
export function getCVSSSeverity(cvss: number | null): {
  level: "none" | "low" | "medium" | "high" | "critical"
  color: string
  label: string
} {
  if (!cvss) return { level: "none", color: "text-slate-400", label: "Unknown" }

  if (cvss >= 9.0) return { level: "critical", color: "text-red-400", label: "Critical" }
  if (cvss >= 7.0) return { level: "high", color: "text-orange-400", label: "High" }
  if (cvss >= 4.0) return { level: "medium", color: "text-yellow-400", label: "Medium" }
  if (cvss > 0.0) return { level: "low", color: "text-green-400", label: "Low" }

  return { level: "none", color: "text-slate-400", label: "None" }
}

// Helper function to format EPSS score as percentage
export function formatEPSSScore(epss: number | null): string {
  if (!epss) return "N/A"
  return `${(epss * 100).toFixed(1)}%`
}

// Helper function to check if CVE is recent (within last 30 days)
export function isRecentCVE(publishedTime: string): boolean {
  const publishedDate = new Date(publishedTime)
  const thirtyDaysAgo = new Date()
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
  return publishedDate > thirtyDaysAgo
}
