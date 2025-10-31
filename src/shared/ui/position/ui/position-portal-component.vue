<script setup lang="ts">
import { computed, type MaybeRefOrGetter, onUnmounted, ref, useSlots, watch } from 'vue';
import type { ReferenceElement } from '@floating-ui/vue';

import {
	useFloatingContext,
	createVirtualFloatingNode,
	type IFloatingOptions,
} from '@/app/plugins/floating';

const props = withDefaults(defineProps<IFloatingOptions>(), {
	scope: 'default',
	trigger: 'click',
	placement: 'right-start',
	strategy: 'fixed',
	offset: 6,
});

const isVisible = ref(false);

const slots = useSlots();
const floating = useFloatingContext(props.scope);

const renderNode = computed(() => {
	return () => slots.default?.({
		close: handleClose,
		isVisible: isVisible,
	}) ?? null;
});

function handleOpen(reference?: MaybeRefOrGetter<ReferenceElement>, opts?: IFloatingOptions) {
	if (isVisible.value) {
		return;
	}

	isVisible.value = true;

	floating.open({
		reference: reference ?? floating.reference.value,
		content: renderNode.value,
		options: { ...props, ...(opts ?? {}) },
		onClose: () => {
			isVisible.value = false;
		},
	});
}

function handleClose() {
	if (!isVisible.value) {
		return;
	}

	floating.close();
}

watch(isVisible, (value) => {
	if (value) {
		handleOpen();
	} else {
		handleClose();
	}
});

function openEvent(e: MouseEvent, opts?: IFloatingOptions) {
	handleOpen(createVirtualFloatingNode(e), opts);
}

function openAt(reference: MaybeRefOrGetter<ReferenceElement>, opts?: IFloatingOptions) {
	handleOpen(reference, opts);
}

defineSlots<{
	// eslint-disable-next-line no-shadow
	default(props: {
		close: () => void;
		isVisible: boolean;
	}): unknown;
}>();

defineExpose({
	openEvent,
	openAt,
	close: handleClose,
	floating,
});

onUnmounted(() => {
	if (isVisible.value) {
		floating.stop();
	}
});
</script>

<!-- eslint-disable vue/valid-template-root -->
<template>
</template>
