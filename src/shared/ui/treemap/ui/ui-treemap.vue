<script setup lang="ts">
import { computed, useTemplateRef } from 'vue';
import { toRefs } from 'vue';

import { useDepth, useTreemapLayout, type ITreeMapItem } from '../composable';

import UiTreemapItem from './ui-treemap-item.vue';

interface IDataInput {
	ticker: string;
	logoUrl: string;
	sizeValue: number;
	colorValue: number;
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
}

const props = defineProps<IUiTreemap>();

const { treemap } = useTreemapLayout(
	useTemplateRef<HTMLCanvasElement>('treemapCanvas'),
	computed(() => props.data.map(({ ticker, sizeValue }) => ({ value: sizeValue, id: ticker }))),
);

const { getColorByValue } = useDepth(toRefs(props).depthRange);

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

</script>

<template>
	<div class="treemap-container">
		<canvas ref="treemapCanvas" class="hidden"></canvas>
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
		/>
	</div>
</template>

<style scoped>
.treemap-container {
	position: relative;
	height: 100%;
}

.hidden {
	display: none;
}
</style>
