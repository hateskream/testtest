<script setup lang="ts">
import { computed, type VNode } from 'vue';

import { useFloatingContext } from '@/app/plugins/floating';

const floating = useFloatingContext()!;

const { content } = floating;

const normalizedContent = computed<VNode[]>(() => {
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

<style scoped>

</style>
