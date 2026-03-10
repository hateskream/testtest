<script setup lang="ts">
import { computed, defineAsyncComponent } from 'vue';

import { BaseTickerWidgetError } from '@/modules/widgets/base';
import { useAnalystRatings } from '../../composables';
import type { ITickerWidgetMeta } from '@/modules/ticker';
import { isFeatureEnabled } from '@/shared/lib';
import { isStockMarket } from '@/modules/cell';

import PreloaderComponent from './preloader-component.vue';

const ViewComponent = defineAsyncComponent({
	loader: () => import('./base-view.vue'),
	loadingComponent: PreloaderComponent,
	errorComponent: BaseTickerWidgetError,
});

interface IProps {
	meta: ITickerWidgetMeta;
}

const props = defineProps<IProps>();

const {
	data,
	isLoading,
	isError,
	refetch,
} = useAnalystRatings({
	tickerId: () => props.meta.tickerId,
});

const isStock = computed(() => isStockMarket(props.meta.tickerId));

const isThrowError = computed(() => {
	return isError.value || !isStock.value;
});

const widgetIsEnabled = isFeatureEnabled('TICKER_WIDGET_ANALYST_RATINGS_ENABLED');
</script>

<template>
	<div v-if="widgetIsEnabled">
		<base-ticker-widget-error v-if="isThrowError" @retry="refetch()" />
		<preloader-component v-else-if="isLoading" />
		<view-component
			v-else-if="data"
			:data="data"
			:meta="meta"
		/>
	</div>
</template>
