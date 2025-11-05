import type { Ref } from 'vue';
import { ref } from 'vue';

interface IMachine<S> {
	[k: string]: { [k: string]: S };
}
type MachineState<T> = keyof T;
type MachineEvent<T> = keyof UnionToIntersection<T[keyof T]>;

// 🤯 https://fettblog.eu/typescript-union-to-intersection/
type UnionToIntersection<T> = (T extends unknown ? (x: T) => unknown : never) extends (
	x: infer R
) => unknown
	? R
	: never;

export function useStateMachine<M>(
	initialState: MachineState<M>,
	machine: M & IMachine<MachineState<M>>,
) {
	const state = ref(initialState) as Ref<MachineState<M>>;

	function reducer(event: MachineEvent<M>) {
		// @ts-expect-error: state.value is keyof M
		const nextState = machine[state.value][event];
		return nextState ?? state.value;
	}

	const dispatch = (event: MachineEvent<M>) => {
		state.value = reducer(event);
	};

	return {
		state,
		dispatch,
	};
}
