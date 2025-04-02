<script setup lang="ts">
import { ref } from 'vue';

import { responsiveGridLayout } from './composables';
import { GAP } from './constants';

import GridComponents from './grid-components.vue';

const grid = ref<HTMLDivElement | null>(null);

const { rowsNum, columnsNum, rowHeight, columnWidth } = responsiveGridLayout(grid);
</script>

<template>
	<div
		ref="grid"
		class="grid-wrapper"
	>
		<div class="grid-layout1">
			<grid-components
				:gap="GAP"
				:col-num="columnsNum"
				:row-num="rowsNum"
				:item-height="rowHeight"
				:item-width="columnWidth"
			/>
		</div>
	</div>
</template>

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
