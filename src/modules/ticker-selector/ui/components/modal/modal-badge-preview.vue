<script setup lang="ts">
import { computed } from 'vue';

import { ACTIVE_TICKER_LIST_COUNT_SHOW, type IMarketMapped, type ITickerMapped } from '../../../model';
import { SymbolType } from '@/modules/cell';

import ModalFilterTickerIcon from './modal-filter-ticker-icon.vue';
import ModalFilterTickerLabel from './modal-filter-ticker-label.vue';
import ModalFilterMarketLabel from './modal-filter-market-label.vue';
import ModalFilterMarketIcon from './modal-filter-market-icon.vue';

interface IModalBadgePreviewProps {
	selectedTickers: ITickerMapped[];
	selectedMarkets: IMarketMapped[];
	displayVariant: 'default' | 'new';
	showLabel?: boolean;
	showIcon?: boolean;
	emptyLabel?: string;
	totalSelectedCount: number;
}

const props = withDefaults(defineProps<IModalBadgePreviewProps>(), {
	emptyLabel: 'Tickers',
});

function getSize(symbol: SymbolType | null | undefined) {
	if (props.displayVariant === 'new' || !symbol) {
		return 14;
	}

	return symbol === SymbolType.Forex ? 20 : 14;
}

function getPadding(symbol: SymbolType | null | undefined) {
	if (props.displayVariant === 'new' || !symbol) {
		return undefined;
	}

	return symbol === SymbolType.Forex ? 12 : undefined;
}

const selectedItemsCount = computed(() => props.selectedTickers.length + props.selectedMarkets.length);
</script>

<template>
	<div :class="classes.header">
		<template v-if="selectedItemsCount > 0">
			<div v-if="props.showIcon" :class="classes.iconsWrapper">
				<div
					v-for="item in props.selectedTickers"
					:key="item.tickerId"
					:class="classes.iconsItem"
				>
					<modal-filter-ticker-icon
						:src-image="item.srcImage"
						:type="item.symbolType"
						:ticker="item.ticker"
						:size="getSize(item.symbolType)"
						:padding="getPadding(item.symbolType)"
						:display-variant="props.displayVariant"
					/>
				</div>
				<div
					v-for="market in props.selectedMarkets"
					:key="market.marketType"
					:class="classes.iconsItem"
				>
					<modal-filter-market-icon :icon="market.icon" />
				</div>
				<template v-if="props.totalSelectedCount > ACTIVE_TICKER_LIST_COUNT_SHOW">
					+ {{ props.totalSelectedCount - ACTIVE_TICKER_LIST_COUNT_SHOW }}
				</template>
			</div>
			<div v-if="props.showLabel" :class="classes.labels">
				<modal-filter-ticker-label
					v-for="ticker in props.selectedTickers"
					:key="ticker.tickerId"
					:ticker="ticker"
					:class="classes.label"
				/>
				<modal-filter-market-label
					v-for="market in props.selectedMarkets"
					:key="market.marketType"
					:market="market"
					:class="classes.label"
				/>
			</div>
		</template>
		<div v-else>{{ props.emptyLabel }}</div>
	</div>
</template>

<style module="classes">
.header {
	display: flex;
	gap: 4px;
	align-items: center;
}

.iconsItem {
	margin-left: -12px;
	border-radius: 100%;
}

.iconsItem:first-child {
	margin-left: 0;
}

.iconsWrapper {
	display: flex;
	align-items: center;
	gap: 4px;
}

.labels {
	max-width: 120px;
	overflow: hidden;
	font-weight: 400;
	font-size: var(--font-text-200-r-size, 12.2px);
	line-height: 180%;
	letter-spacing: 0.122px;
	white-space: nowrap;
	text-overflow: ellipsis;
}

.label:not(:last-child)::after {
	content: ',';
	margin-right: 3px;
}
</style>
