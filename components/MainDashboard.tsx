import * as React from "react";
import ShadowyCyberLayout from "./ShadowyCyberLayout";
import { AdvancedShodanDashboard } from "./advanced-shodan-dashboard";
import UnifiedGoogleSearch from "./UnifiedGoogleSearch";
import { RealTimeThreatIntelligenceHub } from "./real-time-threat-intelligence-hub";
import { DomainIntelligenceDashboard } from "./domain-intelligence-dashboard";
import { BeginnerGuide } from "./beginner-guide";
import LiveBotnetTracker from "./live-botnet-tracker";

export default function MainDashboard() {
  return (
    <ShadowyCyberLayout>
      <h1 className="text-4xl font-bold mb-6 text-center tracking-tight">Shadowy Cyber Exploration</h1>
      <nav className="flex flex-wrap gap-4 justify-center mb-8">
        <a href="#shodan" className="px-4 py-2 rounded bg-gray-900/60 hover:bg-gray-800 transition shadow text-slate-100">Shodan Explorer</a>
        <a href="#google-dorks" className="px-4 py-2 rounded bg-gray-900/60 hover:bg-gray-800 transition shadow text-slate-100">Google Dorks</a>
        <a href="#threat-map" className="px-4 py-2 rounded bg-gray-900/60 hover:bg-gray-800 transition shadow text-slate-100">Threat Map</a>
        <a href="#reverse-lookup" className="px-4 py-2 rounded bg-gray-900/60 hover:bg-gray-800 transition shadow text-slate-100">Reverse Lookup</a>
        <a href="#education" className="px-4 py-2 rounded bg-gray-900/60 hover:bg-gray-800 transition shadow text-slate-100">Learn Cyber</a>
      </nav>
      <section id="shodan" className="mb-12">
        <h2 className="text-2xl font-semibold mb-2">Shodan Explorer</h2>
        <p className="mb-4 text-slate-400">Explore the cyber world with real Shodan data. No signup required. Search, filter, and learn about devices online.</p>
        <AdvancedShodanDashboard />
      </section>
      <section id="unified-google" className="mb-12">
        <h2 className="text-2xl font-semibold mb-2">Old Google + Google CSE + Advanced Dorks</h2>
        <p className="mb-4 text-slate-400">Classic Google experience with dorks and CSE results, all in one panel.</p>
        <UnifiedGoogleSearch apiKey={process.env.NEXT_PUBLIC_GOOGLE_API_KEY!} cseId={"26754e5f5ae0a4628"} />
      </section>
      <section id="botnet-tracker" className="mb-12">
        <h2 className="text-2xl font-semibold mb-2">Live Botnet Tracker</h2>
        <p className="mb-4 text-slate-400">Track active botnets, C2 servers, and infected hosts in real time using threat intelligence feeds.</p>
        <LiveBotnetTracker />
      </section>
      <section id="threat-map" className="mb-12">
        <h2 className="text-2xl font-semibold mb-2">Threat Map</h2>
        <p className="mb-4 text-slate-400">Visualize global cyber threats in real time. Interactive and educational for all skill levels.</p>
        <RealTimeThreatIntelligenceHub />
      </section>
      <section id="reverse-lookup" className="mb-12">
        <h2 className="text-2xl font-semibold mb-2">Reverse Number Lookup</h2>
        <p className="mb-4 text-slate-400">Lookup phone numbers, domains, and IPs using cutestat.com, yandex.ru, and more.</p>
        <DomainIntelligenceDashboard />
      </section>
      <section id="education" className="mb-12">
        <h2 className="text-2xl font-semibold mb-2">Cyber Forensics & Learning</h2>
        <p className="mb-4 text-slate-400">Easy explanations and guides for everyday people. Learn cyber forensics and exploration in a beautiful, simple way.</p>
        <BeginnerGuide />
      </section>
    </ShadowyCyberLayout>
  );
}
