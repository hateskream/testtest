<script setup lang="ts">
import { computed, nextTick, onUnmounted, ref, type Ref, useTemplateRef, watch } from 'vue';
import { useElementSize } from '@vueuse/core';

import { useCustomScroll } from '@/shared/composables/scroll.ts';
import { TickerHeaderComponent } from '../header';
import { TickerFooterComponent } from '../footer';
import type { ViewMode } from '../../models';
import { createTickerLayoutContext } from '../../composables';

export interface ITickerLayoutProps {
	showHeader?: boolean;
}

const props = withDefaults(defineProps<ITickerLayoutProps>(), {
	showHeader: true,
});

const BOT_CONTENT_PADDING = 24;

const contentShift = ref(0);
const footerShift = ref(0);
const isBottomReached = ref(false);

const viewMode = ref<ViewMode>('mixed');

const topContentEl = useTemplateRef('topContentEl');
const footerEl = useTemplateRef('footerEl');
const container = useTemplateRef('container');
const botContent = useTemplateRef('botContentEl');

const { height: containerHeight } = useElementSize(container);
const { height: botContentHeight } = useElementSize(botContent);

let delayedActionTimeout: number | null = null;

const { height: topContentHeightTemp } = useElementSize(topContentEl);

const topContentHeight = computed(() => topContentHeightTemp.value + 28);

const { height: footerHeight } = useElementSize(footerEl);

const maxShift = computed(() => {
	const topContent = topContentEl.value;

	if (topContent) {
		return topContentHeightTemp.value + BOT_CONTENT_PADDING;
	}

	return 0;
});

const maxFooterShift = computed(() => {
	return footerHeight.value || 0;
});

const opacityTop = computed(() => {
	if (!topContentHeight.value || !contentShift.value) {
		return 1;
	}
	return Math.max(0, 1 - contentShift.value / topContentHeight.value);
});

const isInReportsMode = computed(() => {
	return viewMode.value === 'reports' && contentShift.value >= maxShift.value;
});

const footerShouldBeVisible = computed(() => {
	return (botContentHeight.value + topContentHeight.value) < containerHeight.value;
});

const canScrollFooter = computed(() => {
	return isInReportsMode.value && isBottomReached.value && maxFooterShift.value > 0;
});

function handleFooterScroll(delta: number): boolean {
	if (!canScrollFooter.value && footerShift.value === 0) {
		return false;
	}

	const newFooterShift = Math.max(0, Math.min(maxFooterShift.value, footerShift.value + delta));

	if (delta > 0 && footerShift.value < maxFooterShift.value) {
		footerShift.value = newFooterShift;
		return true;
	}

	if (delta < 0 && footerShift.value > 0) {
		footerShift.value = newFooterShift;
		if (footerShift.value === 0) {
			isBottomReached.value = false;
		}
		return true;
	}

	return false;
}

createTickerLayoutContext({
	setBottomReached: (state: boolean) => isBottomReached.value = state,
	handleFooterScroll,
});

const emit = defineEmits<{
	(event: 'change-view', value: ViewMode): void;
	(event: 'animation-start'): void;
	(event: 'animation-end'): void;
}>();

watch(maxShift, (newMax, oldMax) => {
	if (!oldMax || !newMax || oldMax === newMax) {
		return;
	}

	const ratio = contentShift.value / oldMax;
	contentShift.value = Math.min(newMax, ratio * newMax);

	if (viewMode.value === 'reports' && ratio > 0.8) {
		contentShift.value = newMax;
	}
});

function clearDelayedAction() {
	if (delayedActionTimeout) {
		clearTimeout(delayedActionTimeout);
		delayedActionTimeout = null;
	}
}

function setDelayedAction(action: () => void, delay = 1000) {
	clearDelayedAction();
	delayedActionTimeout = window.setTimeout(() => {
		action();
		delayedActionTimeout = null;
	}, delay);
}

function finishScrollToBottom() {
	clearDelayedAction();
	if (!maxShift.value) {
		return;
	}

	contentShift.value = maxShift.value;
	viewMode.value = 'reports';
	emit('change-view', 'reports');
	emit('animation-start');
	setTimeout(() => emit('animation-end'), 1000);
}

