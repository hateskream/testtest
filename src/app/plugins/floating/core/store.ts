import {
	reactive,
	ref,
	toValue,
	computed,
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
import { createClickOutsideHandler, matchesTrigger } from '../utils';

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
		strategy: () => session.options.strategy ?? 'absolute',
		middleware: computed(() => {
			const base: Middleware[] = [offset(session.options.offset ?? 6), flip(), shift()];
			return session.options.middleware ? base.concat(session.options.middleware) : base;
		}),
	}));

	let cleanup: (() => void) | null = null;

	function startAutoUpdate() {
		cleanup?.();
		const refEl = toValue(session.reference);

		if (refEl && content.value) {
			cleanup = autoUpdate(refEl, content.value, instance.update);
		}
	}

	function handleClickOutside(e: PointerEvent) {
		createClickOutsideHandler(e, reference.value, content.value, stop);
	}

	function handleMouseLeave() {
		stop();
	}

	function addEventListeners() {
		const { trigger } = session.options;

		if (!trigger) {
			return;
		}

		if (matchesTrigger(trigger, ['click', 'contextmenu'])) {
			document.addEventListener('pointerdown', handleClickOutside, true);
		}
		if (matchesTrigger(trigger, 'hover')) {
			content.value?.addEventListener('mouseleave', handleMouseLeave, true);
		}
	}

	function removeEventListeners() {
		document.removeEventListener('pointerdown', handleClickOutside, true);
		content.value?.removeEventListener('mouseleave', handleMouseLeave, true);
	}

	function open(payload: IFloatingOpenPayload) {
		if (isOpen.value) {
			stop();
		}

		const opts = payload.options ?? {};

		session.id += 1;
		session.reference = toValue(payload.reference);
		session.content = payload.content;
		session.options = opts;
		session.onClose = payload.onClose;

		reference.value = toValue(payload.reference);
		isOpen.value = true;

		addEventListeners();
		startAutoUpdate();
	}

	function close(immediate = false) {
		if (!isOpen.value) {
			return;
		}

		if (immediate) {
			stop();
			return;
		}

		const delay = session.options.hideDelayMs ?? 0;
		setTimeout(() => stop(), delay);
	}

	function stop() {
		removeEventListeners();

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
