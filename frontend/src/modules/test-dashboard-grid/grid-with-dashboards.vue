<script setup lang="ts">
import { computed, ref, type CSSProperties } from 'vue';
import { GridLayout, GridItem } from 'grid-layout-plus';

const GAP_IN_DND = 24;
const GAP_IN_DND_PX = `${GAP_IN_DND}px`;

interface IGridWidthDashboardsProps {
	itemWidth: number;
	itemHeight: number;
	colNum: number;
	rowNum: number;
	gap: number;
}

const props = defineProps<IGridWidthDashboardsProps>();

const emit = defineEmits<{
	(e: 'update'): void;
}>();

const isDnd = ref(false);

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
			static: false,
		};
	}),
);

const rowHeight = computed(() => props.itemHeight - (isDnd.value ? GAP_IN_DND : props.gap));

const gridLayoutStyles = computed(
	(): Partial<CSSProperties> =>
		isDnd.value
			? {
					width: `calc(100% + ${GAP_IN_DND_PX})`,
					margin: `-${GAP_IN_DND / 2}px`,
				}
			: {
					width: `calc(100% + ${props.gap}px)`,
					margin: `-${props.gap / 2}px`,
				},
);

const margin = computed(() => (isDnd.value ? [GAP_IN_DND, GAP_IN_DND] : [props.gap, props.gap]));

function move() {
	isDnd.value = true;
	console.log('move');
}

function moved() {
	isDnd.value = false;
	console.log('moved');
}

function resize() {
	isDnd.value = true;
	console.log('resize');
}

function resized() {
	isDnd.value = false;
	console.log('resized');
}

function updated() {
	isDnd.value = false;
	emit('update');
}
</script>

<template>
	<div :class="classes.gridWrapper">
		<div
			:class="classes.gridLayout"
			:style="gridLayoutStyles"
		>
			<grid-layout
				v-model:layout="layout"
				:col-num="props.colNum"
				:row-height="rowHeight"
				:is-draggable="true"
				:is-resizable="true"
				:use-css-transforms="false"
				:prevent-collision="false"
				:margin="margin"
				@layout-updated="updated"
				@layout-ready="emit('update')"
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
					@move="move"
					@moved="moved"
					@resize="resize"
					@resized="resized"
				>
					<span :class="classes.text">
						{{ item.i }}
					</span>
				</grid-item>
			</grid-layout>
		</div>
	</div>
</template>

<style module="classes">
.gridWrapper {
	position: relative;
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	overflow: hidden;
}

.gridLayout {
	opacity: 0.1;

	/* transition:
		width 0.3s ease,
		margin 0.3s ease; */
}

:global(.vgl-layout) {
	background-color: #eeeeee;
	touch-action: none;
	transition: none;
}

:global(.vgl-item:not(.vgl-item--placeholder)) {
	background-color: #cccccc;
	user-select: none;
}

:global(.vgl-item) {
	transition: 0.1s ease-in !important;
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
