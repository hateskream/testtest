<script setup lang="ts">
import { computed } from 'vue';

import { AddToWatchlist, type IWatchlistData } from '@/modules/watchlist';
import { filterValueToDisplay, TimeRangeFilterValue } from '../../model';
import { ModalTickerSelectorWithBadge } from '@/modules/ticker-selector';
import { UiDelimiter } from '@/shared/ui/delimiter';
import { ModalBadge, ModalBadgeList, ModalItemSelector } from '@/modules/widgets/base';
import { IconIds, UiIcon } from '@/shared/ui/icon';

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

const isDefaultDisplayVariant = computed(() => props.displayVariant === 'default');

const gapInPx = computed(() => isDefaultDisplayVariant.value ? '6px' : '3px');
</script>
<template>
	<div :class="classes.header">
		<modal-ticker-selector-with-badge
			:model-value="[selectedTicker]"
			:enable-selected-info="false"
			selection-mode="single"
			:display-variant="props.displayVariant"
			:show-label="!isDefaultDisplayVariant"
			autofocus
			@update:model-value="updateTicker"
		/>
		<template v-if="!props.isBig || !isDefaultDisplayVariant">
			<ui-delimiter v-if="isDefaultDisplayVariant" />
			<modal-badge :display-variant="props.displayVariant">
				<template #title>
					<span>{{ filterValueToDisplay[timeRange].label }}</span>
					<ui-icon
						:id="IconIds.DropdownDown"
						width="12"
						height="12"
					/>
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
			:class="classes.watchlist"
			@add-to-watchlist="emits('add-to-watchlist', $event.watchlistId)"
			@remove-from-watchlist="emits('remove-from-watchlist', $event.watchlistId)"
			@add-to-new-watchlist="emits('add-to-new-watchlist')"
		/>
	</div>
</template>

<style module="classes">
.header {
	display: flex;
	align-items: center;
	gap: v-bind(gapInPx);
}

.watchlist {
	margin-left: auto;
}
</style>
