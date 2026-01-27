<script setup lang="ts">
import { computed, useTemplateRef } from 'vue';

import { ModalBadgeDropdown, ModalBadgeList, ModalFilterTitle, WidgetFiltersScrollable } from '@/modules/widgets/base';
import { ALL_MARKET_TYPES, MarketType } from '@/modules/market';
import {
	type ILocation,
	NewsLocationFilter,
	type SortState,
	sortToName,
} from '@/modules/news';
import { CalendarRangeSelect, type IDateRange } from '@/shared/ui/calendar';
import { type ITickerItem, SelectionMode } from '@/modules/ticker-selector';
import { TickerSelectorModalWithBadge } from '@/modules/ticker-selector';

import SortbyModalInner from '../modal/sortby-modal-inner.vue';

const emits = defineEmits<{
	resetAllChanges: [];
}>();

defineOptions({
	inheritAttrs: false,
});

const selectedMarkets = defineModel<MarketType[]>('selectedMarkets', {
	required: true,
});
const selectedTickers = defineModel<ITickerItem[]>('selectedTickers', {
	required: true,
});
const excludedTickers = defineModel<ITickerItem[]>('excludedTickers', {
	required: true,
});

const locations = defineModel<ILocation[]>('locations', { required: true });
const sortBy = defineModel<SortState>('sortBy', { required: true });
const dateRange = defineModel<IDateRange>('dateRange', { required: true });

const sortTitle = computed(() => {
	if (!sortBy.value) {
		return 'Sort By';
	}

	const value = sortToName[sortBy.value];

	if (typeof value === 'string') {
		return value;
	}

	return value.additional;
});

const sortByDropdownRef = useTemplateRef('sortByDropdown');

function closeSortByDropdown() {
	sortByDropdownRef.value?.close?.();
}

function onTickerSelect(tickers: ITickerItem[]) {
	selectedTickers.value = tickers;
}

function onExcludeTickers(tickers: ITickerItem[]) {
	excludedTickers.value = tickers;
}

// TODO: Вернуть все фильтры после реализации бекенда
</script>

<template>
	<div :class="classes.root">
		<widget-filters-scrollable display-variant="new" @on-clear-click="emits('resetAllChanges')">
			<ticker-selector-modal-with-badge
				v-if="false"
				v-model:selected-markets="selectedMarkets"
				:enabled-markets="ALL_MARKET_TYPES"
				:selection-mode="SelectionMode.Multiple"
				display-variant="new"
				enable-select-all
				:show-icon="false"
				@update:selected-tickers="onTickerSelect"
				@update:excluded-tickers="onExcludeTickers"
			/>

			<modal-badge-dropdown v-if="false" display-variant="new">
				<template #title>
					Location
				</template>
				<template #content>
					<news-location-filter v-model:locations="locations" display-variant="new" />
				</template>
			</modal-badge-dropdown>
			<modal-badge-dropdown display-variant="new">
				<template #title>
					Date
				</template>
				<template #content>
					<modal-badge-list display-variant="new">
						<calendar-range-select
							v-model="dateRange"
							view="monthly"
						/>
					</modal-badge-list>
				</template>
			</modal-badge-dropdown>

			<modal-badge-dropdown ref="sortByDropdown" display-variant="new">
				<template #title>
					{{sortTitle}}
				</template>
				<template #content>
					<modal-badge-list display-variant="new">
						<modal-filter-title>Sort By</modal-filter-title>

						<sortby-modal-inner v-model="sortBy" @update:model-value="closeSortByDropdown" />
					</modal-badge-list>
				</template>
			</modal-badge-dropdown>
		</widget-filters-scrollable>
	</div>
</template>

<style module="classes">
.root {
	display: flex;
	align-items: center;
	width: 100%;
	height: 100%;
	gap: 3px;
}

.capitalize {
	text-transform: capitalize;
}
</style>
