<script setup lang="ts">
import { computed, defineAsyncComponent } from 'vue';

import { BaseErrorComponent, BaseWidgetDashboard, ModalSubmenu } from '@/modules/widgets/base';
import type { IMeta } from '@/modules/dashboard-group';
import { useWidgetContext } from '@/modules/dashboard-group/layout-dashboards/composables';
import { useWidgetState } from '@/modules/widgets/base/composables';
import { SelectionMode, TickerSelectorModal } from '@/modules/ticker-selector';
import { useChartPriceState } from '../../composables';
import { getDefaultsState, type IState } from '../../model';
import { FiltersComponent, PreloaderComponent } from '../common';
import { ALL_MARKET_TYPES } from '@/modules/market';

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
	(e: 'delete'): void;
	(e: 'moveTo', dashboardId: string): void;
	(e: 'duplicate'): void;
}>();

const { updateState } = useWidgetContext();

const { state } = useWidgetState<IState>({
	externalState: computed(() => props.meta.state as IState | undefined),
	getDefaultState: () => getDefaultsState(props.meta.defaultStateType),
	onStateChange: (s) => updateState(s),
});

const {
	selectedTickersModel,
	selectedTickerId,
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
} = useChartPriceState({
	state,
	defaultStateType: props.meta.defaultStateType,
});
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
		@retry="refetch"
	>
		<template #filters>
			<filters-component
				v-model:selected-ticker="selectedTickersModel"
				v-model:time-range="timeRange"
				:selected-ticker-id="selectedTickerId"
				:is-big="true"
				:watchlists="watchlists"
				display-variant="new"
				@add-to-watchlist="handleAddToWatchlist"
				@remove-from-watchlist="handleRemoveFromWatchlist"
				@add-to-new-watchlist="handleAddTickerInNewWatchlist"
				@toggle-favorite-watchlist="handleToggleFavoriteWatchlist"
				@reset-all-changes="resetAllChanges"
			/>
		</template>

		<template #content>
			<base-error-component v-if="isError" @retry="refetch" />
			<preloader-component
				v-else-if="isLoading || props.meta.isLoading"
				:display-variant="props.meta.activeDisplayVariant"
			/>
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
					<ticker-selector-modal
						v-model:selected-tickers="selectedTickersModel"
						:enabled-markets="ALL_MARKET_TYPES"
						:enable-select-all="false"
						:selection-mode="SelectionMode.Single"
						display-variant="new"
					/>
				</template>
			</modal-submenu>
		</template>
	</base-widget-dashboard>
</template>
