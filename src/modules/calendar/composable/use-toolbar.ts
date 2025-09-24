import { useUrlSearchParams } from '@vueuse/core';
import { onBeforeUnmount, onMounted, ref, watch } from 'vue';

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

export interface IUseToolbarStateOptions {
	query: boolean;
}

export function useToolbar(options: IUseToolbarStateOptions) {
	const params = options.query ? useUrlSearchParams<IParams>('history') : {};

	const setParamIfNotDefault = (key: keyof IParams, value: string, defaultValue: string) => {
		params[key] = value !== defaultValue ? value : undefined;
	};

	const state = ref<IToolbarState>({
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
		state.value.marketId = parseEnum(MarketIds, params.country) ?? state.value.marketId;
		state.value.impact = parseEnum(Impact, params.impact) ?? state.value.impact;
		state.value.eventType = parseEnum(EventType, params.event) ?? state.value.eventType;
		state.value.watchlistId = params.catalog ?? state.value.watchlistId;
		state.value.watchlistSection = params.section ?? state.value.watchlistSection;
	});

	onBeforeUnmount(() => {
		stopToQuery();
	});

	return {
		state,
	};
}
