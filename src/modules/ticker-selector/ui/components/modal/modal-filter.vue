<script setup lang="ts">
import { computed, nextTick, ref } from 'vue';

import {
	FilterListType,
	type ITickerEmits,
	type ITickerSelectAction,
	MarketToSymbol,
	type TickerDto,
} from '@/modules/ticker-selector/model/filter-ticker';
import { MarketType } from '@/modules/market';
import { SymbolType } from '@/modules/cell';

import ModalFilterInfo from './modal-filter-info.vue';
import ModalFilterRow from './modal-filter-row.vue';
import ModalFilterHeader from '@/modules/ticker-selector/ui/components/modal/modal-filter-header.vue';
import ModalFilterGroup from '@/modules/ticker-selector/ui/components/modal/modal-filter-group.vue';
import ModalFilterList from '@/modules/ticker-selector/ui/components/modal/modal-filter-list.vue';
import ModalFilterEmptyState from '@/modules/ticker-selector/ui/components/modal/modal-filter-empty-state.vue';
import ModalFilterSelectedMarkets
	from '@/modules/ticker-selector/ui/components/modal/modal-filter-selected-markets.vue';

export interface IModalFilterTickerProps {
	tickers: TickerDto[];
	isBackgroundTransparent?: boolean;

	/**
	 * Show "All" and "Selected" tabs before options
	 */
	enableSelectedInfo?: boolean;

	/**
	 * Enable to select all options in group
	 */
	enableSelectAll?: boolean;

	/**
	 * Enable markets selection using v-model:markets (crypto, stock, forex, etc..)
	 */
	enableMarkets?: boolean;

	/**
	 * Focus search input on open modal
	 */
	autofocus?: boolean;

	/**
	 * Change from "Selected" tab to "All" when selected tickers are empty
	 */
	closeEmptySelected?: boolean;

	textAboveSearch?: string;

	/**
	 * @default multiple
	 */
	selectionMode?: 'single' | 'multiple';

	/**
	 * @default Start typing the ticker...
	 */
	searchPlaceholder?: string;

	/**
	 * Available market types for selection
	 * @example [MarketType.Crypto, MarketType.Stock]
	 * @default Object.values(MarketType)
	 */
	marketTypes: MarketType[];

	displayVariant: 'new' | 'default';
}

type IGroupedTicker = Record<SymbolType, TickerDto[]>;

const props = withDefaults(defineProps<IModalFilterTickerProps>(), {
	isBackgroundTransparent: false,
	enableSelectedInfo: true,
	closeEmptySelected: true,
	textAboveSearch: '',
	selectionMode: 'multiple',
	searchPlaceholder: 'Start typing the ticker...',
});

const tickersModel = defineModel<string[]>({ default: () => [] });
const marketsModel = defineModel<MarketType[]>('markets', { default: () => [] });

const emit = defineEmits<ITickerEmits>();

const availableSymbols = computed(() => props.marketTypes.map(type => MarketToSymbol[type]));
const isSingleSelectionMode = computed(() => props.selectionMode === 'single');

const tickersData = computed<TickerDto[]>(() =>
	props.tickers.filter(ticker => availableSymbols.value.includes(ticker.symbol.symbolType!)).map((t) => ({
		tickerId: t.tickerId,
		symbol: t.symbol,
	})),
);

const query = ref('');
const preparedQuery = computed(() => query.value.trimStart().toLowerCase());
const hasSearchQuery = computed(() => preparedQuery.value.length > 0);

const activeGroup = ref<SymbolType | null>(
	props.marketTypes.length === 1
		? marketToSymbol(props.marketTypes[0])
		: null,
);

const viewMode = ref<FilterListType>(FilterListType.All);

const selectedTickers = computed(() => {
	const selected = tickersData.value.filter(t => tickersModel.value.includes(t.tickerId));

	if (viewMode.value === FilterListType.Selected) {
		return selected.filter((t) =>
			[t.tickerId.toLowerCase()].some((s) => s.includes(preparedQuery.value)),
		);
	}

	return selected;
});

const queriedTickers = computed(() => {
	return tickersData.value.filter((item) =>
		[item.tickerId.toLowerCase()].some((s) => s.includes(preparedQuery.value)),
	);
});

const groupedTickers = computed<IGroupedTicker>(() => {
	const group = {} as IGroupedTicker;

	tickersData.value.forEach(ticker => {
		const type = ticker.symbol.symbolType;

		if (type && !group[type]) {
			group[type] = [];
		}
	});

	queriedTickers.value.forEach((item) => {
		const type = item.symbol.symbolType;
		if (type) {
			(group[type] ??= []).push(item);
		}
	});

	return group;
});

const selectedTickerIdsByGroup = computed(() => {
	return Object.entries(groupedTickers.value).reduce((acc, [group, tickers]) => {
		acc[group as SymbolType] = tickers
			.filter(t => tickersModel.value.includes(t.tickerId))
			.map(t => t.tickerId);

		return acc;
	}, {} as Record<SymbolType, string[]>);
});

function handleToggleSelect(action: ITickerSelectAction) {
	if (action.isSelected) {
		if (isSingleSelectionMode.value) {
			tickersModel.value = [action.tickerId];
			emit('select', action.tickerId);

			return;
		}

		if (!tickersModel.value.includes(action.tickerId)) {
			tickersModel.value = [...tickersModel.value, action.tickerId];
		}

		emit('select', action.tickerId);
		return;
	}

	if (isSingleSelectionMode.value && tickersModel.value.length < 2) {
		return;
	}

	tickersModel.value = tickersModel.value.filter((id) => id !== action.tickerId);
	emit('unselect', action.tickerId);

	if (
		tickersModel.value.length === 0
		&& !isSingleSelectionMode.value
		&& props.marketTypes.length > 1
		&& props.closeEmptySelected
	) {
		nextTick(() => {
			viewMode.value = FilterListType.All;
			activeGroup.value = null;
		});
	}
}

