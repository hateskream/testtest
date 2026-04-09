import { computed, type MaybeRefOrGetter, nextTick, type Ref, ref, toValue, watch } from 'vue';
import { useDebounceFn } from '@vueuse/core';

import type { WidgetState } from '@/modules/dashboard-group';
import { deepCompare } from '@/shared/lib/compare.ts';
import { clone } from '@/shared/lib';

export type UseWidgetStateOptions<State extends WidgetState, HydratedState extends WidgetState = State> = {
	externalState: MaybeRefOrGetter<HydratedState | undefined>;
	getDefaultState: () => State;
	onStateChange: (state: HydratedState) => void;
	rehydrate?: (state: HydratedState) => State;
	hydrate?: (state: State) => HydratedState;
};

export type UseWidgetStateReturn<State extends WidgetState> = {
	state: Ref<State>;
};

export function useWidgetState<
	State extends WidgetState,
	HydratedState extends WidgetState = State,
>(
	options: UseWidgetStateOptions<State, HydratedState>,
): UseWidgetStateReturn<State> {
	const {
		rehydrate = v => v as unknown as State,
		hydrate = v => v as unknown as HydratedState,
		externalState,
		getDefaultState,
		onStateChange,
	} = options;

	const externalStateValue = computed(() => toValue(externalState));

	function getInitialState() {
		if (externalStateValue.value) {
			try {
				return clone(rehydrate(externalStateValue.value));
			} catch (_error) {
				return getDefaultState();
			}
		} else {
			return getDefaultState();
		}
	}

	const state = ref(getInitialState()) as Ref<State>;

	let isSyncingFromExternal = false;

	watch(() => toValue(externalState),
		(newState, oldState) => {
			if (newState) {
				if (deepCompare(newState, oldState)) {
					return;
				}

				isSyncingFromExternal = true;

				state.value = clone(rehydrate(newState));

				void nextTick(() => {
					isSyncingFromExternal = false;
				});
			}
		},
	);

	let snapshot = JSON.stringify(state.value);

	const updateState = useDebounceFn(
		(value: State) => onStateChange(hydrate(value)),
		100,
	);

	watch(state, newState => {
		if (isSyncingFromExternal) {
			return;
		}

		const newSnapshot = JSON.stringify(state.value);

		if (newSnapshot !== snapshot) {
			snapshot = newSnapshot;
			void updateState(newState);
		}
	}, { deep: true });

	return { state };
}

