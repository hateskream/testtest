<script setup lang="ts">
import { computed, type CSSProperties } from 'vue';

interface IGridComponentProps {
	itemWidth: number;
	itemHeight: number;
	colNum: number;
	rowNum: number;
}

const props = defineProps<IGridComponentProps>();

const totalItems = computed(() => props.colNum * props.rowNum);

const gridStyle = computed(
	(): Partial<CSSProperties> => ({
		display: 'grid',
		gridTemplateColumns: `repeat(${props.colNum}, ${props.itemWidth}px)`,
		gridTemplateRows: `repeat(${props.rowNum}, ${props.itemHeight}px)`,
	}),
);

const itemStyle = computed(
	(): Partial<CSSProperties> => ({
		maxWidth: `${props.itemWidth}px`,
		height: `${props.itemHeight}px`,
	}),
);

function topRightVerticalLineStyle(itemIndex: number): Partial<CSSProperties> {
	if (isTopRightItem(itemIndex)) {
		return {
			width: '0px',
		};
	}
	if (isTopRow(itemIndex)) {
		return {
			top: '1px',
		};
	}
	if (isLeftCell(itemIndex)) {
		return {
			width: '1px',
		};
	}
	return {};
}

function topRightHorizontalLineStyle(itemIndex: number): Partial<CSSProperties> {
	if (isTopRightItem(itemIndex)) {
		return {
			width: '0px',
		};
	}
	if (isTopRow(itemIndex)) {
		return {
			height: '1px',
		};
	}
	if (isLeftCell(itemIndex)) {
		return {
			left: '1px',
		};
	}
	return {};
}

function topLeftVerticalLineStyle(itemIndex: number): Partial<CSSProperties> {
	if (isTopLeftItem(itemIndex)) {
		return {
			width: '0px',
		};
	}
	if (isTopRow(itemIndex)) {
		return {
			top: '1px',
		};
	}
	if (isRightCell(itemIndex)) {
		return {
			width: '1px',
		};
	}
	return {};
}

function topLeftHorizontalLineStyle(itemIndex: number): Partial<CSSProperties> {
	if (isTopLeftItem(itemIndex)) {
		return {
			width: '0px',
		};
	}
	if (isTopRow(itemIndex)) {
		return {
			height: '1px',
		};
	}
	if (isRightCell(itemIndex)) {
		return {
			right: '1px',
		};
	}

	return {};
}

function bottomRightVerticalLineStyle(itemIndex: number): Partial<CSSProperties> {
	if (isBottomRightItem(itemIndex)) {
		return {
			width: '0px',
		};
	}
	if (isLeftCell(itemIndex)) {
		return {
			width: '1px',
		};
	}
	if (isBottomLineItem(itemIndex)) {
		return {
			bottom: '1px',
		};
	}

	return {};
}

function bottomLeftVerticalLineStyle(itemIndex: number): Partial<CSSProperties> {
	if (isBottomLeftItem(itemIndex)) {
		return {
			width: '0px',
		};
	}
	if (isRightCell(itemIndex)) {
		return {
			width: '1px',
		};
	}
	if (isBottomLineItem(itemIndex)) {
		return {
			bottom: '1px',
		};
	}
	return {};
}

function bottomLeftHorizontalLineStyle(itemIndex: number): Partial<CSSProperties> {
	if (isBottomRightItem(itemIndex)) {
		return {
			width: '0px',
		};
	}
	if (isLeftCell(itemIndex)) {
		return {
			left: '1px',
		};
	}
	if (isBottomLineItem(itemIndex)) {
		return {
			height: '1px',
		};
	}
	return {};
}

function bottomRightHorizontalLineStyle(itemIndex: number): Partial<CSSProperties> {
	if (isBottomLeftItem(itemIndex)) {
		return {
			height: '0px',
		};
	}
	if (isRightCell(itemIndex)) {
		return {
			right: '1px',
		};
	}
	if (isBottomLineItem(itemIndex)) {
		return {
			height: '1px',
		};
	}
	return {};
}

function isTopRightItem(itemIndex: number): boolean {
	return itemIndex === 1;
}

function isTopLeftItem(itemIndex: number): boolean {
	return itemIndex === props.colNum;
}

function isBottomRightItem(itemIndex: number): boolean {
	return itemIndex === props.colNum * (props.rowNum - 1) + 1;
}

function isBottomLeftItem(itemIndex: number): boolean {
	return itemIndex === totalItems.value;
}

function isTopRow(itemIndex: number): boolean {
	return itemIndex <= props.colNum;
}

function isLeftCell(itemIndex: number): boolean {
	return (itemIndex - 1) % props.colNum === 0;
}

function isRightCell(itemIndex: number): boolean {
	return itemIndex % props.colNum === 0;
}

function isBottomLineItem(itemIndex: number): boolean {
	return itemIndex > totalItems.value - props.colNum;
}
</script>

<template>
	<div :style="gridStyle">
		<div
			v-for="index in totalItems"
			:key="index"
			:class="classes.gridItem"
			:style="itemStyle"
		>
			<div
				:class="classes.topRightVertical"
				:style="topRightVerticalLineStyle(index)"
			/>
			<div
				:class="classes.topRightHorizontal"
				:style="topRightHorizontalLineStyle(index)"
			/>
			<div
				:class="classes.topLeftVertical"
				:style="topLeftVerticalLineStyle(index)"
			/>
			<div
				:class="classes.topLeftHorizontal"
				:style="topLeftHorizontalLineStyle(index)"
			/>
			<div
				:class="classes.bottomRightVertical"
				:style="bottomRightVerticalLineStyle(index)"
			/>
			<div
				:class="classes.bottomRightHorizontal"
				:style="bottomRightHorizontalLineStyle(index)"
			/>
			<div
				:class="classes.bottomLeftVertical"
				:style="bottomLeftVerticalLineStyle(index)"
			/>
			<div
				:class="classes.bottomLeftHorizontal"
				:style="bottomLeftHorizontalLineStyle(index)"
			/>
		</div>
	</div>
</template>

<style module="classes">
.gridItem {
	position: relative;
}

.topRightVertical,
.topRightHorizontal,
.topLeftVertical,
.topLeftHorizontal,
.bottomRightVertical,
.bottomRightHorizontal,
.bottomLeftVertical,
.bottomLeftHorizontal {
	content: '';
	position: absolute;
	background-color: rgb(72 72 72 / 100%);
}

.topRightVertical {
	top: 0;
	left: 0;
	width: 0.5px;
	height: 8px;
}

.topRightHorizontal {
	top: 0;
	left: 0;
	width: 8px;
	height: 0.5px;
}

.topLeftVertical {
	top: 0;
	right: 0;
	width: 0.5px;
	height: 8px;
}

.topLeftHorizontal {
	top: 0;
	right: 0;
	width: 8px;
	height: 0.5px;
}

.bottomRightVertical {
	bottom: 0;
	left: 0;
	width: 0.5px;
	height: 8px;
}

.bottomRightHorizontal {
	right: 0;
	bottom: 0;
	width: 8px;
	height: 0.5px;
}

.bottomLeftHorizontal {
	bottom: 0;
	left: 0;
	width: 8px;
	height: 0.5px;
}

.bottomLeftVertical {
	right: 0;
	bottom: 0;
	width: 0.5px;
	height: 8px;
}
</style>
