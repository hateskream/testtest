<script setup lang="ts">
import {
	autoUpdate,
	flip,
	offset,
	shift,
	useFloating,
} from '@floating-ui/vue';
import {
	nextTick,
	onMounted,
	onUnmounted,
	ref,
	useSlots, useTemplateRef,
	watch,
} from 'vue';

import type { IFloatingOptions } from '../model';
import { createClickOutsideHandler, matchesTrigger } from '../utils';
import { providePinnedLevel, providePinnedStack } from '@/shared/ui/position';

import FloatingTeleport from '@/shared/ui/position/ui/host/floating-teleport.vue';

const props = withDefaults(defineProps<IFloatingOptions>(), {
	placement: 'right-end',
	trigger: 'click',
	offset: 6,
	strategy: 'fixed',
});

const slots = useSlots();

const level = providePinnedLevel(1);
const stack = providePinnedStack();

const isVisible = ref(false);
const isPinned = ref(false);

const wrapperRef = useTemplateRef('wrapper');
const referenceRef = useTemplateRef('reference');
const floatingRef = useTemplateRef('floating');

const { floatingStyles, update } = useFloating(
	referenceRef,
	floatingRef,
	{
		placement: props.placement,
		strategy: props.strategy,
		middleware: [
			offset(props.offset),
			flip(),
			shift({ padding: 4 }),
		],
	},
);

let cleanup: (() => void) | null = null;

async function handleOpen() {
	if (isVisible.value || !slots.content) {
		return;
	}

	isVisible.value = true;

	await nextTick();

	cleanup = autoUpdate(referenceRef.value!, floatingRef.value!, update);

	if (matchesTrigger(props.trigger, ['click', 'contextmenu'])) {
		document.body.addEventListener('pointerdown', handleClickOutside, true);
	}

	if (matchesTrigger(props.trigger, 'hover')) {
		floatingRef.value?.addEventListener('mouseleave', handleMouseLeaveFloating, true);
	}
}

function handleClose() {
	if (!isVisible.value) {
		return;
	}

	isVisible.value = false;
	isPinned.value = false;

	cleanup?.();
	cleanup = null;

	document.body.removeEventListener('pointerdown', handleClickOutside, true);
	floatingRef.value?.removeEventListener('mouseleave', handleMouseLeaveFloating, true);
}

watch(isVisible, (value) => {
	value ? handleOpen() : handleClose();
});

function handleClickOutside(e: PointerEvent) {
	const target = e.target as HTMLElement;

	if (target && target.closest('[data-subposition]')) {
		return;
	}

	if (stack.hasPinned()) {
		e.stopImmediatePropagation();
		e.stopPropagation();
		stack.closeLast();
		return;
	}

	createClickOutsideHandler(
		e,
		referenceRef.value,
		floatingRef.value,
		handleClose,
	);
}

function handleMouseLeaveFloating() {
	if (isPinned.value) {
		return;
	}

	handleClose();
}

async function handleContextMenu(event: MouseEvent) {
	event.preventDefault();
	isPinned.value = true;
	await nextTick();
	await handleOpen();
}

function handleClickWrapper() {
	if (isVisible.value && isPinned.value) {
		handleClose();
	} else {
		isPinned.value = true;
		handleOpen();
	}
}

function handleMouseOverWrapper() {
	if (!isVisible.value && !isPinned.value) {
		handleOpen();
	}
}

function handleMouseLeaveWrapper() {
	if (!isPinned.value) {
		handleClose();
	}
}

function addEventListeners() {
	const { trigger } = props;

	if (matchesTrigger(trigger, 'contextmenu')) {
		wrapperRef.value?.addEventListener('contextmenu', handleContextMenu);
	}
	if (matchesTrigger(trigger, 'click')) {
		wrapperRef.value?.addEventListener('click', handleClickWrapper);
	}
	if (matchesTrigger(trigger, 'hover')) {
		wrapperRef.value?.addEventListener('mouseover', handleMouseOverWrapper);
		wrapperRef.value?.addEventListener('mouseleave', handleMouseLeaveWrapper);
	}
}

function removeEventListeners() {
	const { trigger } = props;

	if (matchesTrigger(trigger, 'contextmenu')) {
		wrapperRef.value?.removeEventListener('contextmenu', handleContextMenu);
	}
	if (matchesTrigger(trigger, 'click')) {
		wrapperRef.value?.removeEventListener('click', handleClickWrapper);
	}
	if (matchesTrigger(trigger, 'hover')) {
		wrapperRef.value?.removeEventListener('mouseover', handleMouseOverWrapper);
		wrapperRef.value?.removeEventListener('mouseleave', handleMouseLeaveWrapper);
	}
}

onMounted(() => {
	addEventListeners();
});

onUnmounted(() => {
	removeEventListeners();
	handleClose();
});

defineExpose({
	isVisible,
	isPinned,
	handleOpen,
	handleClose,
});

defineSlots<{
	// eslint-disable-next-line no-shadow
	title(props: { isVisible: boolean; isPinned: boolean }): unknown;
	content(): unknown;
}>();
</script>

<template>
	<div
		ref="wrapper"
		data-position
		:data-position-level="level"
	>
		<div ref="reference">
			<slot
				name="title"
				:is-visible="isVisible"
				:is-pinned="isPinned"
			/>
		</div>

		<floating-teleport>
			<transition name="fade">
				<div
					v-if="isVisible"
					ref="floating"
					:style="floatingStyles"
					class="floating-inner"
				>
					<slot name="content" />
				</div>
			</transition>
		</floating-teleport>
	</div>
</template>

<style scoped>
.floating-inner {
	z-index: 101;
	max-height: 80svh;
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
