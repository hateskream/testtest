import type { ReferenceElement } from '@floating-ui/vue';

export function createClickOutsideHandler(
	e: PointerEvent,
	trigger: ReferenceElement | null,
	floating: HTMLElement | null,
	stop: () => void,
) {
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
