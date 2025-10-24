<script setup lang="ts">
import { computed } from 'vue';

import { useFloatingContext, type FloatingContentRenderable } from '@/app/plugins/floating';

const floating = useFloatingContext()!;

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
	<teleport v-if="floating.isOpen" to="body">
		<div
			ref="content"
			:class="classes.host"
			:style="floating.instance.floatingStyles"
		>
			<component
				:is="node"
				v-for="(node, i) in normalizedContent"
				:key="i"
			/>
		</div>
	</teleport>
</template>

<style module="classes">
.host {
	z-index: 101;
}
</style>
