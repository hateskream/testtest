<script setup lang="ts">
import { defineAsyncComponent, ref } from 'vue';

import type { IMeta } from '@/modules/dashboard-group';
import { BaseErrorComponent, BaseWidgetDashboard } from '@/modules/widgets/base';
import { PreloaderComponent, FiltersPanel } from '../common';

const ViewComponent = defineAsyncComponent({
	loader: () => import('../common/main-component.vue'),
	loadingComponent: PreloaderComponent,
	errorComponent: BaseErrorComponent,
});

interface IWidgetComponentProps {
	meta: IMeta;
}

const props = defineProps<IWidgetComponentProps>();

const isError = false;
const isLoading = false;
const refetch = () => {};

const metricBadge = {
	label: 'Growth YoY',
	value: 2.6,
	unit: 'points',
	trend: 'up' as const,
	isPercent: false,
};

const items = [
	{
		label: 'CPI',
		color: '#fff',
	},
];

enum DateRange {
	Day= '1D',
	Week = '1W',
	Month = '1M',
	SixMonths = '6M',
	Year = '1Y',
	All = 'ALL',
}

const dateRange = ref(DateRange.Year);

const dateRangeFilterValueToDisplay: Record<DateRange, string> = {
	[DateRange.Day]: '1 D',
	[DateRange.Week]: '7 days',
	[DateRange.Month]: '1 month',
	[DateRange.SixMonths]: '6 months',
	[DateRange.Year]: '1 Y',
	[DateRange.All]: 'All',
};

enum CPI {
	Points = 'points',
	ChangeDelta = 'change-delta',
	ChangePercent = 'change-percent',
}

const cpi = ref(CPI.Points);

const cpiFilterValueToDisplay: Record<CPI, string> = {
	[CPI.Points]: 'Points',
	[CPI.ChangeDelta]: 'Change',
	[CPI.ChangePercent]: 'Change, %',
};
</script>

<template>
	<base-widget-dashboard
		:title="props.meta.name"
		:active-display-variant="props.meta.activeDisplayVariant"
		:all-display-variants="props.meta.allDisplayVariants"
	>
		<template #filters>
			<filters-panel
				v-model:date-range="dateRange"
				v-model:cpi="cpi"
				display-variant="new"
				:data-ranges="Object.values(DateRange)"
				:cpis="Object.values(CPI)"
				:display-value-data-range="dateRangeFilterValueToDisplay"
				:display-value-cpi="cpiFilterValueToDisplay"
			/>
		</template>
		<template #title>
			{{ props.meta.name }}
		</template>
		<template #content>
			<base-error-component v-if="isError" @retry="refetch" />
			<preloader-component v-else-if="isLoading || props.meta.isLoading" />
			<view-component
				v-else
				:metric-badge="metricBadge"
				:legend="items"
			/>
		</template>
	</base-widget-dashboard>
</template>
