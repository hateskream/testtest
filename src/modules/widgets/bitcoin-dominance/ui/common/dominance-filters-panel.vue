<script setup lang="ts">
import { computed } from 'vue';

import { MarketType } from '@/modules/market';
import { type ITickerItem, SelectionMode } from '@/modules/ticker-selector';
import { dateRangeFilterValueToDisplay, DominanceDateRange, type IDisplaySettings } from '../../model';
import { ModalBadge, ModalBadgeList, ModalItemSelector, WidgetFiltersScrollable } from '@/modules/widgets/base';
import { IconIds, UiIcon } from '@/shared/ui/icon';
import type { IMeta } from '@/modules/dashboard-group';
import { TickerSelectorModalWithBadge } from '@/modules/ticker-selector';
import { createCostylTickerItems } from '@/modules/ticker-selector/api/fetch-tickers.ts';

const emit = defineEmits<{
	reset: [];
}>();

const selectedTickers = defineModel<string[]>('selectedTickers', { required: true });
const activeDateRange = defineModel<DominanceDateRange>('dateRange', { required: true });

interface IDominanceFiltersPanelProps {
	meta: IMeta;
	displaySettings: IDisplaySettings;
	displayVariant: 'default' | 'new';
}

const props = defineProps<IDominanceFiltersPanelProps>();

const dateRangeMustBeVisible = computed(() => props.displaySettings.isShowChart
	&& props.meta.size.h > 5
	&& props.meta.size.h < 8,
);

const tickersModel = computed({
	get: () => createCostylTickerItems(selectedTickers.value),
	set: (tickers: ITickerItem[]) => {
		selectedTickers.value = tickers.map(ticker => ticker.canonical_ticker_id);
	},
});
</script>

<template>
	<widget-filters-scrollable
		:display-variant="props.displayVariant"
		@on-clear-click="emit('reset')"
	>
		<ticker-selector-modal-with-badge
			v-model:selected-tickers="tickersModel"
			:enabled-markets="[MarketType.Crypto]"
			:display-variant="props.displayVariant"
			:selection-mode="SelectionMode.Multiple"
		/>
		<modal-badge v-if="dateRangeMustBeVisible" :display-variant="props.displayVariant">
			<template #title>
				{{ dateRangeFilterValueToDisplay[activeDateRange] }}
				<ui-icon
					:id="IconIds.DropdownDown"
					width="12"
					height="12"
				/>
			</template>
			<template #content>
				<modal-badge-list :display-variant>
					<template #title>
						Date range
					</template>
					<template
						v-for="filterKey in DominanceDateRange"
						:key="filterKey"
					>
						<modal-item-selector
							:model-value="filterKey === activeDateRange"
							@update:model-value="activeDateRange = filterKey"
						>
							{{ dateRangeFilterValueToDisplay[filterKey] }}
						</modal-item-selector>
					</template>
				</modal-badge-list>
			</template>
		</modal-badge>
	</widget-filters-scrollable>
</template>
