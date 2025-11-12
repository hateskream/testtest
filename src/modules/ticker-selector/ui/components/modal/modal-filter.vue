<script setup lang="ts">
import { computed, nextTick, ref } from 'vue';

import {
	FilterListType,
	type ITickerEmits,
	type ITickerSelectAction,
	MarketToSymbol,
	SymbolToName,
	type TickerDto,
} from '@/modules/ticker-selector/model/filter-ticker';
import { ModalSearch } from '@/modules/widgets/base';
import { compareStrings } from '@/shared/lib';
import { MarketType } from '@/modules/market';
import { SymbolType } from '@/modules/cell';

import ModalFilterInfo from './modal-filter-info.vue';
import ModalFilterRow from './modal-filter-row.vue';
import ModalFilterRowTitle from './modal-filter-row-title.vue';

interface IModalFilterTickerProps {
	tickers: TickerDto[];
	modelValue: string[];
	isBackgroundTransparent?: boolean;
	enableSelectedInfo?: boolean;
	enableSelectAll?: boolean;
	autofocus?: boolean;
	textAboveSearch?: string;
	selectionMode?: 'single' | 'multiple';
	searchPlaceholder?: string;
	marketTypes: MarketType[];
}

type IGroupedTicker = Record<SymbolType, TickerDto[]>;

const props = withDefaults(defineProps<IModalFilterTickerProps>(), {
	isBackgroundTransparent: false,
	enableSelectedInfo: true,
	textAboveSearch: '',
	selectionMode: 'multiple',
	searchPlaceholder: 'Start typing the ticker...',
});

type IEmits = ITickerEmits & {
	(e: 'update:modelValue', data: string[]): void;
};

const emits = defineEmits<IEmits>();

const getGroupKey = (type: SymbolType) => SymbolToName[type];

const availableSymbols = computed(() => props.marketTypes.map(type => MarketToSymbol[type]));

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
		? MarketToSymbol[props.marketTypes[0]]
		: null,
);

const viewMode = ref<FilterListType>(FilterListType.All);

const selectedTickers = computed(() => {
	const groupedSelectedCount: Record<string, number> = {};

	let allSelected = tickersData.value.filter((t) => {
		const isSelected = props.modelValue.includes(t.tickerId);
		if (isSelected) {
			const groupName = t.symbol.symbolType!;
			groupedSelectedCount[groupName] = (groupedSelectedCount[groupName] ?? 0) + 1;
		}
		return isSelected;
	});

	if (viewMode.value === FilterListType.Selected) {
		allSelected = allSelected.filter((t) =>
			[t.tickerId.toLowerCase()].some((s) => s.includes(preparedQuery.value)),
		);
	}

	return {
		groupedSelectedCount,
		allSelected,
	};
});

const queredTickers = computed(() => {
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

	queredTickers.value.forEach((item) => {
		const type = item.symbol.symbolType;
		if (type) {
			(group[type] ??= []).push(item);
		}
	});

	return group;
});

function isGroupTickersSelectedAll(group: SymbolType) {
	return groupedTickers.value[group].length === selectedTickers.value.groupedSelectedCount[group];
}

/** 🧩 Обновлённая логика выбора элемента */
function handleToggleSelect(action: ITickerSelectAction) {
	if (props.selectionMode === 'single') {

		if (action.isSelected) {

			emits('update:modelValue', [action.tickerId]);
			emits('select', action.tickerId);
		} else {

			if (props.modelValue.length > 1) {
				const next = props.modelValue.filter((id) => id !== action.tickerId);
				emits('update:modelValue', next);
				emits('unselect', action.tickerId);
			}
		}
	} else {

		if (!action.isSelected) {
			const next = props.modelValue.filter((id) => id !== action.tickerId);
			emits('update:modelValue', next);
			emits('unselect', action.tickerId);
		} else {
			const ticker = tickersData.value.find((i) => compareStrings(i.tickerId, action.tickerId));
			if (ticker) {
				emits('update:modelValue', [...new Set([...props.modelValue, ticker.tickerId])]);
				emits('select', ticker.tickerId);
			}
		}
	}

	nextTick(() => {
		if (props.modelValue.length === 0 && props.selectionMode === 'multiple' && props.marketTypes.length > 1) {
			viewMode.value = FilterListType.All;
			activeGroup.value = null;
		}
	});
}

/** 🧩 Обновлён handleSelectAll (в single режиме — просто выбирает первый) */
function handleSelectAll(groupName: SymbolType) {
	if (props.selectionMode === 'single') {
		const group = groupedTickers.value[groupName];
		if (group.length > 0) {
			const first = group[0].tickerId;
			emits('update:modelValue', [first]);
			emits('selectAll', [first]);
		}
		return;
	}


	const group = groupedTickers.value[groupName];
	if (isGroupTickersSelectedAll(groupName)) {
		const toUnselect = new Set(group.map((t) => t.tickerId));
		const next = props.modelValue.filter((m) => !toUnselect.has(m));
		emits('unselectAll', next);
		emits('update:modelValue', next);
	} else {
		const additions: string[] = group
			.filter((t) => !props.modelValue.includes(t.tickerId))
			.map((i) => i.tickerId);
		if (additions.length) {
			const tickers = [...props.modelValue, ...additions];
			emits('update:modelValue', tickers);
			emits('selectAll', tickers);
		}
	}
}
</script>


