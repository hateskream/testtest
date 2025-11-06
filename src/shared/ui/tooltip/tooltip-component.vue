<script setup lang="ts">
import { ref, computed, watch, useTemplateRef, onUnmounted } from 'vue';
import { offset, shift, flip, type Placement } from '@floating-ui/vue';

import { UiPositionPortal, type IPositionProps } from '@/shared/ui/position';

interface IProps {
	forceHide?: boolean;
	showInMs?: number;
	position?: Placement;
}

const props = withDefaults(defineProps<IProps>(), {
	forceHide: false,
	showInMs: 800,
	position: 'bottom',
});

const reference = useTemplateRef<HTMLElement>('referenceRef');
const layer = useTemplateRef('layerRef');

const isVisible = ref(false);
const timeout = ref<number | null>(null);

const layerOptions = computed<IPositionProps>(() => ({
	strategy: 'fixed',
	placement: props.position,
	offset: 6,
	middleware: [offset(6), flip(), shift({ padding: 5 })],
}));

function openNow() {
	if (!reference.value) {
		return;
	}
	layer.value?.openAt(reference.value);
	isVisible.value = true;
}

function closeNow() {
	layer.value?.close();
	isVisible.value = false;
}

function handleMouseover() {
	if (props.forceHide || timeout.value || isVisible.value) {
		return;
	}
	timeout.value = setTimeout(() => {
		openNow();
		timeout.value && clearTimeout(timeout.value);
		timeout.value = null;
	}, props.showInMs);
}

function handleMouseleave() {
	if (timeout.value) {
		clearTimeout(timeout.value);
		timeout.value = null;
	}
	if (isVisible.value) {
		closeNow();
	}
}

watch(() => props.forceHide, value => {
	if (value) {
		closeNow();
	}
});

onUnmounted(() => {
	if (timeout.value) {
		clearTimeout(timeout.value);
	}
});
</script>

<template>
	<div>
		<div
			ref="referenceRef"
			@mouseover="handleMouseover"
			@mouseleave="handleMouseleave"
		>
			<slot name="default" />
		</div>

		<ui-position-portal ref="layerRef" v-bind="layerOptions">
			<transition name="fade" appear>
				<div :class="classes.content" class="content-anchor">
					<slot name="content" />
				</div>
			</transition>
		</ui-position-portal>
	</div>
</template>

<style module="classes">
.content {
	z-index: 100;
	width: max-content;
	padding: 4px 10px;
	font-size: 12px;
	color: var(--text-color-base-300);
	background: var(--bg-color-base-500);
	border: 1px solid var(--border-color-base-300);
	border-radius: 8px;
	backdrop-filter: blur(16px);
}
</style>

<style scoped>
.fade-enter-active,
.fade-leave-active {
	transition: opacity 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
	opacity: 0;
}
</style>
