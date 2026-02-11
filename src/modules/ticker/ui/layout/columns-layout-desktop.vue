<script setup lang="ts">
import { computed, inject, useTemplateRef, watch } from 'vue';
import { notNullish, useEventListener, useScroll } from '@vueuse/core';

import {
	isScrolledToBottom,
	isScrolledToTop,
	isScrollingDown,
	isScrollingUp,
	preventDefaultScrollBehavior,
} from '@/shared/lib/scroll';

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
const mainColumn = useTemplateRef('mainCol');
const leftColumn = useTemplateRef('leftCol');
const rightColumn = useTemplateRef('rightCol');

const hasMainColumn = computed(() => notNullish(mainColumn.value));

// main scroll

const { y: mainColumnScrollPosition, arrivedState: mainColumnScrollArrivedState } = useScroll(mainColumn, {
	observe: {
		mutation: true,
	},
});

watch(() => mainColumnScrollArrivedState.bottom, handleBottomReached, { immediate: true });

function isAtBottom() {
	return mainColumnScrollArrivedState.bottom;
}

function isAtTop() {
	return mainColumnScrollArrivedState.top;
}

function shouldDelegateScrollToFooter(delta: number) {
	return (isAtBottom() && isScrollingDown(delta)) || isScrollingUp(delta);
}

/**
 * Делегировать скролл футеру, если:
 * - скролл вверх ИЛИ скролл вниз И блок максимально проскроллен
 * И
 * - футер может обработать скролл
 */
function tryDelegateScrollToFooter(event: WheelEvent): boolean {
	const { deltaY } = event;

	if (!shouldDelegateScrollToFooter(deltaY)) {
		return false;
	}

	if (!tryHandleFooterScroll(deltaY)) {
		return false;
	}

	preventDefaultScrollBehavior(event);
	return true;
}

function onMainColumnScroll(event: WheelEvent) {
	if (props.disableScroll) {
		event.preventDefault();
		return;
	}

	if (tryDelegateScrollToFooter(event)) {
		return;
	}

	if (isAtTop() && isScrollingUp(event.deltaY)) {
		return;
	}

	preventDefaultScrollBehavior(event);
	mainColumnScrollPosition.value += event.deltaY;

	requestAnimationFrame(() => {
		handleBottomReached(isAtBottom());
	});
}

useEventListener(mainColumn, 'wheel', onMainColumnScroll, { passive: false });

// sides

function syncSideScrollWithMainColumn(event: WheelEvent) {
	const { currentTarget, deltaY } = event;

	const shouldSyncScrollUp = isScrolledToTop(currentTarget as HTMLElement) && isScrollingUp(deltaY) && !isAtTop();

	if (shouldSyncScrollUp) {
		if (isAtTop()) {
			return;
		}

		mainColumnScrollPosition.value += deltaY;
		preventDefaultScrollBehavior(event);
		return;
	}

	const shouldSyncScrollDown = isScrolledToBottom(currentTarget as HTMLElement) && isScrollingDown(deltaY);
	if (!shouldSyncScrollDown) {
		return;
	}

	if (isAtBottom()) {
		handleBottomReached(true);
	} else {
		mainColumnScrollPosition.value += deltaY;
		preventDefaultScrollBehavior(event);
	}
}

function onSideColumnScroll(event: WheelEvent) {
	if (props.disableScroll) {
		event.preventDefault();
		return;
	}


	if (tryDelegateScrollToFooter(event)) {
		return;
	}

	const target = event.currentTarget as HTMLElement;

	if (isScrolledToBottom(target) || isScrolledToTop(target)) {
		if (hasMainColumn.value) {
			syncSideScrollWithMainColumn(event);
		} else {
			handleBottomReached(isScrolledToBottom(target));
		}
	} else {
		target.scrollTop += event.deltaY;
		preventDefaultScrollBehavior(event);
	}
}

useEventListener(leftColumn, 'wheel', onSideColumnScroll, { passive: false });
useEventListener(rightColumn, 'wheel', onSideColumnScroll, { passive: false });

// container

function isInMiddleOfContent() {
	return !isAtBottom() && !isAtTop();
}

function onContainerScroll(event: WheelEvent) {
	if (isInMiddleOfContent()) {
		preventDefaultScrollBehavior(event);
	}
}

useEventListener(container, 'wheel', onContainerScroll);
</script>

<template>
	<div ref="container" :class="[classes.root, classes.hideScrollbar]">
		<div
			ref="leftCol"
			:class="[classes.leftCol, classes.hideScrollbar, { [classes.full]: !hasMainColumn }]"
		>
			<slot name="leftCol"></slot>
		</div>
		<div
			v-if="$slots.mainCol"
			ref="mainCol"
			:class="[classes.mainCol, classes.hideScrollbar]"
		>
			<slot name="mainCol"></slot>
		</div>
		<div
			ref="rightCol"
			:class="[classes.rightCol, classes.hideScrollbar]"
		>
			<slot name="rightCol"></slot>
		</div>
	</div>
</template>

<style module="classes">
.root {
	display: flex;
	height: calc(100svh - 16px);
	overflow: hidden;
}

.leftCol {
	flex: 0 0 330px;
	width: 330px;
	height: 100%;
	padding: 0 var(--padding-s5, 8px) 10px;
	overflow: hidden;
}

.full.full {
	flex-grow: 1;
}

.rightCol {
	flex: 0 0 330px;
	width: 330px;
	height: 100%;
	padding: 0 var(--padding-s5, 8px) 10px;
	overflow-x: hidden;
	overflow-y: auto;
}

.mainCol {
	display: flex;
	flex-grow: 2;
	flex-direction: column;
	height: 100%;
	padding: 0 var(--padding-s9, 16px) 8px;
	padding-bottom: 5px;
	overflow-x: hidden;
	overflow-y: auto;
}

.hideScrollbar {
	scrollbar-width: none;
	-ms-overflow-style: none;
}

.hideScrollbar::-webkit-scrollbar {
	display: none;
}
</style>
