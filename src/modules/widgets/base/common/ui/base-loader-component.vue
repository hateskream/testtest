<script setup lang="ts">
import { computed, defineAsyncComponent, type Component } from 'vue';

import type { DisplayVariant } from '@/modules/dashboard-group/layout-dashboards/model';

interface IBaseLoaderComponentProps {
	displayVariant?: DisplayVariant;
}

const props = withDefaults(defineProps<IBaseLoaderComponentProps>(), {
	displayVariant: 'default',
});

const resolvedVariant = computed<string>(() => {
	return props.displayVariant === 'default' || !props.displayVariant
		? 'tile'
		: props.displayVariant;
});

const resolvedComponent = computed(() => {
	const variant = resolvedVariant.value;

	const loaders: Record<string, () => Promise<Component>> = {
		tile: () => import('./loader-presets/tile-skeleton.vue'),
		chart: () => import('./loader-presets/chart-skeleton.vue'),
		bar: () => import('./loader-presets/bar-skeleton.vue'),
		indicator: () => import('./loader-presets/indicator-skeleton.vue'),
		list: () => import('./loader-presets/list-skeleton.vue'),
		table: () => import('./loader-presets/table-skeleton.vue'),
		heatmap: () => import('./loader-presets/heatmap-skeleton.vue'),
	};

	const loader = loaders[variant] ?? loaders.tile;

	return defineAsyncComponent({ loader });
});
</script>

<template>
	<div :class="classes.container">
		<slot name="header"></slot>
		<slot v-if="$slots.default" />
		<component :is="resolvedComponent" v-else />
		<slot name="footer"></slot>
	</div>
</template>

<style module="classes">
.container {
	display: flex;
	flex-grow: 1;
	flex-direction: column;
	padding: 0 16px 16px;
}
</style>
