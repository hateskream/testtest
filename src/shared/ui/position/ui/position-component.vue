<script setup lang="ts">
import {
	nextTick,
	onMounted,
	onUnmounted,
	ref,
	useSlots,
	useTemplateRef,
	watch,
} from 'vue';

import type { IFloatingOptions } from '../model';
import { useFloatingContext } from '../composables';
import { matchesTrigger } from '../utils';

interface IPositionComponentEmits {
	(e: 'mouseover'): void;
	(e: 'mouseleave'): void;
}

const props = withDefaults(defineProps<IFloatingOptions>(), {
	scope: 'default',
	placement: 'right-end',
	trigger: 'click',
	positionOffset: 6,
	strategy: 'fixed',
});

const emits = defineEmits<IPositionComponentEmits>();

const slots = useSlots();

const isVisible = ref(false);
const isPinned = ref(false);

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
		options: props,
		onClose: () => {
			isVisible.value = false;
			isPinned.value = false;
		},
	});
}

function handleClose() {
	if (!isVisible.value) {
		return;
	}

	isVisible.value = false;
	isPinned.value = false;
	floating.close();
}

watch(isVisible, (value) => {
	if (value) {
		handleOpen();
	} else {
		handleClose();
	}
});

async function handleContextMenu(event: MouseEvent) {
	event.preventDefault();
	isPinned.value = true;
	await nextTick();
	handleOpen();
}

function handleClick() {
	if (isVisible.value && isPinned.value) {
		handleClose();
	} else {
		isPinned.value = true;
		handleOpen();
	}
}

function handleMouseOver() {
	if (!isVisible.value && !isPinned.value) {
		emits('mouseover');
		handleOpen();
	}
}

function handleMouseLeave() {
	if (!isPinned.value) {
		emits('mouseleave');
		handleClose();
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
		element.addEventListener('click', handleClick);
	}

	if (matchesTrigger(trigger, 'hover')) {
		element.addEventListener('mouseover', handleMouseOver);
		element.addEventListener('mouseleave', handleMouseLeave);
	}

	onUnmounted(() => {
		element.removeEventListener('contextmenu', handleContextMenu);
		element.removeEventListener('click', handleClick);
		element.removeEventListener('mouseover', handleMouseOver);
		element.removeEventListener('mouseleave', handleMouseLeave);
	});
});

onUnmounted(() => {
	if (isVisible.value) {
		floating.stop();
	}
});

defineExpose({
	isVisible: isVisible,
	isPinned: isPinned,
	handleOpen: handleOpen,
	handleClose: handleClose,
});

defineSlots<{
	// eslint-disable-next-line no-shadow
	title(props: { isVisible: boolean; isPinned: boolean }): unknown;
	content(): unknown;
}>();
</script>

<template>
	<div ref="wrapper">
		<div ref="reference">
			<slot
				name="title"
				:is-visible="isVisible"
				:is-pinned="isPinned"
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
