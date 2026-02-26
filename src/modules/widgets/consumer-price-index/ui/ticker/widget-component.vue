<script setup lang="ts">
import { computed, defineAsyncComponent, ref } from 'vue';

import {
	BaseErrorComponent,
	BaseTickerWidgetError,
	BaseTickerWidgetHeader,
	BaseTickerWidgetWrapper,
} from '@/modules/widgets/base';
import { useQueryCpi } from '../../queries';
import { CpiDateRangePreset, type CpiDateRangePresetType, CpiValueType, type CpiValueTypeType } from '../../model';
import type { ITickerWidgetMeta } from '@/modules/ticker';

import PreloaderComponent from './preloader-component.vue';
import MetricTrendTag from '@/modules/widgets/consumer-price-index/ui/ticker/metric-trend-tag.vue';

const ViewComponent = defineAsyncComponent({
	loader: () => import('./view-component.vue'),
	loadingComponent: PreloaderComponent,
	errorComponent: BaseErrorComponent,
});

interface IWidgetComponentProps {
	meta: ITickerWidgetMeta;
}

defineProps<IWidgetComponentProps>();

const activeRange = ref<CpiDateRangePresetType>(CpiDateRangePreset.Year);
const valueType = ref<CpiValueTypeType>(CpiValueType.Points);

function resetFilters() {
	activeRange.value = CpiDateRangePreset.Year;
	valueType.value = CpiValueType.Points;
}

const {
	data,
	isLoading,
	isError,
	refetch,
} = useQueryCpi(activeRange);

const metricTagValue = computed(() => data.value ? Math.abs(data.value.growthYoy) : 0);
const metricTagTrend = computed(() => data.value && data.value.growthYoy > 0 ? 'up' : 'down');
</script>

<template>
	<base-ticker-widget-wrapper :class="classes.wrapper">
		<base-ticker-widget-header>
			<template #default>Consumer price index</template>
			<template #right v-if="!isError && !isLoading && data">
				<metric-trend-tag
					:value="metricTagValue"
					:trend="metricTagTrend"
					unit="points"
				/>
			</template>
		</base-ticker-widget-header>
		<base-ticker-widget-error v-if="isError" @retry="refetch" />
		<preloader-component v-if="isLoading" />
		<view-component
			v-else-if="data"
			v-model:date-range="activeRange"
			v-model:value-type="valueType"
			:history="data"
			@reset="resetFilters"
		/>
	</base-ticker-widget-wrapper>
</template>

<style module="classes">
.wrapper {
	display: flex;
	flex-direction: column;
}
</style>
