<script setup lang="ts">
import { computed, type CSSProperties } from 'vue';

interface IGridComponentProps {
	itemWidth: number;
	itemHeight: number;
	colNum: number;
	rowNum: number;
	gap: number;
}

const props = defineProps<IGridComponentProps>();

const totalItems = computed(() => props.colNum * props.rowNum);

const gridStyle = computed(
	(): Partial<CSSProperties> => ({
		gap: `${props.gap}px`,
	}),
);

const itemStyle = computed(
	(): Partial<CSSProperties> => ({
		width: `${props.itemWidth}px`,
		height: `${props.itemHeight}px`,
	}),
);

const itemInner = computed(
	(): Partial<CSSProperties> => ({
		width: `${props.itemWidth - 2}px`,
		height: `${props.itemHeight - 2}px`,
	}),
);
</script>

<template>
	<div
		:class="classes.gridContainer"
		:style="gridStyle"
	>
		<div
			v-for="index in totalItems"
			:key="index"
			:class="classes.gridItem"
			:style="itemStyle"
		>
			<div
				:class="classes.gridItemInner"
				:style="itemInner"
			>
				<div :class="classes.topRightVertical" />
				<div :class="classes.topRightHorizontal" />
				<div :class="classes.topLeftVertical" />
				<div :class="classes.topLeftHorizontal" />
				<div :class="classes.bottomRightVertical" />
				<div :class="classes.bottomRightHorizontal" />
				<div :class="classes.bottomLeftVertical" />
				<div :class="classes.bottomLeftHorizontal" />
			</div>
		</div>
	</div>
</template>

<style module="classes">
.gridContainer {
	display: flex;
	flex-wrap: wrap;
}

.gridItem {
	display: flex;
	flex-shrink: 1;
	justify-content: center;
	align-items: center;
	background-color: rgb(200 200 200 / 10%);
	opacity: 0.5;
}

.gridItemInner {
	position: relative;
	background-color: rgb(255 0 0 / 10%);
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
	top: -11px;
	left: -3px;
	width: 0.5px;
	height: 16px;
}

.topRightHorizontal {
	top: -3px;
	left: -11px;
	width: 16px;
	height: 0.5px;
}

.topLeftVertical {
	top: -11px;
	right: -3px;
	width: 0.5px;
	height: 16px;
}

.topLeftHorizontal {
	top: -3px;
	right: -11px;
	width: 16px;
	height: 0.5px;
}

/* .topRight {
	top: -11px;
	left: -3px;
	width: 0.5px;
	height: 16px;
}

.topLeft {
	top: -3px;
	left: -11px;
	width: 16px;
	height: 0.5px;
}

.bottomRight {
	right: -3px;
	bottom: -11px;
	width: 0.5px;
	height: 16px;
}

.bottomLeft {
	bottom: -3px;
	left: -11px;
	width: 16px;
	height: 0.5px;
} */
</style>
