<script setup lang="ts">
import { computed } from 'vue';

import { MarketType } from '@/modules/market';
import { ModalTickerSelectorWithBadge } from '@/modules/ticker-selector';
import { dateRangeFilters, dateRangeFilterValueToDisplay, MarketCapDateRange, type MarketCapType } from '../../model';
import { ModalBadgeFilter, WidgetFiltersScrollable } from '@/modules/widgets/base';
import { UiDelimiter } from '@/shared/ui/delimiter';

const emit = defineEmits<{
	reset: [];
}>();

const selectedTickers = defineModel<string[]>('selectedTickers', { required: true });
const selectedMarkets = defineModel<MarketCapType[]>('selectedMarkets', { required: true });
const activeDateRange = defineModel<MarketCapDateRange>('dateRange', { required: true });

interface IMarketCapFiltersPanelProps {
	isShowDateRange?: boolean;
	displayVariant: 'default' | 'new';
}

const props = defineProps<IMarketCapFiltersPanelProps>();

const selectedRangeLabel = computed(() => dateRangeFilterValueToDisplay[activeDateRange.value].selected);
</script>

<template>
	<widget-filters-scrollable
		:display-variant="props.displayVariant"
		@on-clear-click="emit('reset')"
	>
		<modal-ticker-selector-with-badge
			v-model="selectedTickers"
			v-model:markets="selectedMarkets"
			:market-types="[MarketType.Crypto, MarketType.Stock]"
			:display-variant="props.displayVariant"
			:close-empty-selected="false"
			:show-icon="selectedTickers.length > 0"
			:show-label="selectedTickers.length === 0"
			autofocus
			enable-markets
		/>
		<template v-if="props.isShowDateRange">
			<ui-delimiter v-if="props.displayVariant === 'default'" />
			<modal-badge-filter
				:display-variant="props.displayVariant"
				:options="dateRangeFilters"
				:selected-value="activeDateRange"
				:label="selectedRangeLabel"
				close-on-select
				title="Date"
				@select="activeDateRange = $event.value"
			/>
		</template>
	</widget-filters-scrollable>
</template>

<style module="classes">
.container {
	display: flex;
	align-items: center;
}
</style>
