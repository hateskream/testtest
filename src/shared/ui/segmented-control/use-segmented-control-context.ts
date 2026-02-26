import { inject, type InjectionKey, provide, type Ref } from 'vue';

import type { SegmentedControlModel } from '@/shared/ui/segmented-control';

export interface ISegmentedControlContext {
	select: (value: SegmentedControlModel | undefined) => void;
	active: Readonly<Ref<SegmentedControlModel | undefined>>;
}

const SegmentedControlKey: InjectionKey<ISegmentedControlContext> = Symbol('SegmentedControl');

export function createSegmentedControlContext(context: ISegmentedControlContext) {
	provide(SegmentedControlKey, context);
}

export function useSegmentedControlContext() {
	const context = inject<ISegmentedControlContext>(SegmentedControlKey);

	if (!context) {
		throw new Error('Use useSegmentedControlContext in created context');
	}

	return context;
}
