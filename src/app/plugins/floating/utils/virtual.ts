import type { VirtualElement } from '@floating-ui/vue';

interface ICreateVirtualFloatingNodeOptions {
	x: number;
	y: number;
	top?: number;
	left?: number;
	right?: number;
	bottom?: number;
	width?: number;
	height?: number;
}

export function createVirtualFloatingNode({ x, y, ...opts }: ICreateVirtualFloatingNodeOptions): VirtualElement {
	return {
		getBoundingClientRect() {
			return {
				x: x,
				y: y,
				top: opts.top ?? y,
				left: opts.left ?? x,
				right: opts.right ?? x,
				bottom: opts.bottom ?? y,
				width: opts.width ?? 0,
				height: opts.height ?? 0,
			} as DOMRect;
		},
	};
}
