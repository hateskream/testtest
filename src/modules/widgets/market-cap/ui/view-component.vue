<script setup lang="ts">
import { reactive, ref, useTemplateRef } from 'vue';

import type { IMarketCapDomain } from '../api';
import { IconIds, UiIcon } from '@/shared/ui/icon';
import { ModalBadge, ModalFilterTicker } from '../../base';
import type { IModalFilterTicker } from '../../base/modal/model';
import { UiImage } from '@/shared/ui/image';
import { RangeChart } from '@/modules/lightweight-charts/model';
import { compareStrings, prettyNumberWithKey } from '@/shared/lib';
import { useMarketCapStore } from '../store/market-cap';
import type { IMeta } from '@/modules/dashboard-group/core';

import ChartComponent from '@/modules/lightweight-charts/ui/chart-component.vue';
import ChartMarketCap from '@/modules/lightweight-charts/ui/chart-market-cap.vue';

interface IViewComponentProps {
	meta: IMeta;
	data: IMarketCapDomain[];
}

const props = defineProps<IViewComponentProps>();
const chartMarketCapRef = useTemplateRef('chartMarketCap');

const ACTIVE_TICKER_LIST_COUNT_SHOW = 3;

const listWithGroups = ref<{ [x: string]: IModalFilterTicker[] }>({});
const mapper = reactive<Map<string, IMarketCapDomain>>(new Map());

props.data.forEach((item) => {
	if (!listWithGroups.value[item.type]) {
		listWithGroups.value[item.type] = [];
	}

	mapper.set(item.id, item);

	listWithGroups.value[item.type].push({
		id: item.id,
		image: item.srcValue,
		name: item.name,
		ticker: item.symbol,
		isSelected: false,
	});
});


const activeList = ref<IMarketCapDomain[]>([]);
const marketCapStore = useMarketCapStore();

function formatFdv(fdv: string) {
	const { value, suffix } = prettyNumberWithKey(fdv);

	return `$${value}${suffix}`;
}

function handleUpdateFilterTickerItem(item: IModalFilterTicker) {
	if (item.isSelected) {
		const foundItem = mapper.get(item.id)!;

		activeList.value.push(foundItem);

		chartMarketCapRef.value?.addTicker(foundItem.color, foundItem.symbol);
	} else {
		const idx = activeList.value.findIndex(singleItem => compareStrings(singleItem.id, item.id));

		activeList.value.splice(idx, 1);

		chartMarketCapRef.value?.removeTicker(idx);
	}
}
</script>

<template>
	<div :class="classes.root">

		<div>
			<modal-badge>
				<template #title>
					<div :class="classes.listFiltersTitleImageWrapper">
						<div
							v-for="item in activeList.slice(0, ACTIVE_TICKER_LIST_COUNT_SHOW)"
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
							activeList.length  === 0
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


		<div
			v-if="
				activeList.length === 0
			"

			:class="classes.chartPrices"
			:style="{ marginTop: meta.size.h <= 3 ? 'auto' : '0'  }"
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

						<div v-if="marketCapStore.isShowChange" :class="classes.chartPriceTitleChange">
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


		<div v-if="activeList.length  > 0" :class="classes.marketCapCurrencyList">
			<div
				v-for="item in activeList"
				:key="item.id"
				:class="classes.marketCapCurrency"
			>

				<div :class="classes.marketCapCurrencyName">
					<div :style="{backgroundColor: item.color}"></div>
					<span>{{ item.symbol }}</span>
				</div>

				<div :class="classes.marketCapCurrencyFdv">
					{{ formatFdv(item.fdv) }}
				</div>

				<div
					:class="[classes.marketCapCurrencyChange,
						item.change24h > 0 ?
							classes.marketCapCurrencyChangePositive : classes.marketCapCurrencyChangeNegative
					]"
				>
					{{ item.change24h }}%
				</div>

			</div>
		</div>


		<div v-show="marketCapStore.isShowChart && meta.size.h > 3">
			<chart-component
				v-show="activeList.length === 0"
				:width="100"
				:disable-scroll="true"
				:is-visible-history-graph="false"
				:is-visible-indicators="false"
				:range-list="[ RangeChart['1D'], RangeChart['1W'], RangeChart['1M'], RangeChart['1Y'], RangeChart.ALL]"
				:height="320"
				:is-visible-range="meta.size.w > 2"
			/>
			<chart-market-cap
				v-show="activeList.length > 0"
				ref="chartMarketCap"
				:height="280"
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
