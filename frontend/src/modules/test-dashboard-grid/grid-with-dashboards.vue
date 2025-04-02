<script setup lang="ts">
import { computed, onMounted, reactive, ref, type CSSProperties } from 'vue';
import { GridLayout } from 'grid-layout-plus';

interface IGridWidthDashboardsProps {
	itemWidth: number;
	itemHeight: number;
	colNum: number;
	rowNum: number;
	gap: number;
}

const props = defineProps<IGridWidthDashboardsProps>();

const layout = reactive(
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
	<grid-layout
		v-model:layout="layout"
		:col-num="props.colNum"
		:row-height="props.itemHeight"
		:is-draggable="false"
		:is-resizable="false"
		:use-css-transforms="true"
		:prevent-collision="false"
		:margin="[6, 6]"
		class="grid-layout"
	>
		<grid-item
			v-for="item in layout"
			:key="item.i"
			:x="item.x"
			:y="item.y"
			:w="item.w"
			:h="item.h"
			:i="item.i"
			class="grid-item"
		>
			<span class="text">{{ `${item.i}` }}</span>
		</grid-item>
	</grid-layout>
</template>

<style module="classes"></style>

<style scoped>
.grid-wrapper {
	display: flex;
	justify-content: center;
	align-items: center;
	width: 100%;
	min-height: 100%;
	overflow: hidden;
}

.grid-layout {
	width: calc(100% + 12px);
	height: calc(100% + 12px);
	margin: -6px;
}

.grid-layout1 {
	width: 100%;
	height: 100%;
}

.vgl-layout {
	background-color: #eeeeee;
	touch-action: none;
}

:deep(.vgl-item:not(.vgl-item--placeholder)) {
	background-color: #cccccc;
	user-select: none;
}

:deep(.vgl-item--resizing) {
	opacity: 0.9;
}

:deep(.vgl-item--static) {
	background-color: #ccccee;
}

.grid-item {
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
