<script setup lang="ts">
import { defineAsyncComponent } from 'vue';

import type { IMeta } from '@/modules/dashboard-group';
import { BaseErrorComponent, BaseWidgetDashboard } from '@/modules/widgets/base';
import { PreloaderComponent } from '../common';
import { useNonfarmPayrolls } from '../../composables';

const ViewComponent = defineAsyncComponent({
	loader: () => import('../common/main-component.vue'),
	loadingComponent: PreloaderComponent,
	errorComponent: BaseErrorComponent,
});

interface IWidgetComponentProps {
	meta: IMeta;
}

const props = defineProps<IWidgetComponentProps>();

const {
	currentData,
	refetch,
	isError,
	isLoading,
} = useNonfarmPayrolls({
	widgetId: props.meta.widgetId,
});
</script>

<template>
	<base-widget-dashboard
		:meta="props.meta"
		:title="props.meta.name"
		:active-display-variant="props.meta.activeDisplayVariant"
		:all-display-variants="props.meta.allDisplayVariants"
		@retry="refetch"
	>
		<template #content>
			<base-error-component v-if="isError" @retry="refetch" />
			<preloader-component
				v-else-if="isLoading || props.meta.isLoading"
				:display-variant="props.meta.activeDisplayVariant"
			/>
			<view-component
				v-else
				:metric-badge="currentData!.badge"
				:points="currentData!.points"
				:chart-color-schema="currentData!.badge.isGood ? 'positive' : 'negative'"
			/>
		</template>
	</base-widget-dashboard>
</template>
