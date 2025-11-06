<script setup lang="ts">
import { onUnmounted, ref, watch } from 'vue';

import type { ISubpositionRootProps } from '../../model';
import {
	useHoverEvents,
	usePinnedLevel,
	usePinnedStack,
	providePinnedLevel,
	useFloatingContext,
	useProvideSubFloatingContext,
} from '../../composables';

const props = withDefaults(defineProps<ISubpositionRootProps>(), {
	trigger: 'hover',
});

const emits = defineEmits<{
	onPinned: [];
	onUnpinned: [];
	onOpened: [];
	onClosed: [];
}>();

const parentLevel = usePinnedLevel();
const level = providePinnedLevel(parentLevel + 1);

const isOpen = ref(false);
const isPinned = ref(false);

const triggerRef = ref<HTMLElement | null>(null);
const contentRef = ref<HTMLElement | null>(null);

const stack = usePinnedStack();

function onDocumentClick() {
	isPinned.value = false;
	isOpen.value = false;
}

let clearPinned: (() => void) | null = null;

function pin() {
	isPinned.value = true;
}

function unpin() {
	isPinned.value = false;
}

function open() {
	isOpen.value = true;
}

function close() {
	isOpen.value = false;
}

watch(isOpen, (value) => {
	if (value) {
		emits('onOpened');
	} else {
		emits('onClosed');
		isPinned.value = false;
	}
}, { flush: 'post' });

watch(isPinned, (value) => {
	if (value) {
		clearPinned = stack?.push(level, onDocumentClick) ?? null;
		emits('onPinned');
		isOpen.value = true;
	} else {
		emits('onUnpinned');
		clearPinned?.();
	}
}, { flush: 'post' });

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
	openDelay: () => props.openDelay ?? 20,
	closeDelay: () => props.closeDelay ?? 140,
});

function onMouseEnter() {
	if (stack?.hasPinnedLevel(level)) {
		return;
	}

	hoverEvents.onMouseEnter();
}

const parentContext = useFloatingContext();

useProvideSubFloatingContext({
	parent: parentContext,
	isOpen,
	isPinned,
	open,
	close,
	pin,
	unpin,
	registerTrigger,
	registerContent,
	triggerRef,
	contentRef,
	trigger: () => props.trigger,
	events: {
		hover: {
			...hoverEvents,
			onMouseEnter: onMouseEnter,
		},
	},
});

onUnmounted(() => {
	close();
});
</script>

<template>
	<div
		data-position-root
		data-subposition
		:data-position-level="level"
	>
		<slot :is-open="isOpen" :is-pinned="isPinned" />
	</div>
</template>

<style scoped>

</style>