<template>
	<div
		:class="classes.wrapper"
		:style="isBackgroundTransparent && { background: 'transparent' }"
	>
		<div :class="classes.content">
			<div
				:class="classes.header"
				:style="isBackgroundTransparent
					? {
						background: 'linear-gradient(to top, transparent 0, var(--bg-color-surface-01) 22%)',
					}
					: {
						background: 'linear-gradient(to top, transparent 0, var(--bg-modal-color-base) 22%)',
					}"
			>
				<div
					v-if="props.textAboveSearch"
					:class="classes.textAboveSearch"
				>
					{{ props.textAboveSearch }}
				</div>

				<div :class="classes.search">
					<modal-search
						v-model="query"
						:placeholder="searchPlaceholder"
						:autofocus="props.autofocus"
					/>
				</div>
			</div>

			<modal-filter-info
				v-if="props.enableSelectedInfo"
				v-model="viewMode"
				:is-searching="hasSearchQuery"
				:total-items="queredTickers.length"
				:total-selected="selectedTickers.allSelected.length"
			/>

			<template v-if="viewMode === FilterListType.All">
				<template v-if="activeGroup === null">
					<div v-for="(_, group) in groupedTickers" :key="group">
						<modal-filter-row-title
							:is-selected-all="isGroupTickersSelectedAll(group)"
							:is-searching="hasSearchQuery"
							:is-inside-open="false"
							:enable-select-all="props.enableSelectAll"
							@select-all="handleSelectAll(group)"
							@click="activeGroup = group"
						>
							<template #title>
								{{ getGroupKey(group) }}
							</template>
							<template #count>
								{{ groupedTickers[group].length }}
							</template>
						</modal-filter-row-title>
						<template v-if="hasSearchQuery">
							<div
								v-if="groupedTickers[group].length === 0"
								:class="classes.notFound"
							>
								Nothing found in {{ getGroupKey(group) }}
							</div>
							<modal-filter-row
								v-else
								:list="groupedTickers[group!].slice(0, 3)"
								:selected-ids-map="modelValue"
								@update="handleToggleSelect"
							/>
						</template>

					</div>
				</template>
				<template v-else>
					<modal-filter-row-title
						v-if="availableSymbols.length > 1"
						:is-back="true"
						:is-selected-all="isGroupTickersSelectedAll(activeGroup)"
						:is-searching="hasSearchQuery"
						:is-inside-open="true"
						:enable-select-all="props.enableSelectAll"
						@click="activeGroup = null"
						@select-all="handleSelectAll(activeGroup)"
					>
						<template #title>
							{{ getGroupKey(activeGroup) }}
						</template>
						<template #count>
							{{ groupedTickers[activeGroup!].length }}
						</template>
					</modal-filter-row-title>
					<div
						v-if="hasSearchQuery && groupedTickers[activeGroup].length === 0"
						:class="classes.notFound"
					>
						Nothing found in {{ getGroupKey(activeGroup) }}
					</div>
					<modal-filter-row
						v-else
						:list="groupedTickers[activeGroup!]"
						:selected-ids-map="modelValue"
						@update="handleToggleSelect"
					/>
				</template>
			</template>
			<template v-else>
				<div
					v-if="selectedTickers.allSelected.length === 0 && hasSearchQuery"
					:class="classes.notFound"
				>
					Nothing found in selected items
				</div>
				<modal-filter-row
					v-else
					:list="selectedTickers.allSelected"
					:selected-ids-map="modelValue"
					@update="handleToggleSelect"
				/>
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
	padding: 6px;
	overflow: hidden;
	background: var(--bg-modal-color-base);
	border: 1px solid rgb(199 199 199 / 10%);
	border-radius: 18px;
}

.textAboveSearch {
	padding: 12px;
	font-style: normal;
	text-align: center;
}

.search {
	padding-inline: 12px;
}

.content {
	flex: 1;
	overflow-x: hidden;
	overflow-y: auto;
	scrollbar-width: thin;
	scrollbar-color: var(--border-color-base-300) transparent;
}

.header {
	position: sticky;
	top: 0;
	padding-bottom: 22px;
}

.notFound {
	display: flex;
	justify-content: center;
	align-items: center;
	height: 112px;
	font-style: normal;
	font-weight: 440;
	font-size: 11px;
	text-align: center;
	color: var(--text-color-base-300);
	letter-spacing: 0.088px;
}
</style>
