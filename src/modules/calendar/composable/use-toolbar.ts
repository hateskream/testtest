import { ref, watch } from 'vue';

import { useToolbarGetState, useToolbarUpdateState } from '@/modules/calendar/query/use-query-toolbar.ts';
import { EventType, Impact, type IToolbarState, MarketIds } from '@/modules/calendar';

export interface IUseToolbarStateOptions {
	widgetId: string;
	useQuery: boolean;
}

export function useToolbar(options: IUseToolbarStateOptions) {
	const toolbar = ref<IToolbarState>(getToolbarDefaultState());

	function getToolbarDefaultState() {
		return {
			marketId: MarketIds.EntireWorld,
			impact: Impact.All,
			eventType: EventType.All,
			watchlistId: null,
			watchlistSection: null,
		};
	}

	const { data } = useToolbarGetState(options.widgetId, options);
	const { mutate } = useToolbarUpdateState(options.widgetId, options);

	watch(data, (newState) => {
		if (newState) {
			toolbar.value = { ...newState };
		}
	}, { deep: true, immediate: true });

	watch(toolbar, (newState) => {
		mutate(newState);
	}, { deep: true });

	return {
		state: toolbar,
		getToolbarDefaultState,
	};
}
