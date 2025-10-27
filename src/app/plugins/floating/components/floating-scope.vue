<script setup lang="ts">
import { computed, onUnmounted, watch } from 'vue';

import { createClickOutsideHandler, matchesTrigger } from '../utils';
import { useFloatingContext } from '../composables';
import { type FloatingContentRenderable } from '../types';

const props = defineProps<{
	scope: string;
}>();

const floating = useFloatingContext(props.scope);

const { content } = floating;

const normalizedContent = computed<FloatingContentRenderable[]>(() => {
	const node = floating.session.content?.();
	if (!node) {
		return [];
	}
	return Array.isArray(node) ? node : [node];
});

function handleClickOutside(e: PointerEvent) {
	createClickOutsideHandler(e, floating.reference.value, floating.content.value, floating.close);
}

function handleMouseLeave() {
	floating.stop();
}

function addEventListeners() {
	const { trigger } = floating.session.options;

	if (!trigger) {
		return;
	}

	if (matchesTrigger(trigger, ['click', 'contextmenu'])) {
		document.addEventListener('pointerdown', handleClickOutside, true);
	}

	if (matchesTrigger(trigger, 'hover')) {
		floating.content.value?.addEventListener('mouseleave', handleMouseLeave, true);
	}
}

function removeEventListeners() {
	document.removeEventListener('pointerdown', handleClickOutside, true);
	floating.content.value?.removeEventListener('mouseleave', handleMouseLeave, true);
}

watch(floating.isOpen, (isOpen) => {
	if (isOpen) {
		removeEventListeners();
		addEventListeners();
	} else {
		removeEventListeners();
	}
}, { immediate: true });

onUnmounted(removeEventListeners);
</script>

<template>
	<div
		v-if="normalizedContent.length"
		:key="floating.session.id"
		ref="content"
		:class="classes.scope"
		:style="floating.instance.floatingStyles"
	>
		<component
			:is="node"
			v-for="(node, i) in normalizedContent"
			:key="i"
		/>
	</div>
</template>

<style module="classes">
.scope {
	z-index: 101;
}
</style>
