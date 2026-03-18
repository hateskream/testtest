<script setup lang="ts">
import { defineAsyncComponent } from 'vue';

import {
	BaseTickerWidgetContent,
	BaseTickerWidgetError,
	BaseTickerWidgetHeader,
	BaseTickerWidgetWrapper,
} from '@/modules/widgets/base';
import type { ITickerWidgetMeta } from '@/modules/ticker';
import { useSectors } from '../../../composables';

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
} = useSectors({ tickerId: () => props.meta.tickerId });
</script>

<template>
	<base-ticker-widget-wrapper :class="classes.wrapper">
		<base-ticker-widget-header>{{ props.meta.name }}</base-ticker-widget-header>
		<base-ticker-widget-content :class="classes.content">
			<base-ticker-widget-error
				v-if="isError"
				:class="classes.error"
				@retry="refetch"
			/>
			<preloader-component v-else-if="isLoading" />
			<view-component
				v-else-if="data"
				:data="data"
			/>
		</base-ticker-widget-content>
	</base-ticker-widget-wrapper>
</template>

<style module="classes">
.wrapper {
	display: flex;
	flex-direction: column;
	align-self: stretch;
}

.error {
	flex-grow: 1;
}

.content {
	display: flex;
	flex-grow: 1;
	flex-direction: column;
	justify-content: flex-start;
}
</style>
