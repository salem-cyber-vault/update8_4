"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Activity, Eye, Server, Globe, AlertTriangle } from "lucide-react"
import { getCurrentBotnets, BotnetData } from "@/lib/api-integrations"
import BotnetDetailsModal from "./botnet-details-modal"

export default function LiveBotnetTracker() {
	const [botnets, setBotnets] = useState<BotnetData[]>([])
	const [loading, setLoading] = useState(true)
	const [selectedBotnet, setSelectedBotnet] = useState<BotnetData | null>(null)

	useEffect(() => {
		async function fetchBotnets() {
			setLoading(true)
			try {
				const data = await getCurrentBotnets()
				setBotnets(data)
			} catch (error) {
				// Optionally show error toast
			}
			setLoading(false)
		}
		fetchBotnets()
		const interval = setInterval(fetchBotnets, 60000)
		return () => clearInterval(interval)
	}, [])

	return (
		<Card className="bg-slate-900/40 border-slate-700/50 backdrop-blur-xl">
			<CardHeader>
				<CardTitle className="text-purple-400 flex items-center gap-2">
					<Activity className="w-5 h-5" />
					Live Botnet Tracker
					<Badge variant="outline" className="text-purple-400 border-purple-400 animate-pulse">REAL-TIME</Badge>
				</CardTitle>
			</CardHeader>
			<CardContent className="space-y-6">
				{loading ? (
					<div className="flex items-center justify-center h-64">
						<div className="text-slate-400">Loading botnet data...</div>
					</div>
				) : botnets.length === 0 ? (
					<div className="text-center text-slate-400 py-8">
						<Eye className="w-12 h-12 mx-auto mb-2 opacity-30" />
						<p>No active botnets detected</p>
					</div>
				) : (
					<div className="space-y-3 max-h-96 overflow-y-auto">
						{botnets.map((botnet) => (
							<Card key={botnet.name} className="bg-slate-800/30 border-slate-600">
								<CardContent className="p-4 flex items-center justify-between">
									<div>
										<h4 className="font-medium text-white">{botnet.name}</h4>
										<div className="flex items-center gap-2 text-sm text-slate-400 mt-1">
											<Server className="w-3 h-3" />
											<span>{botnet.size} hosts</span>
											<Globe className="w-3 h-3 ml-2" />
											<span>{botnet.countries.join(", ")}</span>
										</div>
									</div>
									<div className="flex items-center gap-2">
										<Badge variant="outline" className={`text-xs border-slate-500 text-slate-400`}>{botnet.threatLevel.toUpperCase()}</Badge>
										<Button size="sm" variant="outline" onClick={() => setSelectedBotnet(botnet)}>
											Details
										</Button>
									</div>
								</CardContent>
							</Card>
						))}
					</div>
				)}

				{/* Educational Note */}
				<Card className="bg-purple-900/20 border-purple-500/30">
					<CardContent className="p-4">
						<div className="flex items-start gap-3">
							<AlertTriangle className="w-5 h-5 text-purple-400 mt-0.5" />
							<div>
								<h4 className="font-medium text-purple-400 mb-1">What is a Botnet?</h4>
								<p className="text-sm text-purple-300">
									Botnets are networks of compromised devices controlled by attackers. This panel shows live botnet activity detected by threat intelligence feeds. Click "Details" for more info on each botnet family and its C2 servers.
								</p>
							</div>
						</div>
					</CardContent>
				</Card>

				{/* Details Modal */}
				{selectedBotnet && (
					<BotnetDetailsModal botnet={selectedBotnet} onClose={() => setSelectedBotnet(null)} />
				)}
			</CardContent>
		</Card>
	)
}
