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
	Array.from({ length: 56 }, (item, index) => {
		const x = index % 8; // Колонка (0..7)
		const y = Math.floor(index / 8); // Строка (0..6)
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

const rowHeight = ref(105);

const grid = ref<HTMLDivElement | null>(null);

const minRowHeight = 104;
const maxRowHeight = 140;

const numberOfRows = 7;

const updateRowHeight = () => {
	if (!grid.value) {
		return;
	}

	const containerHeight = grid.value.getBoundingClientRect().height;

	console.log('containerHeight', grid.value.getBoundingClientRect().height);
	console.log('containerHeight 2', grid.value.offsetHeight);

	let calculatedRowHeight = containerHeight / numberOfRows;
	console.log('calculatedRowHeight', calculatedRowHeight);
	calculatedRowHeight = Math.max(minRowHeight, Math.min(maxRowHeight, calculatedRowHeight));

	rowHeight.value = Math.ceil(calculatedRowHeight);
};

onMounted(() => {
	updateRowHeight();
});
</script>

<template>
	<grid-layout
		v-model:layout="layout"
		:col-num="8"
		:row-height="rowHeight"
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
