<script setup lang="ts">
import { computed, useTemplateRef } from 'vue';

import { AddToWatchlist, type IWatchlistData } from '@/modules/watchlist';
import { filterValueToDisplay, TimeRangeFilterValue } from '../../model';
import { ModalTickerSelectorWithBadge } from '@/modules/ticker-selector';
import { UiDelimiter } from '@/shared/ui/delimiter';
import { ModalBadgeDropdown, ModalBadgeList, ModalItemSelector, WidgetFiltersScrollable } from '@/modules/widgets/base';

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

function updateTicker(newValue: string[]) {
	[selectedTicker.value] = newValue;
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
			<modal-ticker-selector-with-badge
				:model-value="[selectedTicker]"
				:enable-selected-info="false"
				selection-mode="single"
				:display-variant="props.displayVariant"
				:show-label="!isDefaultDisplayVariant"
				autofocus
				close-on-select
				@update:model-value="updateTicker"
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
