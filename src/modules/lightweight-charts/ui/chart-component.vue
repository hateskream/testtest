<script setup lang="ts">
import { computed, type CSSProperties, reactive, ref, useTemplateRef } from 'vue';
import { CrosshairMode, LineStyle } from 'lightweight-charts';
import type { CandlestickData, ChartClickData, ChartData, ChartType, LineData } from '@shared/component-library';
import {
	LastPriceAnimationMode,
	type LastPriceAnimationMode as LastPriceAnimationModeType,
} from '@shared/component-library';
import { notNullish, unrefElement } from '@vueuse/core';

import {
	chartTimeToDate,
	type DateRangePresetType,
	type DateRangePresetValue,
	type DateRangeValue,
	formatPrice,
	getDateRangePresetLabel,
	type IChartTimelineSegment,
	isCandlestickData,
	type SharedChartMouseEvent,
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
import { ModalBadgeFilter } from '@/modules/widgets/base';
import { IconIds } from '@/shared/ui/icon';
import type { IFilterOption } from '@/modules/widgets/base/modal/model';
import { UiDelimiter } from '@/shared/ui/delimiter';
import { UiControlIcon } from '@/shared/ui/control-icon';

interface IChartProps {
	height: CSSProperties['height'];
	handleScale?: boolean;
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
	canSwitchType?: boolean;
	dateRangePresets?: DateRangePresetValue[];
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
	dateRangePresets: () => [],
});

interface IChartEmits {
	(e: 'chart-hover', event: SharedChartMouseEvent): void;
}

const emit = defineEmits<IChartEmits>();

const container = useTemplateRef<HTMLElement>('container');

const heightInPx = computed(() => {
	if (isNumber(props.height)) {
		return `${props.height}px`;
	}

	return props.height;
});

// filters

const ChartTypeFilters = [
	{ label: 'Candlestick', value: 'candlestick' },
	{ label: 'Line', value: 'area' },
] as const satisfies IFilterOption<string>[];

const chartType = ref<ChartType>(props.type);

const chartTypeTitle = computed(() => {
	if (chartType.value === 'candlestick') {
		return 'Candlestick';
	}

	return 'Line';
});

const DateRangePresetFilters = computed(() => {
	return props.dateRangePresets.map(preset => ({
		label: getDateRangePresetLabel(preset.preset),
		value: preset.preset,
	})) satisfies IFilterOption<string>[];
});

const dateRange = defineModel<DateRangeValue>('dateRange');

function selectDateRange(preset: DateRangePresetType) {
	dateRange.value = props.dateRangePresets.find(it => it.preset === preset);
}

const selectedDateRangePreset = computed(() => {
	if (!dateRange.value) {
		return undefined;
	}

	if (dateRange.value.type === 'preset') {
		return dateRange.value.preset;
	}

	return undefined;
});

const dateRangeTitle = computed(() => {
	const range = dateRange.value;

	if (!range) {
		return 'Range';
	}

	if (range.type === 'preset') {
		return `${getDateRangePresetLabel(range.preset)} range`;
	}

	return 'Custom range';
});

// data

const preparedChartData = computed(() => {
	if (props.data.length === 0) {
		return props.data;
	}

	if (chartType.value === 'candlestick') {
		return props.data as CandlestickData[];
	}

	const point = props.data[0];

	if (isCandlestickData(point)) {
		return (props.data as CandlestickData[])
			.map(candle => ({ time: candle.time, value: candle.close })) as LineData[];
	}

	return props.data as LineData[];
});

const preparedPriceLines = computed(() => {
	if (!props.isVisiblePriceLine) {
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

// function updateHistoryChartPropChange() {
// chartHistory.value = createChart(history.value as HTMLElement, {
// 	autoSize: true,
// 	crosshair: {
// 		horzLine: {
// 			visible: false,
// 		},
// 		vertLine: {
// 			visible: false,
// 		},
// 	},
// 	layout: {
// 		textColor: '#9A9A9D',
// 		background: { type: ColorType.Solid, color: 'rgb(12 12 13 / 100%)' },
// 	},
// 	rightPriceScale: {
// 		visible: false,
// 	},
// 	timeScale: {
// 		borderVisible: false,
// 	},
// 	grid: {
// 		horzLines: {
// 			visible: false,
// 		},
// 		vertLines: {
// 			color: '#37364E',
// 			visible: false,
// 		},
// 	},
// 	handleScale: false,
// 	handleScroll: false,
// });
// }

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

const tooltipDateFormatter = getDateFormatter({
	month: 'short',
	day: 'numeric',
	year: 'numeric',
	hour: 'numeric',
	minute: '2-digit',
	hour12: true,
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

	const date = chartTimeToDate(segment.time);

	tooltipState.title = [tooltipDateFormatter.format(date)];

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
	const lastPoint = preparedChartData.value[preparedChartData.value.length - 1];

	if (isCandlestickData(lastPoint)) {
		return lastPoint.low;
	}

	return lastPoint.value;
});

const chartPrecision = computed(() => {
	const current = lastDatasetValue.value;
	const prevClose = props.prevClosePrice;

	if (notNullish(prevClose)) {
		return calcNumberPrecision(Math.abs(current - prevClose));
	}

	return calcNumberPrecision(minDatasetValue.value);
});
</script>

<template>
	<div :class="classes.wrapper" :style="{ height: heightInPx }">
		<div v-if="showInstruments" :class="classes.header">
			<div :class="classes.filters">
				<modal-badge-filter
					v-if="dateRangePresets.length && dateRange"
					:display-variant="props.displayVariant"
					:options="DateRangePresetFilters"
					:selected-value="selectedDateRangePreset"
					:label="dateRangeTitle"
					close-on-select
					title="Range"
					@select="selectDateRange($event.value)"
				/>
				<ui-delimiter :class="classes.delimiter" />
				<modal-badge-filter
					v-if="canSwitchType"
					:display-variant="props.displayVariant"
					:options="ChartTypeFilters"
					:selected-value="chartType"
					:label="chartTypeTitle"
					close-on-select
					title="Type"
					:icon="IconIds.ChartView"
					@select="chartType = $event.value"
				/>
			</div>
			<div :class="classes.actions">
				<div :class="classes.instruments">
					<ui-control-icon :icon="IconIds.Camera" transparent />
					<ui-control-icon
						:icon="IconIds.ControlFullView"
						transparent
						:icon-size="14"
					/>
				</div>
				<ui-control-icon :icon="IconIds.ControlMore" transparent />
			</div>
		</div>
		<div :class="classes.mainChart">
			<i88-chart
				ref="container"
				:data="preparedChartData"
				:type="chartType"
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
				@chart-hover="onChartHover"
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

.delimiter {
	margin: 0 4px;
}

.header {
	display: flex;
	justify-content: space-between;
	align-items: center;
	align-self: stretch;
	gap: var(--padding-s7, 12px);
}

.filters {
	display: flex;
	align-items: center;
	gap: 4px;
}

.actions {
	display: flex;
	align-items: center;
	gap: var(--padding-s6, 10px);
}

.instruments {
	display: flex;
	align-items: center;
	gap: var(--padding-s2, 2px);
}

:global(a#tv-attr-logo) {
	display: none !important;
}
</style>
