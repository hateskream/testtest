<script setup lang="ts">
import { computed, ref } from 'vue';

import type { IMeta } from '@/modules/dashboard-group';
import type { IMarketCapDomain } from '../api';
import { IconIds, UiIcon } from '@/shared/ui/icon';
import { ModalBadge, ModalFilterTicker } from '../../base';
import type { IModalFilterTicker, IModalFilterTickerLists, IModalFilterTickerWithGroup } from '../../base/modal/model';
import { UiImage } from '@/shared/ui/image';
import { RangeChart } from '@/modules/lightweight-charts/model';

import ChartComponent from '@/modules/lightweight-charts/ui/chart-component.vue';

interface IViewComponentProps {
	meta: IMeta;
	data: IMarketCapDomain[];
}
const props = defineProps<IViewComponentProps>();

const ACTIVE_TICKER_LIST_COUNT_SHOW = 3;


const listWithGroups = ref<{ [x: string]: IModalFilterTicker[] }>({});

props.data.forEach((item) => {
	if (!listWithGroups.value[item.type]) {
		listWithGroups.value[item.type] = [];
	}

	listWithGroups.value[item.type].push({
		image: item.srcValue,
		name: item.name,
		ticker: item.symbol,
		isSelected: false,
	});
});

const activeList = computed<IModalFilterTickerWithGroup[]>(() =>
	Object.entries(listWithGroups.value)
		.map(([group, arr]) => arr.map(item => ({ ...item, group })))
		.flat()
		.filter(item => item.isSelected)
		.slice(0, ACTIVE_TICKER_LIST_COUNT_SHOW),
);

function handleUpdateFilterTickerItem(list: IModalFilterTickerLists) {
	listWithGroups.value = list;
}
</script>

<template>
	<div :class="classes.root">

		<div>
			<modal-badge>
				<template #title>
					<div :class="classes.listFiltersTitleImageWrapper">
						<div
							v-for="item in activeList"
							:key="item.ticker"
							:class="classes.listFiltersTitleImage"
						>
							<ui-image
								:src="item.image"
								replacement="/images/market/ADA.png"
							/>
						</div>
					</div>


					<div
						v-if="
							activeList.length  ===0
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
						:model-value="listWithGroups"
						@update:model-value="handleUpdateFilterTickerItem"
					/>
				</template>
			</modal-badge>
		</div>


		<div :class="classes.chartPrices">
			<div>
				<div :class="classes.chartPrice">
					<div :class="classes.chartPriceTime">
						At Close: 0
					</div>


					<div :class="classes.chartPriceTitle">
						<div :class="classes.chartPriceTitleValue">
							$ 324
						</div>

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
						</div>
					</div>
				</div>

			</div>


			<div>
				<div :class="classes.chartPrice">
					<div :class="classes.chartPriceTime">
						After Hours
					</div>


					<div :class="classes.chartPriceTitle">
						<div :class="classes.chartPriceTitleValue">
							$ 324
						</div>

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
						</div>
					</div>
				</div>
			</div>
		</div>


		<chart-component
			:width="100"
			:disable-scroll="true"
			:is-visible-history-graph="false"
			:is-visible-indicators="false"
			:range-list="[ RangeChart['1D'], RangeChart['1W'], RangeChart['1M'], RangeChart['1Y'], RangeChart.ALL]"
			:height="320"
		/>
	</div>
</template>

<style module="classes">
.root {
	display: flex;
	flex-direction: column;
	height: 100%;
	padding: 0 16px 18px;
	overflow: hidden;
}


.chartPrices {
	display: flex;
	align-items: center;
	margin-top: 20px;
	margin-bottom: 20px;
	gap: 28px;
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
	gap: 12px;
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
</style>
