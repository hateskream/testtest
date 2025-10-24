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
	<teleport to="body">
		<transition name="fade">
			<div
				v-if="floating.isOpen && normalizedContent.length"
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
		</transition>
	</teleport>
</template>

<style module="classes">
.host {
	z-index: 101;
}
</style>

<style scoped>
.fade-enter-active,
.fade-leave-active {
	transition: opacity 0.15s ease;
}

.fade-enter-from,
.fade-leave-to {
	opacity: 0;
}
</style>
