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
		paddingRight: `${props.gap}px`,
		paddingLeft: `${props.gap}px`,
		paddingTop: `${props.gap / 2}px`,
		paddingBottom: `${props.gap / 2}px`,
	}),
);

const itemStyle = computed(
	(): Partial<CSSProperties> => ({
		width: `${props.itemWidth + props.gap / 2}px`,
		height: `${props.itemHeight + props.gap / 2}px`,
		padding: `${props.gap / 2 + 3}px`,
	}),
);
</script>

<template>
	<div :class="classes.root">
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
				<div :class="classes.gridItemInner">
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
	</div>
</template>

<style module="classes">
.root {
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	overflow: hidden;
}

.gridContainer {
	display: flex;
	flex-wrap: wrap;
}

.gridItem {
	display: flex;
	flex-shrink: 1;
	justify-content: center;
	align-items: center;

	/* background-color: rgb(200 200 200 / 10%); */
	opacity: 0.5;
}

.gridItemInner {
	position: relative;
	width: 100%;
	height: 100%;

	/* background-color: rgb(255 0 0 / 10%); */
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
	top: -14px;
	left: -6px;
	width: 0.5px;
	height: 16px;
}

.topRightHorizontal {
	top: -6px;
	left: -14px;
	width: 16px;
	height: 0.5px;
}

.topLeftVertical {
	top: -14px;
	right: -6px;
	width: 0.5px;
	height: 16px;
}

.topLeftHorizontal {
	top: -6px;
	right: -14px;
	width: 16px;
	height: 0.5px;
}

.bottomRightVertical {
	bottom: -14px;
	left: -6px;
	width: 0.5px;
	height: 16px;
}

.bottomRightHorizontal {
	bottom: -6px;
	left: -14px;
	width: 16px;
	height: 0.5px;
}

.bottomLeftVertical {
	right: -6px;
	bottom: -14px;
	width: 0.5px;
	height: 16px;
}

.bottomLeftHorizontal {
	right: -14px;
	bottom: -6px;
	width: 16px;
	height: 0.5px;
}
</style>
