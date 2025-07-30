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
	isPercent: boolean;
}

interface IUiTreemap {
	data: IDataInput[];
	depthRange: IDepthRange;
	visibleConfig: IVisibleConfig;
	currencySymbol: string;
	colorBy: string;
	sizeBy: string;
}

const props = defineProps<IUiTreemap>();

const { treemap } = useTreemapLayout(
	useTemplateRef<HTMLCanvasElement>('treemapCanvas'),
	computed(() => props.data.map(({ ticker, sizeValue }) => ({ value: sizeValue, id: ticker }))),
);

const { getColorByValue } = useDepth(toRefs(props).depthRange);

const tickerHovered = ref<string | null>(null);

const dataForTooltip = computed(() => {
	const empty = {
		isOpen: false,
		logoUrl: '',
		ticker: '',
		price: 0,
		currencySymbol: props.currencySymbol,
		sizeValue: 0,
		colorValue: 0,
		colorValueIsPercent: props.visibleConfig.isPercent,
		colorBy: props.colorBy,
		sizeBy: props.sizeBy,
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
	empty.colorValue = data.colorValue;

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
				:visible-config="visibleConfig"
				:color="item.color"
				:logo-url="item.logoUrl"
				:ticker="item.ticker"
				:value="item.colorValue"
				:left="item.left"
				:top="item.top"
				:width="item.width"
				:height="item.height"
				@hover="setTickerHovered(item.ticker)"
				@unhover="setTickerHovered(null)"
			/>
		</div>

		<ui-treemap-tooltip
			:is-open="dataForTooltip.isOpen"
			:logo-url="dataForTooltip.logoUrl"
			:ticker="dataForTooltip.ticker"
			:price="dataForTooltip.price"
			:currency-symbol="dataForTooltip.currencySymbol"
			:size-value="dataForTooltip.sizeValue"
			:color-value="dataForTooltip.colorValue"
			:color-value-is-percent="dataForTooltip.colorValueIsPercent"
			:color-by="dataForTooltip.colorBy"
			:size-by="dataForTooltip.sizeBy"
		/>
	</div>
</template>

<style scoped>
.treemap-container {
	position: relative;
	height: 400px;
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
