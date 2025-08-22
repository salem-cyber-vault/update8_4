import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { BotnetData } from "@/lib/api-integrations"
import { Eye, Server, Globe, X, Shield } from "lucide-react"

export default function BotnetDetailsModal({ botnet, onClose }: { botnet: BotnetData; onClose: () => void }) {
	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
			<Card className="w-full max-w-lg bg-slate-900 border-slate-700 shadow-xl">
				<CardHeader className="flex-row items-center justify-between">
					<CardTitle className="text-purple-400 flex items-center gap-2">
						<Server className="w-5 h-5" />
						{botnet.name} Botnet Details
						<Badge variant="outline" className="text-purple-400 border-purple-400 ml-2">{botnet.threatLevel.toUpperCase()}</Badge>
					</CardTitle>
					<Button size="icon" variant="ghost" onClick={onClose}><X className="w-5 h-5" /></Button>
				</CardHeader>
				<CardContent className="space-y-4">
					<div className="flex flex-col gap-2">
						<div className="flex items-center gap-2">
							<Globe className="w-4 h-4 text-purple-400" />
							<span className="text-slate-300">Countries:</span>
							<span className="text-slate-400">{botnet.countries.join(", ")}</span>
						</div>
						<div className="flex items-center gap-2">
							<Server className="w-4 h-4 text-purple-400" />
							<span className="text-slate-300">C2 Servers:</span>
							<span className="text-slate-400">{botnet.c2Servers.join(", ") || "N/A"}</span>
						</div>
						<div className="flex items-center gap-2">
							<Shield className="w-4 h-4 text-purple-400" />
							<span className="text-slate-300">Affected Ports:</span>
							<span className="text-slate-400">{botnet.affectedPorts.join(", ") || "N/A"}</span>
						</div>
						<div className="flex items-center gap-2">
							<Eye className="w-4 h-4 text-purple-400" />
							<span className="text-slate-300">Last Seen:</span>
							<span className="text-slate-400">{new Date(botnet.lastSeen).toLocaleString()}</span>
						</div>
					</div>
					<div className="mt-4">
						<h4 className="font-semibold text-slate-200 mb-1">Description</h4>
						<p className="text-sm text-slate-400">{botnet.description}</p>
					</div>
				</CardContent>
			</Card>
		</div>
	)
}
