<script setup lang="ts">
import { computed, useTemplateRef } from 'vue';

import { AddToWatchlist, type IWatchlistData } from '@/modules/watchlist';
import { ENABLED_MARKETS, filterValueToDisplay } from '../../model';
import { type ITickerItem, SelectionMode, TickerSelectorModalWithBadge } from '@/modules/ticker-selector';
import { UiDelimiter } from '@/shared/ui/delimiter';
import { ModalBadgeDropdown, ModalBadgeList, ModalItemSelector, WidgetFiltersScrollable } from '@/modules/widgets/base';
import {
	createPreset,
	DateRangePreset,
	type DateRangePresetType,
	type DateRangeValue,
} from '@/modules/lightweight-charts/model';

interface IFiltersComponentProps {
	selectedTickerId: string;
	watchlists: IWatchlistData[];
	isBig: boolean;
	displayVariant: 'default' | 'new';
}

const props = defineProps<IFiltersComponentProps>();

const selectedTicker = defineModel<ITickerItem[]>('selectedTicker', { required: true });
const dateRange = defineModel<DateRangeValue>('timeRange', { required: true });

const emit = defineEmits<{
	(e: 'add-to-watchlist', watchlistId: string): void;
	(e: 'remove-from-watchlist', watchlistId: string): void;
	(e: 'add-to-new-watchlist'): void;
	(e: 'toggle-favorite-watchlist'): void;
	(e: 'reset-all-changes'): void;
}>();

const selectedDateRangePreset = computed(() => {
	const range = dateRange.value;

	if (range.type === 'preset') {
		return range.preset;
	}

	return undefined;
});

const dateRangeLabel = computed(() => {
	const preset = selectedDateRangePreset.value;

	if (preset) {
		return filterValueToDisplay[preset].label;
	}

	return 'Custom';
});

const dateRangeDropdownRef = useTemplateRef('timeRangeDropdown');

function closeTimeRangeDropdown() {
	dateRangeDropdownRef.value?.close?.();
}

function updateFilter(newValue: DateRangePresetType) {
	const range = dateRange.value;
	const preset = createPreset(newValue);

	if (range.type === 'custom' || range.preset !== newValue) {
		dateRange.value = preset;
		closeTimeRangeDropdown();
	}
}

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
				v-model:selected-tickers="selectedTicker"
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
						<span>{{ dateRangeLabel }}</span>
					</template>
					<template #content>
						<modal-badge-list :display-variant>
							<template #title>
								Time Range
							</template>
							<template
								v-for="filterValue in DateRangePreset"
								:key="filterValue"
							>
								<modal-item-selector
									:model-value="filterValue === selectedDateRangePreset"
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
			:ticker-id="selectedTickerId"
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
