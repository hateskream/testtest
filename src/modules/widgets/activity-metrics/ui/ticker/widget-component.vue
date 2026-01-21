<script setup lang="ts">
import { defineAsyncComponent } from 'vue';

import { BaseErrorComponent } from '@/modules/widgets/base';
import type { TickerId } from '@/modules/ticker';
import { useActivityMetrics } from '../../composables';

import PreloaderComponent from './preloader-component.vue';

const ViewComponent = defineAsyncComponent({
	loader: () => import('./base-view.vue'),
	loadingComponent: PreloaderComponent,
	errorComponent: BaseErrorComponent,
});

interface IWidgetComponentProps {
	meta: {
		tickerId: TickerId;
	};
}

const props = defineProps<IWidgetComponentProps>();

const {
	data,
	isLoading,
	isError,
	refetch,
	tickerMarket,
} = useActivityMetrics({
	tickerId: () => props.meta.tickerId,
});
</script>

<template>
	<div>
		<base-error-component v-if="isError" @retry="refetch" />
		<preloader-component v-else-if="isLoading" />
		<view-component
			v-else-if="data"
			:market="tickerMarket"
			:metrics="data"
		/>
	</div>
</template>
