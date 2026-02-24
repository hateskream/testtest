<script setup lang="ts">
import { computed, useTemplateRef, watch } from 'vue';
import { notNullish, useEventListener, useScroll } from '@vueuse/core';

import {
	isScrolledToBottom,
	isScrolledToTop,
	isScrollingDown,
	isScrollingUp,
	preventDefaultScrollBehavior,
} from '@/shared/lib/scroll';
import { useTickerLayout } from '../../composables';

export interface IProps {
	disableScroll?: boolean;
}

const props = defineProps<IProps>();

const { setBottomReached, handleFooterScroll } = useTickerLayout();

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

watch(() => mainColumnScrollArrivedState.bottom, setBottomReached, { immediate: true });

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

	if (!handleFooterScroll(deltaY)) {
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
		setBottomReached(isAtBottom());
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
		setBottomReached(true);
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
			setBottomReached(isScrolledToBottom(target));
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
	<div ref="container" :class="classes.root">
		<div
			ref="leftCol"
			:class="[classes.side, classes.column, { [classes.full]: !hasMainColumn }]"
		>
			<slot name="leftCol"></slot>
		</div>
		<div
			v-if="$slots.mainCol"
			ref="mainCol"
			:class="[classes.main, classes.column]"
		>
			<slot name="mainCol"></slot>
		</div>
		<div
			ref="rightCol"
			:class="[classes.side, classes.column]"
		>
			<slot name="rightCol"></slot>
		</div>
	</div>
</template>

<style module="classes">
.root {
	display: grid;
	grid-template-columns: 330px 1fr 330px;
	grid-template-rows: fit-content(calc(100svh - 16px));
	overflow: hidden;
}

.column {
	min-height: 0;
	overflow-x: hidden;
	overflow-y: auto;
	scrollbar-width: none;
	-ms-overflow-style: none;
}

.column::-webkit-scrollbar {
	display: none;
}

.main {
	display: flex;
	flex-direction: column;
	padding: 0 var(--padding-s9, 16px) 8px;
	padding-bottom: 5px;
}

.side {
	padding: 0 var(--padding-s5, 8px) 10px;
}

.side.full {
	grid-column: span 2;
}
</style>
