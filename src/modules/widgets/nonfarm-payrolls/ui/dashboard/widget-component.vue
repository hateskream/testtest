<script setup lang="ts">
import { defineAsyncComponent } from 'vue';

import type { IMeta } from '@/modules/dashboard-group';
import { BaseErrorComponent, BaseWidgetDashboard } from '@/modules/widgets/base';
import { PreloaderComponent } from '../common';

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

interface IMetricTrendBadge {
	topValue: number;
	isTopValuePercent: boolean;
	label: string;
	value: number;
	unit: string;
	trend: 'up' | 'down';
	isGood: boolean;
	isPercent: boolean;
}

const metricBadge: IMetricTrendBadge = {
	label: 'Payrolls down YoY',
	value: 70,
	unit: '',
	trend: 'up' as const,
	isPercent: true,
	topValue: 22274,
	isTopValuePercent: false,
	isGood: false,
};
</script>

<template>
	<base-widget-dashboard
		:meta="props.meta"
		:title="props.meta.name"
		:active-display-variant="props.meta.activeDisplayVariant"
		:all-display-variants="props.meta.allDisplayVariants"
	>
		<template #content>
			<base-error-component v-if="isError" @retry="refetch" />
			<preloader-component v-else-if="isLoading || props.meta.isLoading" />
			<view-component
				v-else
				:metric-badge="metricBadge"
				chart-color-schema="negative"
			/>
		</template>
	</base-widget-dashboard>
</template>
