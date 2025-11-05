<script setup lang="ts">
import { computed, defineAsyncComponent } from 'vue';

import type { IMeta } from '@/modules/dashboard-group';
import { BaseErrorComponent, BaseWidgetDashboard } from '@/modules/widgets/base';
import { MarketCapFiltersPanel, PreloaderComponent } from '../common';
import { useMarketCap } from './../../composables';

const ViewComponent = defineAsyncComponent({
	loader: () => import('../common/base-view.vue'),
	loadingComponent: PreloaderComponent,
	errorComponent: BaseErrorComponent,
});

interface IWidgetComponentProps {
	meta: IMeta;
}

const props = defineProps<IWidgetComponentProps>();

const {
	selectedTickers,
	displaySettings,
	activeDateRange,
	data,
	isLoading,
	isError,
	refetch,
} = useMarketCap({
	widgetId: props.meta.widgetId,
	isEphemeral: props.meta.isOpenFull,
});

const isNotData = computed(() => (!!data.value && isLoading.value) || props.meta.isLoading);
</script>

<template>
	<base-widget-dashboard
		:title="props.meta.name"
		:active-display-variant="props.meta.activeDisplayVariant"
		:all-display-variants="props.meta.allDisplayVariants"
	>
		<template #filters>
			<market-cap-filters-panel
				v-model:selected-tickers="selectedTickers"
				v-model:date-range="activeDateRange"
				autofocus
				is-show-date-range
				:class="classes.filters"
				display-variant="new"
			/>
		</template>
		<template #title>
			{{ props.meta.name }}
		</template>
		<template #content>
			<base-error-component v-if="isError" @retry="refetch" />
			<preloader-component v-else-if="isNotData" />
			<view-component
				v-else-if="data"
				v-model:date-range="activeDateRange"
				:data="data"
				:meta="meta"
				:display-settings="displaySettings"
				:class="classes.content"
			/>
		</template>
	</base-widget-dashboard>
</template>

<style module="classes">
.filters {
	gap: 3px;
}

.content {
	padding-left: 16px;
	padding-top: 12px;
}
</style>
