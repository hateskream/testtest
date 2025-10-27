<script setup lang="ts">
import {
	nextTick,
	onMounted,
	onUnmounted,
	ref,
	useSlots,
	useTemplateRef,
} from 'vue';

import { type IPositionProps } from '../model.ts';
import { useFloatingContext } from '@/app/plugins/floating';
import { matchesTrigger } from '@/app/plugins/floating/utils';

interface IPositionComponentEmits {
	(e: 'mouseover'): void;
	(e: 'mouseleave'): void;
}

const props = withDefaults(defineProps<IPositionProps>(), {
	scope: 'default',
	placement: 'right-end',
	trigger: 'click',
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

const floating = useFloatingContext(props.scope);

function handleOpen() {
	if (isVisible.value || !slots.content) {
		return;
	}

	isVisible.value = true;

	floating.open({
		reference: referenceRef,
		content: () => slots.content?.() ?? null,
		options: {
			placement: props.placement,
			hoverPadding: props.hoverPadding,
			strategy: props.strategy,
			offset: props.offset,
			trigger: props.trigger,
		},
		onClose: () => {
			isVisible.value = false;
		},
	});
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
	const { trigger } = props;

	const element = wrapperRef.value;

	if (!element) {
		return;
	}

	if (matchesTrigger(trigger, 'contextmenu')) {
		element.addEventListener('contextmenu', handleContextMenu);
	}

	if (matchesTrigger(trigger, 'click')) {
		element.addEventListener('click', handleContextMenu);
	}

	if (matchesTrigger(trigger, 'hover')) {
		element.addEventListener('mouseover', handleMouseOver);
		element.addEventListener('mouseleave', handleMouseLeave);
	}

	onUnmounted(() => {
		element.removeEventListener('contextmenu', handleContextMenu);
		element.removeEventListener('click', handleContextMenu);
		element.removeEventListener('mouseover', handleMouseOver);
		element.removeEventListener('mouseleave', handleMouseLeave);
	});
});

onUnmounted(() => {
	floating.stop();
});

defineExpose({
	isVisible,
	handleOpen,
});
</script>

<template>
	<div ref="wrapper">
		<div ref="reference">
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
