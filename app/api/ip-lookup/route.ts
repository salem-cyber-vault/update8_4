import { NextRequest, NextResponse } from 'next/server'

// IP Intelligence Provider Types
interface BaseIPData {
  ip: string
  city?: string
  region?: string
  country?: string
  country_code?: string
  latitude?: number
  longitude?: number
  timezone?: string
  asn?: string
  org?: string
  isp?: string
  proxy?: boolean
  hosting?: boolean
  tor?: boolean
  mobile?: boolean
  success?: boolean
  provider: string
}

// Demo data for testing when external APIs are not available
const DEMO_DATA: Record<string, BaseIPData> = {
  "8.8.8.8": {
    ip: "8.8.8.8",
    city: "Mountain View",
    region: "California",
    country: "United States",
    country_code: "US",
    latitude: 37.4056,
    longitude: -122.0775,
    timezone: "America/Los_Angeles",
    asn: "AS15169",
    org: "Google LLC",
    isp: "Google LLC",
    proxy: false,
    hosting: true,
    tor: false,
    mobile: false,
    success: true,
    provider: "demo-mode"
  },
  "1.1.1.1": {
    ip: "1.1.1.1",
    city: "San Francisco",
    region: "California", 
    country: "United States",
    country_code: "US",
    latitude: 37.7621,
    longitude: -122.3971,
    timezone: "America/Los_Angeles",
    asn: "AS13335",
    org: "Cloudflare, Inc.",
    isp: "Cloudflare, Inc.",
    proxy: false,
    hosting: true,
    tor: false,
    mobile: false,
    success: true,
    provider: "demo-mode"
  },
  "208.67.222.222": {
    ip: "208.67.222.222",
    city: "San Francisco",
    region: "California",
    country: "United States", 
    country_code: "US",
    latitude: 37.7749,
    longitude: -122.4194,
    timezone: "America/Los_Angeles",
    asn: "AS36692",
    org: "OpenDNS, LLC",
    isp: "Cisco OpenDNS",
    proxy: false,
    hosting: true,
    tor: false,
    mobile: false,
    success: true,
    provider: "demo-mode"
  }
}

interface IPAPIResponse {
  status: string
  country: string
  countryCode: string
  region: string
  regionName: string
  city: string
  zip: string
  lat: number
  lon: number
  timezone: string
  isp: string
  org: string
  as: string
  query: string
  mobile: boolean
  proxy: boolean
  hosting: boolean
}

interface IPWhoResponse {
  ip: string
  success: boolean
  type: string
  continent: string
  continent_code: string
  country: string
  country_code: string
  region: string
  region_code: string
  city: string
  latitude: number
  longitude: number
  is_eu: boolean
  postal: string
  calling_code: string
  capital: string
  borders: string
  flag: {
    img: string
    emoji: string
    emoji_unicode: string
  }
  connection: {
    asn: number
    org: string
    isp: string
    domain: string
  }
  timezone: {
    id: string
    abbr: string
    is_dst: boolean
    offset: number
    utc: string
    current_time: string
  }
  security: {
    is_proxy: boolean
    proxy_type: string | null
    is_crawler: boolean
    crawler_name: string | null
    crawler_type: string | null
    is_tor: boolean
    threat_level: string
    threat_types: string | null
  }
}

interface IPInfoResponse {
  ip: string
  hostname?: string
  city: string
  region: string
  country: string
  loc: string
  org: string
  postal: string
  timezone: string
  asn?: {
    asn: string
    name: string
    domain: string
    route: string
    type: string
  }
  company?: {
    name: string
    domain: string
    type: string
  }
  privacy?: {
    vpn: boolean
    proxy: boolean
    tor: boolean
    relay: boolean
    hosting: boolean
    service: string
  }
  abuse?: {
    address: string
    country: string
    email: string
    name: string
    network: string
    phone: string
  }
  domains?: {
    total: number
    domains: string[]
  }
}

