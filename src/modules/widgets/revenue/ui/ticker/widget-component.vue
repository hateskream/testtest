<script setup lang="ts">
import { defineAsyncComponent } from 'vue';

import type { ITickerWidgetMeta } from '@/modules/ticker';
import {
	BaseErrorComponent,
	BaseTickerWidgetContent,
	BaseTickerWidgetError,
	BaseTickerWidgetHeader,
	BaseTickerWidgetWrapper,
} from '@/modules/widgets/base';
import { useRevenue } from '../../composables';

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

const { activeMode, data, isLoading, isError, refetch } = useRevenue({
	tickerId: () => props.meta.tickerId,
});
</script>

<template>
	<base-ticker-widget-wrapper>
		<base-ticker-widget-header>{{ props.meta.name }}</base-ticker-widget-header>
		<base-ticker-widget-content :class="classes.content">
			<base-ticker-widget-error v-if="isError" @retry="refetch()" />
			<preloader-component v-else-if="isLoading" />
			<view-component
				v-else-if="data"
				v-model="activeMode"
				:data="data"
			/>
		</base-ticker-widget-content>
	</base-ticker-widget-wrapper>
</template>

<style module="classes">
.content {
	align-items: normal;
	padding: 0;
}

.container {
	display: flex;
	flex-direction: column;
}
</style>
