<script setup lang="ts">
import { defineAsyncComponent } from 'vue';

import {
	BaseTickerWidgetError,
} from '@/modules/widgets/base';
import { PreloaderComponent } from '../common';
import { useUsInflation } from '../../composables';
import { isFeatureEnabled } from '@/shared/lib';
import type { ITickerWidgetMeta } from '@/modules/ticker';

const ViewComponent = defineAsyncComponent({
	loader: () => import('./ticker-component.vue'),
	loadingComponent: PreloaderComponent,
	errorComponent: BaseTickerWidgetError,
});

interface IWidgetComponentProps {
	meta: ITickerWidgetMeta;
}

const props = defineProps<IWidgetComponentProps>();


const {
	data,
	isLoading,
	isError,
	refetch,
} = useUsInflation({
	widgetId: props.meta.tickerId,
});

const widgetIsEnabled = isFeatureEnabled('TICKER_WIDGET_US_INFLATION_ENABLED');
</script>

<template>
	<div v-if="widgetIsEnabled">
		<base-ticker-widget-error v-if="isError" @retry="refetch" />
		<preloader-component
			v-else-if="isLoading"
		/>
		<view-component
			v-else-if="data"
			:data="data"
			:meta="meta"
		/>

	</div>
</template>
