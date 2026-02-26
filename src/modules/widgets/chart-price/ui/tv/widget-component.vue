<script setup lang="ts">
import { computed, defineAsyncComponent } from 'vue';

import { BaseErrorComponent, BaseWidgetTvComponent, ModalSubmenu } from '@/modules/widgets/base';
import type { IMeta } from '@/modules/dashboard-group';
import { SelectionMode, TickerSelectorModal } from '@/modules/ticker-selector';
import { useChartPrice } from '../../composables';
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

const {
	selectedTickerId,
	selectedTickersModel,
	timeRange,
	watchlists,

	data,
	isLoading,
	isError,
	refetch,

	handleAddToWatchlist,
	handleRemoveFromWatchlist,
	handleAddTickerInNewWatchlist,
	resetAllChanges,
	applyStateToParent,
} = useChartPrice({
	widgetId: props.meta.widgetId,
	isEphemeral: props.meta.isOpenFull,
	defaultStateType: props.meta.defaultStateType,
});

const emit = defineEmits<{
	(e: 'delete'): void;
	(e: 'moveTo', dashboardId: string): void;
	(e: 'duplicate'): void;
}>();

const isBig = computed(() => props.meta.size.h >= 6 );
</script>

<template>
	<base-widget-tv-component
		:meta="props.meta"
		has-reset
		@reset="resetAllChanges"
		@delete="emit('delete')"
		@duplicate="emit('duplicate')"
		@move-to="emit('moveTo', $event)"
		@apply-changes="applyStateToParent"
		@retry="refetch"
	>
		<template #title> {{ props.meta.name }} </template>
		<template #content>
			<base-error-component v-if="isError" @retry="refetch" />
			<preloader-component v-else-if="isLoading || props.meta.isLoading" />
			<view-component
				v-else-if="data"
				v-model:range="timeRange"
				:meta="meta"
				:current="data.current"
				:points="data.points"
				is-show-time-range
				display-variant="tv"
			>
				<template #filters>
					<filters-component
						v-model:selected-ticker="selectedTickersModel"
						v-model:time-range="timeRange"
						:selected-ticker-id="selectedTickerId"
						:is-big="isBig"
						:watchlists="watchlists"
						display-variant="default"
						@add-to-watchlist="handleAddToWatchlist"
						@remove-from-watchlist="handleRemoveFromWatchlist"
						@add-to-new-watchlist="handleAddTickerInNewWatchlist"
						@reset-all-changes="resetAllChanges"
					/>
				</template>
			</view-component>
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
						display-variant="default"
					/>
				</template>
			</modal-submenu>
		</template>
	</base-widget-tv-component>
</template>
