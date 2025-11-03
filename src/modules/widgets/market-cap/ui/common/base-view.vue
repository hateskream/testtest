<script setup lang="ts">
import { nextTick, ref, useTemplateRef, watch } from 'vue';

import { IconIds, UiIcon } from '@/shared/ui/icon';
import type { IMeta } from '@/modules/dashboard-group';
import { RangeChart } from '@/shared/ui/chart-range';
import { useMarketCapStore } from '../../store/market-cap.ts';
import type { IMarketCapDomain } from '../../api/get-market-cap.ts';

import ChartComponent from '@/modules/lightweight-charts/ui/chart-component.vue';
import ChartMarketCap from '@/modules/lightweight-charts/ui/chart-market-cap.vue';

interface IViewComponentProps {
	meta: IMeta;
	data: IMarketCapDomain[];
}

const props = defineProps<IViewComponentProps>();
const chartMarketCapRef = useTemplateRef('chartMarketCap');

const marketCapStore = useMarketCapStore();
const prevIds = ref<string[]>([]);

watch(
	() => props.data,
	async (newData: IMarketCapDomain[]) => {
		await nextTick();
		const chart = chartMarketCapRef.value;
		if (!chart) {
			return;
		}

		// eslint-disable-next-line no-plusplus
		for (let i = prevIds.value.length - 1; i >= 0; i--) {
			chart.removeTicker(i);
		}

		for (const d of newData) {
			chart.addTicker(d.color!, d.symbol);
		}

		prevIds.value = newData.map(d => d.id);
	},
	{ immediate: true, flush: 'post' },
);

</script>

<template>
	<div
		:class="classes.root"
		:style="
			data.length >= 0 &&
				(	!marketCapStore.isShowChart ||
					meta.size.h <= 3) &&
				{ justifyContent: 'space-between'}
		"
	>
		<slot name=ticker-selector />

		<div
			v-if="data.length === 0"
			:class="classes.chartPrices"
		>
			<div>
				<div :class="classes.chartPrice">
					<div :class="classes.chartPriceTime">
						Market cap
					</div>


					<div :class="classes.chartPriceTitle">
						<div :class="classes.chartPriceTitleValue">
							$ 324B
						</div>

						<div
							v-if="marketCapStore.isShowChange && meta.size.w > 1"
							:class="classes.chartPriceTitleChange"
						>
							<div :class="classes.chartPriceTitleChangeIcon">
								<ui-icon
									:id="IconIds.Gainers"
									height="12px"
									width="12px"
								/>
							</div>

							<div :class="classes.chartPriceTitleChangeValue">
								0.93 (0.33%)
							</div>
						</div>
					</div>
				</div>

			</div>


			<div>
				<div :class="classes.chartPrice">
					<div :class="classes.chartPriceTime">
						Volume
					</div>


					<div :class="classes.chartPriceTitle">
						<div :class="classes.chartPriceTitleValue">
							$ 104B
						</div>
						<!--
						<div :class="classes.chartPriceTitleChange">
							<div :class="classes.chartPriceTitleChangeIcon">
								<ui-icon
									:id="IconIds.Gainers"
									height="12px"
									width="12px"
								/>
							</div>

							<div :class="classes.chartPriceTitleChangeValue">
								0.93 (0.33%)
							</div>
						</div> -->
					</div>
				</div>
			</div>
		</div>


		<div v-if="data.length > 0" :class="classes.marketCapCurrencyList">
			<div
				v-for="item in data"
				:key="item.id"
				:class="classes.marketCapCurrency"
			>

				<div :class="classes.marketCapCurrencyName">
					<div :style="{backgroundColor: item.color}"></div>
					<span>
						{{ item.symbol  }}
					</span>
				</div>

				<div :class="classes.marketCapCurrencyFdv">
					{{ item.fdv }}
				</div>

				<div
					:class="[classes.marketCapCurrencyChange,
						item.change24h > 0 ?
							classes.marketCapCurrencyChangePositive : classes.marketCapCurrencyChangeNegative
					]"
				>
					{{ item.change24h  }}%
				</div>

			</div>
		</div>

		<template v-if="marketCapStore.isShowChart && meta.size.h > 3">
			<div :class="classes.chartWrapper">
				<chart-component
					v-show="data.length === 0"
					:width="100"
					:disable-scroll="true"
					:is-visible-history-graph="false"
					:is-visible-indicators="false"
					:range-list="[
						RangeChart['1D'],
						RangeChart['1W'],
						RangeChart['1M'],
						RangeChart['1Y'],
						RangeChart.ALL
					]"
					height="100%"
					:is-visible-range="meta.size.w > 2"
				/>


				<chart-market-cap
					v-show="data.length > 0"
					ref="chartMarketCap"
					:is-visible-range="meta.size.w > 2"
					:range-list="[
						RangeChart['1D'],
						RangeChart['1W'],
						RangeChart['1M'],
						RangeChart['1Y'],
						RangeChart.ALL
					]"
					height="100%"
				/>
			</div>
		</template>
	</div>
</template>

<style module="classes">
.root {
	display: flex;
	flex-direction: column;
	height: 100%;
	gap: 16px;
}


.chartWrapper {
	height: 100%;
}

.chartPrices {
	display: flex;
	align-items: center;
	gap: 8px;
}

.chartPriceTime {
	margin-bottom: 12px;
	font-weight: 440;
	font-size: 10px;
	color: var(--text-color-base-300);
}

.chartPriceTitle {
	display: flex;
	align-items: center;
	gap: 6px;
}

.chartPriceTitleValue {
	font-weight: 340;
	font-size: 24px;
	color: var(--text-color-base-500);
}

.chartPriceTitleChange {
	display: flex;
	align-items: center;
	padding: 7px 9px 7px 7px;
	background-color: var(--metrics-bg-control-300);
	border-radius: 16px;
	gap: 4px;
}

.chartPriceTitleChangeValue {
	font-weight: 440;
	font-size: 12px;
	color: var(--metrics-color-positive-chart);
}

.marketCapCurrency {
	display: flex;
	align-items: center;
	width: max-content;
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
	border-right: 1px solid var(--border-color-base-300);
	gap: 6px;
}

.marketCapCurrencyName > div {
	width: 4px;
	height: 4px;
	border-radius: 100%;
}

.marketCapCurrencyName > span {
	font-weight: 440;
	font-size: 10px;
	color: var(--text-color-base-300);
}

.marketCapCurrencyFdv {
	font-weight: 440;
	font-size: 10px;
	color: var(--text-color-base-500);
}

.marketCapCurrencyList {
	flex: 0 0 auto;
	width: max-content;
	height: 60px;
	padding-right: 10px;
	overflow-y: auto;
}

.marketCapCurrencyChange {
	font-weight: 400;
	font-size: 10px;
}

.marketCapCurrencyChangePositive {
	color: rgb(4 237 160 / 100%);
}

.marketCapCurrencyChangeNegative {
	color: rgb(252 74 107 / 100%);
}
</style>
