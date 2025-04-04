<script setup lang="ts">
import { computed } from 'vue';
import { GridLayout, GridItem } from 'grid-layout-plus';

interface IGridWidthDashboardsProps {
	itemWidth: number;
	itemHeight: number;
	colNum: number;
	rowNum: number;
	gap: number;
}

const props = defineProps<IGridWidthDashboardsProps>();

const layout = computed(() =>
	Array.from({ length: props.colNum * props.rowNum }, (item, index) => {
		const x = index % props.colNum;
		const y = Math.floor(index / props.colNum);
		return {
			x,
			y,
			w: 1,
			h: 1,
			i: String(index),
			static: false,
		};
	}),
);
</script>

<template>
	<div :class="classes.gridWrapper">
		<div :class="classes.gridLayout">
			<grid-layout
				v-model:layout="layout"
				:col-num="props.colNum"
				:row-height="props.itemHeight - props.gap"
				:is-draggable="true"
				:is-resizable="true"
				:use-css-transforms="false"
				:prevent-collision="false"
				:margin="[props.gap, props.gap]"
			>
				<grid-item
					v-for="item in layout"
					:key="item.i"
					:x="item.x"
					:y="item.y"
					:w="item.w"
					:h="item.h"
					:i="item.i"
					:class="classes.gridItem"
				>
					<span :class="classes.text">
						{{ item.i }}
					</span>
				</grid-item>
			</grid-layout>
		</div>
	</div>
</template>

<style module="classes">
.gridWrapper {
	position: relative;
	overflow: hidden;
}

.gridLayout {
	width: calc(100% + 6px);
	margin: -3px;
	opacity: 0.1;
}

:global(.vgl-layout) {
	background-color: #eeeeee;
	touch-action: none;
}

:global(.vgl-item:not(.vgl-item--placeholder)) {
	background-color: #cccccc;
	user-select: none;
}

:global(.vgl-item--resizing) {
	opacity: 0.9;
}

:global(.vgl-item--static) {
	background-color: #ccccee;
}

.gridItem {
	background-color: rgb(200 200 200 / 30%);
}

.text {
	position: absolute;
	inset: 0;
	width: 100%;
	height: 100%;
	margin: auto;
	font-size: 24px;
	text-align: center;
	pointer-events: none;
}
</style>
