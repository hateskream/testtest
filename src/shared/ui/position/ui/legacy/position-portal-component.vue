<script setup lang="ts">
import {
	autoUpdate,
	useFloating,
	offset,
	flip,
	shift,
	type ReferenceElement,
} from '@floating-ui/vue';
import {
	ref,
	watch,
	toValue,
	nextTick,
	onUnmounted,
	useTemplateRef,
	type MaybeRefOrGetter,
} from 'vue';

import { createVirtualFloatingNode, matchesTrigger } from '../../utils';
import { providePinnedLevel, providePinnedStack, useProvideFloatingContext } from '../../composables';
import type { IFloatingOptions } from '../../model';

import PositionTeleport from '../position-teleport.vue';

const props = withDefaults(defineProps<IFloatingOptions>(), {
	trigger: 'click',
	placement: 'right-start',
	strategy: 'fixed',
	offset: 6,
});

const isVisible = ref(false);
const isPinned = ref(false);

providePinnedLevel(1);
const stack = providePinnedStack();

const referenceRef = ref<ReferenceElement | null>(null);
const floatingRef = useTemplateRef('floating');

const { floatingStyles, update } = useFloating(referenceRef, floatingRef, {
	placement: props.placement,
	strategy: props.strategy,
	middleware: [offset(props.offset), flip(), shift({ padding: 4 })],
});

let cleanup: (() => void) | null = null;

async function handleOpen(reference?: MaybeRefOrGetter<ReferenceElement>) {
	isVisible.value = true;

	if (reference) {
		referenceRef.value = toValue(reference);
	}

	await nextTick();

	if (!referenceRef.value || !floatingRef.value) {
		return;
	}

	cleanup = autoUpdate(referenceRef.value, floatingRef.value, update);
	addEventListeners();
}

function handleClose() {
	isVisible.value = false;
	isPinned.value = false;

	cleanup?.();
	cleanup = null;
	removeEventListeners();
}

watch(isVisible, (value) => {
	if (value) {
		handleOpen();
	} else {
		handleClose();
	}
});

function openEvent(e: MouseEvent) {
	isPinned.value = true;
	const virtualElement = createVirtualFloatingNode(e);
	handleOpen(virtualElement);
}

function openAt(reference: MaybeRefOrGetter<ReferenceElement>) {
	isPinned.value = true;
	handleOpen(reference);
}

defineExpose({
	openEvent,
	openAt,
	close: handleClose,
	update,
	isVisible,
});

function handleClickOutside(e: PointerEvent) {
	const target = e.target as HTMLElement;

	if (
		target && target.closest('[data-subposition]') ||
		floatingRef.value && floatingRef.value.contains(target)
	) {
		return;
	}

	if (stack.hasPinned()) {
		e.stopImmediatePropagation();
		e.stopPropagation();
		stack.closeLast();
		return;
	}

	handleClose();
}

function handleMouseLeaveFloating() {
	handleClose();
}

function addEventListeners() {
	const { trigger } = props;

	if (matchesTrigger(trigger, ['click', 'contextmenu'])) {
		document.body.addEventListener('pointerdown', handleClickOutside, true);
	}

	if (matchesTrigger(trigger, 'hover')) {
		floatingRef.value?.addEventListener('mouseleave', handleMouseLeaveFloating, true);
	}
}

function removeEventListeners() {
	document.body.removeEventListener('pointerdown', handleClickOutside, true);
	floatingRef.value?.removeEventListener('mouseleave', handleMouseLeaveFloating, true);
}

onUnmounted(() => {
	removeEventListeners();
	cleanup?.();
});

// eslint-disable-next-line @typescript-eslint/no-explicit-any
useProvideFloatingContext({} as any);
</script>

<template>
	<position-teleport>
		<div
			v-if="isVisible"
			ref="floating"
			:style="floatingStyles"
			data-position
			data-portal-content
		>
			<slot :close="handleClose" :is-visible="isVisible" />
		</div>
	</position-teleport>
</template>

<style scoped>
[data-portal-content] {
	z-index: 101;
	max-height: 80svh;
}
</style>
