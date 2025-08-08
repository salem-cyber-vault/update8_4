import { NextRequest, NextResponse } from 'next/server'
import { ComprehensiveIntelligenceAggregator } from '@/lib/comprehensive-intelligence'

// Rate limiting
const requestCounts = new Map<string, { count: number; resetTime: number }>()
const RATE_LIMIT_WINDOW = 60 * 1000 // 1 minute
const MAX_REQUESTS_PER_WINDOW = 10

function getRateLimitKey(req: NextRequest): string {
  const forwarded = req.headers.get('x-forwarded-for')
  const ip = forwarded ? forwarded.split(',')[0] : req.ip || 'anonymous'
  return ip
}

function checkRateLimit(key: string): boolean {
  const now = Date.now()
  const requestData = requestCounts.get(key)

  if (!requestData || now > requestData.resetTime) {
    requestCounts.set(key, { count: 1, resetTime: now + RATE_LIMIT_WINDOW })
    return true
  }

  if (requestData.count >= MAX_REQUESTS_PER_WINDOW) {
    return false
  }

  requestData.count++
  return true
}

export async function POST(req: NextRequest) {
  try {
    // Rate limiting
    const rateLimitKey = getRateLimitKey(req)
    if (!checkRateLimit(rateLimitKey)) {
      return NextResponse.json(
        { error: 'Rate limit exceeded. Please wait before making another request.' },
        { status: 429 }
      )
    }

    const body = await req.json()
    const { target, type } = body

    // Validate input
    if (!target || !type) {
      return NextResponse.json(
        { error: 'Target and type are required' },
        { status: 400 }
      )
    }

    if (!['ip', 'domain', 'email', 'hash', 'url'].includes(type)) {
      return NextResponse.json(
        { error: 'Invalid type. Must be one of: ip, domain, email, hash, url' },
        { status: 400 }
      )
    }

    // Basic input validation
    const targetStr = String(target).trim()
    if (targetStr.length === 0 || targetStr.length > 2048) {
      return NextResponse.json(
        { error: 'Invalid target length' },
        { status: 400 }
      )
    }

    // Validate target format based on type
    switch (type) {
      case 'ip':
        const ipRegex = /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/
        if (!ipRegex.test(targetStr)) {
          return NextResponse.json(
            { error: 'Invalid IP address format' },
            { status: 400 }
          )
        }
        break
      case 'domain':
        const domainRegex = /^(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?\.)*[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?$/
        if (!domainRegex.test(targetStr)) {
          return NextResponse.json(
            { error: 'Invalid domain format' },
            { status: 400 }
          )
        }
        break
      case 'email':
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!emailRegex.test(targetStr)) {
          return NextResponse.json(
            { error: 'Invalid email format' },
            { status: 400 }
          )
        }
        break
      case 'hash':
        const hashRegex = /^[a-fA-F0-9]+$/
        if (!hashRegex.test(targetStr) || ![32, 40, 64, 128].includes(targetStr.length)) {
          return NextResponse.json(
            { error: 'Invalid hash format (must be MD5, SHA1, SHA256, or SHA512)' },
            { status: 400 }
          )
        }
        break
      case 'url':
        try {
          new URL(targetStr)
        } catch {
          return NextResponse.json(
            { error: 'Invalid URL format' },
            { status: 400 }
          )
        }
        break
    }

    // Perform intelligence analysis
    const aggregator = new ComprehensiveIntelligenceAggregator()
    const result = await aggregator.analyzeTarget(targetStr, type as any)

    // Add processing metadata
    const response = {
      ...result,
      metadata: {
        processingTime: Date.now() - parseInt(result.timestamp),
        serverTimestamp: new Date().toISOString(),
        sourceCount: Object.keys(result.sources).length,
        successfulSources: Object.keys(result.sources).filter(key => !result.sources[key].error).length,
        version: '1.0.0'
      }
    }

    return NextResponse.json(response)

  } catch (error) {
    console.error('Intelligence API error:', error)
    
    return NextResponse.json(
      { 
        error: 'Internal server error', 
        message: process.env.NODE_ENV === 'development' ? error.message : undefined 
      },
      { status: 500 }
    )
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'Salem Cyber Vault Intelligence API',
    version: '1.0.0',
    endpoints: {
      analyze: 'POST /api/intelligence',
      methods: ['ip', 'domain', 'email', 'hash', 'url']
    },
    rateLimit: {
      window: '1 minute',
      maxRequests: MAX_REQUESTS_PER_WINDOW
    }
  })
}