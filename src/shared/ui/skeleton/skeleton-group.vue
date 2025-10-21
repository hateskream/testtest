<script setup lang="ts">
import { computed, type CSSProperties } from 'vue';

import SkeletonComponent from './skeleton-component.vue';

interface ISkeletonGroupProps {
	count?: number;
	height?: CSSProperties['height'];
	borderRadius?: CSSProperties['borderRadius'];
	gap?: CSSProperties['gap'];
}

const props = withDefaults(defineProps<ISkeletonGroupProps>(), {
	count: 3,
	height: '64px',
	borderRadius: '16px',
	gap: '10px',
});

const opacityValues = computed(() => {
	// Прозрачность уменьшается равномерно от 1 до 0.3
	// За точность расчетов не гарантирую, нейронкой насрано. Вроде работает.
	const minOpacity = 0.3;
	const maxOpacity = 1;
	const step = props.count > 1
		? (maxOpacity - minOpacity) / (props.count - 1)
		: 0;
	return Array.from({ length: props.count }, (_, i) =>
		+(maxOpacity - step * i).toFixed(2),
	);
});
</script>

<template>
	<div :class="classes.root">
		<skeleton-component
			v-for="(opacity, index) in opacityValues"
			:key="index"
			:opacity="opacity"
			:height="height"
			:border-radius="borderRadius"
		/>
	</div>
</template>

<style module="classes">
.root {
	display: flex;
	flex-direction: column;
	gap: v-bind(gap);
}
</style>
