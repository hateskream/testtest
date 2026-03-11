<script setup lang="ts">
import { defineAsyncComponent } from 'vue';

import { BaseTickerWidgetError, BaseTickerWidgetHeader, BaseTickerWidgetWrapper } from '@/modules/widgets/base';
import type { ITickerWidgetMeta } from '@/modules/ticker';
import { useSeasonsals } from '../../composables';

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

const {
	data,
	selectedYears,
	availableYears,
	isLoading,
	isError,
	refetch,
} = useSeasonsals(() => props.meta.tickerId);
</script>

<template>
	<base-ticker-widget-wrapper>
		<base-ticker-widget-header>{{ props.meta.name }}</base-ticker-widget-header>
		<div :class="classes.content">
			<base-ticker-widget-error v-if="isError" @retry="refetch()" />
			<preloader-component v-else-if="isLoading" />
			<view-component
				v-else-if="data"
				v-model:selected-years="selectedYears"
				:available-years="availableYears"
				:data="data"
			/>
		</div>
	</base-ticker-widget-wrapper>
</template>

<style module="classes">
.content {
	display: flex;
	flex-grow: 1;
	flex-direction: column;
	min-height: 0;
	padding: 40px 0 0;
}
</style>
