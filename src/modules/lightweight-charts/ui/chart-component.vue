<script setup lang="ts">
import { computed, type CSSProperties, reactive, useTemplateRef } from 'vue';
import { CrosshairMode, LineStyle } from 'lightweight-charts';
import type { CandlestickData, ChartClickData, ChartData, ChartType, LineData } from '@shared/component-library';
import {
	LastPriceAnimationMode,
	type LastPriceAnimationMode as LastPriceAnimationModeType,
} from '@shared/component-library';
import { notNullish, unrefElement } from '@vueuse/core';

import {
	chartTimeToDate,
	formatPrice,
	type IChartTimelineSegment,
	isCandlestickData,
	type SharedChartMouseEvent,
	timeToZonedTime,
	TimezoneUtc,
	timezoneUtcToIntl,
	type UtcSeconds,
	zonedTimeToTime,
} from '../model';
import type { IUseExternalTooltipState } from '../composables';
import type { ICalendarEvent } from '@/modules/calendar';
import { ChartExternalTooltip } from './external-tooltip';
import {
	calcNumberPrecision,
	CURRENT_LOCALE,
	FALLBACK_LOCALE,
	getDateFormatter,
	isFeatureEnabled,
	isNumber,
} from '@/shared/lib';
import type { TimezoneUtcType } from '@/modules/lightweight-charts/model';

interface IChartProps {
	height: CSSProperties['height'];
	handleScale?: boolean;
	handleScroll?: boolean;
	isVisiblePriceScale?: boolean;
	isVisibleTimeScale?: boolean;
	isVisibleEventsTimeline?: boolean;
	eventsTimelinePadding?: CSSProperties['padding'];
	fadeLeft?: boolean;
	isShowTooltip?: boolean;
	isVisiblePriceLine?: boolean;
	colorSchema?: 'positive' | 'negative' | 'neutral';
	crosshairMode?: CrosshairMode;
	rightOffsetPixels?: number;
	events?: ICalendarEvent[];
	timelineSegments?: IChartTimelineSegment[];
	data: ChartData[];
	lastPriceAnimation?: LastPriceAnimationModeType;
	priceLabel?: string;
	locale?: string | null;
	displayVariant?: 'new' | 'default';
	prevClosePrice?: number | null;
	prevClosePriceLabel?: string;
	type?: ChartType;
	showInstruments?: boolean;
	timezone?: TimezoneUtcType;
}

const props = withDefaults(defineProps<IChartProps>(), {
	isVisiblePriceScale: true,
	isVisibleTimeScale: true,
	isVisiblePriceLine: true,
	colorSchema: 'positive',
	crosshairMode: CrosshairMode.Normal,
	rightOffsetPixels: 0,
	events: () => [],
	timelineSegments: () => [],
	eventsTimelinePadding: '0px',
	lastPriceAnimation: LastPriceAnimationMode.Disabled,
	priceLabel: 'Current Price',
	locale: null,
	displayVariant: 'new',
	prevClosePrice: null,
	prevClosePriceLabel: 'Prev Close',
	type: 'area',
	timezone: TimezoneUtc.UTC0,
});

interface IChartEmits {
	(e: 'chart-hover', event: SharedChartMouseEvent): void;
}

const emit = defineEmits<IChartEmits>();

interface ISharedChartElement extends HTMLElement {
	takeScreenshot(addTopLayer?: boolean, includeCrosshair?: boolean): HTMLCanvasElement | null;
}

const container = useTemplateRef<ISharedChartElement>('container');

const heightInPx = computed(() => {
	if (isNumber(props.height)) {
		return `${props.height}px`;
	}

	return props.height;
});

// data

const preparedChartData = computed(() => {
	if (props.data.length === 0) {
		return props.data;
	}

	const timezoneValue = props.timezone;

	if (props.type === 'candlestick') {
		return (props.data as CandlestickData[]).map(candle => {
			return {
				...candle,
				time: timeToZonedTime(candle.time, timezoneValue),
			};
		});
	}

	if (isCandlestickData(props.data[0])) {
		return (props.data as CandlestickData[]).map(candle => {
			return {
				time: timeToZonedTime(candle.time, timezoneValue),
				value: candle.close,
			} as LineData;
		});
	}

	return (props.data as LineData[]).map(point => {
		return { value: point.value, time: timeToZonedTime(point.time, timezoneValue) };
	});
});

