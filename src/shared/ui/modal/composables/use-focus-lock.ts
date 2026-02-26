import { type MaybeRef, onBeforeUnmount, readonly, ref, toValue } from 'vue';
import { onElementRemoval } from '@vueuse/core';

import { lockFocus, unlockFocus } from '../utils';

export function useFocusLock(element: MaybeRef<HTMLElement | null>) {
	const isLocked = ref(false);

	onElementRemoval(element, () => {
		unlock();
	});

	onBeforeUnmount(unlock);

	function lock() {
		if (!isLocked.value) {
			const el = toValue(element);

			if (el) {
				lockFocus(el);
				isLocked.value = true;
			}
		}
	}

	function unlock() {
		if (isLocked.value) {
			const el = toValue(element);

			if (el) {
				unlockFocus(el);
				isLocked.value = false;
			}
		}
	}

	return {
		isLocked: readonly(isLocked),
		lock,
		unlock,
	};
}
