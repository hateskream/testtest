<script setup lang="ts">
import { computed } from 'vue';

import { UiDelimiter } from '@/shared/ui/delimiter';
import {
	ModalBadge,
	ModalBadgeList,
	ModalItemSelector,
} from '@/modules/widgets/base';
import { ModalTickerSelectorWithBadge } from '@/modules/ticker-selector';
import {
	filterValueToDisplay,
	TimeRangeFilterValue,
} from '../model';
import type { IMeta } from '@/modules/dashboard-group/core';
import { AddToWatchlist, type IWatchlistData } from '@/modules/watchlist';

import ChartPrice from './chart-price.vue';

interface IViewComponentProps {
	meta: IMeta;
	wachlists: IWatchlistData[];
}

const selectedTicker = defineModel<string>('selectedTicker', { required: true });
const timeRange = defineModel<TimeRangeFilterValue>('timeRange', { required: true });

const props = defineProps<IViewComponentProps>();

const emits = defineEmits<{
	(e: 'add-to-watchlist', wachlistsId: string): void;
	(e: 'remove-from-watchlist', wachlistsId: string): void;
	(e: 'add-to-new-watchlist'): void;
}>();

const isBig = computed(() => props.meta.size.h >= 6 );

function updateFilter(newValue: TimeRangeFilterValue) {
	timeRange.value = newValue;
}

function updateTicker(newValue: string[]) {
	[selectedTicker.value] = newValue;
}
</script>

<template>
	<div :class="classes.root">
		<div :class="classes.header">
			<modal-ticker-selector-with-badge
				:model-value="[selectedTicker]"
				:enable-selected-info="false"
				selection-mode="single"
				@update:model-value="updateTicker"
			/>

			<template v-if="!isBig">
				<div :class="classes.lineDelimiterGroup">
					<ui-delimiter />
				</div>

				<modal-badge :class="classes.filter">
					<template #title>
						{{ filterValueToDisplay[timeRange].label }}
					</template>
					<template #content>
						<modal-badge-list>
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
									{{ filterValueToDisplay[filterValue].label }}
								</modal-item-selector>
							</template>
						</modal-badge-list>
					</template>
				</modal-badge>
			</template>

			<add-to-watchlist
				:wachlists="props.wachlists"
				:ticker-id="selectedTicker"
				@add-to-watchlist="emits('add-to-watchlist', $event.watchlistId)"
				@remove-from-watchlist="emits('remove-from-watchlist', $event.watchlistId)"
				@add-to-new-watchlist="emits('add-to-new-watchlist')"
			/>
		</div>

		<chart-price
			:class="classes.chart"
			:is-big="isBig"
		/>
	</div>
</template>

<style module="classes">
.root {
	display: flex;
	flex-direction: column;
	height: 100%;
	max-height: 100%;
}

.filter {
	margin-left: 6px;
}

.header {
	margin-inline: 12px;
	display: flex;
	align-items: center;
}

.header > :last-child {
	margin-left: auto;
}

.chart {
	height: calc(100% - 38px);
}

.lineDelimiterGroup {
	display: flex;
	align-items: center;
	gap: 6px;
	margin-left: 6px;
}
</style>
