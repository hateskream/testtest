import type { ToolbarSchemaType } from '@/modules/calendar/services/schema.ts';
import type { IToolbarState } from '@/modules/calendar';

export function getRehydrated(data: ToolbarSchemaType): IToolbarState {
	return {
		marketId: new Set(data.marketId),
		impact: new Set(data.impact),
		eventType: new Set(data.eventType),
		watchlistId: data.watchlistId,
		watchlistSection: data.watchlistSection,
	};
}

export function getHydrated(data: IToolbarState): ToolbarSchemaType {
	return {
		marketId: Array.from(data.marketId),
		impact: Array.from(data.impact),
		eventType: Array.from(data.eventType),
		watchlistId: data.watchlistId,
		watchlistSection: data.watchlistSection,
	};
}
