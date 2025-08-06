<!-- eslint-disable no-console -->
<script setup lang="ts">
import { computed, ref, toRefs, watch } from 'vue';

import { useDepth } from '../composable';

import UiTreemapElement from './ui-treemap-element.vue';
import UiTreemapTooltip from './ui-treemap-tooltip.vue';
import UiTreemapLayout from './ui-treemap-layout.vue';
import UiBreadcrumbs from './ui-breadcrumbs.vue';

interface IDataItem {
	id: string;
	value: number;
}

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

interface IBreadcrumb {
	id: string;
	name: string;
}

interface IUiTreemap {
	data: IDataInput[];
	depthRange: IDepthRange;
	visibleConfig: IVisibleConfig;
	currencySymbol: string;
	displayValueName: string;
	sizeBy: string;
	originalBreadcrumbs?: IBreadcrumb[];
}

const props = withDefaults(defineProps<IUiTreemap>(), {
	originalBreadcrumbs: () => [],
});

const emit = defineEmits<{
	(e: 'click-all'): void;
	(e: 'click-original-breadcrumb', id: string): void;
}>();

const { getColorByValue } = useDepth(toRefs(props).depthRange);

const tickerHovered = ref<string | null>(null);

const treemap = ref<IDataItem[]>([]);

const prevent = ref<string[]>([]);

const idToPropsItem = computed((): Record<string, ITreeMapItem> =>
	props.data.reduce((acc, item) => {
		acc[item.ticker] = {
			ticker: item.ticker,
			logoUrl: item.logoUrl,
			value: item.displayValue,
			color: getColorByValue(item.colorValue),
		};
		return acc;
	}, {} as Record<string, ITreeMapItem>),
);

const breadcrumb = computed(() => {
	return [
		...props.originalBreadcrumbs
			.map(el => ({
				id: el.id,
				name: el.name,
				isOriginal: true,
			})),
		...prevent.value
			.map(id =>
				({
					id,
					name: idToPropsItem.value[id].ticker || '',
					isOriginal: false,
				}),
			),
	];
});

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

watch(
	() => props.data,
	() => {
		treemap.value = prepareData(props.data);

		prevent.value = [];
	},
	{ immediate: true },
);

function prepareData(raw: IDataInput[]) {
	return raw.map(({ ticker, sizeValue }) => ({ value: sizeValue, id: ticker }));
}

function setTickerHovered(ticker: string | null) {
	tickerHovered.value = ticker;
}

function onClickOther(other: IDataItem[], largestElementId: string) {
	treemap.value = other;
	prevent.value.push(largestElementId);
}

function onClickNotOriginalBreadcrumb(id: string) {
	const preparedData = prepareData(props.data);

	const indexStartData =
		preparedData
			.sort((a, b) => b.value - a.value)
			.findIndex(el => el.id === id);

	if (indexStartData == -1) {
		console.error('not found');
		return;
	}

	treemap.value = preparedData.slice(indexStartData);

	const indexBreadcrumb = breadcrumb.value.findIndex(el => el.id === id);

	prevent.value = prevent.value.slice(0, indexBreadcrumb + 1);
}

function onCLickAll() {
	if (props.originalBreadcrumbs.length) {
		emit('click-all');
		return;
	}

	treemap.value = prepareData(props.data);
	prevent.value = [];
}

function onClickOriginalBreadcrumb() {
	treemap.value = prepareData(props.data);
	prevent.value = [];
}
</script>

<template>
	<div :class="classes.root">
		<ui-breadcrumbs
			:breadcrumbs="breadcrumb"
			@click-all="onCLickAll"
			@click-original-breadcrumb="onClickOriginalBreadcrumb"
			@click-not-original-breadcrumb="onClickNotOriginalBreadcrumb"
		/>
		<ui-treemap-layout :data="treemap">
			<template #default="{ item: { id, isOther }, other, largestElementId }">
				<ui-treemap-element
					:id="id"
					:is-other="isOther"
					:item="idToPropsItem[id]"
					:other-count="other.length"
					:visible-config="{
						isShowLogo: visibleConfig.isShowLogo,
						isShowTicker: visibleConfig.isShowTicker,
						isPercent: visibleConfig.isSizeValuePercent,
					}"
					@hover="setTickerHovered(id)"
					@unhover="setTickerHovered(null)"
					@click-other="onClickOther(other, largestElementId)"
				/>
			</template>
		</ui-treemap-layout>

		<ui-treemap-tooltip
			v-if="false"
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
	display: flex;
	flex-direction: column;
	width: 100%;
	height: 100%;
}
</style>
