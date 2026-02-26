<script setup lang="ts" generic="M extends readonly MarketType[]">
import { computed } from 'vue';

import { ACTIVE_TICKER_LIST_COUNT_SHOW, type IMarketTickerItem, type ITickerItem } from '../../../model';
import { useInitTickerSelectorQuery } from '../../../composables';
import { UiClamped } from '@/shared/ui/clamped';
import { UniversalTickerIcon } from '@/shared/ui/ticker';
import { marketToLabel, type MarketType } from '@/modules/market';
import { UiText } from '@/shared/ui/text';
import type { TextToken } from '@/shared/ui/text/token.ts';

import ModalBadgeTickerLabel from './modal-badge-ticker-label.vue';
import MarketTickerIcon from '../elements/market-ticker-icon.vue';

const props = withDefaults(defineProps<{
	fontToken?: TextToken;

	selectedMarkets: M;
	selectedTickers: ITickerItem[];
	excludedTickers: ITickerItem[];
	selectedMarketTickers: IMarketTickerItem[];

	displayVariant: 'default' | 'new';
	showLabel?: boolean;
	showIcon?: boolean;
}>(), {
	fontToken: 'text-200-r',
});

const { data } = useInitTickerSelectorQuery();

const selectedSum = computed(() => {
	if (!data.value) {
		return 0;
	}

	let sum = 0;

	for (const category of data.value.categories) {
		const market = category.market_type;

		if (props.selectedMarkets.includes(market)) {
			sum += 1;
			continue;
		}

		const tickersCount = props.selectedTickers.filter(
			t => t.market_type === market,
		).length;

		if (tickersCount > 0) {
			sum += tickersCount;
		}

		const hasMarketTicker = props.selectedMarketTickers.some(
			mt => mt.market_type === market,
		);

		if (hasMarketTicker) {
			sum += 1;
		}
	}

	return sum;
});

const clampedLabels = computed(() => {
	const limit = ACTIVE_TICKER_LIST_COUNT_SHOW;
	const items = [];

	for (const market of props.selectedMarkets) {
		if (items.length === limit) {
			return items;
		}

		items.push({
			id: market,
			kind: 'market' as const,
			market,
		});
	}

	for (const mt of props.selectedMarketTickers) {
		if (items.length === limit) {
			return items;
		}

		if (props.selectedMarkets.includes(mt.market_type)) {
			continue;
		}

		items.push({
			id: mt.id,
			kind: 'market-ticker' as const,
			marketTicker: mt,
		});
	}

	for (const ticker of props.selectedTickers) {
		if (items.length === limit) {
			return items;
		}

		if (props.selectedMarkets.includes(ticker.market_type)) {
			continue;
		}

		items.push({
			id: ticker.canonical_ticker_id,
			kind: 'ticker' as const,
			ticker,
		});
	}

	return items;
});

const iconItems = computed(() => {
	const limit = ACTIVE_TICKER_LIST_COUNT_SHOW;
	const items = [];

	for (const market of props.selectedMarkets) {
		if (items.length === limit) {
			return items;
		}

		items.push({
			id: market,
			kind: 'market' as const,
			market: market,
		});
	}

	for (const marketTicker of props.selectedMarketTickers) {
		if (items.length === limit) {
			return items;
		}

		if (props.selectedMarkets.includes(marketTicker.market_type)) {
			continue;
		}

		items.push({
			id: marketTicker.id,
			kind: 'market-ticker' as const,
			marketTicker: marketTicker,
		});
	}

	for (const ticker of props.selectedTickers) {
		if (items.length === limit) {
			return items;
		}

		if (props.selectedMarkets.includes(ticker.market_type)) {
			continue;
		}

		items.push({
			id: ticker.canonical_ticker_id,
			kind: 'ticker' as const,
			ticker: ticker,
		});
	}

	return items;
});

const isShowIcon = computed(() => {
	return props.showIcon && iconItems.value.length > 0;
});
</script>

<template>
	<div :class="classes.header">
		<div
			v-if="isShowIcon"
			:class="classes.iconsWrapper"
		>
			<template
				v-for="item in iconItems"
				:key="item.id"
			>
				<div
					v-if="item.kind !== 'market'"
					:class="classes.iconsItem"
					data-icon-glow-trigger
				>
					<market-ticker-icon
						v-if="item.kind === 'market-ticker'"
						:width="22"
						:height="22"
						:icon="item.marketTicker.icon"
					/>

					<universal-ticker-icon
						v-else-if="item.kind === 'ticker'"
						:src="item.ticker.logo"
						:right-src="item.ticker.currency_icon"
						:display-variant="displayVariant"
						:size="22"
						:ticker="item.ticker.symbol"
						:right-ticker="item.ticker.currency"
						:symbol-type="item.ticker.market_type"
					/>
				</div>
			</template>
		</div>

		<ui-clamped
			v-if="props.showLabel"
			:class="classes.labels"
			:rows="1"
		>
			<template v-if="clampedLabels.length > 0">
				<template
					v-for="item in clampedLabels"
					:key="item.id"
				>
					<ui-text
						v-if="item.kind === 'market'"
						:token="props.fontToken"
						:class="classes.label"
					>
						{{ marketToLabel[item.market] }}
					</ui-text>

					<ui-text
						v-else-if="item.kind === 'market-ticker'"
						:token="props.fontToken"
						:class="classes.label"
					>
						{{ item.marketTicker.label }}
					</ui-text>

					<modal-badge-ticker-label
						v-else
						:ticker="item.ticker"
						:class="classes.label"
					/>
				</template>
			</template>

			<template v-else>
				<ui-text :token="props.fontToken">
					Tickers
				</ui-text>
			</template>
		</ui-clamped>

		<span v-if="selectedSum > ACTIVE_TICKER_LIST_COUNT_SHOW" :class="classes.counter">
			+{{ selectedSum - ACTIVE_TICKER_LIST_COUNT_SHOW }}
		</span>

		<div>
			<slot name="empty" />
		</div>
	</div>
</template>

<style module="classes">
.header {
	display: flex;
	gap: 4px;
	align-items: center;
}

.iconsItem {
	border-radius: 100%;
	mask: radial-gradient(circle 9px at right 50%, transparent 0, transparent 11px, #ffffff 8px);
}

.iconsItem + .iconsItem {
	margin-left: -8px;
}

.iconsItem:last-child {
	mask: none;
}

.iconsItem:first-child {
	margin-left: 0;
}

.iconsWrapper {
	display: flex;
	align-items: center;
}

.labels {
	display: inline-block;
	max-width: 120px;
	white-space: nowrap;
	text-overflow: ellipsis;
}

.label:not(:last-child)::after {
	content: ',';
	margin-right: 3px;
}
</style>
