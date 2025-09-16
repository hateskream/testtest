<script setup lang="ts">
import { computed, nextTick, ref, useTemplateRef, watch } from 'vue';

import type { TickerDto } from '../api';
import { useBitcoinDominanceStore } from '../store/bitcoin-dominance';
import type { IMeta } from '@/modules/dashboard-group/core';
import { ChartBitcoinDominance } from '@/modules/lightweight-charts';
import { RangeChart } from '@/shared/ui/chart-range';
import { getTickerName } from '@/modules/cell';
import type { TickerRow } from '../model';
import { ModalTickerSelectorWithBadge } from '@/modules/ticker-selector';

import ChartRange from '@/shared/ui/chart-range/chart-range.vue';


interface IViewComponentProps {
	meta: IMeta;
	data: TickerRow[];
}

const props = defineProps<IViewComponentProps>();
const chartMarketCapRef = useTemplateRef('chart');

const activeListSorted = computed(() => {
	return [...props.data].sort((a, b) => +b.dominance24hPercent.value - +a.dominance24hPercent.value );
});

const totalOtherDominance = computed(() => {
	return (100 - activeListSorted.value.reduce((acc, item) => acc + +item.dominance24hPercent.value, 0)).toFixed(2);
});

const bitcoinDominanceStore = useBitcoinDominanceStore();

const prevIds = ref<string[]>([]);

watch(
	() => props.data,
	async (newData: TickerDto[]) => {
		await nextTick();
		const chart = chartMarketCapRef.value;
		if (!chart) {
			return;
		}

		for (let i = prevIds.value.length - 1; i >= 0; i--) {
			chart.removeTicker(i);
		}

		for (const d of newData) {
			chart.addTicker(d.color.value!, d.tickerId);
		}

		prevIds.value = newData.map(d => d.tickerId);
	},
	{ immediate: true, flush: 'post' },
);
</script>

<template>
	<div :class="classes.root">
		<modal-ticker-selector-with-badge
			v-model="bitcoinDominanceStore.selectedTickers"
		/>


		<div v-if="activeListSorted.length  > 0" :class="classes.marketCapCurrencyAllData">
			<div style="flex-grow: 1;">
				<div  :class="classes.marketCapCurrencyDominanceList">
					<div
						v-for="item in activeListSorted"
						:key="item.tickerId"
						:class="classes.marketCapCurrencyDominanceItem"
					>
						<div :class="classes.marketCapCurrencyDominanceName">
							<div :style="{backgroundColor: item.color.value}"></div>
							<span>
								{{ getTickerName(item.symbol)}}
							</span>
						</div>

						<div :class="classes.marketCapCurrencyDominanceValue">
							{{ item.dominance24hPercent.value }}%
						</div>
					</div>

					<div
						:class="classes.marketCapCurrencyDominanceItem"
					>
						<div :class="classes.marketCapCurrencyDominanceName">
							<div :style="{backgroundColor: '#Fff'}"></div>
							<span>Other</span>
						</div>

						<div :class="classes.marketCapCurrencyDominanceValue">
							{{ totalOtherDominance }}%
						</div>
					</div>
				</div>

				<div v-if="bitcoinDominanceStore.isShowIndicator" :class="classes.marketCapDominanceLine">
					<div
						v-for="item in activeListSorted"
						:key="item.tickerId"
						:class="classes.marketCapDominanceLineItem"
						:style="{background: item.color.value, width: `${item.dominance24hPercent.value}%`}"
					/>
					<div
						:class="classes.marketCapDominanceLineItem"
						:style="{background: '#fff', width: `${totalOtherDominance}%`}"
					/>
				</div>
			</div>

			<div v-if="bitcoinDominanceStore.isShowHistorical" :class="classes.marketCapCurrencyList">
				<div
					v-for="item in activeListSorted"
					:key="item.tickerId"
					:class="classes.marketCapCurrency"
				>

					<div :class="classes.marketCapCurrencyName">
						<div :style="{backgroundColor: item.color.value}"></div>
						<span>
							{{ getTickerName(item.symbol) }}
						</span>
					</div>

					<div :class="classes.marketCapCurrencyChange">
						{{ item.dominance24hPercent.value }}%
					</div>

					<div :class="classes.marketCapCurrencyChange">
						{{ item.dominance7dPercent.value }}%
					</div>


					<div :class="classes.marketCapCurrencyChange">
						{{ item.dominance30dPercent.value }}%
					</div>
				</div>
			</div>

		</div>

		<div
			v-show="
				bitcoinDominanceStore.isShowChart &&
					meta.size.h >= 7 &&
					activeListSorted.length > 0
			"
			:class="classes.chartWrapper"
		>
			<chart-bitcoin-dominance
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

.marketCapCurrencyDominanceList {
	display: flex;
	flex-wrap: wrap;
	max-height: 170px;
	overflow-y: auto;
	row-gap: 6px;
}

.marketCapCurrencyDominanceItem {
	display: flex;
	flex-direction: column;
	width: 80px;
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


.marketCapCurrencyDominanceName {
	display: flex;
	align-items: center;
	padding-right: 4px;
	gap: 6px;
}

.marketCapCurrencyDominanceName > div {
	width: 4px;
	height: 4px;
	border-radius: 100%;
}

.marketCapCurrencyDominanceName > span {
	font-weight: 440;
	font-size: 10px;
	color: var(--text-color-base-300);
}

.marketCapCurrencyDominanceValue {
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


.marketCapDominanceLine {
	display: flex;
	align-items: center;
	margin-top: 10px;
}

.marketCapDominanceLineItem {
	height: 14px;
}

.marketCapDominanceLine .marketCapDominanceLineItem:first-child {
	border-top-left-radius: 4px;
	border-bottom-left-radius: 4px;
}

.marketCapDominanceLine .marketCapDominanceLineItem:last-child {
	border-top-right-radius: 4px;
	border-bottom-right-radius: 4px;
}
</style>
