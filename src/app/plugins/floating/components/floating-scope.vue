<script setup lang="ts">
import { computed } from 'vue';

import { useFloatingContext, type FloatingContentRenderable } from '@/app/plugins/floating';

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
</script>

<template>
	<div
		v-if="floating.isOpen"
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