const preparedPriceLines = computed(() => {
	if (!props.isVisiblePriceLine || props.data.length === 0) {
		return [];
	}

	const lastPoint = preparedChartData.value[preparedChartData.value.length - 1];
	const price = isCandlestickData(lastPoint) ? lastPoint.close : lastPoint.value;

	const lines = [{
		price,
		color: props.colorSchema === 'positive' ? '#04EDA0' : '#FC1D4D',
		lineWidth: 2,
		lineStyle: LineStyle.Dashed,
		axisLabelVisible: true,
		title: props.priceLabel,
		axisLabelColor: props.colorSchema === 'positive' ? '#043222' : '#35040D',
		axisLabelTextColor: props.colorSchema === 'positive' ? '#04EDA0' : '#FC4A6B',
	}];

	if (notNullish(props.prevClosePrice)) {
		lines.push({
			price: props.prevClosePrice,
			color: '#FFFFFF7F',
			lineWidth: 2,
			lineStyle: LineStyle.Dashed,
			axisLabelVisible: true,
			title: props.prevClosePriceLabel,
			axisLabelColor: '#2d2d31',
			axisLabelTextColor: '#FFF',
		});
	}

	return lines;
});

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

const tooltipDateFormatter = computed(() => {
	return getDateFormatter({
		timeZone: timezoneUtcToIntl(props.timezone),
		month: 'short',
		day: 'numeric',
		year: 'numeric',
		hour: 'numeric',
		minute: '2-digit',
		hour12: true,
	});
});

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

	const time = zonedTimeToTime(segment.time as UtcSeconds, props.timezone);
	const date = chartTimeToDate(time);

	tooltipState.title = [tooltipDateFormatter.value.format(date)];

	tooltipState.rows[0] = {
		text: 'Price',
		value: `$${formatPrice(state.value)}`,
		color: tooltipRowColor.value,
	};

	tooltipState.visible = true;
}

function onChartHover(event: SharedChartMouseEvent) {
	emit('chart-hover', event);

	if (props.isShowTooltip) {
		updateTooltipState(event.detail[0]);
	}
}

// locale

const localeIsEnabled = isFeatureEnabled('DATE_FORMAT_LOCALIZATION');

const chartLocale = computed(() => {
	if (props.locale) {
		return props.locale;
	}

	if (localeIsEnabled) {
		return CURRENT_LOCALE;
	}

	return FALLBACK_LOCALE;
});

// precision

const minDatasetValue = computed(() => {
	return preparedChartData.value.reduce((min, point) => {
		if (isCandlestickData(point)) {
			return Math.min(min, point.low);
		}

		return Math.min(min, point.value);
	}, 1_000_000);
});

const lastDatasetValue = computed(() => {
	if (props.data.length === 0) {
		return null;
	}

	const lastPoint = preparedChartData.value[preparedChartData.value.length - 1];

	if (isCandlestickData(lastPoint)) {
		return lastPoint.low;
	}

	return lastPoint.value;
});

const chartPrecision = computed(() => {
	const current = lastDatasetValue.value;
	const prevClose = props.prevClosePrice;

	if (notNullish(prevClose) && notNullish(current)) {
		return calcNumberPrecision(Math.abs(current - prevClose));
	}

	return calcNumberPrecision(minDatasetValue.value);
});

function takeScreenshot(addTopLayer?: boolean, includeCrosshair?: boolean) {
	if (container.value) {
		return container.value.takeScreenshot(addTopLayer, includeCrosshair);
	}

	return null;
}

defineExpose({ takeScreenshot });

function onWheel(e: WheelEvent) {
	if (props.handleScale) {
		e.preventDefault();
		e.stopPropagation();
	}
}
</script>

<template>
	<div :class="classes.wrapper" :style="{ height: heightInPx }">
		<div :class="classes.mainChart">
			<i88-chart
				v-if="props.data.length"
				ref="container"
				:data="preparedChartData"
				:type="props.type"
				:auto-size="true"
				:color-scheme="props.colorSchema"
				:show-price-scale="props.isVisiblePriceScale"
				:show-time-scale="props.isVisibleTimeScale"
				:price-visible="false"
				:crosshair-mode="props.crosshairMode"
				:right-offset-pixels="props.rightOffsetPixels"
				:fade-left="props.fadeLeft"
				:last-price-animation="props.lastPriceAnimation"
				:price-lines="preparedPriceLines"
				:locale="chartLocale"
				entire-text-only-price-scale
				:precision="chartPrecision"
				:handle-scale="props.handleScale"
				:handle-scroll="props.handleScroll"
				@chart-hover="onChartHover"
				@wheel.prevent="onWheel"
			/>
		</div>
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

:global(a#tv-attr-logo) {
	display: none !important;
}
</style>
