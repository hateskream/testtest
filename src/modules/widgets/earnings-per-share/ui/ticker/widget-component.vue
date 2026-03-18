<script setup lang="ts">
import { defineAsyncComponent } from 'vue';

import type { ITickerWidgetMeta } from '@/modules/ticker';
import { BaseTickerWidgetError, BaseTickerWidgetHeader, BaseTickerWidgetWrapper } from '@/modules/widgets/base';
import { useQueryEarningsPerShare } from '../../queries';
import { EpsForecastBadge } from '../common';

import PreloaderComponent from './preloader-component.vue';

const ViewComponent = defineAsyncComponent({
	loader: () => import('./view-component.vue'),
	loadingComponent: PreloaderComponent,
	errorComponent: BaseTickerWidgetError,
});

interface IWidgetComponentProps {
	meta: ITickerWidgetMeta;
}

const props = defineProps<IWidgetComponentProps>();

const { data, isLoading, isError, refetch } = useQueryEarningsPerShare(() => props.meta.tickerId);
</script>

<template>
	<base-ticker-widget-wrapper>
		<base-ticker-widget-header>
			<template #default>{{ props.meta.name }}</template>
			<template #right>
				<eps-forecast-badge v-if="data?.forecast" :forecast="data.forecast" />
			</template>
		</base-ticker-widget-header>
		<base-ticker-widget-error v-if="isError" @retry="refetch()" />
		<preloader-component v-else-if="isLoading" />
		<view-component v-else-if="data" :quarters="data.quarters" />
	</base-ticker-widget-wrapper>
</template>
