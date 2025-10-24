function isInsideSameRoot(e: Event, rootId: string) {
	const path = (e.composedPath?.() ?? []) as EventTarget[];
	for (const t of path) {
		if (t instanceof Element) {
			const el = t.closest(`[data-floating-root="${rootId}"]`);
			if (el) {
				return true;
			}
		}
	}
	return false;
}

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
	trigger: HTMLElement | null,
	floating: HTMLElement | null,
	stop: () => void,
) {
	if (isInsideFloatingList(e)) {
		return;
	}

	const rootId =
		floating?.getAttribute('data-floating-root') ??
		trigger?.getAttribute('data-floating-root');

	if (!rootId) {
		if (
			trigger && !trigger.contains(e.target as Node) &&
			floating && !floating.contains(e.target as Node)
		) {
			stop();
		}
		return;
	}

	if (isInsideSameRoot(e, rootId)) {
		return;
	}

	stop();
}
