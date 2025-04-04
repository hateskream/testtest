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
	<dev
		ref="grid"
		:class="classes.root"
	>
		<dev
			v-show="isShowGrid"
			:class="classes.grid"
		>
			<grid-components
				:col-num="columnsNum"
				:item-height="rowHeight"
				:item-width="columnWidth"
				:row-num="rowsNum"
			/>
		</dev>
		<dev :class="classes.content">
			<grid-with-dashboards
				:col-num="columnsNum"
				:item-height="rowHeight"
				:item-width="columnWidth"
				:row-num="rowsNum"
				:gap="GAP"
			/>
		</dev>
	</dev>
</template>

<style module="classes">
.root {
	position: relative;
	display: flex;
	justify-content: center;
	align-items: center;
	width: 100%;
	min-height: 100%;
	overflow: hidden;
}

.content {
	position: relative;
	width: 100%;
}

.grid {
	position: absolute;
	z-index: -1;
	width: 100%;
	height: 100%;
}
</style>