function finishScrollToTop() {
	clearDelayedAction();
	contentShift.value = 0;
	footerShift.value = 0;
	isBottomReached.value = false;
	viewMode.value = 'mixed';
	emit('change-view', 'mixed');
}

onUnmounted(() => {
	clearDelayedAction();
});

function handleScroll(delta: number) {
	if (!topContentHeight.value) {
		return;
	}

	if (canScrollFooter.value) {
		const newFooterShift = Math.max(0, Math.min(maxFooterShift.value, footerShift.value + delta));

		if (delta > 0 && footerShift.value < maxFooterShift.value) {
			footerShift.value = newFooterShift;
			return;
		}

		if (delta < 0 && footerShift.value > 0) {
			footerShift.value = newFooterShift;
			if (footerShift.value === 0) {
				isBottomReached.value = false;
			}
			return;
		}

		if (delta < 0 && footerShift.value === 0) {
			clearDelayedAction();
			const threshold = topContentHeight.value / 5;

			if (contentShift.value + delta < topContentHeight.value - threshold) {
				finishScrollToTop();
				return;
			}
			setDelayedAction(finishScrollToBottom);
			contentShift.value = Math.max(0, contentShift.value + delta);
			return;
		}

		return;
	}

	clearDelayedAction();
	const threshold = topContentHeight.value / 5;

	if (delta > 0) {
		if (contentShift.value + delta > threshold) {
			finishScrollToBottom();
			return;
		}

		setDelayedAction(finishScrollToTop);
	}

	if (delta < 0) {
		if (contentShift.value + delta < topContentHeight.value - threshold) {
			finishScrollToTop();
			return;
		}

		setDelayedAction(finishScrollToBottom);
	}

	contentShift.value = Math.max(0, Math.min(topContentHeight.value, contentShift.value + delta));
}

useCustomScroll(container as Ref<HTMLElement | null>, handleScroll);

function setMixedViewMode() {
	clearDelayedAction();
	contentShift.value = 0;
	footerShift.value = 0;
	isBottomReached.value = false;
	viewMode.value = 'mixed';
	emit('change-view', 'mixed');
}

async function setReportsViewMode() {
	clearDelayedAction();
	if (!container.value) {
		return;
	}

	await nextTick();
	contentShift.value = maxShift.value;
	viewMode.value = 'reports';
	emit('change-view', 'reports');
}

defineExpose({ setMixedViewMode, setReportsViewMode });
</script>

<template>
	<div ref="container" :class="classes.root">
		<div
			ref="topContentEl"
			:class="classes.topContent"
			:style="{ opacity: opacityTop }"
		>
			<ticker-header-component v-show="props.showHeader" />
			<slot name="topContent">Graph</slot>
		</div>
		<div
			:class="classes.contentWrapper"
			:style="{ transform: `translateY(-${contentShift + footerShift}px)` }"
		>
			<div
				ref="botContentEl"
				:class="[classes.botContent]"
			>
				<slot name="botContent" />
				<div
					ref="footerEl"
					:class="classes.footer"
					:style="{
						opacity: (isInReportsMode || footerShouldBeVisible) ? 1 : 0,
						pointerEvents: (isInReportsMode || footerShouldBeVisible) ? 'auto' : 'none'
					}"
				>
					<ticker-footer-component />
				</div>
			</div>
		</div>
	</div>
</template>

<style module="classes">
.root {
	display: flex;
	flex-grow: 1;
	flex-direction: column;
	width: 100%;
	height: 100%;
	overflow: hidden;
}

.topContent {
	position: relative;
	padding: 0 var(--padding-s10, 18px);
	border-bottom: 1px solid var(--surface-04, rgb(37 37 40 / 92%));
	transition: opacity 0.5s ease-in-out;
}

.contentWrapper {
	transition: transform 0.4s ease-in-out;
}

.botContent {
	position: relative;
	padding: var(--padding-s12, 24px) var(--padding-s6, 18px);
	transition: none;
}

.footer {
	position: absolute;
	top: 100%;
	left: 0;
	width: 100%;
	transition: opacity 0.3s ease-in-out;
}
</style>
