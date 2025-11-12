<script setup lang="ts">
import { computed } from 'vue';

import { UiIcon, IconIds } from '@/shared/ui/icon';
import { ModalBadge, ModalBadgeList } from '@/modules/widgets/base';
import { type MarketType } from '@/modules/market';
import {
	type ILocation,
	type SortState,
	type ISegmentData,
	type SelectedSegmentTickersState,
	NewsLocationFilter,
	NewsSegmentModal,
	sortToName,
	getSegmentsTitleStr,
} from '@/modules/news';
import { CalendarRangeSelect, type IDateRange } from '@/shared/ui/calendar';

const props = defineProps<{
	segments: ISegmentData[];
	selectedSegmentsTickers: SelectedSegmentTickersState;
}>();

const emits = defineEmits<{
	selectAll: [id: MarketType];
	unselectAll: [id: MarketType];
	toggleTicker: [id: MarketType, tickerId: string];
}>();

const locations = defineModel<ILocation[]>('locations', { required: true });
const sortBy = defineModel<SortState>('sortBy', { required: true });
const dateRange = defineModel<IDateRange>('dateRange', { required: true });

const sortTitle = computed(() => {
	if (!sortBy.value) {
		return 'Date';
	}

	const value = sortToName[sortBy.value];

	if (typeof value === 'string') {
		return value;
	}

	return value.additional;
});

const displayItems = computed(() => {
	return getSegmentsTitleStr(props.segments, props.selectedSegmentsTickers) || 'Unset';
});
</script>

<template>
	<div :class="classes.root">
		<modal-badge display-variant="new">
			<template #title>
				<span :class="classes.capitalize">
					{{displayItems}}
				</span>

				<ui-icon
					:id="IconIds.DropdownDown"
					width="20"
					height="20"
				/>
			</template>
			<template #content>
				<news-segment-modal
					:segments="props.segments"
					:selected-segment-tickers="props.selectedSegmentsTickers"
					@select-all="emits('selectAll', $event)"
					@unselect-all="emits('unselectAll', $event)"
					@toggle-ticker="(v1, v2) => emits('toggleTicker', v1, v2)"
				/>
			</template>
		</modal-badge>
		<modal-badge display-variant="new">
			<template #title>
				Location

				<ui-icon
					:id="IconIds.DropdownDown"
					width="20"
					height="20"
				/>
			</template>
			<template #content>
				<news-location-filter v-model:locations="locations" />
			</template>
		</modal-badge>
		<modal-badge display-variant="new">
			<template #title>
				{{sortTitle}}

				<ui-icon
					:id="IconIds.DropdownDown"
					width="20"
					height="20"
				/>
			</template>
			<template #content>
				<modal-badge-list>
					<calendar-range-select
						v-model="dateRange"
						view="monthly"
					/>
				</modal-badge-list>
			</template>
		</modal-badge>
	</div>
</template>

<style module="classes">
.root {
	display: flex;
	gap: 3px;
}

.capitalize {
	text-transform: capitalize;
}
</style>
