import { inject, provide } from 'vue';

const KEY = Symbol('SegmentedControl');

export interface ISegmentedControlContext {
	select: (value: string | number) => void;
	getValue: () => string | number;
}

export function provideSegmentedControl(ctx: ISegmentedControlContext) {
	provide(KEY, ctx);
}

export function useSegmentedControl() {
	const ctx = inject<ISegmentedControlContext>(KEY);

	if (!ctx) {
		throw new Error(
			'Wrap your Item with <UiSegmentedControl>. It’s not like I’m warning you for your sake or anything… baka.',
		);
	}

	return ctx;
}
