import { provide, inject, type MaybeRefOrGetter, computed, toValue } from 'vue';

type DisplayVariant = 'new' | 'default';

interface IUseDisplayVariant {
	displayVariant: MaybeRefOrGetter<DisplayVariant>;
}

const DISPLAY_VARIANT_KEY = Symbol('DISPLAY_VARIANT_KEY');

export function useProvideDisplayVariant(displayVariant: MaybeRefOrGetter<DisplayVariant>) {
	provide<IUseDisplayVariant>(DISPLAY_VARIANT_KEY, { displayVariant: displayVariant });
}

export function useDisplayVariant(displayVariantProp?: MaybeRefOrGetter<DisplayVariant | undefined>) {
	const injected = inject<IUseDisplayVariant>(DISPLAY_VARIANT_KEY, {
		displayVariant: 'default',
	});

	const displayVariant = computed<DisplayVariant>(() => {
		const local = toValue(displayVariantProp);

		if (local) {
			return local;
		}

		return toValue(injected.displayVariant) ?? 'default';
	});

	return { displayVariant };
}