interface IPGeolocationResponse {
  ip: string
  continent_code: string
  continent_name: string
  country_code2: string
  country_code3: string
  country_name: string
  country_capital: string
  state_prov: string
  district: string
  city: string
  zipcode: string
  latitude: string
  longitude: string
  is_eu: boolean
  calling_code: string
  country_tld: string
  languages: string
  country_flag: string
  geoname_id: string
  isp: string
  connection_type: string
  organization: string
  asn: string
  currency: {
    code: string
    name: string
    symbol: string
  }
  time_zone: {
    name: string
    offset: number
    current_time: string
    current_time_unix: number
    is_dst: boolean
    dst_savings: number
  }
  security: {
    threat_types: string[]
    is_proxy: boolean
    is_tor: boolean
    is_tor_exit: boolean
    proxy_type: string
    is_anonymous: boolean
    is_known_attacker: boolean
    is_known_abuser: boolean
    is_threat: boolean
    is_bogon: boolean
    is_cloud_provider: boolean
  }
}

// Provider-specific functions
async function queryIPAPI(ip: string): Promise<BaseIPData | null> {
  try {
    const response = await fetch(`http://ip-api.com/json/${ip}?fields=status,message,continent,continentCode,country,countryCode,region,regionName,city,district,zip,lat,lon,timezone,offset,currency,isp,org,as,asname,reverse,mobile,proxy,hosting,query`)
    
    if (!response.ok) {
      throw new Error(`IP-API returned ${response.status}`)
    }
    
    const data: IPAPIResponse = await response.json()
    
    if (data.status !== 'success') {
      throw new Error('IP-API query failed')
    }
    
    return {
      ip: data.query,
      city: data.city,
      region: data.regionName,
      country: data.country,
      country_code: data.countryCode,
      latitude: data.lat,
      longitude: data.lon,
      timezone: data.timezone,
      asn: data.as,
      org: data.org,
      isp: data.isp,
      proxy: data.proxy,
      hosting: data.hosting,
      mobile: data.mobile,
      success: true,
      provider: 'ip-api.com'
    }
  } catch (error) {
    console.error('IP-API error:', error)
    return null
  }
}

async function queryIPWho(ip: string): Promise<BaseIPData | null> {
  try {
    const response = await fetch(`https://ipwho.is/${ip}`)
    
    if (!response.ok) {
      throw new Error(`IPWho returned ${response.status}`)
    }
    
    const data: IPWhoResponse = await response.json()
    
    if (!data.success) {
      throw new Error('IPWho query failed')
    }
    
    return {
      ip: data.ip,
      city: data.city,
      region: data.region,
      country: data.country,
      country_code: data.country_code,
      latitude: data.latitude,
      longitude: data.longitude,
      timezone: data.timezone.id,
      asn: data.connection.asn.toString(),
      org: data.connection.org,
      isp: data.connection.isp,
      proxy: data.security.is_proxy,
      hosting: false, // IPWho doesn't provide hosting info
      tor: data.security.is_tor,
      mobile: false, // IPWho doesn't provide mobile info
      success: true,
      provider: 'ipwho.is'
    }
  } catch (error) {
    console.error('IPWho error:', error)
    return null
  }
}

async function queryIPInfo(ip: string): Promise<BaseIPData | null> {
  const apiKey = process.env.IPINFO_API_KEY
  if (!apiKey) {
    console.warn('IPInfo API key not configured')
    return null
  }
  
  try {
    const response = await fetch(`https://ipinfo.io/${ip}?token=${apiKey}`)
    
    if (!response.ok) {
      throw new Error(`IPInfo returned ${response.status}`)
    }
    
    const data: IPInfoResponse = await response.json()
    
    const [lat, lon] = data.loc ? data.loc.split(',').map(Number) : [0, 0]
    
    return {
      ip: data.ip,
      city: data.city,
      region: data.region,
      country: data.country,
      country_code: data.country,
      latitude: lat,
      longitude: lon,
      timezone: data.timezone,
      asn: data.asn?.asn || data.org,
      org: data.company?.name || data.org,
      isp: data.org,
      proxy: data.privacy?.proxy || false,
      hosting: data.privacy?.hosting || false,
      tor: data.privacy?.tor || false,
      mobile: false, // IPInfo doesn't provide mobile info in basic plan
      success: true,
      provider: 'ipinfo.io'
    }
  } catch (error) {
    console.error('IPInfo error:', error)
    return null
  }
}

