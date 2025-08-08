import { NextRequest, NextResponse } from 'next/server'

const WHOISXML_API_KEY = process.env.WHOISXML_API_KEY
const WHOISXML_BASE_URL = 'https://www.whoisxmlapi.com/whoisserver/WhoisService'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const domain = searchParams.get('domain')
    
    if (!domain) {
      return NextResponse.json({ error: 'Domain parameter is required' }, { status: 400 })
    }

    if (!WHOISXML_API_KEY) {
      return NextResponse.json({ 
        error: 'WhoisXML API key not configured',
        fallback: {
          domainName: domain,
          registrar: 'Example Registrar',
          registrantName: 'Privacy Protected',
          registrantOrganization: 'REDACTED FOR PRIVACY',
          createdDate: '2020-01-01T00:00:00Z',
          expiresDate: '2025-01-01T00:00:00Z',
          updatedDate: '2024-01-01T00:00:00Z',
          status: ['clientTransferProhibited'],
          nameServers: ['ns1.example.com', 'ns2.example.com'],
          dnssec: 'unsigned'
        }
      }, { status: 200 })
    }

    const response = await fetch(
      `${WHOISXML_BASE_URL}?apiKey=${WHOISXML_API_KEY}&domainName=${encodeURIComponent(domain)}&outputFormat=JSON`
    )

    if (!response.ok) {
      throw new Error(`WhoisXML API error: ${response.status}`)
    }

    const data = await response.json()
    return NextResponse.json(data)

  } catch (error) {
    console.error('WHOIS lookup failed:', error)
    return NextResponse.json(
      { error: 'Failed to fetch WHOIS data' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const { domain, action } = await request.json()
    
    if (!domain) {
      return NextResponse.json({ error: 'Domain parameter is required' }, { status: 400 })
    }

    if (!WHOISXML_API_KEY) {
      return NextResponse.json({ 
        error: 'WhoisXML API key not configured' 
      }, { status: 500 })
    }

    let endpoint = WHOISXML_BASE_URL
    let params = `apiKey=${WHOISXML_API_KEY}&domainName=${encodeURIComponent(domain)}&outputFormat=JSON`

    // Handle different WHOIS actions
    switch (action) {
      case 'history':
        endpoint = 'https://whois-history.whoisxmlapi.com/api/v1'
        break
      case 'reverse':
        endpoint = 'https://reverse-whois.whoisxmlapi.com/api/v2'
        break
      default:
        // Standard WHOIS lookup
        break
    }

    const response = await fetch(`${endpoint}?${params}`)

    if (!response.ok) {
      throw new Error(`WhoisXML API error: ${response.status}`)
    }

    const data = await response.json()
    return NextResponse.json(data)

  } catch (error) {
    console.error('WHOIS operation failed:', error)
    return NextResponse.json(
      { error: 'Failed to perform WHOIS operation' },
      { status: 500 }
    )
  }
}