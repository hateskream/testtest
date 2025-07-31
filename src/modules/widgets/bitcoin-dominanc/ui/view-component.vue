<script setup lang="ts">
import { computed, onMounted, ref, useTemplateRef } from 'vue';

import type { IBitcoinDominancDomain } from '../api';
import { IconIds, UiIcon } from '@/shared/ui/icon';
import { ModalBadge, ModalFilterTicker } from '../../base';
import type { IModalFilterTicker } from '../../base/modal/model';
import { UiImage } from '@/shared/ui/image';
import { compareStrings } from '@/shared/lib';
import { useBitcoinDominancStore } from '../store/bitcoin-dominanc';
import type { IMeta } from '@/modules/dashboard-group/core';
import { ChartBitcoinDominanc } from '@/modules/lightweight-charts';
import { RangeChart } from '@/modules/lightweight-charts/model';

import ChartRange from '@/modules/lightweight-charts/components/chart-range.vue';

interface IViewComponentProps {
	meta: IMeta;
	data: IBitcoinDominancDomain[];
}

const props = defineProps<IViewComponentProps>();
const chartMarketCapRef = useTemplateRef('chart');

const ACTIVE_TICKER_LIST_COUNT_SHOW = 3;

const listWithGroups = ref<IModalFilterTicker[]>(
	props.data.map((item, idx) => {
		return {
			id: item.id,
			image:  item.srcValue,
			name: item.name,
			ticker: item.symbol,
			imageType: 'image',
			type: {
				value: item.type,
				name: '',
			},
			isSelected: idx === 0,
		};
	}),
);

const activeList = ref<IBitcoinDominancDomain[]>([]);
const activeListSorted = computed(() => {
	return [...activeList.value].sort((a, b) => b.dominanc-a.dominanc );
});
const totalOtherDominanc = computed(() => {
	return (100 - activeListSorted.value.reduce((acc, item) => acc + item.dominanc, 0)).toFixed(2);
});
const bitcoinDominancStore = useBitcoinDominancStore();

function handleUpdateFilterTickerItem(item: IModalFilterTicker) {
	if (item.isSelected) {
		const foundItem = props.data.find(singleItem => compareStrings(singleItem.id, item.id) )!;

		activeList.value.push(foundItem);

		chartMarketCapRef.value?.addTicker(foundItem.color, foundItem.symbol);
	} else {
		const idx = activeList.value.findIndex(singleItem => compareStrings(singleItem.id, item.id));

		activeList.value.splice(idx, 1);

		chartMarketCapRef.value?.removeTicker(idx);
	}
}
onMounted(() => {
	handleUpdateFilterTickerItem(
		listWithGroups.value[0]!,
	);
});
</script>

<template>
	<div :class="classes.root">

		<div>
			<modal-badge>
				<template #title>
					<div :class="classes.listFiltersTitleImageWrapper">
						<div
							v-for="item in activeListSorted.slice(0, ACTIVE_TICKER_LIST_COUNT_SHOW)"
							:key="item.symbol"
							:class="classes.listFiltersTitleImage"
						>
							<ui-image
								:src="item.srcValue"
								replacement="/images/market/ADA.png"
							/>
						</div>
					</div>


					<div
						v-if="
							activeListSorted.length  === 0
						"
					>
						Crypto
					</div>

					<ui-icon
						:id="IconIds.DropdownDown"
						width="12"
						height="12"
						:class="classes.icon"
					/>
				</template>

				<template #content>
					<modal-filter-ticker
						v-model="listWithGroups"
						@select="handleUpdateFilterTickerItem"
					/>
				</template>
			</modal-badge>
		</div>


		<div v-if="activeListSorted.length  > 0" :class="classes.marketCapCurrencyAllData">
			<div style="flex-grow: 1;">
				<div  :class="classes.marketCapCurrencyDominancList">
					<div
						v-for="item in activeListSorted"
						:key="item.id"
						:class="classes.marketCapCurrencyDominancItem"
					>
						<div :class="classes.marketCapCurrencyDominancName">
							<div :style="{backgroundColor: item.color}"></div>
							<span>{{ item.symbol }}</span>
						</div>

						<div :class="classes.marketCapCurrencyDominancValue">
							{{ item.dominanc }}%
						</div>
					</div>

					<div
						:class="classes.marketCapCurrencyDominancItem"
					>
						<div :class="classes.marketCapCurrencyDominancName">
							<div :style="{backgroundColor: '#Fff'}"></div>
							<span>Other</span>
						</div>

						<div :class="classes.marketCapCurrencyDominancValue">
							{{ totalOtherDominanc	 }}%
						</div>
					</div>
				</div>

				<div v-if="bitcoinDominancStore.isShowIndicator" :class="classes.marketCapDominancLine">
					<div
						v-for="item in activeListSorted"
						:key="item.id"
						:class="classes.marketCapDominancLineItem"
						:style="{background: item.color, width: `${item.dominanc}%`}"
					/>
					<div
						:class="classes.marketCapDominancLineItem"
						:style="{background: '#fff', width: `${totalOtherDominanc}%`}"
					/>
				</div>
			</div>

			<div v-if="bitcoinDominancStore.isShowHistorical" :class="classes.marketCapCurrencyList">
				<div
					v-for="item in activeListSorted"
					:key="item.id"
					:class="classes.marketCapCurrency"
				>

					<div :class="classes.marketCapCurrencyName">
						<div :style="{backgroundColor: item.color}"></div>
						<span>{{ item.symbol }}</span>
					</div>

					<div :class="classes.marketCapCurrencyChange">
						{{ item.changeYerstaday }}%
					</div>

					<div :class="classes.marketCapCurrencyChange">
						{{ item.changeWeek }}%
					</div>


					<div :class="classes.marketCapCurrencyChange">
						{{ item.changeYear }}%
					</div>
				</div>
			</div>

		</div>

		<div
			v-show="
				bitcoinDominancStore.isShowChart &&
					meta.size.h >= 7 &&
					activeListSorted.length > 0
			"
			:class="classes.chartWrapper"
		>
			<chart-bitcoin-dominanc
				ref="chart"
				:hide-axis="meta.size.w  <= 2 || meta.size.h <= 7"
				:height="'85%'"
			/>

			<chart-range
				v-show="meta.size.h >= 8 && meta.size.w >=3"
				:class="classes.range"
				:active-range="RangeChart['ALL']"
				:list="[
					RangeChart['1D'],
					RangeChart['1W'],
					RangeChart['1M'],
					RangeChart['6M'],
					RangeChart['1Y'],
					RangeChart['ALL']
				]"
			/>
		</div>

	</div>
