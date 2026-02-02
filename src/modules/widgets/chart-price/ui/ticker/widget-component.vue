<script setup lang="ts">
import { defineAsyncComponent } from 'vue';

import { BaseErrorComponent } from '@/modules/widgets/base';
import { useTickerChartPrice } from '../../composables';

import PreloaderComponent from './preloader-component.vue';

const ViewComponent = defineAsyncComponent({
	loader: () => import('./view-component.vue'),
	loadingComponent: PreloaderComponent,
	errorComponent: BaseErrorComponent,
	delay: 0,
});

interface IWidgetComponentProps {
	meta: {
		tickerId: string;
	};
	handleScale?: boolean;
}

const props = defineProps<IWidgetComponentProps>();

const {
	data,
	dateRange,
	timezone,
	chartType,
	isError,
	isLoading,
	refetch,
} = useTickerChartPrice(() => props.meta.tickerId);
</script>

<template>
	<div>
		<base-error-component v-if="isError" @retry="refetch" />
		<preloader-component v-else-if="isLoading" />
		<view-component
			v-else-if="data"
			v-model:date-range="dateRange"
			v-model:timezone="timezone"
			v-model:chart-type="chartType"
			:data="data"
			:handle-scale="props.handleScale"
		/>
	</div>
</template>
