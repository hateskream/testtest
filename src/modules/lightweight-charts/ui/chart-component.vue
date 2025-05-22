<script setup lang="ts">
import {
	AreaSeries,
	ColorType,
	createChart,
	type ISeriesApi,
	LineSeries,
	type IChartApi,
	type LineData,
	type SeriesType,
	type Time,
	CandlestickSeries,
	type CandlestickData,
} from 'lightweight-charts';
import { computed, onMounted, reactive, ref, useTemplateRef, watch } from 'vue';

import { calculateSMASeriesData, generateCandleDataFromLineData, generateLineData, groupSeriesByRange } from '../utils';
import { IndicatorsChart, RangeChart, TypeChart } from '../model/chart';
import { ModalBadge, ModalBadgeList, ModalItemCheckbox, ModalItemSelector } from '@/modules/widgets/base';
import { IconIds, UiIcon } from '@/shared/ui/icon';
import { MA_SETTINGS, MAIN_AREA_SETTINGS, MAIN_CANDLESTICK_SETTINGS, RANGE_IN_SECONDS } from '../const';
import { prepareLineDataFromCandlestick, prepareSeries } from '../utils/prepare-series';

import ChartRange from '../components/chart-range.vue';

interface IChartProps {
	width: number;
	height: number;
}

const props = defineProps<IChartProps>();

defineExpose({
	regenerateData,
});


type IGroupedData = {
	[x in RangeChart]: CandlestickData[]
};

const container = useTemplateRef('container');
const history = useTemplateRef('history');
const chart = ref<IChartApi | null>();
const chartHistory = ref<IChartApi | null>();

type ICalcSeriesData = CandlestickData[];
type ICalcSeriesReturnData = CandlestickData[] | LineData[];

const indicators = reactive<
	Map<string, {
		isActive: boolean;
		series: ISeriesApi<SeriesType, Time>;
		calcSeries: (data: ICalcSeriesData, type: TypeChart) => ICalcSeriesReturnData;
	}>
>(new Map());

const currentRange = ref<RangeChart>(RangeChart.ALL);

const listTypeGraph = Object.entries(TypeChart).map(([title, val]) => ({ title, val }));

const currentTypeGraph = ref<TypeChart>(TypeChart.Line);

const mainData = ref(generateCandleDataFromLineData(generateLineData(6000)));

watch(() => mainData, () => {
	updateIndicators();
});

const groupedData = computed(() => {
	const group: IGroupedData = {} as IGroupedData;

	Object.entries(RangeChart).forEach(([key, val]) => {
		group[key as RangeChart] = groupSeriesByRange<CandlestickData>(mainData.value, RANGE_IN_SECONDS[val]);
	});

	return group;
});

const listAvailableIndicators = computed(() => {
	return Object.entries(IndicatorsChart).map(([title, val]) => ({ title, val }));
});

const listActiveIndicators = computed(() => {
	return Array.from(indicators.entries()).filter(([, item]) => item.isActive).map(([name]) => name);
});


function regenerateData() {
	mainData.value = generateCandleDataFromLineData(generateLineData(6000));
}

function selectRange(range: RangeChart) {
	currentRange.value = range;

	updateIndicators();
}

function changeVisibleIndicator(indicator: IndicatorsChart) {
	const item = indicators.get(indicator);

	if (item) {
		item.isActive = !item.isActive;

		indicators.set(indicator, item);

		item.series.applyOptions({
			visible: item.isActive,
		});
	}
}


function updateIndicators() {
	indicators.forEach(({ series, calcSeries }) => {
		series.setData(calcSeries(groupedData.value[currentRange.value], currentTypeGraph.value));
	});

	chart.value!.timeScale().fitContent();
	chartHistory.value!.timeScale().fitContent();
}

function updateTypeChart(type: TypeChart) {
	const indicator = indicators.get(IndicatorsChart.Main)!;

	currentTypeGraph.value = type;

	if (type === TypeChart.Candlestick) {
		const candleSeries = chart.value!.addSeries(CandlestickSeries, MAIN_CANDLESTICK_SETTINGS);

		indicators.set(IndicatorsChart.Main, {
			...indicator,
			series: candleSeries,
		});

		chart.value!.removeSeries(indicator.series);
	} else if (type === TypeChart.Line) {
		const areaSeries = chart.value!.addSeries(AreaSeries, MAIN_AREA_SETTINGS);

		indicators.set(IndicatorsChart.Main, {
			...indicator,
			series: areaSeries,
		});

		chart.value!.removeSeries(indicator.series);
	}

	updateIndicators();
}


