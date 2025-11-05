<script setup lang="ts">
import { defineAsyncComponent } from 'vue';

import type { IMeta } from '@/modules/dashboard-group';
import { BaseErrorComponent, BaseWidgetDashboard } from '@/modules/widgets/base';
import { PreloaderComponent } from '../common';
import { useDominance } from '../../composables';

import DominanceFiltersPanel from '../common/dominance-filters-panel.vue';

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
	displaySettings,
	selectedTickers,
	activeDateRange,
	data,
	isLoading,
	isError,
	refetch,
} = useDominance({
	widgetId: props.meta.widgetId,
	isEphemeral: props.meta.isOpenFull,
});
</script>

<template>
	<base-widget-dashboard
		:title="props.meta.name"
		:active-display-variant="props.meta.activeDisplayVariant"
		:all-display-variants="props.meta.allDisplayVariants"
	>
		<template #filters>
			<dominance-filters-panel
				v-model:selected-tickers="selectedTickers"
				v-model:date-range="activeDateRange"
				:meta="props.meta"
				:display-settings="displaySettings"
				:class="classes.filters"
				display-variant="new"
			/>
		</template>
		<template #title>
			{{ props.meta.name }}
		</template>
		<template #content>
			<base-error-component v-if="isError" @retry="refetch" />
			<preloader-component v-else-if="isLoading || props.meta.isLoading" :class="classes.preloader" />
			<view-component
				v-else-if="data?.length"
				v-model:date-range="activeDateRange"
				:selected-tickers="selectedTickers"
				:data="data"
				:meta="props.meta"
				:display-settings="displaySettings"
				:class="classes.component"
			/>
		</template>
	</base-widget-dashboard>
</template>

<style module="classes">
.filters {
	margin-bottom: 16px;
}
</style>
