<script setup lang="ts">
import { defineAsyncComponent } from 'vue';

import { BaseErrorComponent, BaseWidgetDashboard } from '@/modules/widgets/base';
import type { IMeta } from '@/modules/dashboard-group';
import { usePrice } from '../../composables';
import { FilterComponent, PreloaderComponent } from '../common';
import type { IInfiniteStateHandler } from '@/shared/ui/infinite-loading';

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
	loadMore,
	hasNextPage,
} = usePrice({
	widgetId: props.meta.widgetId,
	isEphemeral: props.meta.isOpenFull,
	defaultStateType: props.meta.defaultStateType,
	maxCountRows: props.meta.maxCountRowTable,
});

async function loadMoreTickets($state: IInfiniteStateHandler) {
	await loadMore();

	if (fetchTickersError.value) {
		$state.error();
	} else if (hasNextPage.value) {
		$state.loaded();
	} else {
		$state.complete();
	}
}
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
			<preloader-component v-else-if="isNotData || props.meta.isLoading" :class="classes.preloader" />
			<view-component
				v-else
				display-variant="new"
				:tickers="tickers"
				:settings="currentSettings"
				:meta="meta"
				:has-pin="hasPin"
				@load-more="loadMoreTickets"
				@toggle-pin="togglePin"
			/>
		</template>
	</base-widget-dashboard>
</template>

<style module="classes">
.preloader {
	padding: 0 20px;
}
</style>
