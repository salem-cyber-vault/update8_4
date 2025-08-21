import React, { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"

export function ArchiveExplorerPanel() {
  const [domain, setDomain] = useState("")
  const [result, setResult] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  const handleLookup = async () => {
    setLoading(true)
    // TODO: Integrate Wayback Machine, Yandex cache, etc.
    setTimeout(() => {
      setResult({
        wayback: "https://web.archive.org/web/20230817000000/https://" + domain,
        yandex: "https://yandex.ru/search/?text=url:" + domain,
        cached: "https://www.google.com/search?q=cache:" + domain,
        lastArchived: "2025-08-17",
        notes: "Archive and cache links for research."
      })
      setLoading(false)
    }, 1200)
  }

  return (
    <div className="space-y-4">
      <Input
        placeholder="Enter domain or URL..."
        value={domain}
        onChange={e => setDomain(e.target.value)}
        className="mb-2"
      />
      <button className="bg-yellow-900 text-yellow-200 px-4 py-2 rounded shadow" onClick={handleLookup} disabled={loading || !domain.trim()}>
        {loading ? "Searching..." : "Explore Archive"}
      </button>
      {result && (
        <Card className="bg-black/70 border border-yellow-900 mt-4">
          <CardHeader>
            <CardTitle>Archive & Cache Links</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <a href={result.wayback} target="_blank" rel="noopener noreferrer" className="text-yellow-200 underline">Wayback Machine</a>
              <a href={result.yandex} target="_blank" rel="noopener noreferrer" className="text-yellow-200 underline">Yandex Cache</a>
              <a href={result.cached} target="_blank" rel="noopener noreferrer" className="text-yellow-200 underline">Google Cache</a>
              <Badge className="bg-yellow-800 text-yellow-100">Last Archived: {result.lastArchived}</Badge>
              <div className="text-yellow-200 text-sm">{result.notes}</div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
