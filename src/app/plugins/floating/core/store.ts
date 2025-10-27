import {
	reactive,
	ref,
	toValue,
	computed, nextTick,
} from 'vue';
import {
	autoUpdate,
	flip,
	offset,
	shift,
	useFloating,
	type Middleware,
	type ReferenceElement,
	type UseFloatingReturn,
} from '@floating-ui/vue';

import type { IFloatingOpenPayload, IFloatingSession } from '../types.ts';

export function createFloatingStore(scope: string) {
	const reference = ref<ReferenceElement | null>(null);
	const content = ref<HTMLElement | null>(null);
	const isOpen = ref(false);

	const session = reactive<IFloatingSession>({
		id: 0,
		reference: null,
		content: null,
		options: {},
	});

	const instance = reactive<UseFloatingReturn>(useFloating(reference, content, {
		placement: () => session.options.placement ?? 'bottom-start',
		strategy: () => session.options.strategy ?? 'fixed',
		middleware: computed(() => {
			const base: Middleware[] = [offset(session.options.offset ?? 6), flip(), shift()];
			return session.options.middleware ? base.concat(session.options.middleware) : base;
		}),
	}));

	let cleanup: (() => void) | null = null;

	function updateSession(payload: IFloatingOpenPayload) {
		session.id += 1;
		session.reference = toValue(payload.reference);
		session.content = payload.content;
		session.options = payload.options ?? {};
		session.onClose = payload.onClose;

		reference.value = toValue(session.reference);
	}

	function startAutoUpdate() {
		cleanup?.();
		const refEl = toValue(session.reference);

		if (refEl && content.value) {
			cleanup = autoUpdate(refEl, content.value, instance.update);
		}
	}

	async function open(payload: IFloatingOpenPayload) {
		if (isOpen.value) {
			stop();
		}

		updateSession(payload);
		isOpen.value = true;

		await nextTick();

		startAutoUpdate();
	}

	async function close() {
		if (!isOpen.value) {
			return;
		}

		stop(session.id);
	}

	function stop(id?: number) {
		if (id && id !== session.id) {
			return;
		}

		isOpen.value = false;
		session.reference = null;
		session.content = null;
		session.onClose?.();
		cleanup?.();
		cleanup = null;
	}

	return {
		scope,
		reference,
		content,
		instance,
		session,
		isOpen,
		open,
		close,
		stop,
	};
}
