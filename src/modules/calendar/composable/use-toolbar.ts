import { computed, ref, watch } from 'vue';

import { useToolbarGetState, useToolbarUpdateState } from '@/modules/calendar/query/use-query-toolbar.ts';
import { EventType, getDefaultState, Impact, type IToolbarState, MarketIds } from '@/modules/calendar';
import { getRehydrated } from '@/modules/calendar/services';
import { deepCompare } from '@/shared/lib/compare.ts';

export interface IUseToolbarStateOptions {
	widgetId: string;
	useQuery: boolean;
	defaultState?: string;
}

export function useToolbar(options: IUseToolbarStateOptions) {
	const toolbar = ref<IToolbarState>(
		getRehydrated(getDefaultState(options.defaultState)),
	);

	const { data } = useToolbarGetState(options.widgetId, {
		useQuery: options.useQuery,
		defaultState: getToolbarDefaultState,
	});

	const { mutate } = useToolbarUpdateState(options.widgetId, {
		useQuery: options.useQuery,
		defaultState: getToolbarDefaultState,
	});

	function getToolbarDefaultState() {
		return getDefaultState(options.defaultState);
	}

	watch(data, (newState) => {
		if (newState) {
			toolbar.value = newState;
		}
	}, { deep: true, immediate: true });

	watch(toolbar, (value, oldValue) => {
		if (!deepCompare(value, oldValue)) {
			mutate(value);
		}
	}, { deep: true });

	const marketId = computed<Set<MarketIds>>({
		get: () => toolbar.value.marketId,
		set: (val) => {
			toolbar.value = {
				...toolbar.value,
				marketId: new Set(val),
			};
		},
	});

	const impact = computed<Set<Impact>>({
		get: () => toolbar.value.impact,
		set: (val) => {
			toolbar.value = {
				...toolbar.value,
				impact: new Set(val),
			};
		},
	});

	const eventType = computed<Set<EventType>>({
		get: () => toolbar.value.eventType,
		set: (val) => {
			toolbar.value = {
				...toolbar.value,
				eventType: new Set(val),
			};
		},
	});

	const watchlistId = computed<string | null>({
		get: () => toolbar.value.watchlistId,
		set: (val) => {
			toolbar.value = {
				...toolbar.value,
				watchlistId: val,
			};
		},
	});

	const watchlistSection = computed<string | null>({
		get: () => toolbar.value.watchlistSection,
		set: (val) => {
			toolbar.value = {
				...toolbar.value,
				watchlistSection: val,
			};
		},
	});

	return {
		state: toolbar,
		marketId,
		impact,
		eventType,
		watchlistId,
		watchlistSection,
		getToolbarDefaultState,
	};
}
