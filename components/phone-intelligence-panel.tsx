import React, { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"

export function PhoneIntelligencePanel() {
  const [phone, setPhone] = useState("")
  const [result, setResult] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  const handleLookup = async () => {
    setLoading(true)
    // TODO: Integrate real phone intelligence API
    setTimeout(() => {
      setResult({
        carrier: "T-Mobile",
        location: "Salem, MA",
        type: "Mobile",
        spamScore: 2,
        lastSeen: "2025-08-17",
        notes: "No suspicious activity detected."
      })
      setLoading(false)
    }, 1200)
  }

  return (
    <div className="space-y-4">
      <Input
        placeholder="Enter phone number..."
        value={phone}
        onChange={e => setPhone(e.target.value)}
        className="mb-2"
      />
      <button className="bg-orange-900 text-orange-200 px-4 py-2 rounded shadow" onClick={handleLookup} disabled={loading || !phone.trim()}>
        {loading ? "Looking up..." : "Lookup"}
      </button>
      {result && (
        <Card className="bg-black/70 border border-orange-900 mt-4">
          <CardHeader>
            <CardTitle>Phone Intelligence Result</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Badge className="bg-orange-800 text-orange-100">Carrier: {result.carrier}</Badge>
              <Badge className="bg-orange-800 text-orange-100">Location: {result.location}</Badge>
              <Badge className="bg-orange-800 text-orange-100">Type: {result.type}</Badge>
              <Badge className="bg-orange-800 text-orange-100">Spam Score: {result.spamScore}</Badge>
              <Badge className="bg-orange-800 text-orange-100">Last Seen: {result.lastSeen}</Badge>
              <div className="text-orange-200 text-sm">{result.notes}</div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
