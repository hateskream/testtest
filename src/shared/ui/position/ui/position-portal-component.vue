<script setup lang="ts">
import { computed, useSlots } from 'vue';
import type { ReferenceElement, VirtualElement } from '@floating-ui/vue';

import {
	useFloatingContext,
	makeVirtualFromMouseEvent,
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
		reference: makeVirtualFromMouseEvent(e),
		content: renderNode.value,
		options: { ...props, ...(opts ?? {}) },
	});
}

function openAt(reference: ReferenceElement | VirtualElement, opts?: IFloatingOptions) {
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
		close: () => void
	): unknown;
}>();

defineExpose({ openEvent, openAt, close });
</script>

<!-- eslint-disable vue/valid-template-root -->
<template>
</template>
