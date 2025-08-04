<script setup lang="ts">
import { computed, ref, useTemplateRef } from 'vue';
import { toRefs } from 'vue';

import { useDepth, useTreemapLayout, type ITreeMapItem } from '../composable';

import UiTreemapItem from './ui-treemap-item.vue';
import UiTreemapTooltip from './ui-treemap-tooltip.vue';

interface IDataInput {
	ticker: string;
	logoUrl: string;
	sizeValue: number;
	colorValue: number;
	displayValue: number;
	price: number;
}

interface IDataItem extends ITreeMapItem, IDataInput {
	color: string;
}

interface IDepthRange {
	start: number;
	end: number;
}

interface IVisibleConfig {
	isShowLogo: boolean;
	isShowTicker: boolean;
	isSizeValuePercent: boolean;
	isDisplayValuePercent: boolean;
}

interface IUiTreemap {
	data: IDataInput[];
	depthRange: IDepthRange;
	visibleConfig: IVisibleConfig;
	currencySymbol: string;
	displayValueName: string;
	sizeBy: string;
}

const props = defineProps<IUiTreemap>();

const { treemap } = useTreemapLayout(
	useTemplateRef<HTMLCanvasElement>('treemapCanvas'),
	computed(() => props.data
		.map(({ ticker, sizeValue }) => ({ value: sizeValue, id: ticker })),
	),
);

const { getColorByValue } = useDepth(toRefs(props).depthRange);

const tickerHovered = ref<string | null>(null);

interface IUiTreemapTooltipProps {
	logoUrl: string;
	ticker: string;

	price: number;
	currencySymbol: string;

	sizeValue: number;
	sizeValueIsPercent: boolean;
	sizeBy: string;

	displayValue: number;
	displayValueIsPercent: boolean;
	displayValueName: string;

	isOpen: boolean;
}

const dataForTooltip = computed(() => {
	const empty: IUiTreemapTooltipProps = {
		logoUrl: '',
		ticker: '',

		price: 0,
		currencySymbol: props.currencySymbol,

		sizeValue: 0,
		sizeValueIsPercent: props.visibleConfig.isSizeValuePercent,
		sizeBy: props.sizeBy,

		displayValue: 0,
		displayValueIsPercent: props.visibleConfig.isDisplayValuePercent,
		displayValueName: props.displayValueName,

		isOpen: false,
	};

	const ticker = tickerHovered.value;
	if (ticker === null) {
		return empty;
	}

	const data = props.data.find(el => el.ticker === ticker)!;

	empty.isOpen = true;
	empty.ticker = data.ticker;
	empty.logoUrl = data.logoUrl;
	empty.price = data.price;
	empty.sizeValue = data.sizeValue;
	empty.displayValue = data.displayValue;

	return empty;
});

const treemapWithData = computed<IDataItem[]>(() =>
	treemap.value.map(item => {
		const dataItem = props.data.find(({ ticker }) => ticker === item.id)!;

		return {
			...item,
			...dataItem,
			color: getColorByValue(dataItem.colorValue),
		};
	}),
);

function setTickerHovered(ticker: string | null) {
	tickerHovered.value = ticker;
}
</script>

<template>
	<div class="treemap-container">
		<canvas ref="treemapCanvas" class="hidden"></canvas>
		<div class="treemap">
			<ui-treemap-item
				v-for="(item, index) in treemapWithData"
				:key="index"
				:visible-config="{
					isShowLogo: visibleConfig.isShowLogo,
					isShowTicker: visibleConfig.isShowTicker,
					isPercent: visibleConfig.isDisplayValuePercent,
				}"
				:color="item.color"
				:logo-url="item.logoUrl"
				:ticker="item.ticker"
				:value="item.displayValue"
				:left="item.left"
				:top="item.top"
				:width="item.width"
				:height="item.height"
				@hover="setTickerHovered(item.ticker)"
				@unhover="setTickerHovered(null)"
			/>
		</div>

		<ui-treemap-tooltip
			:logo-url="dataForTooltip.logoUrl"
			:ticker="dataForTooltip.ticker"

			:price="dataForTooltip.price"
			:currency-symbol="dataForTooltip.currencySymbol"

			:size-value="dataForTooltip.sizeValue"
			:size-value-is-percent="dataForTooltip.sizeValueIsPercent"
			:size-by="dataForTooltip.sizeBy"

			:display-value="dataForTooltip.displayValue"
			:display-value-is-percent="dataForTooltip.displayValueIsPercent"
			:display-value-name="dataForTooltip.displayValueName"

			:is-open="dataForTooltip.isOpen"
		/>
	</div>
</template>

<style scoped>
.treemap-container {
	position: relative;
	height: 100%;
}

.treemap {
	position: absolute;
	width: 100%;
	height: 100%;
}

.hidden {
	position: absolute;
	z-index: -1;
	display: none;
}
</style>
