<script setup lang="ts">
import { defineAsyncComponent } from 'vue';

import type { ITickerWidgetMeta } from '@/modules/ticker';
import { useUnemploymentRate } from '../../composables';

import PreloaderComponent from './preloader-component.vue';
import ErrorComponent from './error-component.vue';

const props = defineProps<{
	meta: ITickerWidgetMeta;
}>();

const { currentData, isLoading } = useUnemploymentRate({
	widgetId: props.meta.tickerId,
});

const ViewComponent = defineAsyncComponent({
	loader: () => import('./view-component.vue'),
	loadingComponent: PreloaderComponent,
	errorComponent: ErrorComponent,
});
</script>

<template>
	<preloader-component v-if="isLoading" />

	<view-component
		v-else-if="currentData"
		:meta="props.meta"
		:current-data="currentData"
	/>

	<error-component v-else />
</template>

<style module="classes">

</style>