onMounted(() => {
	chartHistory.value = createChart(history.value as HTMLElement, {
		width: props.width,
		height: 96,
		crosshair: {
			horzLine: {
				visible: false,
			},
			vertLine: {
				visible: false,
			},
		},
		layout: {
			textColor: '#9A9A9D',
			background: { type: ColorType.Solid, color: 'rgb(12 12 13 / 100%)' },
		},

		rightPriceScale: {
			visible: false,
		},

		grid: {
			horzLines: {
				visible: false,
			},
			vertLines: {
				color: '#37364E',
			},
		},
	});


	chart.value = createChart(container.value as HTMLElement, {
		width: props.width,
		height: props.height,
		layout: {
			textColor: '#9A9A9D',
			background: { type: ColorType.Solid, color: 'rgb(12 12 13 / 100%)' },
		},
	});


	chart.value.applyOptions({
		rightPriceScale: {
			scaleMargins: {
				top: 0.3, // leave some space for the legend
				bottom: 0.25,
			},
		},
		// hide the grid lines
		grid: {
			vertLines: {
				visible: false,
			},
			horzLines: {
				visible: false,
			},
		},
	});


	chart.value!.timeScale().applyOptions({
		borderColor: 'rgba(4, 237, 160, 0.00)',
	});


	indicators.set('history',
		{
			series: chartHistory.value!.addSeries(AreaSeries, {
				topColor: 'rgba(28, 42, 78, 0.35)',
				bottomColor: 'rgba(4, 237, 160, 0.00)',
				lineColor: '#6F81A9',
				lineWidth: 2,
				crosshairMarkerVisible: false,
			}),
			isActive: true,
			calcSeries(data: ICalcSeriesData) {
				return prepareSeries(data, 'Line');
			},
		},
	);


	indicators.set(IndicatorsChart.Main,
		{
			series: chart.value!.addSeries(AreaSeries, MAIN_AREA_SETTINGS),
			isActive: true,
			calcSeries(data: ICalcSeriesData, type: TypeChart) {
				return prepareSeries(data, type);
			},
		},
	);

	indicators.set(IndicatorsChart.SMA,
		{
			series: chart.value!.addSeries(LineSeries, MA_SETTINGS),
			isActive: false,
			calcSeries(data: ICalcSeriesData) {
				return calculateSMASeriesData(prepareLineDataFromCandlestick(data));
			},
		},
	);


	updateIndicators();

	function syncVisibleRange(sourceChart: IChartApi, targetChart: IChartApi) {
		// const debounceUpdate = useDebounceFn((c: IChartApi, range: LogicalRange) => {
		// 	if (range ) {
		// 		c.timeScale().setVisibleLogicalRange(range);
		// 	}
		// }, 150);

		sourceChart.timeScale().subscribeVisibleLogicalRangeChange(range => {
			if (range ) {
				// debounceUpdate(targetChart, range);
				targetChart.timeScale().setVisibleLogicalRange(range);
			}
		});
	}

	syncVisibleRange(chartHistory.value, chart.value);
	syncVisibleRange(chart.value, chartHistory.value);
});


</script>

<template>
	<div>

		<div :class="classes.instuments">
			<modal-badge style="margin-bottom: 10px;">
				<template #title>
					Indicators

					<ui-icon
						:id="IconIds.DropdownDown"
						width="12"
						height="12"
					/>
				</template>

				<template #content>
					<modal-badge-list>
						<template #title>
							Indicators
						</template>

						<modal-item-checkbox
							v-for="item in listAvailableIndicators"
							:key="item.title"
							:model-value="listActiveIndicators.includes(item.val)"
							@update:model-value="changeVisibleIndicator(item.val)"
						>
							{{ item.title }}
						</modal-item-checkbox>
					</modal-badge-list>
				</template>
			</modal-badge>

			<modal-badge style="margin-bottom: 10px;">
				<template #title>
					Type

					<ui-icon
						:id="IconIds.DropdownDown"
						width="12"
						height="12"
					/>
				</template>

				<template #content>
					<modal-badge-list>
						<template #title>
							Type
						</template>

						<modal-item-selector
							v-for="item in listTypeGraph"
							:key="item.title"
							:model-value="currentTypeGraph === item.val"
							@update:model-value="updateTypeChart(item.val)"
						>
							{{ item.title }}
						</modal-item-selector>
					</modal-badge-list>
				</template>
			</modal-badge>
		</div>

		<div ref="container" style=" width: 100%; height: 100%;"></div>

		<chart-range
			style="margin-top: 10px; margin-bottom: 10px;"
			:active-range="currentRange"
			@select="selectRange"
		/>

		<div ref="history" style=" width: 100%; height: 100%;"></div>
	</div>
</template>

<style module="classes">
.instuments {
	display: flex;
	gap: 4px;
	align-items: center;
}

:global(a#tv-attr-logo) {
	display: none !important;
}
</style>
