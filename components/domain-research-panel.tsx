import React, { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"

export function DomainResearchPanel() {
  const [domain, setDomain] = useState("")
  const [result, setResult] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  const handleLookup = async () => {
    setLoading(true)
    // TODO: Integrate WHOIS, DNS, CuteStat, etc.
    setTimeout(() => {
      setResult({
        registrar: "Namecheap",
        created: "2012-04-01",
        expires: "2026-04-01",
        status: "Active",
        cuteStat: "https://www.cutestat.com/info/" + domain,
        whois: "https://who.is/whois/" + domain,
        notes: "Domain research links and summary."
      })
      setLoading(false)
    }, 1200)
  }

  return (
    <div className="space-y-4">
      <Input
        placeholder="Enter domain..."
        value={domain}
        onChange={e => setDomain(e.target.value)}
        className="mb-2"
      />
      <button className="bg-green-900 text-green-200 px-4 py-2 rounded shadow" onClick={handleLookup} disabled={loading || !domain.trim()}>
        {loading ? "Searching..." : "Research Domain"}
      </button>
      {result && (
        <Card className="bg-black/70 border border-green-900 mt-4">
          <CardHeader>
            <CardTitle>Domain Research Result</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Badge className="bg-green-800 text-green-100">Registrar: {result.registrar}</Badge>
              <Badge className="bg-green-800 text-green-100">Created: {result.created}</Badge>
              <Badge className="bg-green-800 text-green-100">Expires: {result.expires}</Badge>
              <Badge className="bg-green-800 text-green-100">Status: {result.status}</Badge>
              <a href={result.cuteStat} target="_blank" rel="noopener noreferrer" className="text-green-200 underline">CuteStat</a>
              <a href={result.whois} target="_blank" rel="noopener noreferrer" className="text-green-200 underline">WHOIS</a>
              <div className="text-green-200 text-sm">{result.notes}</div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
