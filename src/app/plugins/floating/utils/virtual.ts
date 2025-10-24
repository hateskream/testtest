import type { VirtualElement } from '@floating-ui/vue';

export function makeVirtualFromMouseEvent(e: MouseEvent): VirtualElement {
	const x = e.clientX;
	const y = e.clientY;
	return {
		getBoundingClientRect() {
			return {
				x, y, top: y, left: x, right: x, bottom: y, width: 0, height: 0,
			} as DOMRect;
		},
	};
}
