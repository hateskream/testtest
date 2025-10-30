<script setup lang="ts">
import { computed, type MaybeRefOrGetter, onUnmounted, useSlots } from 'vue';
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

const slots = useSlots();
const floating = useFloatingContext(props.scope);

const renderNode = computed(() => {
	return () => slots.default?.({
		close: close,
	}) ?? null;
});

function openEvent(e: MouseEvent, opts?: IFloatingOptions) {
	floating.open({
		reference: createVirtualFloatingNode(e),
		content: renderNode.value,
		options: { ...props, ...(opts ?? {}) },
	});
}

function openAt(reference: MaybeRefOrGetter<ReferenceElement>, opts?: IFloatingOptions) {
	floating.open({
		reference: reference,
		content: renderNode.value,
		options: { ...props, ...(opts ?? {}) },
	});
}

function close() {
	floating.close();
}

defineSlots<{
	default(
		// eslint-disable-next-line no-shadow
		close: () => void,
	): unknown;
}>();

defineExpose({
	openEvent,
	openAt,
	close,
	floating,
});

onUnmounted(() => {
	floating.stop();
});
</script>

<!-- eslint-disable vue/valid-template-root -->
<template>
</template>
