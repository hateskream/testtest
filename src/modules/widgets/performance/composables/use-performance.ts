import { computed, ref, watch } from 'vue';
import { z } from 'zod';

import { type IState, getDefaultState, Stock, DateRange, DisplayVariant } from '../model';
import { createStateQueries } from '@/shared/service/data-repo';

export const stateSchema = z.object({
	stock: z.nativeEnum(Stock),
	date: z.nativeEnum(DateRange),
	displayVariant: z.nativeEnum(DisplayVariant),
	isCompactMode: z.boolean(),
});

export type StateSchemaType = z.infer<typeof stateSchema>;


export function usePerformance(widgetId: string) {
	const {
		useStateQuery,
		useStateMutation,
	} = createStateQueries<IState, StateSchemaType>({
		storageKey: '__PERFORMANCE__',
		isSaveChange: true,
		getDefaultState: getDefaultState,
		entityId: widgetId,
		schema: stateSchema,
		hydrateFn: (s: StateSchemaType): IState => s,
		rehydrateFn: (s: IState): StateSchemaType => s,
		urlGet: '',
		urlSet: '',
	});

	const {
		data: dataState,
	} = useStateQuery();
	const { mutate } = useStateMutation();

	const state = ref<IState>(getDefaultState());

	const currentStock = computed({
		get: () => state.value.stock,
		set: (val: Stock) => {
			state.value.stock = val;
		},
	});

	const currentDate = computed({
		get: () => state.value.date,
		set: (val: DateRange) => {
			state.value.date = val;
		},
	});

	const currentDisplayVariant = computed({
		get: () => state.value.displayVariant,
		set: (val: DisplayVariant) => {
			state.value.displayVariant = val;
		},
	});

	const isCompactMode = computed({
		get: () => state.value.isCompactMode,
		set: (val: boolean) => {
			state.value.isCompactMode = val;
		},
	});

	watch(dataState, newState => {
		if (newState) {
			state.value = { ...newState };
		}

	}, { immediate: true });

	watch(state, newState => {
		mutate(newState);
	}, { deep: true });

	function resetAllChanges() {
		state.value = getDefaultState();
	}

	return {
		currentStock,
		currentDate,
		currentDisplayVariant,
		isCompactMode,

		resetAllChanges,
	};
}
