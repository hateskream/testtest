<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from 'vue';
import { throttle } from '@vexip-ui/utils';

import GhostComponentBase from './ghost-component-base.vue';

interface IPosition {
	x: number;
	y: number;
}

interface ISize {
	height: number;
	width: number;
}

interface IGhostComponentProps {
	title: string;
}

const props = defineProps<IGhostComponentProps>();

const ghostComponentRef = ref<InstanceType<typeof GhostComponentBase> | null>(null);

const position = ref<IPosition>({ x: 0, y: 0 });

const sizeGhostComponent = ref<ISize>({ height: 0, width: 0 });

const styles = computed(() => ({
	left: `${position.value.x - sizeGhostComponent.value.width / 2 + 14}px`,
	top: `${position.value.y - sizeGhostComponent.value.height / 2 - 20}px`,
	transform: 'translate(-50%, -50%)',
	willChange: 'transform, left, top',
}));

const trottledUpdatePosition = throttle(updatePosition, 30);

onMounted(() => {
	window.addEventListener('mousemove', trottledUpdatePosition);

	if (!ghostComponentRef.value) {
		return;
	}

	sizeGhostComponent.value = {
		height: ghostComponentRef.value.$el.clientHeight,
		width: ghostComponentRef.value.$el.clientWidth,
	};
});

onUnmounted(() => {
	window.removeEventListener('mousemove', trottledUpdatePosition);
});

function updatePosition(event: MouseEvent) {
	const scrollX = window.scrollX || window.pageXOffset;
	const scrollY = window.scrollY || window.pageYOffset;

	position.value = {
		x: event.clientX + scrollX,
		y: event.clientY + scrollY,
	};
}
</script>

<template>
	<div
		:style="styles"
		:class="classes.root"
	>
		<ghost-component-base
			ref="ghostComponentRef"
			:title="props.title"
		/>
	</div>
</template>

<style module="classes">
.root {
	position: fixed;
}
</style>
