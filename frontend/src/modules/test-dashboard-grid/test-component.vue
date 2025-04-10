<script setup lang="ts">
import { ref } from 'vue';

import { responsiveGridLayout } from './composables';
import { GAP } from './constants';

import GridComponents from './grid-components.vue';
import ParentComponent from './parent-component.vue';
// import GridWithDashboards from './grid-with-dashboards.vue';

const grid = ref<HTMLDivElement | null>(null);

const { rowsNum, columnsNum, rowHeight, columnWidth, rowNumGrid, updateColumnsNumGrid } =
	responsiveGridLayout(grid);

const isEditState = ref(false);

function updateIsShowGridState(newState: boolean) {
	// isShowGrid.value = newState;
}
</script>

<template>
	<div :class="classes.testWrapper">
		<div
			ref="grid"
			:class="classes.root"
		>
			<div
				v-show="isEditState"
				:class="classes.grid"
			>
				<grid-components
					:col-num="columnsNum"
					:item-height="rowHeight"
					:item-width="columnWidth"
					:row-num="rowNumGrid"
				/>
			</div>

			<div :class="classes.content">
				<!-- <grid-with-dashboards
					:col-num="columnsNum"
					:item-height="rowHeight"
					:item-width="columnWidth"
					:row-num="rowsNum"
					:gap="GAP"
					@update="updateColumnsNumGrid"
					@update-is-show-grid-state="updateIsShowGridState"
				/> -->
				<parent-component
					v-model="isEditState"
					:col-num="columnsNum"
					:item-height="rowHeight"
					:item-width="columnWidth"
					:row-num="rowsNum"
					:gap="GAP"
					@update="updateColumnsNumGrid"
					@update-is-show-grid-state="updateIsShowGridState"
				/>
			</div>
		</div>
	</div>
</template>

<style module="classes">
.testWrapper {
	position: relative;
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;

	/* width: 100%; */
	min-height: 100%;
}

.droppable {
	margin-bottom: 20px;
}

.root {
	position: relative;
	display: flex;
	flex-grow: 1;
	justify-content: center;
	align-items: center;
	width: 100%;

	/* min-height: 100%; */

	/* overflow: hidden; */
}

.content {
	position: relative;
	width: 100%;
}

.grid {
	position: absolute;

	/* z-index: -1; */
	width: 100%;
	height: 100%;
}
</style>
