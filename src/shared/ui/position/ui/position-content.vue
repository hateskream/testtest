<script setup lang="ts">
import { nextTick, onMounted, onUnmounted, ref, toValue, useTemplateRef, watch } from 'vue';
import {
	autoUpdate,
	offset,
	shift,
	size,
	useFloating,
} from '@floating-ui/vue';

import { matchesTrigger } from '../utils';
import { usePinnedStack, useFloatingContext } from '../composables';
import { type IPositionContentProps, parseAutoUpdate } from '../model';

const props = withDefaults(defineProps<IPositionContentProps>(), {
	autoUpdate: true,
	placement: 'bottom-start',
	offset: 6,
	strategy: 'absolute',
	transform: true,
});

const contentRef = useTemplateRef('content');

const stack = usePinnedStack();
const {
	isOpen,
	isPinned,
	triggerRef,
	trigger: _trigger,
	registerContent,
	close,
	events,
} = useFloatingContext();

const trigger = () => toValue(_trigger);

let cleanup: null | (() => void) = null;

const { floatingStyles, update } = useFloating(triggerRef, contentRef, {
	placement: props.placement,
	strategy: props.strategy,
	middleware: [
		offset(props.offset),
		shift({
			padding: 8,
			rootBoundary: 'viewport',
			boundary: 'clippingAncestors',
			mainAxis: true,
			crossAxis: true,
		}),
		size({
			padding: 8,
			apply({ availableHeight, elements }) {
				elements.floating.style.maxHeight = `${availableHeight}px`;
			},
		}),
	],
	transform: () => props.transform,
});

const memorizedStyles = ref<CSSStyleValue | null>(null);

function onBodyPointerDown(e: PointerEvent) {
	const target = e.target as HTMLElement;

	if (target.closest('[data-subposition]') || target.closest('[data-subposition-content]')) {
		return;
	}

	if (stack?.hasPinned()) {
		e.stopImmediatePropagation();
		e.stopPropagation();
		stack?.closeLast();

		return;
	}

	const isVirtual = !!(triggerRef.value && !(triggerRef.value as HTMLElement).contains);

	if (isVirtual) {
		if (contentRef.value && !contentRef.value.contains(target)) {
			close();
		}

		return;
	}

	if (
		triggerRef.value && !(triggerRef.value as HTMLElement).contains(target) &&
		contentRef.value && !contentRef.value.contains(target)
	) {
		close();
	}
}

function handleOpen() {
	nextTick(() => {
		if (!triggerRef.value || !contentRef.value) {
			return;
		}

		if (!props.memorize && props.autoUpdate) {
			cleanup = autoUpdate(
				triggerRef.value,
				contentRef.value,
				update,
				parseAutoUpdate(props.autoUpdate),
			);
		}

		if (matchesTrigger(trigger(), ['click', 'contextmenu'])) {
			document.body.addEventListener('pointerdown', onBodyPointerDown, true);
		}

		if (matchesTrigger(trigger(), 'hover')) {
			contentRef.value.addEventListener('mouseenter', events.hover.onFloatingEnter);
			contentRef.value.addEventListener('mouseleave', events.hover.onFloatingLeave);
		}
	});
}

function dispose() {
	cleanup?.();
	cleanup = null;
	memorizedStyles.value = null;
	document.body.removeEventListener('pointerdown', onBodyPointerDown, true);
	contentRef.value?.removeEventListener('mouseenter', events.hover.onFloatingEnter);
	contentRef.value?.removeEventListener('mouseleave', events.hover.onFloatingLeave);
}

onMounted(() => {
	if (contentRef.value) {
		registerContent(contentRef.value);
	}
});

onUnmounted(dispose);

watch(isOpen, (v) => (v ? handleOpen() : dispose()), {
	immediate: true,
});

watch(floatingStyles, (value, oldValue) => {
	if (!props.memorize) {
		return;
	}

	if (isOpen.value && !oldValue) {
		memorizedStyles.value = value;
	} else {
		memorizedStyles.value = null;
	}
}, { deep: true });
</script>

<template>
	<div
		v-if="isOpen"
		ref="content"
		:style="memorizedStyles || floatingStyles"
		data-position-content
		:data-open="isOpen"
		:data-pinned="isPinned"
	>
		<slot />
	</div>
</template>

<style>
[data-position-content] {
	z-index: 101;
}
</style>
