<script setup lang="ts">
import { nextTick, onMounted, onUnmounted, toValue, useTemplateRef, watch } from 'vue';
import { autoUpdate, flip, offset, shift, useFloating } from '@floating-ui/vue';

import type { ISubpositionContentProps } from '../../model';
import { matchesTrigger } from '../../utils';
import { useSubFloatingContext } from '../../composables';

const props = withDefaults(defineProps<ISubpositionContentProps>(), {
	placement: 'bottom-start',
	offset: 6,
	strategy: 'absolute',
	openDelay: 0,
	closeDelay: 0,
});

const contentRef = useTemplateRef('content');

const {
	isOpen,
	triggerRef,
	trigger: _trigger,
	registerContent,
	events,
} = useSubFloatingContext();

const trigger = () => toValue(_trigger);

let cleanup: null | (() => void) = null;

const { floatingStyles, update } = useFloating(triggerRef, contentRef, {
	placement: props.placement,
	strategy: props.strategy,
	middleware: [offset(props.offset), flip(), shift({ padding: 4 })],
});

function handleOpen() {
	nextTick(() => {
		if (!triggerRef.value || !contentRef.value) {
			return;
		}

		cleanup = autoUpdate(triggerRef.value, contentRef.value, update);

		if (matchesTrigger(trigger(), 'hover')) {
			contentRef.value.addEventListener('mouseenter', events.hover.onFloatingEnter);
			contentRef.value.addEventListener('mouseleave', events.hover.onFloatingLeave);
		}
	});
}

function dispose() {
	cleanup?.();
	cleanup = null;
	contentRef.value?.removeEventListener('mouseenter', events.hover.onFloatingEnter);
	contentRef.value?.removeEventListener('mouseleave', events.hover.onFloatingLeave);
}

onMounted(() => {
	if (contentRef.value) {
		registerContent(contentRef.value);
	}
});

onUnmounted(dispose);

watch(isOpen, (v) => (v ? handleOpen() : dispose()));
</script>

<template>
	<div
		v-if="isOpen"
		ref="content"
		:style="floatingStyles"
		data-position-content
	>
		<slot />
	</div>
</template>

<style scoped>

</style>
