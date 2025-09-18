<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useMouse } from '@vueuse/core';

import GhostComponentBase from './ghost-component-base.vue';

interface ISize {
	height: number;
	width: number;
}

interface IGhostComponentProps {
	title: string;
}

const props = defineProps<IGhostComponentProps>();

const ghostComponentRef = ref<InstanceType<typeof GhostComponentBase> | null>(null);

const sizeGhostComponent = ref<ISize>({ height: 0, width: 0 });

const { x, y } = useMouse();

const styles = computed(() => ({
	left: `${x.value - sizeGhostComponent.value.width / 2}px`,
	top: `${y.value - sizeGhostComponent.value.height / 2}px`,
	willChange: 'left, top',
}));

onMounted(() => {
	if (!ghostComponentRef.value) {
		return;
	}

	sizeGhostComponent.value = {
		height: ghostComponentRef.value.$el.clientHeight,
		width: ghostComponentRef.value.$el.clientWidth,
	};
});
</script>

<template>
	<teleport to="#app">
		<ghost-component-base
			ref="ghostComponentRef"
			:style="styles"
			:title="props.title"
			:class="classes.root"
		/>
	</teleport>
</template>

<style module="classes">
.root {
	position: fixed;
	z-index: 9999;
	pointer-events: none;
}
</style>