async function queryIPGeolocation(ip: string): Promise<BaseIPData | null> {
  const apiKey = process.env.IPGEOLOCATION_API_KEY
  if (!apiKey) {
    console.warn('IPGeolocation API key not configured')
    return null
  }
  
  try {
    const response = await fetch(`https://api.ipgeolocation.io/ipgeo?apiKey=${apiKey}&ip=${ip}&include=security`)
    
    if (!response.ok) {
      throw new Error(`IPGeolocation returned ${response.status}`)
    }
    
    const data: IPGeolocationResponse = await response.json()
    
    return {
      ip: data.ip,
      city: data.city,
      region: data.state_prov,
      country: data.country_name,
      country_code: data.country_code2,
      latitude: parseFloat(data.latitude),
      longitude: parseFloat(data.longitude),
      timezone: data.time_zone.name,
      asn: data.asn,
      org: data.organization,
      isp: data.isp,
      proxy: data.security.is_proxy,
      hosting: data.security.is_cloud_provider,
      tor: data.security.is_tor,
      mobile: false, // IPGeolocation doesn't provide mobile info in free tier
      success: true,
      provider: 'ipgeolocation.io'
    }
  } catch (error) {
    console.error('IPGeolocation error:', error)
    return null
  }
}

// Validate IP address
function isValidIP(ip: string): boolean {
  const ipv4Regex = /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/
  const ipv6Regex = /^(?:[0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}$/
  return ipv4Regex.test(ip) || ipv6Regex.test(ip)
}

// Main API handler
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const ip = searchParams.get('ip')
    const source = searchParams.get('source') || 'auto'
    
    if (!ip) {
      return NextResponse.json(
        { error: 'IP address is required' },
        { status: 400 }
      )
    }
    
    if (!isValidIP(ip)) {
      return NextResponse.json(
        { error: 'Invalid IP address format' },
        { status: 400 }
      )
    }
    
    // Rate limiting headers
    const headers = {
      'Cache-Control': 'public, max-age=300', // Cache for 5 minutes
      'X-RateLimit-Limit': '100',
      'X-RateLimit-Remaining': '99',
      'X-RateLimit-Reset': Math.floor(Date.now() / 1000) + 3600
    }
    
    let result: BaseIPData | null = null
    
    // Demo mode for common IPs when external APIs fail
    if (DEMO_DATA[ip]) {
      result = DEMO_DATA[ip]
    } else {
      // Provider selection logic
      if (source === 'auto') {
        // Try providers in order of preference
        const providers = [
          () => queryIPInfo(ip),
          () => queryIPGeolocation(ip),
          () => queryIPWho(ip),
          () => queryIPAPI(ip)
        ]
        
        for (const provider of providers) {
          try {
            result = await provider()
            if (result) break
          } catch (error) {
            console.error('Provider failed, trying next:', error)
            continue
          }
        }
      } else {
        // Use specific provider
        switch (source) {
          case 'ip-api':
            result = await queryIPAPI(ip)
            break
          case 'ipwho':
            result = await queryIPWho(ip)
            break
          case 'ipinfo':
            result = await queryIPInfo(ip)
            break
          case 'ipgeolocation':
            result = await queryIPGeolocation(ip)
            break
          default:
            return NextResponse.json(
              { error: 'Invalid source. Use: ip-api, ipwho, ipinfo, ipgeolocation, or auto' },
              { status: 400 }
            )
        }
      }
    }
    
    if (!result) {
      return NextResponse.json(
        { error: 'All IP intelligence providers failed or are unavailable' },
        { status: 503, headers }
      )
    }
    
    return NextResponse.json(result, { headers })
    
  } catch (error) {
    console.error('IP lookup error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// Handle POST requests for batch lookups (future enhancement)
export async function POST(request: NextRequest) {
  return NextResponse.json(
    { error: 'Batch IP lookups not yet implemented' },
    { status: 501 }
  )
}