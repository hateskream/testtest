import { inject, provide, ref } from 'vue';

interface IPinnedItem {
	id: number;
	level: number;
	close: () => void;
}

const PINNED_STACK_KEY = Symbol('PINNED_STACK');

export function providePinnedStack() {
	const stack = ref<IPinnedItem[]>([]);
	let uid = 0;

	function nextId() {
		uid = uid + 1;
		return uid;
	}

	function push(level: number, close: () => void) {
		closeLevel(level);

		const item: IPinnedItem = { id: nextId(), level, close };
		stack.value.push(item);

		return () => remove(item.id);
	}

	function remove(id: number) {
		const index = stack.value.findIndex(item => item.id === id);

		if (index >= 0) {
			const [item] = stack.value.splice(index, 1);
			item.close();
		}
	}

	function closeLast() {
		const item = stack.value.pop();

		if (item) {
			item.close();
		}
	}

	function closeLevel(level: number) {
		for (let index = stack.value.length - 1; index >= 0; index = index - 1) {
			const item = stack.value[index];

			if (item.level >= level) {
				stack.value.splice(index, 1);
				item.close();
			}
		}
	}

	function top() {
		return stack.value.length ? stack.value[stack.value.length - 1] : undefined;
	}

	function hasPinned() {
		return stack.value.length > 0;
	}

	function hasPinnedLevel(level: number) {
		return stack.value.some(item => item.level >= level);
	}

	function clear() {
		for (let index = stack.value.length - 1; index >= 0; index = index - 1) {
			stack.value[index].close();
		}
		stack.value = [];
		uid = 0;
	}

	const api = {
		push,
		remove,
		closeLast,
		closeLevel,
		top,
		hasPinned,
		hasPinnedLevel,
		clear,
	};

	provide(PINNED_STACK_KEY, api);
	return api;
}

export function usePinnedStack() {
	return inject<ReturnType<typeof providePinnedStack> | undefined>(PINNED_STACK_KEY, undefined);
}
