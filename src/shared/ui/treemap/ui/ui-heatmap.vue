<!-- eslint-disable @stylistic/max-len -->
<script lang="ts" setup>
import { useElementSize } from '@vueuse/core';
import { computed, toRefs, useTemplateRef } from 'vue';

import { useDepth } from '../composable';
import { prepareNumber, preparePercent } from '../utils';

const DEFAULT_HEIGHT_CELL = 48;
const MIN_WIDTH_CELL = 120;

interface ITreeMapItemValue {
	display: number;
	color: number;
}

interface ITreeMapItem {
	ticker: string;
	logoUrl: string;
	values: ITreeMapItemValue[];
}

interface IDepthRange {
	start: number;
	end: number;
}

interface IVisibleConfig {
	isShowLogo: boolean;
	isShowTicker: boolean;
	isDisplayValuePercent: boolean;
}

interface IUiHeatmap {
	data: ITreeMapItem[];
	depthRange: IDepthRange;
	visibleConfig: IVisibleConfig;
}

const props = defineProps<IUiHeatmap>();

const { getColorByValue } = useDepth(toRefs(props).depthRange);


const { height, width } = useElementSize(useTemplateRef('size'));

const heightCell = computed(() => {
	const countRow = Math.ceil(height.value / DEFAULT_HEIGHT_CELL);
	const lengthWithHeader = props.data.length + 1;

	if (lengthWithHeader < countRow) {
		return Math.floor(height.value / lengthWithHeader);
	}

	return DEFAULT_HEIGHT_CELL;
});

const wrapperStyle = computed(() => {
	return {
		height: `${Math.ceil(height.value / heightCell.value) * heightCell.value}px`,
		width: `${width.value}px`,
	};
});

const cellStyle = computed(() => {
	return {
		height: `${heightCell.value}px`,
		minWidth: `${MIN_WIDTH_CELL}px`,
	};
});

const gridStyle = computed(() => {
	return {
		'grid-template-columns': `repeat(${props.data.length + 1}, minmax(${MIN_WIDTH_CELL}px, 1fr))`,
	};
});

function getColor(value: number, index: number, intersectionIndex: number) {
	if (intersectionIndex === index) {
		return 'rgba(53, 53, 53, 1)';
	}
	return getColorByValue(value);
}

function prepareValue(value: number) {
	if (props.visibleConfig.isDisplayValuePercent) {
		return preparePercent(value);
	}

	return prepareNumber(value);
};
</script>

<template>
	<div class="root">
		<div ref="size" class="size" />
		<div class="grid-wrapper" :style="wrapperStyle">
			<div class="grid-container" :style="gridStyle">
				<div class="cell sticky-header sticky-first"></div>
				<div
					v-for="item in props.data"
					:key="item.ticker"
					class="cell sticky-header"
					:style="cellStyle"
				>
					<div
						v-if="props.visibleConfig.isShowLogo"
						class="logo"
					/>
					<div>
						{{ item.ticker }}
					</div>
				</div>

				<template v-for="(row, dataIndex) in props.data" :key="row.ticker">
					<div
						class="cell sticky-first"
						:style="cellStyle"
					>
						<div
							v-if="props.visibleConfig.isShowLogo"
							class="logo"
						/>
						<div>
							{{ row.ticker }}
						</div>
					</div>
					<div
						v-for="(value, index) in row.values"
						:key="`${row.ticker}-value-${index}`"
						class="cell"
						:style="{
							...cellStyle,
							backgroundColor: getColor(value.display, index, dataIndex),
						}"
					>
						<div v-if="index !== dataIndex">
							{{ prepareValue(value.display) }}
						</div>
					</div>
				</template>
			</div>
		</div>
	</div>

</template>

<style scoped>
.root {
	position: relative;
	width: 100%;
	height: 100%;
}

.size {
	position: relative;
	top: 0;
	left: 0;
	height: 100%;
}

.grid-wrapper {
	position: absolute;
	top: 0;
	left: 0;
	overflow: auto;
}

.grid-container {
	display: grid;
	width: fit-content;
	min-width: 100%;
}

.cell {
	display: flex;
	justify-content: center;
	align-items: center;
	font-style: normal;
	gap: 8px;
	font-weight: 400;
	line-height: 130%;
	letter-spacing: 0.143px;
	background-color: #000000;
}

.logo {
	width: 32px;
	height: 32px;
	background-color: #2c2727;
	border: 1px solid #000000;
	border-radius: 50%;
}

.sticky-header {
	position: sticky;
	top: 0;
	z-index: 10;
}

.sticky-first {
	position: sticky;
	left: 0;
	z-index: 5;
}

.sticky-header.sticky-first {
	z-index: 15;
}
</style>
