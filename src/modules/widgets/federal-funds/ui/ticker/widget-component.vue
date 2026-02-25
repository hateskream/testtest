<script setup lang="ts">
import { defineAsyncComponent } from 'vue';


import { PreloaderComponent } from '../common';
import { useFederalFunds } from '../../composables';
import type { ITickerWidgetMeta } from '@/modules/ticker';
import { BaseTickerWidgetError } from '@/modules/widgets/base';
import { type DisplayVariant } from '@/modules/dashboard-group/layout-dashboards/model';
import { isFeatureEnabled } from '@/shared/lib';

import ErrorComponent from './error-component.vue';

const ViewComponent = defineAsyncComponent({
	loader: () => import('./ticker-component.vue'),
	loadingComponent: PreloaderComponent,
	errorComponent: BaseTickerWidgetError,
});

const displayVariant = 'tile' as DisplayVariant;

interface IWidgetComponentProps {
	meta: ITickerWidgetMeta;
}

const props = defineProps<IWidgetComponentProps>();

const {
	data,
	isLoading,
	isError,
	refetch,
} = useFederalFunds({ widgetId: props.meta.tickerId });

const widgetIsEnabled = isFeatureEnabled('TICKER_WIDGET_FEDERAL_FUNDS_ENABLED');
</script>

<template>
	<template v-if="widgetIsEnabled">
		<error-component
			v-if="isError"
			:meta="props.meta"
			@retry="refetch"
		/>
		<preloader-component
			v-else-if="isLoading"
			:display-variant="displayVariant"
		/>
		<view-component
			v-else-if="data"
			:data="data"
			:meta="props.meta"
		/>
	</template>
</template>
