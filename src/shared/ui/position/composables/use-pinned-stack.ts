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

	function push(level: number, close: () => void) {
		// eslint-disable-next-line no-plusplus
		const item: IPinnedItem = { id: ++uid, level, close };
		stack.value.push(item);
		return () => remove(item.id);
	}

	function remove(id: number) {
		const i = stack.value.findIndex((x) => x.id === id);
		if (i !== -1) {
			stack.value.splice(i, 1);
		}
	}

	function closeLast() {
		const last = stack.value.pop();
		last?.close();
	}

	function closeLevel(level: number) {
		for (let i = stack.value.length - 1; i >= 0; i-=1) {
			const item = stack.value[i];
			if (item.level >= level) {
				stack.value.splice(i, 1);
				item.close();
			}
		}
	}

	function top() {
		return stack.value[stack.value.length - 1];
	}

	function hasPinned() {
		return stack.value.length > 0;
	}

	provide(PINNED_STACK_KEY, { push, remove, closeLast, closeLevel, top, hasPinned });
	return { push, remove, closeLast, closeLevel, top, hasPinned };
}

export function usePinnedStack() {
	return inject<ReturnType<typeof providePinnedStack>>(PINNED_STACK_KEY)!;
}
