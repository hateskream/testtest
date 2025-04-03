<script setup lang="ts">
import { computed, onMounted, reactive, ref, type CSSProperties } from 'vue';
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
			static: true,
		};
	}),
);
</script>

<template>
	<!-- <div :class="classes.gridWrapper"> -->
	<grid-layout
		v-model:layout="layout"
		:col-num="props.colNum"
		:row-height="props.itemHeight"
		:is-draggable="false"
		:is-resizable="false"
		:use-css-transforms="true"
		:prevent-collision="false"
		:margin="[props.gap, props.gap]"
		:class="classes.gridLayout"
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
			<span :class="classes.text" />
		</grid-item>
	</grid-layout>
	<!-- </div> -->
</template>

<style module="classes">
.gridWrapper {
	display: flex;
	justify-content: center;
	align-items: center;
	width: 100%;
	min-height: 100%;
	overflow: hidden;
}

.gridLayout {
	width: 100%;
	height: 100%;
	margin: 0;
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
