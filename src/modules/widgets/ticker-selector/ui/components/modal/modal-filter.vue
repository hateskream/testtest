<script setup lang="ts">
import { computed, nextTick, ref } from 'vue';

import {
	FilterListType,
	type ITickerMapped,
	type TickerDto,
	type ITickerEmits,
	type ITickerSelectAction,
	SymbolToName,
} from '../../../model/filter-ticker';
import { ModalSearch } from '@/modules/widgets/base';
import { compareStrings } from '@/shared/lib';
import { getMappedRow } from '../../../utils';
import { SymbolType } from '@/modules/cell';

import ModalFilterInfo from './modal-filter-info.vue';
import ModalFilterRow from './modal-filter-row.vue';
import ModalFilterRowTitle from './modal-filter-row-title.vue';

interface IModalFilterTickerProps {
	tickers: TickerDto[];
	modelValue: ITickerMapped[];
}

type IGroupedTicker = Record<SymbolType, TickerDto[]>;

const props = defineProps<IModalFilterTickerProps>();

type IEmits = ITickerEmits & {
	(e: 'update:modelValue', data: ITickerMapped[]): void;
};

const emits = defineEmits<IEmits>();

const getGroupKey = (type: SymbolType) => {
	return SymbolToName[type];
};

const tickersData = computed<TickerDto[]>(() =>
	props.tickers.map((t) => ({
		tickerId: t.tickerId,
		symbol: t.symbol,
	})),
);

const selectedIds = computed(() => props.modelValue.map((i) => i.tickerId));


const query = ref('');

const activeGroup = ref<SymbolType | null>(null);
const viewMode = ref<FilterListType>(FilterListType.All);


const selectedTickers = computed(() => {
	const groupedSelectedCount: Record<string, number> = {};

	let allSelected = tickersData.value.filter((t) => {
		const isSelected = selectedIds.value.includes(t.tickerId);

		if (isSelected) {
			const groupName = t.symbol.symbolType!;

			groupedSelectedCount[groupName] = (groupedSelectedCount[groupName] ?? 0) + 1;
		}

		return isSelected;
	});


	if (viewMode.value === FilterListType.Selected ) {
		allSelected = allSelected.filter((t) =>
			[t.tickerId.toLowerCase()].some((s) => s.includes(query.value)),
		);
	}

	return {
		groupedSelectedCount,
		allSelected,
	};
},
);

const queredTickers = computed(() => {
	return tickersData.value.filter((item) =>
		[item.tickerId.toLowerCase()].some((s) => s.includes(query.value)),
	);
});

const groupedTickers = computed<IGroupedTicker>(() => {
	const group: IGroupedTicker = {} as IGroupedTicker;

	tickersData.value.forEach((item) => {
		group[item.symbol.symbolType!] = [];
	});

	queredTickers.value.forEach((item) => {
		const type = item.symbol.symbolType;

		if (type) {
			(group[item.symbol.symbolType!] ??= []).push(item);
		}
	});

	return group;
});

function isGroupTickersSelectedAll(group: SymbolType) {
	return groupedTickers.value[group].length === selectedTickers.value.groupedSelectedCount[group];
}

function handleToggleSelect(action: ITickerSelectAction) {
	if (!action.isSelected) {
		const idx = props.modelValue.findIndex((i) =>
			compareStrings(i.tickerId, action.tickerId),
		);

		if (idx !== -1) {
			const item = props.modelValue[idx];
			emits(
				'update:modelValue',
				props.modelValue.filter((_, i) => i !== idx),
			);
			emits('unselect', item);
		}
	} else {
		const ticker = tickersData.value.find((i) =>
			compareStrings(i.tickerId, action.tickerId),
		);
		if (ticker) {
			const mapped = getMappedRow(ticker);
			emits('update:modelValue', [...props.modelValue, mapped]);
			emits('select', mapped);
		}
	}

	nextTick(() => {
		if (props.modelValue.length === 0) {
			viewMode.value = FilterListType.All;
			activeGroup.value = null;
		}
	});
}

function handleSelectAll(groupName: SymbolType) {
	const group = groupedTickers.value[groupName];

	if (isGroupTickersSelectedAll(groupName)) {
		const toUnselect = new Set(group.map((t) => t.tickerId));
		const next = props.modelValue.filter((m) => !toUnselect.has(m.tickerId));

		emits('unselectAll', next);
		emits('update:modelValue', next);
	} else {
		const additions: ITickerMapped[] = [];

		group.forEach((t) => {
			if (!selectedIds.value.includes(t.tickerId)) {
				const mapped = getMappedRow(t);
				additions.push(mapped);
			}
		});

		if (additions.length) {
			const tickers = [...props.modelValue, ...additions];

			emits('update:modelValue', tickers);
			emits('selectAll', tickers);
		}
	}
}
</script>

<template>
	<div :class="classes.wrapper">
		<div :class="classes.search">
			<modal-search v-model="query" />
		</div>
		<!--
		<div
			v-if="selectedTickers.allSelected.length > 0 && viewMode === FilterListType.All"
			:class="classes.listBadge"
		>
			<modal-filter-selected-info
				:list="selectedTickers.allSelected"
				@update="handleToggleSelect"
			/>
		</div> -->

		<modal-filter-info
			v-model="viewMode"
			:is-searching="query.length > 0"
			:total-items="queredTickers.length"
			:total-selected="selectedTickers.allSelected.length"
		/>

		<template v-if="viewMode === FilterListType.All">
			<template v-if="activeGroup === null">
				<div v-for="(_, group) in groupedTickers" :key="group">
					<modal-filter-row-title
						:is-selected-all="isGroupTickersSelectedAll(group)"
						:is-searching="query.length > 0"
						:is-inside-open="false"
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


					<template v-if="query.length > 0">
						<div
							v-if=" groupedTickers[group].length === 0"
							:class="classes.notFound"
						>
							Nothing found in {{ getGroupKey(group) }}
						</div>
						<modal-filter-row
							v-else
							:list="groupedTickers[group!].slice(0, 3)"
							:selected-ids-map="selectedIds"
							@update="handleToggleSelect"
						/>
					</template>

				</div>
			</template>
			<template v-else>
				<modal-filter-row-title
					:is-back="true"
					:is-selected-all="isGroupTickersSelectedAll(activeGroup)"
					:is-searching="query.length > 0"
					:is-inside-open="true"
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

				<modal-filter-row
					:list="groupedTickers[activeGroup!]"
					:selected-ids-map="selectedIds"
					@update="handleToggleSelect"
				/>
			</template>
		</template>

		<template v-else>
			<div
				v-if="selectedTickers.allSelected.length === 0 && query.length > 0"
				:class="classes.notFound"
			>
				Nothing found in selected items
			</div>
			<modal-filter-row
				v-else
				:list="selectedTickers.allSelected"
				:selected-ids-map="selectedIds"
				@update="handleToggleSelect"
			/>
		</template>
	</div>
</template>

<style module="classes">
.listBadge {
	display: flex;
	align-items: center;
	margin-bottom: 12px;
	overflow: hidden;
	gap: 4px;
	padding-inline: 12px;
}

.wrapper {
	width: 286px;
	padding: 6px;
	background: var(--bg-modal-color-base);
	border: 1px solid rgb(199 199 199 / 10%);
	border-radius: 18px;
}

.search {
	padding-inline: 12px;
	margin-bottom: 12px;
}

.listItemDataImage {
	display: flex;
	justify-content: center;
	align-items: center;
	width: 24px;
	height: 24px;
	padding: 4px;
	border: 1px solid var(--border-color-base-300);
	border-radius: 100px;
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
