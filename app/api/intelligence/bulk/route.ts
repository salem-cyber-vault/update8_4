import { NextRequest, NextResponse } from 'next/server'
import { ComprehensiveIntelligenceAggregator } from '@/lib/comprehensive-intelligence'

// Bulk analysis with queue management
const analysisQueue = new Map<string, {
  id: string
  targets: { target: string; type: string }[]
  status: 'pending' | 'processing' | 'completed' | 'error'
  results: any[]
  progress: number
  startTime: number
  error?: string
}>()

function generateJobId(): string {
  return `bulk_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { targets } = body

    if (!Array.isArray(targets) || targets.length === 0) {
      return NextResponse.json(
        { error: 'Targets array is required and must not be empty' },
        { status: 400 }
      )
    }

    if (targets.length > 100) {
      return NextResponse.json(
        { error: 'Maximum 100 targets allowed per bulk request' },
        { status: 400 }
      )
    }

    // Validate each target
    for (const target of targets) {
      if (!target.target || !target.type) {
        return NextResponse.json(
          { error: 'Each target must have "target" and "type" properties' },
          { status: 400 }
        )
      }
      
      if (!['ip', 'domain', 'email', 'hash', 'url'].includes(target.type)) {
        return NextResponse.json(
          { error: `Invalid type "${target.type}". Must be one of: ip, domain, email, hash, url` },
          { status: 400 }
        )
      }
    }

    const jobId = generateJobId()
    
    // Initialize job
    analysisQueue.set(jobId, {
      id: jobId,
      targets,
      status: 'pending',
      results: [],
      progress: 0,
      startTime: Date.now()
    })

    // Start processing in background
    processBulkAnalysis(jobId)

    return NextResponse.json({
      jobId,
      status: 'pending',
      targetCount: targets.length,
      estimatedTime: targets.length * 2, // 2 seconds per target estimate
      checkUrl: `/api/intelligence/bulk?jobId=${jobId}`
    })

  } catch (error) {
    console.error('Bulk intelligence API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url)
    const jobId = url.searchParams.get('jobId')

    if (!jobId) {
      // Return list of recent jobs (last 10)
      const recentJobs = Array.from(analysisQueue.entries())
        .slice(-10)
        .map(([id, job]) => ({
          id,
          status: job.status,
          targetCount: job.targets.length,
          progress: job.progress,
          startTime: job.startTime,
          duration: Date.now() - job.startTime
        }))

      return NextResponse.json({ jobs: recentJobs })
    }

    const job = analysisQueue.get(jobId)
    if (!job) {
      return NextResponse.json(
        { error: 'Job not found' },
        { status: 404 }
      )
    }

    const response = {
      jobId,
      status: job.status,
      progress: job.progress,
      targetCount: job.targets.length,
      completedCount: job.results.length,
      startTime: job.startTime,
      duration: Date.now() - job.startTime,
      error: job.error
    }

    if (job.status === 'completed') {
      response.results = job.results
      response.summary = generateBulkSummary(job.results)
    }

    return NextResponse.json(response)

  } catch (error) {
    console.error('Bulk status API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

async function processBulkAnalysis(jobId: string) {
  const job = analysisQueue.get(jobId)
  if (!job) return

  job.status = 'processing'
  const aggregator = new ComprehensiveIntelligenceAggregator()

  try {
    for (let i = 0; i < job.targets.length; i++) {
      const target = job.targets[i]
      
      try {
        const result = await aggregator.analyzeTarget(target.target, target.type as any)
        job.results.push({
          target: target.target,
          type: target.type,
          result,
          success: true
        })
      } catch (error) {
        job.results.push({
          target: target.target,
          type: target.type,
          error: error.message,
          success: false
        })
      }

      job.progress = Math.round(((i + 1) / job.targets.length) * 100)
      
      // Small delay to prevent overwhelming APIs
      await new Promise(resolve => setTimeout(resolve, 1000))
    }

    job.status = 'completed'
  } catch (error) {
    job.status = 'error'
    job.error = error.message
  }

  // Clean up old jobs (keep only last 50)
  if (analysisQueue.size > 50) {
    const entries = Array.from(analysisQueue.entries())
    entries.slice(0, -50).forEach(([id]) => {
      analysisQueue.delete(id)
    })
  }
}

function generateBulkSummary(results: any[]) {
  const summary = {
    total: results.length,
    successful: results.filter(r => r.success).length,
    failed: results.filter(r => !r.success).length,
    riskDistribution: {
      low: 0,
      medium: 0,
      high: 0
    },
    topAlerts: new Map(),
    averageRiskScore: 0
  }

  const successfulResults = results.filter(r => r.success)
  let totalRiskScore = 0

  successfulResults.forEach(result => {
    const riskScore = result.result.riskScore || 0
    totalRiskScore += riskScore

    if (riskScore < 40) {
      summary.riskDistribution.low++
    } else if (riskScore < 70) {
      summary.riskDistribution.medium++
    } else {
      summary.riskDistribution.high++
    }

    // Count alert types
    result.result.alerts?.forEach(alert => {
      const count = summary.topAlerts.get(alert.source) || 0
      summary.topAlerts.set(alert.source, count + 1)
    })
  })

  summary.averageRiskScore = successfulResults.length > 0 
    ? Math.round(totalRiskScore / successfulResults.length) 
    : 0

  // Convert Map to object for JSON serialization
  summary.topAlerts = Object.fromEntries(
    Array.from(summary.topAlerts.entries())
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5)
  )

  return summary
}