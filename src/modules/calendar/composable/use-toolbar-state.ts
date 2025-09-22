import { useUrlSearchParams } from '@vueuse/core';
import { onBeforeUnmount, onMounted, reactive, watch } from 'vue';

import { EventType, Impact, type IToolbarState, MarketIds } from '@/modules/calendar';

interface IParams {
	country?: string;
	impact?: string;
	event?: string;
	catalog?: string;
	section?: string;
}

function parseEnum<T extends Record<string, string>>(e: T, v?: string | null) {
	if (v == null) {
		return undefined as unknown as T[keyof T] | undefined;
	}
	return (Object.values(e) as string[]).includes(v) ? (v as T[keyof T]) : undefined;
}

export function useToolbarState() {
	const params = useUrlSearchParams<IParams>('history');

	const setParamIfNotDefault = (key: keyof IParams, value: string, defaultValue: string) => {
		params[key] = value !== defaultValue ? value : undefined;
	};

	const state = reactive<IToolbarState>({
		marketId: MarketIds.EntireWorld,
		impact: Impact.All,
		eventType: EventType.All,
		watchlistId: null,
		watchlistSection: null,
	});

	const stopToQuery = watch(state, s => {
		setParamIfNotDefault('country', String(s.marketId), String(MarketIds.EntireWorld));
		setParamIfNotDefault('impact', String(s.impact), String(Impact.All));
		setParamIfNotDefault('event', String(s.eventType), String(EventType.All));
		params.catalog = s.watchlistId ?? undefined;
		params.section = s.watchlistSection ?? undefined;
	}, { deep: true });

	onMounted(() => {
		state.marketId = parseEnum(MarketIds, params.country) ?? state.marketId;
		state.impact = parseEnum(Impact, params.impact) ?? state.impact;
		state.eventType = parseEnum(EventType, params.event) ?? state.eventType;
		state.watchlistId = params.catalog ?? state.watchlistId;
		state.watchlistSection = params.section ?? state.watchlistSection;
	});

	onBeforeUnmount(() => {
		stopToQuery();
	});

	return {
		state,
	};
}
