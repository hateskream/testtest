import { ref, watch } from 'vue';

import { useToolbarGetState, useToolbarUpdateState } from '@/modules/calendar/query/use-query-toolbar.ts';
import { getDefaultState, type IToolbarState } from '@/modules/calendar';

export interface IUseToolbarStateOptions {
	widgetId: string;
	useQuery: boolean;
	defaultState?: string;
}

export function useToolbar(options: IUseToolbarStateOptions) {
	const toolbar = ref<IToolbarState>(getDefaultState(options.defaultState));

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
