<script setup lang="ts">
import { computed } from 'vue';

import type { IMeta } from '@/modules/dashboard-group';
import { TimeRangeFilterValue } from '@/modules/widgets/chart-price/model';

import ChartPrice from './chart-price.vue';

interface IViewComponentProps {
	meta: IMeta;
	isShowTimeRange: boolean;
	displayVariant: 'tv' | 'dashboard';
}

const props = defineProps<IViewComponentProps>();

const dateRange = defineModel<TimeRangeFilterValue>('range', { required: true });

const isBig = computed(() => props.meta.size.h >= 6 && props.meta.size.w >= 2);
const isShowChart = computed(() => props.meta.size.h > 3);
const isShowAxes = computed(() => props.meta.size.h >= 5 && props.meta.size.w >= 3);

const isTvDisplayVariant = computed(() => props.displayVariant === 'tv');
</script>

<template>
	<div :class="classes.root">
		<div v-if="$slots.filters" :class="{ [classes.filters]: isTvDisplayVariant }">
			<slot name="filters" />
		</div>
		<chart-price
			v-model:range="dateRange"
			:display-variant="props.displayVariant"
			:is-big="isBig"
			:is-show-chart="isShowChart"
			:is-show-time-range="props.isShowTimeRange && props.meta.size.w > 2"
			:is-show-axes="isShowAxes"
			:class="classes.chart"
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

.filters {
	padding: 0 16px;
}
</style>
