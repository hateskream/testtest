<script setup lang="ts">
import { useSlots } from 'vue';
import type { ReferenceElement, VirtualElement } from '@floating-ui/vue';

import { useFloatingContext } from '@/app/plugins/floating';
import { makeVirtualFromMouseEvent } from '@/app/plugins/floating/utils/virtual';
import type { IFloatingOptions } from '@/app/plugins/floating/types';

const props = withDefaults(defineProps<IFloatingOptions>(), {
	scope: 'default',
	trigger: 'click',
	placement: 'right-start',
	strategy: 'fixed',
	offset: 6,
	hideDelayMs: 120,
});

const slots = useSlots();
const floating = useFloatingContext(props.scope);

function openEvent(e: MouseEvent, opts?: IFloatingOptions) {
	floating.open({
		reference: makeVirtualFromMouseEvent(e),
		content: () => slots.default?.() ?? null,
		options: { ...props, ...(opts ?? {}) },
	});
}

function openAt(reference: ReferenceElement | VirtualElement, opts?: IFloatingOptions) {
	floating.open({
		reference: reference,
		content: () => slots.default?.() ?? null,
		options: { ...props, ...(opts ?? {}) },
	});
}

function close(immediate = false) {
	floating.close(immediate);
}

defineSlots<{
	default(): unknown;
}>();

defineExpose({ openEvent, openAt, close });
</script>

<!-- eslint-disable vue/valid-template-root -->
<template>
</template>
