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
		/>
	</div>
</template>

<style module="classes">
.gridContainer {
	display: flex;
	flex-wrap: wrap;
	background: #e0e0e0;
}

.gridItem {
	flex-shrink: 1;
	background: #cccccc;
}
</style>
