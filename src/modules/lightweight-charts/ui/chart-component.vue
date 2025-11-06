<script setup lang="ts">
import type { CSSProperties } from 'vue';
import { computed, nextTick, onMounted, reactive, ref, useTemplateRef, watch } from 'vue';
import {
	AreaSeries,
	type CandlestickData,
	CandlestickSeries,
	ColorType,
	createChart,
	type IChartApi,
	type ISeriesApi,
	type LineData,
	LineSeries,
	type LogicalRangeChangeEventHandler,
	type SeriesType,
	type Time,
} from 'lightweight-charts';
import type { ChartType } from '@shared/component-library';

import {
	calculateSMASeriesData,
	convertTime,
	generateCandleDataFromLineData,
	generateLineData,
	groupSeriesByRange,
} from '../utils';
import {
	type IChartUpdateEmitData,
	IndicatorsChart,
	type ISharedChartMouseEventDetails,
	type SharedChartMouseEvent,
	TypeChart,
} from '../model/chart';
import { ModalBadge, ModalBadgeList, ModalItemCheckbox, ModalItemSelector } from '@/modules/widgets/base';
import { IconIds, UiIcon } from '@/shared/ui/icon';
import { MA_SETTINGS, MAIN_AREA_SETTINGS, MAIN_CANDLESTICK_SETTINGS } from '../const';
import { prepareLineDataFromCandlestick, prepareSeries } from '../utils/prepare-series';
import { RANGE_IN_SECONDS, RangeChart } from '@/shared/ui/chart-range';
import { ChartExternalTooltip } from '@/modules/lightweight-charts';
import type { IUseExternalTooltipState } from '@/modules/lightweight-charts/composables';

import ChartRange from '@/shared/ui/chart-range/chart-range.vue';

interface IChartProps {
	width: CSSProperties['width'];
	height: CSSProperties['height'];
	disableScroll: boolean;
	isVisibleHistoryGraph?:boolean;
	rangeList: RangeChart[];
	isVisibleIndicators?: boolean;
	isVisibleRange?: boolean;
	isVisibleRangeChange?: boolean;
	isVisiblePriceScale?: boolean;
	isVisibleTimeScale?: boolean;
	isShowTooltip?: boolean;
	isPaddedRange?: boolean;
	colorSchema?: 'positive' | 'negative';
}

const props = withDefaults(defineProps<IChartProps>(), {
	isVisibleHistoryGraph: true,
	isVisibleIndicators: true,
	isVisibleRange: true,
	isVisibleRangeChange: true,
	isVisiblePriceScale: true,
	isVisibleTimeScale: true,
	isPaddedRange: false,
	colorSchema: 'positive',
});

defineExpose({
	regenerateData,
});