</template>

<style module="classes">
.root {
	display: flex;
	flex-direction: column;
	height: 100%;
	padding: 0 16px 18px;
	overflow: hidden;
	gap: 16px;
}


.chartWrapper {
	flex: 1;
	height: 100%;

	/* background-color: red; */
}

.marketCapCurrencyAllData {
	display: flex;
	flex-wrap: wrap;
	gap: 16px;
}

.marketCapCurrencyDominancList {
	display: flex;
	flex-wrap: wrap;
	max-height: 170px;
	overflow-y: auto;
	row-gap: 6px;
}

.marketCapCurrencyDominancItem {
	display: flex;
	flex-direction: column;
	width: 80px;
}

.listFiltersTitleImageWrapper {
	display: flex;
}

.listFiltersTitleImage {
	width: 28px;
	height: 28px;
	margin-left: -12px;
	overflow: hidden;
	background-color: #222223;
	border: 2px solid #222223;
	border-radius: 100%;
}

.listFiltersTitleImageWrapper > .listFiltersTitleImage:first-child {
	margin-left: 0;
}

.marketCapCurrency {
	display: flex;
	align-items: center;
	height: 17px;
	margin-bottom: 4px;
	background-color: var(--bg-color-surface-03);
	border-radius: 16px;
	gap: 6px;
	padding-inline: 6px;
}

.marketCapCurrencyName {
	display: flex;
	align-items: center;
	padding-right: 4px;
	gap: 6px;
}

.marketCapCurrencyName > div {
	width: 4px;
	height: 4px;
	border-radius: 100%;
}

.marketCapCurrencyName > span {
	width: 40px;
	font-weight: 440;
	font-size: 10px;
	color: var(--text-color-base-300);
	border-right: 1px solid var(--border-color-base-300);
}


.marketCapCurrencyDominancName {
	display: flex;
	align-items: center;
	padding-right: 4px;
	gap: 6px;
}

.marketCapCurrencyDominancName > div {
	width: 4px;
	height: 4px;
	border-radius: 100%;
}

.marketCapCurrencyDominancName > span {
	font-weight: 440;
	font-size: 10px;
	color: var(--text-color-base-300);
}

.marketCapCurrencyDominancValue {
	font-weight: 400;
	font-size: 15px;
	color: #ffffff;
}

.marketCapCurrencyFdv {
	font-weight: 440;
	font-size: 10px;
	color: var(--text-color-base-500);
}

.marketCapCurrencyList {
	flex-grow: 1;
	min-width: 300px;
	max-height: 120px;
	overflow-y: auto;
}

.marketCapCurrencyChange {
	display: flex;
	justify-content: center;
	align-items: center;
	width: 100%;
	font-weight: 400;
	font-size: 10px;
	color: var(--text-color-base-300);
	border-right: 1px solid var(--border-color-base-300);
}

.marketCapCurrency .marketCapCurrencyChange:last-child {
	border-right: none;
}


.marketCapDominancLine {
	display: flex;
	align-items: center;
	margin-top: 10px;
}

.marketCapDominancLineItem {
	height: 14px;
}

.marketCapDominancLine .marketCapDominancLineItem:first-child {
	border-top-left-radius: 4px;
	border-bottom-left-radius: 4px;
}

.marketCapDominancLine .marketCapDominancLineItem:last-child {
	border-top-right-radius: 4px;
	border-bottom-right-radius: 4px;
}
</style>
