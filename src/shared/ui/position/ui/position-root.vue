<script setup lang="ts">
import { onUnmounted, ref } from 'vue';

import {
	providePinnedLevel,
	providePinnedStack,
	useHoverEvents, useProvideFloatingContext,
} from '../composables';
import type { IPositionRootProps } from '../model';

const level = providePinnedLevel(1);
providePinnedStack();

const props = withDefaults(defineProps<IPositionRootProps>(), {
	trigger: 'click',
});

const isOpen = ref(false);
const isPinned = ref(false);

const triggerRef = ref<HTMLElement | null>(null);
const contentRef = ref<HTMLElement | null>(null);

function open() {
	isOpen.value = true;
}

function close() {
	isOpen.value = false;
	isPinned.value = false;
}

function registerTrigger(element: HTMLElement) {
	triggerRef.value = element;
}

function registerContent(element: HTMLElement) {
	contentRef.value = element;
}

const hoverEvents = useHoverEvents({
	isPinned,
	show: open,
	hide: close,
	triggerRef: triggerRef,
	openDelay: () => props.openDelay ?? 0,
	closeDelay: () => props.closeDelay ?? 0,
});

useProvideFloatingContext({
	isOpen,
	isPinned,
	open,
	close,
	registerTrigger,
	registerContent,
	triggerRef,
	contentRef,
	trigger: () => props.trigger,
	events: {
		hover: hoverEvents,
	},
});

onUnmounted(() => {
	close();
});

defineExpose({
	isOpen,
	isPinned,
	open,
	close,
});
</script>

<template>
	<div data-position-root :data-position-level="level">
		<slot :is-open="isOpen" :is-pinned="isPinned" />
	</div>
</template>

