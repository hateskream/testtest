<script setup lang="ts">
import { computed } from 'vue';
import { GridLayout, GridItem } from 'grid-layout-plus';

import type { ICurrency } from '../model';

import CellComponent from './cell-component.vue';

interface IViewComponentProps {
	currencies: ICurrency[];
}

const props = defineProps<IViewComponentProps>();

const layout = computed(() =>
	props.currencies.map((currency, index) => ({
		x: 0,
		y: index,
		w: 1,
		h: 1,
		i: currency.ticker,
		static: false,
		data: currency,
	})),
);

const gridConfig = {
	colNum: 1,
	rowHeight: 64,
	margin: [2, 2],
	isDraggable: true,
	isResizable: false,
};
</script>

<template>
	<div :class="classes.root">
		<div :class="classes.scrollable">
			<div :class="classes.content">
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
			</div>
		</div>
	</div>
</template>

<style module="classes">
.root {
	display: flex;
	flex-direction: column;
	height: 100%;
	overflow: hidden;
}

.scrollable {
	position: relative;
	flex: 1;
	overflow-x: hidden;
	overflow-y: auto;
}

.content {
	width: 100%;
	height: auto;
}
</style>

<style scoped>
:deep(.vgl-item--placeholder) {
	background: transparent !important;
}
</style>