function isGroupTickersSelectedAll(group: SymbolType) {
	const tickers = groupedTickers.value[group];

	const modelValueSet = new Set(tickersModel.value);

	return tickers.every((t) => modelValueSet.has(t.tickerId));
}

function toggleSelectAll(groupName: SymbolType) {
	const tickers = groupedTickers.value[groupName];

	if (isSingleSelectionMode.value) {
		if (tickers.length > 0) {
			const firstTickerId = tickers[0].tickerId;

			tickersModel.value = [firstTickerId];
			emit('selectAll', [firstTickerId]);
		}

		return;
	}

	if (isGroupTickersSelectedAll(groupName)) {
		const toUnselect = new Set(tickers.map((t) => t.tickerId));
		const next = tickersModel.value.filter((m) => !toUnselect.has(m));

		tickersModel.value = next;
		emit('unselectAll', next);

		return;
	}

	const additions: string[] = tickers
		.filter((t) => !tickersModel.value.includes(t.tickerId))
		.map((i) => i.tickerId);

	if (additions.length) {
		const preparedSelectedTickers = [...tickersModel.value, ...additions];

		tickersModel.value = preparedSelectedTickers;
		emit('selectAll', preparedSelectedTickers);
	}
}

// markets

function marketToSymbol(market: MarketType) {
	return MarketToSymbol[market];
}

function symbolToMarket(symbol: SymbolType): MarketType | null {
	const maybeMarket = Object.entries(MarketToSymbol).find(([_, smb]) => (smb as SymbolType) === symbol)?.[0];

	if (maybeMarket) {
		return maybeMarket as MarketType;
	}

	return null;
}

function isSelectedMarket(market: MarketType) {
	return marketsModel.value.includes(market);
}

const activeMarket = computed(() => {
	if (!activeGroup.value) {
		return null;
	}

	return symbolToMarket(activeGroup.value);
});

const activeMarketIsSelected = computed(() => {
	if (!activeMarket.value) {
		return false;
	}

	return isSelectedMarket(activeMarket.value);
});

function toggleMarket(market: MarketType) {
	if (isSelectedMarket(market)) {
		marketsModel.value = marketsModel.value.filter(m => m !== market);
	} else {
		if (isSingleSelectionMode.value) {
			marketsModel.value = [market];
		} else {
			marketsModel.value = [...marketsModel.value, market];
		}
	}
}
</script>

<template>
	<div :class="[classes.wrapper, {[classes.transparent]: props.isBackgroundTransparent}]">
		<div :class="classes.content">
			<div>
				<modal-filter-header
					v-model:query="query"
					:autofocus="props.autofocus"
					:search-placeholder="props.searchPlaceholder"
					:text-above-search="props.textAboveSearch"
					:is-background-transparent="props.isBackgroundTransparent"
				/>
				<modal-filter-info
					v-if="props.enableSelectedInfo"
					v-model="viewMode"
					:is-searching="hasSearchQuery"
					:total-items="queriedTickers.length"
					:total-selected="selectedTickers.length + marketsModel.length"
				/>
			</div>
			<div v-if="viewMode === FilterListType.All">
				<modal-filter-group
					v-if="activeGroup"
					:group="activeGroup"
					:market="activeMarket"
					:tickers="groupedTickers[activeGroup]"
					:selected-ticker-ids="selectedTickerIdsByGroup[activeGroup]"
					:enable-back="availableSymbols.length > 1"
					:enable-select-all="props.enableSelectAll"
					:is-searching="hasSearchQuery"
					:display-variant="props.displayVariant"
					:enable-markets="props.enableMarkets"
					:is-selected-market="activeMarketIsSelected"
					@toggle-market="toggleMarket(activeMarket!)"
					@select-all="toggleSelectAll(activeGroup)"
					@update="handleToggleSelect"
					@back="activeGroup = null"
				/>
				<modal-filter-list
					v-else
					:grouped-tickers="groupedTickers"
					:grouped-selected-ticker-ids="selectedTickerIdsByGroup"
					:display-variant="props.displayVariant"
					:is-searching="hasSearchQuery"
					:enable-select-all="props.enableSelectAll"
					@select-all="toggleSelectAll"
					@select-group="activeGroup = $event"
				/>
			</div>
			<template v-else>
				<modal-filter-empty-state v-if="selectedTickers.length === 0 && hasSearchQuery">
					Nothing found in selected items
				</modal-filter-empty-state>
				<modal-filter-row
					v-else
					:list="selectedTickers"
					:selected-ids-map="tickersModel"
					:display-variant="props.displayVariant"
					@update="handleToggleSelect"
				>
					<template v-if="props.enableMarkets" #before-tickers>
						<modal-filter-selected-markets :selected-markets="marketsModel" @toggle-market="toggleMarket" />
					</template>
				</modal-filter-row>
			</template>
		</div>
	</div>
</template>

<style module="classes">
.wrapper {
	position: relative;
	display: flex;
	flex-direction: column;
	width: 286px;
	height: 100%;
	max-height: 80svh;
	padding: 6px;
	overflow: hidden;
	background: var(--bg-modal-color-base);
	border: 1px solid rgb(199 199 199 / 10%);
	border-radius: 18px;
}

.wrapper.transparent {
	background: transparent;
}

.content {
	flex: 1;
	max-height: 650px;
	margin: -6px;
	padding: 6px;
	overflow-y: hidden;
}
</style>
