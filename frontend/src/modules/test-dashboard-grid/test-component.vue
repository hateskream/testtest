<script setup lang="ts">
import { ref } from 'vue';

import { responsiveGridLayout } from './composables';
import { GAP } from './constants';

import GridComponents from './grid-components.vue';
import GridWithDashboards from './grid-with-dashboards.vue';

const grid = ref<HTMLDivElement | null>(null);

const { rowsNum, columnsNum, rowHeight, columnWidth } = responsiveGridLayout(grid);

const isShowGrid = ref(true);
</script>

<template>
	<div
		ref="grid"
		:class="classes.root"
	>
		<div :class="classes.grid">
			<grid-components
				v-show="isShowGrid"
				:gap="GAP"
				:col-num="columnsNum"
				:row-num="rowsNum"
				:item-height="rowHeight"
				:item-width="columnWidth"
			/>
		</div>
		<div :class="classes.content">
			<grid-with-dashboards
				:gap="GAP"
				:col-num="columnsNum"
				:row-num="rowsNum"
				:item-height="rowHeight"
				:item-width="columnWidth"
			/>
		</div>
	</div>
</template>

<style module="classes">
.root {
	position: relative;
	display: flex;
	justify-content: center;
	align-items: center;
	width: 100%;
	min-height: 100%;
	padding: 2px;
	overflow: hidden;
}

.content {
	position: absolute;
	width: 100%;
	height: 100%;
}

.grid {
	position: absolute;
	z-index: -1;
	width: 100%;
	height: 100%;
}
</style>
