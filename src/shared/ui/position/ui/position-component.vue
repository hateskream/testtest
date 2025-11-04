<script setup lang="ts">
import {
	flip,
	shift,
	offset,
	autoUpdate,
	useFloating,
} from '@floating-ui/vue';
import {
	ref,
	watch,
	nextTick,
	onMounted,
	onUnmounted,
	useTemplateRef,
} from 'vue';

import type { IFloatingOptions } from '../model';
import { matchesTrigger } from '../utils';
import { providePinnedLevel, providePinnedStack, useClickOutside, useHoverEvents } from '../composables';

import FloatingTeleport from '@/shared/ui/position/ui/host/floating-teleport.vue';

const props = withDefaults(defineProps<IFloatingOptions>(), {
	placement: 'right-end',
	trigger: 'click',
	offset: 6,
	strategy: 'fixed',
	openDelay: 0,
	closeDelay: (_props) => {
		if (_props.trigger && matchesTrigger(_props.trigger, ['hover'])) {
			return 150;
		}

		return 0;
	},
});

const level = providePinnedLevel(1);
const stack = providePinnedStack();

const isVisible = ref(false);
const isPinned = ref(false);

const wrapperRef = useTemplateRef('wrapper');
const referenceRef = useTemplateRef('reference');
const floatingRef = useTemplateRef('floating');

const { floatingStyles, update } = useFloating(referenceRef, floatingRef, {
	placement: props.placement,
	strategy: props.strategy,
	middleware: [
		offset(props.offset), flip(), shift({ padding: 4 }),
	],
});

let cleanup: (() => void) | null = null;

function open() {
	isVisible.value = true;
}

function close() {
	isVisible.value = false;
	isPinned.value = false;
}

const { handlePointerDown } = useClickOutside({
	trigger: referenceRef,
	floating: floatingRef,
	onClose: close,
});

function onPointerDown(e: PointerEvent) {
	if (stack.hasPinned()) {
		e.stopImmediatePropagation();
		e.stopPropagation();
		stack.closeLast();
		return;
	}

	handlePointerDown(e);
}

const {
	onMouseEnter,
	onMouseLeave,
	onFloatingEnter,
	onFloatingLeave,
} = useHoverEvents({
	isPinned,
	show: open,
	hide: close,
	triggerRef: referenceRef,
	openDelay: () => props.openDelay,
	closeDelay: () => props.closeDelay,
});

async function handleOpen() {
	open();
	await nextTick();

	cleanup = autoUpdate(referenceRef.value!, floatingRef.value!, update);

	if (matchesTrigger(props.trigger, ['click', 'contextmenu'])) {
		document.body.addEventListener('pointerdown', onPointerDown, true);
	}

	if (matchesTrigger(props.trigger, 'hover')) {
		floatingRef.value?.addEventListener('mouseenter', onFloatingEnter, true);
		floatingRef.value?.addEventListener('mouseleave', onFloatingLeave, true);
	}
}

function handleClose() {
	close();
	cleanup?.();
	cleanup = null;

	document.body.removeEventListener('pointerdown', onPointerDown, true);

	floatingRef.value?.removeEventListener('mouseenter', onFloatingEnter, true);
	floatingRef.value?.removeEventListener('mouseleave', onFloatingLeave, true);
}

watch(isVisible, (v) => (v ? handleOpen() : handleClose()));

function handleContextMenu(e: MouseEvent) {
	e.preventDefault();
	isPinned.value = true;
	handleOpen();
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
		onMouseEnter();
	}
}

function handleMouseLeaveWrapper() {
	if (!isPinned.value) {
		onMouseLeave();
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
