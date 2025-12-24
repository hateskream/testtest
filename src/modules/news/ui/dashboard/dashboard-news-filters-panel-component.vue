<script setup lang="ts">
import { computed, useTemplateRef } from 'vue';

import { ModalBadgeDropdown, ModalBadgeList, ModalFilterTitle, WidgetFiltersScrollable } from '@/modules/widgets/base';
import { type MarketType } from '@/modules/market';
import {
	getSegmentsTitleStr,
	type ILocation,
	type ISegmentData,
	NewsLocationFilter,
	NewsSegmentModal,
	type SelectedSegmentTickersState,
	type SortState,
	sortToName,
} from '@/modules/news';
import { CalendarRangeSelect, type IDateRange } from '@/shared/ui/calendar';

import SortbyModalInner from '../modal/sortby-modal-inner.vue';

const props = defineProps<{
	segments: ISegmentData[];
	selectedSegmentsTickers: SelectedSegmentTickersState;
}>();

const emits = defineEmits<{
	selectAll: [id: MarketType];
	unselectAll: [id: MarketType];
	toggleTicker: [id: MarketType, tickerId: string];
	resetAllChanges: [];
}>();

defineOptions({
	inheritAttrs: false,
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

const displayItems = computed(() => {
	return getSegmentsTitleStr(props.segments, props.selectedSegmentsTickers) || 'Market';
});

const sortByDropdownRef = useTemplateRef('sortByDropdown');

function closeSortByDropdown() {
	sortByDropdownRef.value?.close?.();
}

// TODO: Вернуть все фильтры после реализации бекенда
</script>

<template>
	<div :class="classes.root">
		<widget-filters-scrollable display-variant="new" @on-clear-click="emits('resetAllChanges')">
			<modal-badge-dropdown v-if="false" display-variant="new">
				<template #title>
					<span :class="classes.capitalize">
						{{displayItems}}
					</span>
				</template>
				<template #content>
					<news-segment-modal
						display-variant="new"
						:segments="props.segments"
						:selected-segment-tickers="props.selectedSegmentsTickers"
						@select-all="emits('selectAll', $event)"
						@unselect-all="emits('unselectAll', $event)"
						@toggle-ticker="(v1, v2) => emits('toggleTicker', v1, v2)"
					/>
				</template>
			</modal-badge-dropdown>
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
