<script setup lang="ts">
import { computed, ref } from 'vue';
import { GridLayout, GridItem } from 'grid-layout-plus';

import type { ICurrency } from '../model';
// import { ScrollContainer } from '../../base';

import { ScrollContainer } from '../../base';

import CellComponent from './cell-component.vue';

interface IViewComponentProps {
	currencies: ICurrency[];
}

const props = defineProps<IViewComponentProps>();

const layout = ref(
	props.currencies.map((currency, index) => ({
		x: 0,
		y: index,
		w: 12,
		h: 1,
		i: currency.ticker,
		static: false,
		data: currency,
	})),
);

const gridConfig = {
	colNum: 12,
	rowHeight: 64,
	margin: [2, 2],
	isDraggable: true,
	isResizable: false,
};

const visibleCells = computed(() => {
	const cells = 5;
	const fixMarginHeight = gridConfig.margin.reduce((acc, item) => acc + item, 0);
	const totalHeight = gridConfig.rowHeight + fixMarginHeight;

	return totalHeight * cells;
});
</script>

<template>
	<div :class="classes.root">
		<scroll-container
			:max-height="visibleCells"
			overflow-x="hidden"
		>
			<template #content>
				<grid-layout
					v-model:layout="layout"
					:col-num="gridConfig.colNum"
					:row-height="gridConfig.rowHeight"
					:margin="gridConfig.margin"
					:is-draggable="gridConfig.isDraggable"
					:is-resizable="gridConfig.isResizable"
					:vertical-compact="true"
				>
					<grid-item
						v-for="item in layout"
						:key="item.i"
						:x="item.x"
						:y="item.y"
						:w="item.w"
						:h="item.h"
						:i="item.i"
						:static="item.static"
						drag-allow-from=".price-drag"
						drag-ignore-from=".price-no-drag"
					>
						<cell-component :currency="item.data" />
					</grid-item>
				</grid-layout>
			</template>
		</scroll-container>
	</div>
</template>

<style module="classes">
.root {
	display: flex;
	flex-direction: column;
	width: 100%;
}

:global(.vgl-layout) {
	width: 310px !important;
}

:global(.vgl-item) {
	width: 305px !important;
}

:global(.vgl-item--placeholder) {
	width: 300px !important;
	background: transparent !important;
}
</style>
