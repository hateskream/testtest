<script setup lang="ts">
import { defineAsyncComponent } from 'vue';

import { BaseTickerWidgetError } from '@/modules/widgets/base';
import { usePricePerformance } from '../../composables';
import type { ITickerWidgetMeta } from '@/modules/ticker';

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
} = usePricePerformance({
	tickerId: () => props.meta.tickerId,
});
</script>

<template>
	<div>
		<base-ticker-widget-error v-if="isError" @retry="refetch" />
		<preloader-component v-else-if="isLoading" />
		<view-component
			v-else-if="data"
			:data="data"
			:meta="meta"
		/>
	</div>
</template>
