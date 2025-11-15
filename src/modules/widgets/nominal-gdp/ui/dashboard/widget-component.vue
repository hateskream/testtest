<script setup lang="ts">
import { defineAsyncComponent, ref } from 'vue';

import type { IMeta } from '@/modules/dashboard-group';
import { BaseErrorComponent, BaseWidgetDashboard, WidgetContextMenu } from '@/modules/widgets/base';
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

const emits = defineEmits<{
	(e: 'delete'): void;
	(e: 'moveTo', dashboardId: string): void;
	(e: 'duplicate'): void;
}>();

const isError = false;
const isLoading = false;
const refetch = () => {};

const metricBadge = {
	label: 'Growth YoY',
	value: 0.10,
	unit: '',
	trend: 'up' as const,
	isPercent: true,
};

const items = [
	{
		label: 'GDP',
		color: '#fff',
	},
	{
		label: 'Potential GDP',
		color: '#FF7F35',
	},
];

enum DateRange {
	Day= '1D',
	Week = '1W',
	Month = '1M',
	SixMonths = '6M',
	Year = '1Y',
	TenYears = '10Y',
	All = 'ALL',
}

const dateRange = ref(DateRange.TenYears);

const dateRangeFilterValueToDisplay: Record<DateRange, string> = {
	[DateRange.Day]: '1 D',
	[DateRange.Week]: '7 days',
	[DateRange.Month]: '1 month',
	[DateRange.SixMonths]: '6 months',
	[DateRange.Year]: '1 Y',
	[DateRange.TenYears]: '10Y',
	[DateRange.All]: 'All',
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
				display-variant="new"
				:data-ranges="Object.values(DateRange)"
				:display-value-data-range="dateRangeFilterValueToDisplay"
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

		<template #settings-menu>
			<widget-context-menu
				:title="props.meta.name"
				:dashboards="props.meta.dashboards"
				@delete="emits('delete')"
				@duplicate="emits('duplicate')"
				@move-to="emits('moveTo', $event)"
			/>
		</template>
	</base-widget-dashboard>
</template>
