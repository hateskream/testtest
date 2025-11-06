<script setup lang="ts">
import { nextTick, onMounted, onUnmounted, toValue, useTemplateRef, watch } from 'vue';
import {
	autoUpdate,
	flip,
	offset,
	shift,
	useFloating,
} from '@floating-ui/vue';

import { matchesTrigger } from '../utils';
import { usePinnedStack, useFloatingContext } from '../composables';
import type { IPositionContentProps } from '../model';

const props = withDefaults(defineProps<IPositionContentProps>(), {
	placement: 'bottom-start',
	offset: 6,
	strategy: 'absolute',
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
	middleware: [offset(props.offset), flip(), shift({ padding: 4 })],
});

function onBodyPointerDown(e: PointerEvent) {
	const target = e.target as HTMLElement;

	if (target.closest('[data-subposition]')) {
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

		cleanup = autoUpdate(triggerRef.value, contentRef.value, update);

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
</script>

<template>
	<div
		v-if="isOpen"
		ref="content"
		:style="floatingStyles"
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
	max-height: 80svh;
}
</style>
