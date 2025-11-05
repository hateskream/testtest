<script setup lang="ts">
import { computed } from 'vue';

import type { IMeta } from '@/modules/dashboard-group';

import ChartPrice from './chart-price.vue';

interface IViewComponentProps {
	meta: IMeta;
	isShowTimeRange: boolean;
	displayVariant: 'tv' | 'dashboard';
}

const props = defineProps<IViewComponentProps>();

const isBig = computed(() => props.meta.size.h >= 6 );
</script>

<template>
	<div :class="classes.root">
		<slot name="filters" />
		<chart-price
			:display-variant="props.displayVariant"
			:is-big="isBig"
			:is-show-time-range="props.isShowTimeRange"
			:style="{
				height: props.displayVariant === 'tv' ? 'calc(100% - 32px)' : 'calc(100% - 8px)',
			}"
		/>
	</div>
</template>

<style module="classes">
.root {
	display: flex;
	flex-direction: column;
	height: 100%;
	max-height: 100%;
}
</style>
