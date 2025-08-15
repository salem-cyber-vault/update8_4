import { createClient } from "@supabase/supabase-js"

// Database types
export interface Investigation {
  id: string
  title: string
  description?: string
  status: "active" | "completed" | "archived"
  priority: "low" | "medium" | "high" | "critical"
  created_at: string
  updated_at: string
  created_by?: string
  targets: string[]
  tags: string[]
}

export interface Finding {
  id: string
  investigation_id: string
  type: "ip" | "domain" | "cve" | "malware" | "indicator" | "note"
  title: string
  content: string
  source: string
  severity: "info" | "low" | "medium" | "high" | "critical"
  verified: boolean
  created_at: string
  updated_at: string
  created_by?: string
  tags: string[]
  metadata: Record<string, any>
}

export interface TimelineEvent {
  id: string
  investigation_id: string
  title: string
  description?: string
  event_type: "discovery" | "analysis" | "correlation" | "action"
  source: string
  severity: "info" | "warning" | "critical"
  event_timestamp: string
  created_at: string
  created_by?: string
  metadata: Record<string, any>
}

export interface IntelligenceCache {
  id: string
  target: string
  source: string
  data: Record<string, any>
  created_at: string
  expires_at: string
}

// Check if Supabase is configured
export const isSupabaseConfigured =
  typeof process.env.NEXT_PUBLIC_SUPABASE_URL === "string" &&
  process.env.NEXT_PUBLIC_SUPABASE_URL.length > 0 &&
  typeof process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY === "string" &&
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY.length > 0

// Create Supabase client
export const supabase = isSupabaseConfigured
  ? createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)
  : null

// Database operations
export class InvestigationDB {
  static async createInvestigation(
    investigation: Omit<Investigation, "id" | "created_at" | "updated_at">,
  ): Promise<Investigation | null> {
    if (!supabase) return null

    const { data, error } = await supabase.from("investigations").insert(investigation).select().single()

    if (error) {
      console.error("Error creating investigation:", error)
      return null
    }

    return data
  }

  static async getInvestigations(): Promise<Investigation[]> {
    if (!supabase) return []

    const { data, error } = await supabase.from("investigations").select("*").order("updated_at", { ascending: false })

    if (error) {
      console.error("Error fetching investigations:", error)
      return []
    }

    return data || []
  }

  static async getInvestigation(id: string): Promise<Investigation | null> {
    if (!supabase) return null

    const { data, error } = await supabase.from("investigations").select("*").eq("id", id).single()

    if (error) {
      console.error("Error fetching investigation:", error)
      return null
    }

    return data
  }

  static async updateInvestigation(id: string, updates: Partial<Investigation>): Promise<Investigation | null> {
    if (!supabase) return null

    const { data, error } = await supabase.from("investigations").update(updates).eq("id", id).select().single()

    if (error) {
      console.error("Error updating investigation:", error)
      return null
    }

    return data
  }

  static async deleteInvestigation(id: string): Promise<boolean> {
    if (!supabase) return false

    const { error } = await supabase.from("investigations").delete().eq("id", id)

    if (error) {
      console.error("Error deleting investigation:", error)
      return false
    }

    return true
  }

  static async addFinding(finding: Omit<Finding, "id" | "created_at" | "updated_at">): Promise<Finding | null> {
    if (!supabase) return null

    const { data, error } = await supabase.from("findings").insert(finding).select().single()

    if (error) {
      console.error("Error adding finding:", error)
      return null
    }

    return data
  }

  static async getFindings(investigationId: string): Promise<Finding[]> {
    if (!supabase) return []

    const { data, error } = await supabase
      .from("findings")
      .select("*")
      .eq("investigation_id", investigationId)
      .order("created_at", { ascending: false })

    if (error) {
      console.error("Error fetching findings:", error)
      return []
    }

    return data || []
  }

  static async updateFinding(id: string, updates: Partial<Finding>): Promise<Finding | null> {
    if (!supabase) return null

    const { data, error } = await supabase.from("findings").update(updates).eq("id", id).select().single()

    if (error) {
      console.error("Error updating finding:", error)
      return null
    }

    return data
  }

  static async addTimelineEvent(event: Omit<TimelineEvent, "id" | "created_at">): Promise<TimelineEvent | null> {
    if (!supabase) return null

    const { data, error } = await supabase.from("timeline_events").insert(event).select().single()

    if (error) {
      console.error("Error adding timeline event:", error)
      return null
    }

    return data
  }

  static async getTimelineEvents(investigationId: string): Promise<TimelineEvent[]> {
    if (!supabase) return []

    const { data, error } = await supabase
      .from("timeline_events")
      .select("*")
      .eq("investigation_id", investigationId)
      .order("event_timestamp", { ascending: false })

    if (error) {
      console.error("Error fetching timeline events:", error)
      return []
    }

    return data || []
  }

  static async cacheIntelligence(target: string, source: string, data: Record<string, any>): Promise<void> {
    if (!supabase) return

    const { error } = await supabase.from("intelligence_cache").upsert({
      target,
      source,
      data,
      expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
    })

    if (error) {
      console.error("Error caching intelligence:", error)
    }
  }

  static async getCachedIntelligence(target: string, source: string): Promise<Record<string, any> | null> {
    if (!supabase) return null

    const { data, error } = await supabase
      .from("intelligence_cache")
      .select("data")
      .eq("target", target)
      .eq("source", source)
      .gt("expires_at", new Date().toISOString())
      .single()

    if (error || !data) {
      return null
    }

    return data.data
  }

  // Real-time subscriptions
  static subscribeToInvestigations(callback: (payload: any) => void) {
    if (!supabase) return null

    return supabase
      .channel("investigations")
      .on("postgres_changes", { event: "*", schema: "public", table: "investigations" }, callback)
      .subscribe()
  }

  static subscribeToFindings(investigationId: string, callback: (payload: any) => void) {
    if (!supabase) return null

    return supabase
      .channel(`findings:${investigationId}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "findings",
          filter: `investigation_id=eq.${investigationId}`,
        },
        callback,
      )
      .subscribe()
  }

  static subscribeToTimelineEvents(investigationId: string, callback: (payload: any) => void) {
    if (!supabase) return null

    return supabase
      .channel(`timeline:${investigationId}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "timeline_events",
          filter: `investigation_id=eq.${investigationId}`,
        },
        callback,
      )
      .subscribe()
  }
}
