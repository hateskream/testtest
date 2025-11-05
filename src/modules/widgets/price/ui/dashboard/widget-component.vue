<script setup lang="ts">
import { defineAsyncComponent } from 'vue';

import { BaseWidgetDashboard, BaseErrorComponent } from '@/modules/widgets/base';
import type { IMeta } from '@/modules/dashboard-group';
import { usePrice } from '../../composables';
import { FilterComponent, PreloaderComponent } from '../common';

const ViewComponent = defineAsyncComponent({
	loader: () => import('../common/view-component.vue'),
	loadingComponent: PreloaderComponent,
	errorComponent: BaseErrorComponent,
});

interface IWidgetComponentProps {
	meta: IMeta;
}

const props = defineProps<IWidgetComponentProps>();

const {
	activeMarket,
	currentSettings,
	tickers,
	fetchTickersError,
	isNotData,
	togglePin,
	refetch,
	filtersValues,
	filtersState,
	hasPin,
} = usePrice({
	widgetId: props.meta.widgetId,
	isEphemeral: props.meta.isOpenFull,
	defaultStateType: props.meta.defaultStateType,
	maxCountRows: props.meta.maxCountRowTable,
});
</script>

<template>
	<base-widget-dashboard
		:title="props.meta.name"
		:active-display-variant="props.meta.activeDisplayVariant"
		:all-display-variants="props.meta.allDisplayVariants"
	>
		<template #filters>
			<filter-component
				v-model:market="activeMarket"
				v-model:filters="filtersState"
				:filters-values="filtersValues"
				display-type="dashboard"
			/>
		</template>
		<template #content>
			<base-error-component v-if="fetchTickersError" @retry="refetch" />
			<preloader-component v-else-if="isNotData || props.meta.isLoading" />
			<view-component
				v-else
				:tickers="tickers"
				:settings="currentSettings"
				:meta="meta"
				:has-pin="hasPin"
				@toggle-pin="togglePin"
			/>
		</template>
	</base-widget-dashboard>
</template>
