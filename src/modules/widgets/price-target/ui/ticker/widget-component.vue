<script setup lang="ts">
import { defineAsyncComponent } from 'vue';

import { BaseErrorComponent, BaseTickerWidgetError } from '@/modules/widgets/base';
import { useQueryPriceTarget } from '../../queries';
import { isFeatureEnabled } from '@/shared/lib';
import type { ITickerWidgetMeta } from '@/modules/ticker';

import PreloaderComponent from './preloader-component.vue';

const ViewComponent = defineAsyncComponent({
	loader: () => import('./view-component.vue'),
	loadingComponent: PreloaderComponent,
	errorComponent: BaseErrorComponent,
});

interface IWidgetComponentProps {
	meta: ITickerWidgetMeta;
}

const props = defineProps<IWidgetComponentProps>();

const { data, isLoading, isError, refetch } = useQueryPriceTarget(
	() => props.meta.tickerId,
);

const widgetIsEnabled = isFeatureEnabled('TICKER_WIDGET_PRICE_TARGET_ENABLED');
</script>

<template>
	<div v-if="widgetIsEnabled" :class="classes.container">
		<base-ticker-widget-error v-if="isError" @retry="refetch()" />
		<preloader-component v-else-if="isLoading" />
		<view-component v-else-if="data" :data="data" />
	</div>
</template>

<style module="classes">
.container {
	display: flex;
	flex-direction: column;
}
</style>
