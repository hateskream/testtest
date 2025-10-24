import type { ReferenceElement } from '@floating-ui/vue';

function isInsideFloatingList(e: Event) {
	const path = (e.composedPath?.() ?? []) as EventTarget[];

	for (const t of path) {
		if (t instanceof Element && t.closest('[data-floating-submenu]')) {
			return true;
		}
	}

	return false;
}

export function createClickOutsideHandler(
	e: PointerEvent,
	trigger: ReferenceElement | null,
	floating: HTMLElement | null,
	stop: () => void,
) {
	if (isInsideFloatingList(e)) {
		return;
	}

	const rootId =
		(floating as HTMLElement)?.getAttribute?.('data-floating-root') ??
		(trigger as HTMLElement)?.getAttribute?.('data-floating-root');

	const isVirtual = !!(trigger && !(trigger as HTMLElement).contains);

	if (isVirtual) {
		if (floating && !floating.contains(e.target as Node)) {
			stop();
		}
		return;
	}

	if (!rootId) {
		if (
			trigger &&
			!(trigger as HTMLElement).contains(e.target as Node) &&
			floating &&
			!floating.contains(e.target as Node)
		) {
			stop();
		}
		return;
	}

	stop();
}
