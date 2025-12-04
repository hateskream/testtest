<script setup lang="ts">
import { computed, type CSSProperties, nextTick, onMounted, reactive, ref, useTemplateRef, watch } from 'vue';
import {
	AreaSeries,
	type CandlestickData,
	CandlestickSeries,
	ColorType,
	createChart,
	CrosshairMode,
	type IChartApi,
	type ISeriesApi,
	type LineData,
	LineSeries,
	type LogicalRangeChangeEventHandler,
	type SeriesType,
	type Time,
} from 'lightweight-charts';
import type { ChartClickData, ChartData, ChartType } from '@shared/component-library';
import {
	LastPriceAnimationMode,
	type LastPriceAnimationMode as LastPriceAnimationModeType,
} from '@shared/component-library';
import { unrefElement } from '@vueuse/core';

import {
	calculateSMASeriesData,
	generateCandleDataFromLineData,
	generateLineData,
	groupSeriesByRange,
	prepareLineDataFromCandlestick,
	prepareSeries,
} from '../utils';
import type { IChartTimelineSegment, IChartUpdateEmitData, SharedChartMouseEvent } from '../model';
import { IndicatorsChart, TypeChart } from '../model';
import type { IUseExternalTooltipState } from '../composables';
import { MA_SETTINGS, MAIN_AREA_SETTINGS, MAIN_CANDLESTICK_SETTINGS } from '../const';
import { ModalBadge, ModalBadgeList, ModalItemCheckbox, ModalItemSelector } from '@/modules/widgets/base';
import { IconIds, UiIcon } from '@/shared/ui/icon';
import { getChartRangeOffset, RANGE_IN_SECONDS, RangeChart } from '@/shared/ui/chart-range';
import type { ICalendarEvent } from '@/modules/calendar';
import { ChartExternalTooltip } from './external-tooltip';
import { ChartEvents } from './events';
import { ChartTimeline } from './timeline';

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
	isVisibleEventsTimeline?: boolean;
	eventsTimelinePadding?: CSSProperties['padding'];
	fadeLeft?: boolean;
	isShowTooltip?: boolean;
	isVisiblePriceLine?: boolean;
	colorSchema?: 'positive' | 'negative' | 'neutral';
	crosshairMode?: CrosshairMode;
	priceVisible?: boolean;
	rightOffsetPixels?: number;
	events?: ICalendarEvent[];
	timelineSegments?: IChartTimelineSegment[];
	data?: ChartData[] | null;
	lastPriceAnimation?: LastPriceAnimationModeType;
}

const props = withDefaults(defineProps<IChartProps>(), {
	isVisibleHistoryGraph: true,
	isVisibleIndicators: true,
	isVisibleRange: true,
	isVisibleRangeChange: true,
	isVisiblePriceScale: true,
	isVisibleTimeScale: true,
	isVisiblePriceLine: true,
	colorSchema: 'positive',
	crosshairMode: CrosshairMode.Normal,
	priceVisible: true,
	rightOffsetPixels: 0,
	events: () => [],
	timelineSegments: () => [],
	eventsTimelinePadding: '0px',
	lastPriceAnimation: LastPriceAnimationMode.Disabled,
	data: null,
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

const container = useTemplateRef<HTMLElement>('container');
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
		// chartHistory.value?.timeScale().setVisibleLogicalRange(range);
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

const currentRangeOffset = computed(() => getChartRangeOffset(currentRange.value));
const currentRangeStartTime = computed(() => currentRangeOffset.value.from.getTime());
const currentRangeEndTime = computed(() => currentRangeOffset.value.to.getTime());


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

const preparedChartData = computed(() => {
	if (props.data) {
		return props.data;
	}

	const data = groupedData.value[currentRange.value];

	if (currentTypeGraph.value === TypeChart.Candlestick) {
		return data as ChartData[];
	} else {
		return data.map(item => ({
			time: item.time,
			value: item.close,
		})) as ChartData[];
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
	// chartHistory.value?.timeScale()?.fitContent?.();

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
					visible: false,
				},
				timeScale: {
					borderVisible: false,
				},
				grid: {
					horzLines: {
						visible: false,
					},
					vertLines: {
						color: '#37364E',
						visible: false,
					},
				},
				handleScale: false,
				handleScroll: false,
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

		// chartHistory.value?.remove?.();

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
	: 'var(--metrics-color-negative-chart)');

function updateTooltipState(state: ChartClickData | null) {
	if (!state || !container.value) {
		tooltipState.visible = false;
		return;
	}

	const segment = preparedChartData.value.find(sgm => sgm.time === state.time);

	if (!segment) {
		tooltipState.visible = false;
		return;
	}

	const rect = unrefElement(container)!.getBoundingClientRect();

	tooltipState.x = rect.left + state.x;
	tooltipState.y = rect.top + state.y + 20;

	tooltipState.title = [
		(new Date(segment.time)).toLocaleString(undefined, {
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

	if (!container.value) {
		return;
	}

	chart.value = createChart(unrefElement(container)!, {
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
					<modal-badge-list display-variant="default">
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
					<modal-badge-list display-variant="default">
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
		<div :class="classes.mainChart">
			<i88-chart
				ref="container"
				:data="preparedChartData"
				:type="chartTypeForWebComponent"
				:auto-size="true"
				:color-scheme="props.colorSchema"
				:show-price-scale="props.isVisiblePriceScale"
				:show-time-scale="props.isVisibleTimeScale"
				:price-visible="props.isVisiblePriceLine && props.priceVisible"
				:crosshair-mode="props.crosshairMode"
				:right-offset-pixels="props.rightOffsetPixels"
				:fade-left="props.fadeLeft"
				:last-price-animation="props.lastPriceAnimation"
				@chart-hover="onChartHover"
			/>
		</div>
		<div
			v-if="isVisibleEventsTimeline"
			:class="classes.events"
			:style="{ padding: eventsTimelinePadding }"
		>
			<chart-events
				v-if="props.events.length"
				:start-time="currentRangeStartTime"
				:end-time="currentRangeEndTime"
				:events="props.events"
			/>
			<chart-timeline
				:start-time="currentRangeStartTime"
				:end-time="currentRangeEndTime"
				:segments="props.timelineSegments"
			/>
		</div>
		<div v-if="isVisibleRange" :class="classes.rangeWrapper">
			<chart-range
				:active-range="currentRange"
				:list="rangeList"
				:disable-change="!isVisibleRangeChange"
				@select="selectRange"
			/>
		</div>
		<div
			v-if="isVisibleHistoryGraph"
			ref="history"
			:class="classes.chartHistory"
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
	min-height: 0;
}

.mainChart {
	flex: 1 1 auto;
	width: 100%;
	height: 100%;
	min-height: 0;
}

.chartHistory {
	display: block;
	width: 100%;
	height: 80px;
	min-height: 0;
}

.rangeWrapper {
	flex-shrink: 0;
	margin-top: 10px;
	margin-bottom: 10px;
	overflow-x: auto;
	-ms-overflow-style: none;
	scrollbar-width: none;
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

.events {
	display: flex;
	flex-shrink: 0;
	flex-direction: column;
	min-height: 0;
	margin-top: 5px;
	gap: 5px;
}
</style>
