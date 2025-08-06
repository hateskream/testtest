<script setup lang="ts">
import { ref } from 'vue';

import { type IChartUpdateEmitData } from '@/modules/lightweight-charts/model';
import { IconIds, UiIcon } from '@/shared/ui/icon';
import type { IMeta } from '@/modules/dashboard-group/core';
import { RangeChart } from '@/shared/ui/chart-range';

import ChartComponent from '@/modules/lightweight-charts/ui/chart-component.vue';

interface ICellComponentProps {
	meta: IMeta;
}

defineProps<ICellComponentProps>();

const currentPrice = ref<IChartUpdateEmitData>({
	value: 0,
	time: new Date(),
});

function handleUpdateData(data: IChartUpdateEmitData) {
	currentPrice.value = data;
}
</script>

<template>
	<div :class="classes.root">
		<div :class="classes.chartPrices">


			<div>
				<div :class="classes.chartPrice">
					<div :class="classes.chartPriceTime">
						At Close: {{ currentPrice.time.toUTCString() }}
					</div>


					<div :class="classes.chartPriceTitle">
						<div :class="classes.chartPriceTitleValue">
							$ {{ currentPrice.value.toFixed(2) }}
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
							$ {{ (+currentPrice.value + 5).toFixed(2) }}
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
			:width="210"
			:height="230"
			:is-visible-history-graph="false"
			:disable-scroll="false"
			:is-visible-indicators="false"
			:range-list="[ RangeChart['1D'], RangeChart['1W'], RangeChart['1M'], RangeChart['1Y'], RangeChart.ALL]"
			@update="handleUpdateData"
		/>
	</div>
</template>

<style module="classes">
.root {
	padding: 10px 8px 10px 16px;
}

.chartPriceTitleChangeIcon {
	display: flex;
	justify-content: center;
	align-items: center;
	color: rgb(4 237 160 / 100%);
}

.chartPrice {
	min-width: 210px;
}

.chartPrices {
	display: flex;
	align-items: center;
	margin-top: 12px;
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
</style>
