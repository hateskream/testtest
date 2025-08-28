<script setup lang="ts">
import { computed, type Ref, ref, watch, nextTick, onUnmounted } from 'vue';
import { useElementSize } from '@vueuse/core';

import { useCustomScroll } from '@/shared/composables/scroll.ts';

type ViewMode = 'mixed' | 'reports';

const contentShift = ref(0);
const topContentEl = ref<HTMLElement>();
const container = ref<HTMLElement>();
const viewMode = ref<ViewMode>('mixed');
const delayedActionTimeout = ref<number | null>(null);

const { height: topContentHeight } = useElementSize(topContentEl);

const emit = defineEmits<{
	(event: 'change-view', value: ViewMode): void;
	(event: 'animation-start'): void;
	(event: 'animation-end'): void;
}>();

const maxShift = computed(() => topContentEl.value?.offsetHeight || 0);

const opacityTop = computed(() => {
	if (!topContentHeight.value || !contentShift.value) {
		return 1;
	}
	return Math.max(0, 1 - contentShift.value / topContentHeight.value);
});

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
	if (delayedActionTimeout.value) {
		clearTimeout(delayedActionTimeout.value);
		delayedActionTimeout.value = null;
	}
}

function setDelayedAction(action: () => void, delay = 1000) {
	clearDelayedAction();
	delayedActionTimeout.value = setTimeout(() => {
		action();
		delayedActionTimeout.value = null;
	}, delay);
}

function finishScrollToBottom() {
	clearDelayedAction();
	if (!topContentHeight.value) {
		return;
	}

	contentShift.value = topContentHeight.value;
	viewMode.value = 'reports';
	emit('change-view', 'reports');
	emit('animation-start');
	setTimeout(() => emit('animation-end'), 1000);
}

function finishScrollToTop() {
	clearDelayedAction();
	contentShift.value = 0;
	viewMode.value = 'mixed';
	emit('change-view', 'mixed');
}

onUnmounted(() => {
	clearDelayedAction();
});

useCustomScroll(container as Ref<HTMLElement | null>, (delta) => {
	if (!topContentHeight.value) {
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
});

const setMixedViewMode = () => {
	clearDelayedAction();
	contentShift.value = 0;
	viewMode.value = 'mixed';
	emit('change-view', 'mixed');
};

const setReportsViewMode = async () => {
	clearDelayedAction();
	if (!container.value) {
		return;
	}

	await nextTick();
	contentShift.value = topContentHeight.value;
	viewMode.value = 'reports';
	emit('change-view', 'reports');
};

defineExpose({ setMixedViewMode, setReportsViewMode });
</script>

<template>
	<div ref="container" :class="classes.root">
		<div
			ref="topContentEl"
			:class="classes.topContent"
			:style="{ opacity: opacityTop }"
		>
			<slot name="header" />
			<slot name="topContent">Graph</slot>
		</div>
		<div
			ref="botContentEl"
			:class="[classes.botContent, { [classes.locked]: viewMode !== 'reports' }]"
			:style="{ transform: `translateY(-${contentShift}px)` }"
		>
			<slot name="botContent" />
		</div>
	</div>
</template>

<style module="classes">
.root {
	width: 100%;
	height: 100vh;
}

.topContent {
	margin-bottom: 30px;
	padding-bottom: 26px;
	border-bottom: 2px solid var(--border-color-surface-02);
	transition: opacity 0.5s ease-in-out;
}

.botContent {
	transition: transform 0.4s ease-in-out;
}

.locked {
	pointer-events: none;
}
</style>
