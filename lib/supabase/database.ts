import { supabase } from './client'
import { Investigation, Finding, TimelineEvent } from '@/components/forensic-investigation-workspace'

export type { Investigation, Finding, TimelineEvent }

export const InvestigationDB = {
	async getInvestigations() {
		const { data, error } = await supabase
			.from('investigations')
			.select('*')
			.order('created_at', { ascending: false })
		if (error) throw error
		return data || []
	},

	async createInvestigation(investigation) {
		const { data, error } = await supabase
			.from('investigations')
			.insert([investigation])
			.select()
			.single()
		if (error) throw error
		return data
	},

	async addFinding(finding) {
		const { data, error } = await supabase
			.from('findings')
			.insert([finding])
			.select()
			.single()
		if (error) throw error
		return data
	},

	async getFindings(investigationId) {
		const { data, error } = await supabase
			.from('findings')
			.select('*')
			.eq('investigation_id', investigationId)
			.order('created_at', { ascending: true })
		if (error) throw error
		return data || []
	},

	async addTimelineEvent(event) {
		const { data, error } = await supabase
			.from('timeline_events')
			.insert([event])
			.select()
			.single()
		if (error) throw error
		return data
	},

	async getTimelineEvents(investigationId) {
		const { data, error } = await supabase
			.from('timeline_events')
			.select('*')
			.eq('investigation_id', investigationId)
			.order('event_timestamp', { ascending: true })
		if (error) throw error
		return data || []
	},

	// Dummy real-time subscription methods (implement with supabase.realtime if needed)
	subscribeToInvestigations(callback) {
		// Implement real-time subscription if needed
		return { unsubscribe: () => {} }
	},
	subscribeToFindings(investigationId, callback) {
		// Implement real-time subscription if needed
		return { unsubscribe: () => {} }
	},
	subscribeToTimelineEvents(investigationId, callback) {
		// Implement real-time subscription if needed
		return { unsubscribe: () => {} }
	},
}

export async function getUserProfile(userId) {
	const { data, error } = await supabase
		.from('profiles')
		.select('*')
		.eq('id', userId)
		.single()
	return { data, error }
}
