import * as React from "react";
import AlternativeSearchPanel from "./alternative-search-panel";
import ShadowyCyberLayout from "./ShadowyCyberLayout";
import { AdvancedShodanDashboard } from "./advanced-shodan-dashboard";
import UnifiedGoogleSearch from "./UnifiedGoogleSearch";
import { RealTimeThreatIntelligenceHub } from "./real-time-threat-intelligence-hub";
import { DomainIntelligenceDashboard } from "./domain-intelligence-dashboard";
import { BeginnerGuide } from "./beginner-guide";
import LiveBotnetTracker from "./live-botnet-tracker";
import { RealTimeThreatFeed } from "./real-time-threat-feed";
import { EnhancedCVEIntelligencePanel } from "./enhanced-cve-intelligence-panel";

export default function MainDashboard() {
  return (
    <ShadowyCyberLayout>
      <div>
        <h1 className="text-5xl font-extrabold mb-8 text-center tracking-tight text-violet-400 drop-shadow-lg">Salem Cyber Vault</h1>
        <nav className="flex flex-wrap gap-4 justify-center mb-10">
          <a href="#explore" className="px-4 py-2 rounded bg-cyan-900/60 hover:bg-cyan-800 transition shadow text-cyan-100">Cyber Exploration</a>
          <a href="#shodan" className="px-4 py-2 rounded bg-violet-900/60 hover:bg-violet-800 transition shadow text-violet-100">Shodan Explorer</a>
          <a href="#google-dorks" className="px-4 py-2 rounded bg-violet-900/60 hover:bg-violet-800 transition shadow text-violet-100">Google Dorks</a>
          <a href="#threat-feed" className="px-4 py-2 rounded bg-orange-900/60 hover:bg-orange-800 transition shadow text-orange-100">Live Threat Feed</a>
          <a href="#cve-intel" className="px-4 py-2 rounded bg-red-900/60 hover:bg-red-800 transition shadow text-red-100">CVE Intelligence</a>
          <a href="#alt-search" className="px-4 py-2 rounded bg-green-900/60 hover:bg-green-800 transition shadow text-green-100">Dark Web & Alt Search</a>
          <a href="#botnet-tracker" className="px-4 py-2 rounded bg-green-900/60 hover:bg-green-800 transition shadow text-green-100">Botnet Tracker</a>
          <a href="#reverse-lookup" className="px-4 py-2 rounded bg-gray-900/60 hover:bg-gray-800 transition shadow text-slate-100">Reverse Lookup</a>
          <a href="#education" className="px-4 py-2 rounded bg-gray-900/60 hover:bg-gray-800 transition shadow text-slate-100">Learn Cyber</a>
        </nav>

        {/* Main cyber exploration hub with eye theme and real data */}
        <section id="explore" className="mb-16">
          <h2 className="text-3xl font-bold mb-2 text-cyan-400">Cyber Exploration Hub</h2>
          <p className="mb-4 text-slate-400">Explore live threat intelligence, feeds, and analytics. Everything is clickable, interactive, and powered by real data. Eye theme overlays and backgrounds for immersive experience.</p>
          <div className="relative">
            {/* Eye theme background overlay for this section */}
            <div className="absolute inset-0 z-0 pointer-events-none">
              <svg width="100%" height="100%" viewBox="0 0 1440 320" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full opacity-30">
                <ellipse cx="720" cy="160" rx="600" ry="120" fill="#0f172a" />
                <ellipse cx="720" cy="160" rx="300" ry="60" fill="#38bdf8" />
                <ellipse cx="720" cy="160" rx="100" ry="20" fill="#f43f5e" />
              </svg>
            </div>
            <div className="relative z-10">
              <RealTimeThreatIntelligenceHub />
            </div>
          </div>
        </section>

        <section id="shodan" className="mb-16">
          <h2 className="text-3xl font-bold mb-2 text-violet-400">Shodan Explorer</h2>
          <p className="mb-4 text-slate-400">Explore the cyber world with real Shodan data. No signup required. Search, filter, and learn about devices online.</p>
          <AdvancedShodanDashboard />
        </section>

        <section id="google-dorks" className="mb-16">
          <h2 className="text-3xl font-bold mb-2 text-violet-400">Unified Google Search</h2>
          <p className="mb-4 text-slate-400">Search Google CSE with advanced dorks, see results instantly inside the app.</p>
          <UnifiedGoogleSearch />
        </section>

        <section id="threat-feed" className="mb-16">
          <h2 className="text-3xl font-bold mb-2 text-orange-400">Live Threat Feed</h2>
          <p className="mb-4 text-slate-400">Real-time feed of the latest cyber threats, malware, breaches, and vulnerabilities.</p>
          <RealTimeThreatFeed />
        </section>

        <section id="cve-intel" className="mb-16">
          <h2 className="text-3xl font-bold mb-2 text-red-400">Enhanced CVE Intelligence</h2>
          <p className="mb-4 text-slate-400">Comprehensive vulnerability intelligence, risk scoring, and trending CVEs.</p>
          <EnhancedCVEIntelligencePanel />
        </section>

        <section id="alt-search" className="mb-16">
          <h2 className="text-3xl font-bold mb-2 text-green-400">Dark Web & Alt Search</h2>
          <p className="mb-4 text-slate-400">Search Tor, DuckDuckGo, and privacy-focused engines for hidden services, leaks, and advanced cyber intelligence.</p>
          <AlternativeSearchPanel />
        </section>

        <section id="botnet-tracker" className="mb-16">
          <h2 className="text-3xl font-bold mb-2 text-green-400">Live Botnet Tracker</h2>
          <p className="mb-4 text-slate-400">Track active botnets, C2 servers, and infected hosts in real time using threat intelligence feeds.</p>
          <LiveBotnetTracker />
        </section>

        <section id="threat-map" className="mb-16">
          <h2 className="text-3xl font-bold mb-2 text-cyan-400">Threat Map</h2>
          <p className="mb-4 text-slate-400">Visualize global cyber threats in real time. Interactive and educational for all skill levels.</p>
          <RealTimeThreatIntelligenceHub />
        </section>

        <section id="reverse-lookup" className="mb-16">
          <h2 className="text-3xl font-bold mb-2 text-slate-100">Reverse Number Lookup</h2>
          <p className="mb-4 text-slate-400">Lookup phone numbers, domains, and IPs using cutestat.com, yandex.ru, and more.</p>
          <DomainIntelligenceDashboard />
        </section>

        <section id="education" className="mb-16">
          <h2 className="text-3xl font-bold mb-2 text-slate-100">Cyber Forensics & Learning</h2>
          <p className="mb-4 text-slate-400">Easy explanations and guides for everyday people. Learn cyber forensics and exploration in a beautiful, simple way.</p>
          <BeginnerGuide />
        </section>
      </div>
    </ShadowyCyberLayout>
  );
}
