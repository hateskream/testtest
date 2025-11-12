<script setup lang="ts">
import { computed } from 'vue';

import { ModalFilter } from './components/modal';
import { IconIds, UiIcon } from '@/shared/ui/icon';
import { useQueryTickerSelector } from '../queries';
import { ACTIVE_TICKER_LIST_COUNT_SHOW, getMappedRow, type ITickerEmits } from '../model';
import { ModalBadge } from '@/modules/widgets/base';
import { marketToLabel, MarketType } from '@/modules/market';
import { SymbolType } from '@/modules/cell';
import { ModalFilterTickerIcon, ModalFilterTickerLabel } from '@/modules/ticker-selector/ui/components/modal';

interface IProps {
	selectionMode?: 'single' | 'multiple';
	enableSelectedInfo?: boolean;
	displayVariant?: 'default' | 'new';
	searchPlaceholder?: string;
	marketTypes?: MarketType[];
	autofocus?: boolean;
	showLabel?: boolean;
}

const props = withDefaults(defineProps<IProps>(), {
	selectionMode: 'multiple',
	enableSelectedInfo: true,
	displayVariant: 'default',
	searchPlaceholder: 'Start typing the ticker...',
	marketTypes: () => Object.values(MarketType),
});

const selectedTickers = defineModel<string[]>({
	default: [],
});

const { data } = useQueryTickerSelector();

const emits = defineEmits<ITickerEmits>();

const selectedTickersMapped = computed(() => {
	return (data.value?.tickers ?? [])
		.filter((item) => selectedTickers.value.includes(item.tickerId))
		.slice(0, ACTIVE_TICKER_LIST_COUNT_SHOW)
		.map(getMappedRow);
});

const previewLabel = computed(() => marketToLabel[props.marketTypes[0]]);

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
</script>

<template>
	<modal-badge :display-variant="props.displayVariant">
		<template #title>
			<div :class="classes.header">
				<div
					v-if="selectedTickersMapped.length > 0"
					:class="classes.iconsWrapper"
				>
					<div
						v-for="item in selectedTickersMapped"
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
					<template v-if="selectedTickers.length > ACTIVE_TICKER_LIST_COUNT_SHOW">
						+ {{ selectedTickers.length - ACTIVE_TICKER_LIST_COUNT_SHOW }}
					</template>
				</div>
				<div v-if="selectedTickers.length === 0">
					{{previewLabel}}
				</div>
				<div v-else-if="props.showLabel" :class="classes.labels">
					<modal-filter-ticker-label
						v-for="ticker in selectedTickersMapped"
						:key="ticker.tickerId"
						:ticker="ticker"
					/>
					<span v-if="selectedTickersMapped.length > 1" :class="classes.labelsDelimiter">,</span>
				</div>
				<ui-icon
					:id="IconIds.DropdownDown"
					width="12"
					height="12"
				/>
			</div>
		</template>
		<template #content>
			<modal-filter
				v-if="data"
				v-model="selectedTickers"
				:selection-mode="props.selectionMode"
				:tickers="data.tickers"
				:enable-selected-info="props.enableSelectedInfo"
				:search-placeholder="props.searchPlaceholder"
				:market-types="props.marketTypes"
				:display-variant="displayVariant"
				:autofocus="props.autofocus"
				@select="emits('select', $event)"
				@unselect="emits('unselect', $event)"
				@select-all="emits('selectAll', $event)"
			/>
		</template>
	</modal-badge>
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
	white-space: nowrap;
	text-overflow: ellipsis;
}

.labelsDelimiter {
	margin-right: 3px;
}
</style>
