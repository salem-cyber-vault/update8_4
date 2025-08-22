'use client';

import React, { useState } from "react";

const PRESELECTED_DORKS = [
  "site:pastebin.com password",
  "intitle:index.of env",
  "filetype:env database",
  "site:github.com api_key",
  "inurl:login.php",
  "site:stackoverflow.com exploit",
  "site:gov inurl:admin",
  "site:edu inurl:login",
];

const UnifiedGoogleSearch: React.FC = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [totalResults, setTotalResults] = useState<string>("");
  const [searchTime, setSearchTime] = useState<string>("");
  const [startIndex, setStartIndex] = useState(1);

  const fetchResults = async (searchQuery: string, index: number = 1) => {
    setLoading(true);
    setError("");
    setResults([]);
    try {
      const res = await fetch("/api/google-search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: searchQuery, startIndex: index })
      });
      const data = await res.json();
      if (data.items) {
        setResults(data.items);
        setTotalResults(data.searchInformation?.totalResults || "");
        setSearchTime(data.searchInformation?.searchTime?.toFixed(2) || "");
      } else {
        setResults([]);
        setTotalResults("");
        setSearchTime("");
      }
    } catch (err) {
      setError("Failed to fetch results.");
    }
    setLoading(false);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setStartIndex(1);
    fetchResults(query, 1);
  };

  const handlePageChange = (newIndex: number) => {
    setStartIndex(newIndex);
    fetchResults(query, newIndex);
  };

  const highlightText = (text: string) => {
    if (!query) { return text; }
    const terms = query.split(/\s+/).filter(Boolean);
    const regex = new RegExp(`(${terms.map(t => t.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join("|")})`, "gi");
    return text.replace(regex, match => `<span class='bg-yellow-400 text-black px-1 rounded'>${match}</span>`);
  };

  return (
    <div className="bg-zinc-900 text-zinc-100 rounded-lg p-6 shadow-lg">
      <form onSubmit={handleSearch} className="flex gap-2 mb-4">
        <input
          type="text"
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="Search Google..."
          className="bg-zinc-800 text-zinc-100 border border-violet-700 rounded px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-violet-700"
        />
        <button
          type="submit"
          className="bg-violet-700 text-white px-4 py-2 rounded hover:bg-violet-800"
          disabled={loading}
        >
          {loading ? "Searching..." : "Search"}
        </button>
      </form>
      <div className="mb-4 flex flex-wrap gap-2">
        {PRESELECTED_DORKS.map(dork => (
          <button
            key={dork}
            type="button"
            className="bg-zinc-800 text-violet-400 border border-violet-700 rounded px-3 py-1 text-xs hover:bg-violet-700 hover:text-white transition"
            onClick={() => {
              setQuery(dork);
              setStartIndex(1);
              fetchResults(dork, 1);
            }}
            disabled={loading}
          >
            {dork}
          </button>
        ))}
      </div>
      {loading && <div className="text-violet-400 mb-2">Searching...</div>}
      {error && <div className="text-red-400 mb-2">{error}</div>}
      {totalResults && (
        <div className="mb-2 text-sm text-zinc-400">
          <span className="font-semibold text-violet-400">{totalResults}</span> results in <span className="font-semibold text-violet-400">{searchTime}s</span>
        </div>
      )}
      {results.length === 0 && !loading && !error && (
        <div className="text-zinc-400">No results found.</div>
      )}
      <ul className="space-y-6">
        {results.map(item => (
          <li
            key={item.link}
            className="flex flex-col md:flex-row gap-4 items-start bg-zinc-950 rounded-lg shadow border border-zinc-800 p-4 transition hover:shadow-lg hover:border-violet-700"
            style={{ fontFamily: 'Roboto, Arial, sans-serif' }}
          >
            {item.pagemap?.cse_thumbnail?.[0]?.src ? (
              <img src={item.pagemap.cse_thumbnail[0].src} alt="thumbnail" className="w-24 h-24 object-cover rounded border border-zinc-700 mt-1" />
            ) : (
              <div className="w-24 h-24 bg-zinc-800 rounded border border-zinc-700 flex items-center justify-center text-zinc-600 mt-1">No Image</div>
            )}
            <div className="flex-1">
              <a
                href={item.link}
                target="_blank"
                rel="noopener noreferrer"
                className="text-violet-400 text-lg md:text-xl font-semibold hover:underline hover:text-violet-300 transition"
                style={{ fontFamily: 'Roboto, Arial, sans-serif' }}
              >
                <span dangerouslySetInnerHTML={{ __html: highlightText(item.title) }} />
              </a>
              <div className="text-zinc-400 text-xs mb-1" style={{ fontFamily: 'Roboto, Arial, sans-serif' }}>{item.displayLink}</div>
              <div className="text-zinc-100 text-sm" style={{ fontFamily: 'Roboto, Arial, sans-serif' }} dangerouslySetInnerHTML={{ __html: highlightText(item.snippet) }} />
            </div>
          </li>
        ))}
      </ul>
      {/* Pagination */}
      {totalResults && Number(totalResults) > 10 && (
        <div className="flex justify-center items-center gap-2 mt-6">
          <button
            className="bg-zinc-800 text-violet-400 px-3 py-1 rounded border border-violet-700 disabled:opacity-50"
            disabled={startIndex <= 1}
            onClick={() => handlePageChange(startIndex - 10)}
          >
            Previous
          </button>
          <span className="text-zinc-400">Page {Math.ceil(startIndex / 10)}</span>
          <button
            className="bg-zinc-800 text-violet-400 px-3 py-1 rounded border border-violet-700 disabled:opacity-50"
            disabled={startIndex + 10 > Number(totalResults)}
            onClick={() => handlePageChange(startIndex + 10)}
          >
            Next
          </button>
        </div>
      )}
      <style>{`.bg-yellow-400 { background-color: #facc15 !important; color: #18181b !important; }`}</style>
    </div>
  );
};

export default UnifiedGoogleSearch;
