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
	type LogicalRangeChangeEventHandler,
} from 'lightweight-charts';
import { computed, onMounted, reactive, ref, useTemplateRef, watch } from 'vue';

import { calculateSMASeriesData, generateCandleDataFromLineData, generateLineData, groupSeriesByRange } from '../utils';
import { IndicatorsChart, RangeChart, TypeChart, type IChartUpdateEmitData } from '../model/chart';
import { ModalBadge, ModalBadgeList, ModalItemCheckbox, ModalItemSelector } from '@/modules/widgets/base';
import { IconIds, UiIcon } from '@/shared/ui/icon';
import { MA_SETTINGS, MAIN_AREA_SETTINGS, MAIN_CANDLESTICK_SETTINGS, RANGE_IN_SECONDS } from '../const';
import { prepareLineDataFromCandlestick, prepareSeries } from '../utils/prepare-series';

import ChartRange from '../components/chart-range.vue';

interface IChartProps {
	width: number;
	height: number;
	disableScroll: boolean;
	isVisibleHistoryGraph?:boolean;
	rangeList: RangeChart[];
	isVisibleIndicators?: boolean;
}

const props = withDefaults(defineProps<IChartProps>(), {
	isVisibleHistoryGraph: true,
	isVisibleIndicators: true,
});

defineExpose({
	regenerateData,
});

interface IChartEmits {
	(e: 'update', data: IChartUpdateEmitData): void;
}

const emits = defineEmits<IChartEmits>();

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

const handlerSubscribeVisibleLogicalRangeChangeHistory: LogicalRangeChangeEventHandler = range => {
	if (range) {
		// debounceUpdate(targetChart, range);
		chartHistory.value?.timeScale().setVisibleLogicalRange(range);
	}
};

const handlerSubscribeVisibleLogicalRangeChange: LogicalRangeChangeEventHandler = range => {
	if (range) {
		// debounceUpdate(targetChart, range);
		chart.value?.timeScale().setVisibleLogicalRange(range);
	}
};

const currentRange = ref<RangeChart>(props.rangeList[props.rangeList.length - 1]);

const listTypeGraph = Object.entries(TypeChart).map(([title, val]) => ({ title, val }));

const currentTypeGraph = ref<TypeChart>(TypeChart.Line);

const mainData = ref(generateCandleDataFromLineData(generateLineData(4000)));

watch(mainData, () => {
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
	mainData.value = generateCandleDataFromLineData(generateLineData(4000));
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
	chartHistory.value?.timeScale()?.fitContent?.();

	emits('update', {
		value: mainData.value[mainData.value.length - 1].close,
		time: new Date(mainData.value[mainData.value.length - 1].time as number * 1000),
	});
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


function updateHistoryChartPropChange() {
	if (props.isVisibleHistoryGraph) {
		if (!chartHistory.value) {
			chartHistory.value = createChart(history.value as HTMLElement, {
				autoSize: true,
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
					scaleMargins: {
						top: 0.3, // leave some space for the legend
						bottom: 0.25,
					},


					minimumWidth: 55,

					borderVisible: false,
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
		}

		chartHistory.value.timeScale()
			.subscribeVisibleLogicalRangeChange(handlerSubscribeVisibleLogicalRangeChange);
		chart.value!.timeScale()
			.subscribeVisibleLogicalRangeChange(handlerSubscribeVisibleLogicalRangeChangeHistory);
	} else {
		chartHistory.value?.timeScale?.()
			.unsubscribeVisibleLogicalRangeChange(handlerSubscribeVisibleLogicalRangeChange);
		chart.value!.timeScale()
			.subscribeVisibleLogicalRangeChange(handlerSubscribeVisibleLogicalRangeChangeHistory);

		chartHistory.value?.remove?.();

	}

	updateIndicators();
}

watch(() => props.isVisibleHistoryGraph, updateHistoryChartPropChange);


onMounted(() => {
	chart.value = createChart(container.value as HTMLElement, {
		autoSize: true,
		layout: {
			textColor: '#9A9A9D',
			background: { type: ColorType.Solid, color: 'rgb(12 12 13 / 100%)' },
		},
		rightPriceScale: {
			scaleMargins: {
				top: 0.3, // leave some space for the legend
				bottom: 0.25,
			},

			minimumWidth: 55,
			borderVisible: false,
		},

		handleScale: !props.disableScroll,

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

	updateHistoryChartPropChange();
});


</script>

<template>
	<div :class="classes.wrapper" :style="{height: `${height}px`}">
		<div v-if="isVisibleIndicators" :class="classes.instruments">
			<modal-badge>
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

			<modal-badge>
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

		<div ref="container" :class="classes.mainChart"></div>

		<chart-range
			:class="classes.range"
			:active-range="currentRange"
			:list="rangeList"
			@select="selectRange"
		/>

		<div
			ref="history"
			:class="classes.chartHistory"
			:style="{ display: !!chartHistory ? 'block' : 'none'  }"
		></div>
	</div>
</template>

<style module="classes">
.wrapper {
	display: flex;
	flex-direction: column;
	width: 100%;
}

.mainChart {
	flex-grow: 1;
	width: 100%;
	height: v-bind(`${chartHistory ? 'calc(100% - 180px)' : '100%'}`);
}

.chartHistory {
	flex-grow: 1;
	width: 100%;
	height: 100%;
}

.range {
	margin-top: 10px;
	margin-bottom: 10px;
}

.instruments {
	display: flex;
	gap: 4px;
	align-items: center;
	margin-bottom: 10px;
}

:global(a#tv-attr-logo) {
	display: none !important;
}
</style>
