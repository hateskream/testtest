<script setup lang="ts">
import { useEventListener, useScroll } from '@vueuse/core';
import { inject, useTemplateRef, watch } from 'vue';

import { isScrollingDown, isScrollingUp, preventDefaultScrollBehavior } from '@/shared/lib/scroll';

export interface IProps {
	disableScroll?: boolean;
}

const props = defineProps<IProps>();

const onBottomReached = inject<((reached: boolean) => void) | null>('onBottomReached', null);

function handleBottomReached(isBottom: boolean) {
	if (onBottomReached) {
		onBottomReached(isBottom);
	}
}

const handleFooterScroll = inject<((delta: number) => boolean) | null>('handleFooterScroll', null);

/**
 * Передать скролл футеру, если он может его обработать
 * @param deltaY
 * @return boolean - обработал ли footer скролл
 */
function tryHandleFooterScroll(deltaY: number) {
	if (handleFooterScroll) {
		return handleFooterScroll(deltaY);
	}

	return false;
}

const container = useTemplateRef('container');

const { arrivedState } = useScroll(container);

function isAtBottom() {
	return arrivedState.bottom;
}

function onContainerScroll(event: WheelEvent) {
	if (props.disableScroll) {
		preventDefaultScrollBehavior(event);
		return;
	}

	handleBottomReached(isAtBottom());

	const shouldDelegateScroll = isScrollingDown(event.deltaY) && isAtBottom() || isScrollingUp(event.deltaY);

	if (!shouldDelegateScroll) {
		return;
	}

	if (tryHandleFooterScroll(event.deltaY)) {
		preventDefaultScrollBehavior(event);
	}
}

watch(() => arrivedState.bottom, handleBottomReached, { immediate: true });

useEventListener(container, 'wheel', onContainerScroll, { passive: false });
</script>

<template>
	<div ref="container" :class="[classes.root, classes.hideScrollbar]">
		<div v-if="$slots.leftCol" :class="[classes.columnStatic, classes.hideScrollbar]">
			<slot name="leftCol"></slot>
		</div>
		<div v-if="$slots.rightCol" :class="[classes.columnStatic, classes.hideScrollbar]">
			<slot name="rightCol"></slot>
		</div>
		<div v-if="$slots.mainCol" :class="[classes.columnStatic, classes.hideScrollbar]">
			<slot name="mainCol"></slot>
		</div>
	</div>
</template>

<style module="classes">
.root {
	display: flex;
	flex-direction: column;
	height: calc(100svh - 16px);
	padding-bottom: 10px;
	overflow-x: hidden;
	overflow-y: auto;
}

.columnStatic {
	flex-shrink: 0;
	width: 100%;
}

.hideScrollbar {
	scrollbar-width: none;
	-ms-overflow-style: none;
}

.hideScrollbar::-webkit-scrollbar {
	display: none;
}
</style>
