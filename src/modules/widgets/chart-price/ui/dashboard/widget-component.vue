<script setup lang="ts">
import { defineAsyncComponent } from 'vue';

import { BaseErrorComponent, BaseWidgetDashboard, ModalSubmenu } from '@/modules/widgets/base';
import type { IMeta } from '@/modules/dashboard-group';
import { ModalTickerSelector } from '@/modules/ticker-selector';
import { useChartPrice } from '../../composables';
import { FiltersComponent, PreloaderComponent } from '../common';

const ViewComponent = defineAsyncComponent({
	loader: () => import('../common/view-component.vue'),
	loadingComponent: PreloaderComponent,
	errorComponent: BaseErrorComponent,
});

interface IWidgetComponentProps {
	meta: IMeta;
}

const props = defineProps<IWidgetComponentProps>();

const {
	selectedTicker,
	timeRange,
	watchlists,

	handleAddToWatchlist,
	handleRemoveFromWatchlist,
	handleAddTickerInNewWatchlist,
} = useChartPrice({
	widgetId: props.meta.widgetId,
	isEphemeral: props.meta.isOpenFull,
	defaultStateType: props.meta.defaultStateType,
});

function updateTicker(newValue: string[]) {
	[selectedTicker.value] = newValue;
}
</script>

<template>
	<base-widget-dashboard
		:title="props.meta.name"
		:active-display-variant="props.meta.activeDisplayVariant"
		:all-display-variants="props.meta.allDisplayVariants"
	>
		<template #filters>
			<filters-component
				v-model:selected-ticker="selectedTicker"
				v-model:time-range="timeRange"
				:is-big="true"
				:watchlists="watchlists"
				display-variant="new"
				@add-to-watchlist="handleAddToWatchlist"
				@remove-from-watchlist="handleRemoveFromWatchlist"
				@add-to-new-watchlist="handleAddTickerInNewWatchlist"
			/>
		</template>
		<template #content>
			<preloader-component v-if="props.meta.isLoading" />
			<view-component
				v-else
				v-model:range="timeRange"
				:meta="meta"
				:is-show-time-range="false"
				display-variant="dashboard"
			/>
		</template>
		<template #other>
			<modal-submenu>
				<template #title>Choose ticker</template>
				<template #content>
					<modal-ticker-selector
						:model-value="[selectedTicker]"
						:enable-selected-info="false"
						:enable-select-all="false"
						selection-mode="single"
						@update:model-value="updateTicker"
					/>
				</template>
			</modal-submenu>
		</template>
	</base-widget-dashboard>
</template>
