"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Search, Globe, Eye } from "lucide-react";

const PRESELECTED_QUERIES = [
  "onion site list",
  "dark web markets",
  "tor hidden wiki",
  "leak database",
  "ransomware news",
  "privacy tools",
  "anonymous email",
  "zero-day exploit forum",
];

export default function AlternativeSearchPanel() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchResults = async (searchQuery: string) => {
    setLoading(true);
    setError("");
    setResults([]);
    try {
      const res = await fetch("/api/alternative-search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: searchQuery })
      });
      const data = await res.json();
      if (Array.isArray(data)) {
        setResults(data);
      } else {
        setResults([]);
      }
    } catch (err) {
      setError("Failed to fetch results.");
    }
    setLoading(false);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchResults(query);
  };

  return (
    <Card className="bg-slate-900/40 border-slate-700/50 shadow-xl">
      <CardHeader>
        <CardTitle className="text-green-400 flex items-center gap-2">
          <Eye className="w-5 h-5" />
          Dark Web & Alt Search
          <Badge variant="outline" className="ml-auto text-green-400 border-green-400">EXPERIMENTAL</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSearch} className="flex gap-2 mb-4">
          <Input
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search Tor, DuckDuckGo, privacy engines..."
            className="bg-slate-800 text-green-300 border-green-700 rounded px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-green-700"
          />
          <Button type="submit" className="bg-green-700 hover:bg-green-800 text-white px-4 py-2 rounded" disabled={loading}>
            {loading ? "Searching..." : <><Search className="w-4 h-4 mr-2" />Search</>}
          </Button>
        </form>
        <div className="mb-4 flex flex-wrap gap-2">
          {PRESELECTED_QUERIES.map(q => (
            <Button
              key={q}
              type="button"
              variant="outline"
              className="border-green-700 text-green-400 bg-slate-800 hover:bg-green-700 hover:text-white text-xs px-3 py-1 rounded transition"
              onClick={() => {
                setQuery(q);
                fetchResults(q);
              }}
              disabled={loading}
            >
              {q}
            </Button>
          ))}
        </div>
        {loading && <div className="text-green-400 mb-2">Searching...</div>}
        {error && <div className="text-red-400 mb-2">{error}</div>}
        <ScrollArea className="max-h-96">
          <ul className="space-y-6">
            {results.map((item, idx) => (
              <li key={item.link || idx} className="flex flex-col gap-2 bg-slate-950 rounded-lg shadow border border-green-800 p-4 transition hover:shadow-lg hover:border-green-700">
                <a
                  href={item.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-green-400 text-lg font-semibold hover:underline hover:text-green-300 transition"
                >
                  {item.title}
                </a>
                <div className="text-slate-400 text-xs mb-1">{item.displayLink}</div>
                <div className="text-slate-100 text-sm">{item.snippet}</div>
                <Badge variant="secondary" className="text-xs bg-green-700">{item.category || "General"}</Badge>
              </li>
            ))}
            {(!loading && results.length === 0) && <div className="text-slate-400">No results found.</div>}
          </ul>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
