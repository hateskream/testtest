<script setup lang="ts">
import { computed, useTemplateRef } from 'vue';

import { AddToWatchlist, type IWatchlistData } from '@/modules/watchlist';
import { ENABLED_MARKETS, filterValueToDisplay, TimeRangeFilterValue } from '../../model';
import { type ITickerItem, SelectionMode } from '@/modules/ticker-selector';
import { UiDelimiter } from '@/shared/ui/delimiter';
import { ModalBadgeDropdown, ModalBadgeList, ModalItemSelector, WidgetFiltersScrollable } from '@/modules/widgets/base';
import { createCostylTickerItems } from '@/modules/ticker-selector/api/fetch-tickers.ts';

import TickerSelectorModalWithBadge from '@/modules/ticker-selector/new/ticker-selector-modal-with-badge.vue';

interface IFiltersComponentProps {
	watchlists: IWatchlistData[];
	isBig: boolean;
	displayVariant: 'default' | 'new';
}

const props = defineProps<IFiltersComponentProps>();

const selectedTicker = defineModel<string>('selectedTicker', { required: true });
const timeRange = defineModel<TimeRangeFilterValue>('timeRange', { required: true });

const emit = defineEmits<{
	(e: 'add-to-watchlist', watchlistId: string): void;
	(e: 'remove-from-watchlist', watchlistId: string): void;
	(e: 'add-to-new-watchlist'): void;
	(e: 'toggle-favorite-watchlist'): void;
	(e: 'reset-all-changes'): void;
}>();

const timeRangeDropdownRef = useTemplateRef('timeRangeDropdown');

function closeTimeRangeDropdown() {
	timeRangeDropdownRef.value?.close?.();
}

function updateFilter(newValue: TimeRangeFilterValue) {
	if (newValue !== timeRange.value) {
		timeRange.value = newValue;
		closeTimeRangeDropdown();
	}
}

const tickersModel = computed({
	get: () => createCostylTickerItems([selectedTicker.value]),
	set: (tickers: ITickerItem[]) => {
		if (tickers.length === 0) {
			return;
		}

		selectedTicker.value = tickers[0].canonical_ticker_id;
	},
});

const isDefaultDisplayVariant = computed(() => props.displayVariant === 'default');
</script>
<template>
	<div :class="classes.header">
		<widget-filters-scrollable
			:display-variant="props.displayVariant"
			:class="classes.filters"
			@on-clear-click="emit('reset-all-changes')"
		>
			<ticker-selector-modal-with-badge
				v-model:selected-tickers="tickersModel"
				:enabled-markets="ENABLED_MARKETS"
				:selection-mode="SelectionMode.Single"
				:display-variant="props.displayVariant"
				:show-label="!isDefaultDisplayVariant"
				autofocus
				close-on-select
			/>
			<template v-if="!props.isBig || !isDefaultDisplayVariant">
				<ui-delimiter v-if="isDefaultDisplayVariant" />
				<modal-badge-dropdown ref="timeRangeDropdown" :display-variant="props.displayVariant">
					<template #title>
						<span>{{ filterValueToDisplay[timeRange].label }}</span>
					</template>
					<template #content>
						<modal-badge-list :display-variant>
							<template #title>
								Time Range
							</template>
							<template
								v-for="filterValue in TimeRangeFilterValue"
								:key="filterValue"
							>
								<modal-item-selector
									:model-value="filterValue === timeRange"
									@update:model-value="updateFilter(filterValue)"
								>
									{{ filterValueToDisplay[filterValue].option }}
								</modal-item-selector>
							</template>
						</modal-badge-list>
					</template>
				</modal-badge-dropdown>
			</template>
		</widget-filters-scrollable>
		<add-to-watchlist
			:watchlists="props.watchlists"
			:ticker-id="selectedTicker"
			:display-variant
			@add-to-watchlist="emit('add-to-watchlist', $event.watchlistId)"
			@remove-from-watchlist="emit('remove-from-watchlist', $event.watchlistId)"
			@add-to-new-watchlist="emit('add-to-new-watchlist')"
			@toggle-favorite="emit('toggle-favorite-watchlist')"
		/>
	</div>
</template>

<style module="classes">
.header {
	display: flex;
	justify-content: space-between;
	align-items: center;
	gap: 6px;
	width: 100%;
}
</style>
