<script setup lang="ts">
import { computed, ref, toRefs } from 'vue';

import { useDepth } from '../composable';

import UiTreemapItem from './ui-treemap-item.vue';
import UiTreemapTooltip from './ui-treemap-tooltip.vue';
import UiTreemapLayout from './ui-treemap-layout.vue';

interface ITreeMapItem {
	ticker: string;
	logoUrl: string;
	value: number;

	color: string;
}

interface IDataInput {
	ticker: string;
	logoUrl: string;
	sizeValue: number;
	colorValue: number;
	displayValue: number;
	price: number;
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

const { getColorByValue } = useDepth(toRefs(props).depthRange);

const data = computed(() => props.data
	.map(({ ticker, sizeValue }) => ({ value: sizeValue, id: ticker })),
);


const idToPropsItem = computed((): Record<string, ITreeMapItem> =>
	props.data.reduce((acc, item) => {
		acc[item.ticker] = {
			ticker: item.ticker,
			logoUrl: item.logoUrl,
			value: item.sizeValue,
			color: getColorByValue(item.colorValue),
		};
		return acc;
	}, {} as Record<string, ITreeMapItem>),
);

const tickerHovered = ref<string | null>(null);

const dataForTooltip = computed(() => {
	const empty = {
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

	const dataTooltip = props.data.find(el => el.ticker === ticker)!;

	empty.isOpen = true;
	empty.ticker = dataTooltip.ticker;
	empty.logoUrl = dataTooltip.logoUrl;
	empty.price = dataTooltip.price;
	empty.sizeValue = dataTooltip.sizeValue;
	empty.displayValue = dataTooltip.displayValue;

	return empty;
});

function setTickerHovered(ticker: string | null) {
	tickerHovered.value = ticker;
}
</script>

<template>
	<div>
		<ui-treemap-layout :data="data">
			<template #default="{ item: { id } }">
				<ui-treemap-item
					:color="idToPropsItem[id].color"
					:logo-url="idToPropsItem[id].logoUrl"
					:ticker="idToPropsItem[id].ticker"
					:value="idToPropsItem[id].value"
					:visible-config="{
						isShowLogo: visibleConfig.isShowLogo,
						isShowTicker: visibleConfig.isShowTicker,
						isPercent: visibleConfig.isSizeValuePercent,
					}"
					@hover="setTickerHovered(id)"
					@unhover="setTickerHovered(null)"
				/>
			</template>
		</ui-treemap-layout>
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

<style module="classes">
.root {
	position: relative;
}
</style>
