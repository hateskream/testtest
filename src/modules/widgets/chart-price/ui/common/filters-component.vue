<script setup lang="ts">
import { AddToWatchlist, type IWatchlistData } from '@/modules/watchlist';
import { filterValueToDisplay, TimeRangeFilterValue } from '../../model';
import { ModalTickerSelectorWithBadge } from '@/modules/ticker-selector';
import { UiDelimiter } from '@/shared/ui/delimiter';
import { ModalBadge, ModalBadgeList, ModalItemSelector } from '@/modules/widgets/base';

interface IFiltersComponentProps {
	watchlists: IWatchlistData[];
	isBig: boolean;
	displayVariant: 'default' | 'new';
}

const props = defineProps<IFiltersComponentProps>();

const selectedTicker = defineModel<string>('selectedTicker', { required: true });
const timeRange = defineModel<TimeRangeFilterValue>('timeRange', { required: true });

const emits = defineEmits<{
	(e: 'add-to-watchlist', watchlistId: string): void;
	(e: 'remove-from-watchlist', watchlistId: string): void;
	(e: 'add-to-new-watchlist'): void;
}>();

function updateFilter(newValue: TimeRangeFilterValue) {
	timeRange.value = newValue;
}

function updateTicker(newValue: string[]) {
	[selectedTicker.value] = newValue;
}
</script>
<template>
	<div
		:class="classes.header"
		:style="{
			marginInline: props.displayVariant === 'default' ? '12px' : '0',
		}"
	>
		<modal-ticker-selector-with-badge
			:model-value="[selectedTicker]"
			:enable-selected-info="false"
			selection-mode="single"
			:display-variant="props.displayVariant"
			autofocus
			@update:model-value="updateTicker"
		/>

		<template v-if="!props.isBig">
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
			:watchlists="props.watchlists"
			:ticker-id="selectedTicker"
			@add-to-watchlist="emits('add-to-watchlist', $event.watchlistId)"
			@remove-from-watchlist="emits('remove-from-watchlist', $event.watchlistId)"
			@add-to-new-watchlist="emits('add-to-new-watchlist')"
		/>
	</div>
</template>

<style module="classes">
.filter {
	margin-left: 6px;
}

.header {
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
