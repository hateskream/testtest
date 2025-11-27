export type ScrollEasing = (t: number) => number;

export interface ISmoothScrollOptions {
	duration?: number;
	axis?: 'y' | 'x';
	easing?: ScrollEasing;
	offset?: number;
	force?: boolean;
	onUpdate?: (value: number) => void;
}

const easeInOutCubic: ScrollEasing = t =>
	t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

const easeOutQuint: ScrollEasing = t => 1 - Math.pow(1 - t, 5);
const easeOutExpo: ScrollEasing = t => (t === 1 ? 1 : 1 - Math.pow(2, -10 * t));
const easeInOutQuint: ScrollEasing = t =>
	t < 0.5
		? 16 * t * t * t * t * t
		: 1 - Math.pow(-2 * t + 2, 5) / 2;

export const ScrollEasings = {
	cubic: easeInOutCubic,
	outQuint: easeOutQuint,
	outExpo: easeOutExpo,
	inOutQuint: easeInOutQuint,
};

export function smoothScrollTo(
	element: HTMLElement | Window,
	to: number,
	options: ISmoothScrollOptions = {},
) {
	const {
		duration = 500,
		axis = 'y',
		easing = ScrollEasings.outQuint,
		offset = 0,
		force = false,
		onUpdate,
	} = options;

	return new Promise<void>((resolve) => {
		const start = element instanceof Window
			? axis === 'y'
				? element.scrollY
				: element.scrollX
			: axis === 'y'
				? element.scrollTop
				: element.scrollLeft;

		const target = to + offset;
		const change = target - start;

		if (force || duration <= 0) {
			if (element instanceof Window) {
				element.scrollTo(axis === 'y' ? 0 : target, axis === 'y' ? target : 0);
			} else {
				if (axis === 'y') {
					element.scrollTop = target;
				} else {
					element.scrollLeft = target;
				}
			}
			onUpdate?.(target);
			resolve();
			return;
		}

		const startTime = performance.now();

		const animate = (now: number) => {
			const elapsed = now - startTime;
			const progress = Math.min(elapsed / duration, 1);
			const eased = easing(progress);
			const current = start + change * eased;

			if (element instanceof Window) {
				if (axis === 'y') {
					element.scrollTo(0, current);
				} else {
					element.scrollTo(current, 0);
				}
			} else {
				if (axis === 'y') {
					element.scrollTop = current;
				} else {
					element.scrollLeft = current;
				}
			}

			onUpdate?.(current);

			if (elapsed < duration) {
				requestAnimationFrame(animate);
			} else {
				resolve();
			}
		};

		requestAnimationFrame(animate);
	});
}
