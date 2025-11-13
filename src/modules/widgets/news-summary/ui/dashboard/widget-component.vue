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

const metricBadge = {
	trend: 'optimistic' as const,
};

const summary = {
	// eslint-disable-next-line @stylistic/max-len
	text: 'UK\'s MPC votes shifted to 0-1-8, Bank Rate stable at 4.5%. SNB lowers rate to 0.25%. AU job losses surged to 52.8K, UK claimants up to 44.2K.',
	summaryAt: '19:30',
};
</script>

<template>
	<base-widget-dashboard
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
				:summary="summary"
			/>
		</template>
	</base-widget-dashboard>
</template>
