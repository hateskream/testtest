import type { ReferenceElement } from '@floating-ui/vue';
import { computed, type MaybeRefOrGetter, toValue } from 'vue';

export interface IUseClickOutsideOptions {
	trigger: MaybeRefOrGetter<ReferenceElement | null>;
	floating: MaybeRefOrGetter<HTMLElement | null>;
	onClose: () => void;
}

export function useClickOutside(options: IUseClickOutsideOptions) {
	const { onClose } = options;

	const trigger = computed(() => toValue(options.trigger));
	const floating = computed(() => toValue(options.floating));

	function handlePointerDown(event: PointerEvent) {
		const target = event.target as HTMLElement;

		const isVirtual = !!(trigger.value && !(trigger.value as HTMLElement).contains);

		// if its virtual
		if (isVirtual) {
			// and click target is outside of floating: close
			if (floating.value && !floating.value.contains(target)) {
				onClose();
			}
			// otherwise: ignore
			return;
		}

		// if click target inside trigger or floating: close
		if (
			trigger.value && !(trigger.value as HTMLElement).contains(target) &&
			floating.value && !floating.value.contains(target)
		) {
			onClose();
		}

		// if click target is subposition: ignore
		if (target.closest('[data-subposition]')) {
			return;
		}
	}

	return {
		handlePointerDown,
	};
}
