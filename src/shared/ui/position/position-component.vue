<script setup lang="ts">
import {
	nextTick,
	onMounted,
	onUnmounted,
	provide,
	ref,
	useSlots,
	useTemplateRef,
} from 'vue';

import { type IPositionProps, POSITION_INJECTION_KEY } from './model.ts';
import { useInjectFloatingContext } from '@/app/plugins/floating';

interface IPositionComponentEmits {
	(e: 'mouseover'): void;
	(e: 'mouseleave'): void;
}

const props = withDefaults(defineProps<IPositionProps>(), {
	position: 'right-end',
	trigger: 'click',
	showInMs: 100,
	hideDelayMs: 200,
	positionOffset: 6,
	strategy: 'fixed',
	hoverPadding: 8,
});

const emits = defineEmits<IPositionComponentEmits>();

defineSlots<{
	// eslint-disable-next-line no-shadow
	title(props: { isVisible: boolean }): unknown;
	content(): unknown;
}>();

const slots = useSlots();

const isVisible = ref(false);

const wrapperRef = useTemplateRef<HTMLElement>('wrapper');
const referenceRef = useTemplateRef<HTMLElement>('reference');

const floating = useInjectFloatingContext();
provide(POSITION_INJECTION_KEY, {
	close: floating.close,
});

function openFloating() {
	isVisible.value = true;

	floating.open({
		reference: referenceRef,
		content: () => slots.content?.() ?? null,
		options: {
			placement: props.position,
			hideDelayMs: props.hideDelayMs,
			hoverPadding: props.hoverPadding,
			strategy: props.strategy,
			showInMs: props.showInMs,
			offset: props.positionOffset,
			trigger: props.trigger,
		},
		onClose: () => {
			isVisible.value = false;
		},
	});
}

function handleOpen() {
	if (isVisible.value || !slots.content) {
		return;
	}

	openFloating();
}

async function handleContextMenu(event: MouseEvent) {
	event.preventDefault();
	await nextTick();
	handleOpen();
}

function handleMouseOver() {
	if (!isVisible.value) {
		emits('mouseover');
		handleOpen();
	}
}

function handleMouseLeave() {
	if (isVisible.value) {
		emits('mouseleave');
		floating.close();
	}
}

onMounted(() => {
	if (props.trigger === 'click') {
		return;
	}

	wrapperRef.value?.addEventListener('mouseover', handleMouseOver);
	wrapperRef.value?.addEventListener('mouseleave', handleMouseLeave);

	onUnmounted(() => {
		wrapperRef.value?.removeEventListener('mouseover', handleMouseOver);
		wrapperRef.value?.removeEventListener('mouseleave', handleMouseLeave);
	});
});

onUnmounted(() => {
	floating.stop();
});
</script>

<template>
	<div ref="wrapper">
		<div
			ref="reference"
			@click="handleContextMenu"
			@contextmenu="handleContextMenu"
		>
			<slot
				name="title"
				:is-visible="isVisible"
			/>
		</div>
	</div>
</template>

<style scoped>
.floating-content {
	z-index: v-bind('101');
}

.floating-scroll-wrapper {
	max-height: 80svh;
	overflow-y: auto;
}

.floating-inner {
	border-radius: 6px;
}

.fade-enter-active,
.fade-leave-active {
	transition: opacity 0.15s ease;
}

.fade-enter-from,
.fade-leave-to {
	opacity: 0;
}
</style>