interface IChartEmits {
	(e: 'update', data: IChartUpdateEmitData): void;
	(e: 'chart-hover', event: SharedChartMouseEvent): void;
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

const modelValueRange = defineModel<RangeChart>('range');

const currentRange = computed({
	get: () => modelValueRange.value ?? props.rangeList[props.rangeList.length - 1],
	set: (value) => {
		modelValueRange.value = value;
	},
});


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

const styleRoot = computed(() => {
	if (typeof props.height === 'number') {
		return {
			height: `${props.height}px`,
		};
	}

	return {
		height: props.height,
	};
});

const styleMainChart = computed(() => {
	let otherElHeight = 0;

	if (props.isVisibleRange) {
		otherElHeight += 50;
	}

	if (chartHistory.value) {
		otherElHeight += 180;
	}

	return {
		height: `calc(100% - ${otherElHeight}px)`,
	};
});

const preparedChartData = computed(() => {
	const data = groupedData.value[currentRange.value];

	if (currentTypeGraph.value === TypeChart.Candlestick) {
		return data;
	} else {
		return data.map(item => ({
			time: item.time,
			value: item.close,
		}));
	}
});

const chartTypeForWebComponent = computed<ChartType>(() => {
	if (currentTypeGraph.value === TypeChart.Candlestick) {
		return 'candlestick';
	} else if (currentTypeGraph.value === TypeChart.Line) {
		return 'area';
	} else {
		return 'area';
	}
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
						top: 0.3,
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

// tooltip

const tooltipState = reactive<IUseExternalTooltipState>({
	x: 0,
	y: 0,
	padding: 10,
	visible: false,
	title: [],
	rows: [],
});

const tooltipRowColor = computed(() => props.colorSchema === 'positive'
	? 'var(--metrics-color-positive-chart)'
	: 'var(--metrics-color-negative-chart)',
);

function updateTooltipState(state: ISharedChartMouseEventDetails | null) {
	if (!state || !container.value) {
		tooltipState.visible = false;
		return;
	}

	const segment = groupedData.value[currentRange.value].find(sgm => sgm.time === state.time);

	if (!segment) {
		tooltipState.visible = false;
		return;
	}

	const rect = (container.value as HTMLElement).getBoundingClientRect();

	tooltipState.x = rect.left + state.x;
	tooltipState.y = rect.top + state.y + 20;

	const time = convertTime(segment.time);

	tooltipState.title = [
		(new Date(time)).toLocaleString(undefined, {
			month: 'short',
			day: 'numeric',
			year: 'numeric',
			hour: 'numeric',
			minute: '2-digit',
			hour12: true,
		}),
	];

	tooltipState.rows[0] = {
		text: 'Price',
		value: state.value.toString(),
		color: tooltipRowColor.value,
	};

	tooltipState.visible = true;
}

function onChartHover(event: SharedChartMouseEvent) {
	emits('chart-hover', event);

	if (props.isShowTooltip) {
		updateTooltipState(event.detail[0]);
	}
}

// build chart

onMounted(async () => {
	await nextTick();

	chart.value = createChart(container.value as HTMLElement, {
		autoSize: true,
		layout: {
			textColor: '#9A9A9D',
		},

		rightPriceScale: {
			scaleMargins: {
				top: 0.3,
				bottom: 0.25,
			},
			minimumWidth: 55,
			borderVisible: false,
		},

		handleScale: !props.disableScroll,

		timeScale: {
			borderVisible: false,
			timeVisible: true,
			secondsVisible: false,
		},

		grid: {
			vertLines: {
				visible: false,
			},
			horzLines: {
				visible: false,
			},
		},

		crosshair: {
			mode: 1,
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
	<div
		:class="classes.wrapper"
		:style="styleRoot"
	>
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
		<div
			:class="classes.mainChart"
			:style="styleMainChart"
		>
			<i88-chart
				ref="container"
				:data="preparedChartData"
				:type="chartTypeForWebComponent"
				:auto-size="true"
				:color-scheme="props.colorSchema"
				:show-price-scale="props.isVisiblePriceScale"
				:show-time-scale="props.isVisibleTimeScale"
				@chart-hover="onChartHover"
			/>
		</div>
		<chart-range
			v-if="isVisibleRange"
			:class="[classes.range, {[classes.padded]: props.isPaddedRange}]"
			:active-range="currentRange"
			:list="rangeList"
			:disable-change="!isVisibleRangeChange"
			@select="selectRange"
		/>
		<div
			ref="history"
			:class="classes.chartHistory"
			:style="{ display: !!chartHistory ? 'block' : 'none'  }"
		></div>
		<teleport v-if="isShowTooltip" to="body">
			<chart-external-tooltip v-bind="tooltipState">
				<template v-if="$slots.tooltipContent" #content="contentProps">
					<slot name="tooltipContent" v-bind="contentProps" />
				</template>
			</chart-external-tooltip>
		</teleport>
	</div>
</template>

<style module="classes">
.wrapper {
	display: flex;
	flex-direction: column;
	width: 100%;
	height: 100%;
}

.mainChart {
	width: 100%;
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

.range.padded {
	margin-left: 10px;
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
