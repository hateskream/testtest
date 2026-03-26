<script setup lang="ts">
import { defineAsyncComponent } from 'vue';

import { BaseTickerWidgetError, BaseTickerWidgetHeader, BaseTickerWidgetWrapper } from '@/modules/widgets/base';
import type { ITickerWidgetMeta } from '@/modules/ticker';
import { MarginTrendsBadge } from '../common';
import { useQueryAnnualMarginTrends } from '../../queries';

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

const { data, isLoading, isError, refetch } = useQueryAnnualMarginTrends(() => props.meta.tickerId);
</script>

<template>
	<base-ticker-widget-wrapper :class="classes.widget">
		<base-ticker-widget-header>
			<template #default>
				{{ props.meta.name }}
			</template>
			<template v-if="data" #right>
				<margin-trends-badge :summary="data.summary" :status="data.status" />
			</template>
		</base-ticker-widget-header>
		<div :class="classes.content">
			<base-ticker-widget-error v-if="isError" @retry="refetch()" />
			<preloader-component v-else-if="isLoading" />
			<view-component
				v-else-if="data"
				:data="data"
			/>
		</div>
	</base-ticker-widget-wrapper>
</template>

<style module="classes">
.widget {
	display: flex;
	flex: 1 0 0;
	flex-direction: column;
}

.content {
	display: flex;
	flex-grow: 1;
	flex-direction: column;
	min-height: 0;
}
</style>
