<script setup lang="ts">
import { computed, defineAsyncComponent, watch } from 'vue';

import { BaseErrorComponent, BaseWidgetDashboard, ModalSubmenu } from '@/modules/widgets/base';
import type { IMeta } from '@/modules/dashboard-group';
import { ModalTickerSelector } from '@/modules/ticker-selector';
import { useChartPrice } from '../../composables';
import { FiltersComponent, PreloaderComponent } from '../common';
import { getMappedRow, isCryptoTicker, isForexTicker } from '@/modules/ticker-selector/model';
import { useQueryTickerSelector } from '@/modules/ticker-selector/queries';

const ViewComponent = defineAsyncComponent({
	loader: () => import('../common/view-component.vue'),
	loadingComponent: PreloaderComponent,
	errorComponent: BaseErrorComponent,
});

interface IWidgetComponentProps {
	meta: IMeta;
}

const props = defineProps<IWidgetComponentProps>();

const emits = defineEmits<{
	(e: 'set-widget-state-type', widgetId: string, value: string): void;
	(e: 'delete'): void;
	(e: 'moveTo', dashboardId: string): void;
	(e: 'duplicate'): void;
}>();

const {
	selectedTicker,
	timeRange,
	watchlists,

	data,
	isLoading,
	isError,
	refetch,

	handleAddToWatchlist,
	handleRemoveFromWatchlist,
	handleAddTickerInNewWatchlist,
	handleToggleFavoriteWatchlist,
	resetAllChanges,
} = useChartPrice({
	widgetId: props.meta.widgetId,
	isEphemeral: props.meta.isOpenFull,
	defaultStateType: props.meta.defaultStateType,
});

function updateTicker(newValue: string[]) {
	[selectedTicker.value] = newValue;
}

const { data: tickersData, isSuccess: isSuccess } = useQueryTickerSelector();

const widgetLabel = computed(() => {
	if (!selectedTicker.value || !isSuccess.value) {
		return null;
	}

	const item = tickersData.value?.tickers
		.find(t => t.tickerId === selectedTicker.value);

	if (!item) {
		return null;
	}

	const row = getMappedRow(item);

	return isCryptoTicker(row) || isForexTicker(row)
		? row.ticker
		: row.name;
});

// TODO: add stateType onTickersLoaded
watch(widgetLabel, (label) => {
	if (!label) {
		return;
	}

	emits(
		'set-widget-state-type',
		props.meta.widgetId,
		label,
	);
}, { immediate: true });
</script>

<template>
	<base-widget-dashboard
		:meta="props.meta"
		:title="props.meta.name"
		:active-display-variant="props.meta.activeDisplayVariant"
		:all-display-variants="props.meta.allDisplayVariants"
		@delete="emits('delete')"
		@duplicate="emits('duplicate')"
		@move-to="emits('moveTo', $event)"
		@reset="resetAllChanges"
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
				@toggle-favorite-watchlist="handleToggleFavoriteWatchlist"
			/>
		</template>

		<template #content>
			<base-error-component v-if="isError" @retry="refetch" />
			<preloader-component v-else-if="isLoading || props.meta.isLoading" />
			<view-component
				v-else-if="data"
				v-model:range="timeRange"
				:meta="meta"
				:points="data.points"
				:current="data.current"
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
						display-variant="new"
						@update:model-value="updateTicker"
					/>
				</template>
			</modal-submenu>
		</template>
	</base-widget-dashboard>
</template>
