<script setup lang="ts">
import { computed, useCssModule, ref, watch } from 'vue';
import { GridLayout, GridItem, type Layout } from 'grid-layout-plus';

import { BaseDashboardComponent } from '../dashboards-view/dashboards/base';

const props = defineProps<{
	modelValue: Layout;
	isDnd: boolean;
	colNum: number;
	rowHeight: number;
}>();

const emit = defineEmits<{
	(e: 'update-is-show-grid-state', value: boolean): void;
	(e: 'update:modelValue', value: Layout): void;
	(e: 'setWrapper', value: HTMLDivElement): void;
	(e: 'setGridLayoutRef', value: InstanceType<typeof GridLayout>): void;
	(e: 'dropover'): void;
	(e: 'drop'): void;
}>();

const classes = useCssModule('classes');

let isUserInteracted = false;

const wrapperRef = ref<HTMLDivElement | null>(null);
const gridLayoutRef = ref<InstanceType<typeof GridLayout> | null>(null);

const classListItem = computed(() => ({
	[classes.isDnd]: props.isDnd,
	[classes.notDnd]: !props.isDnd,
}));

watch(
	wrapperRef,
	value => {
		if (value) {
			emit('setWrapper', value);
		}
	},

	{
		once: true,
	},
);

watch(
	gridLayoutRef,
	value => {
		if (value) {
			emit('setGridLayoutRef', value);
		}
	},
	{
		once: true,
	},
);

function move() {
	isUserInteracted = true;
	emit('update-is-show-grid-state', true);
}

function moved() {
	isUserInteracted = true;
	emit('update-is-show-grid-state', false);
}

function resize() {
	isUserInteracted = true;
	emit('update-is-show-grid-state', true);
}

function resized() {
	isUserInteracted = true;
	emit('update-is-show-grid-state', false);
}

function updated(newLayout: Layout) {
	emit('update-is-show-grid-state', false);

	if (isUserInteracted) {
		emit('update:modelValue', newLayout);
		isUserInteracted = false;
	}
}
</script>

<template>
	<div
		ref="wrapperRef"
		class="gridLayout"
		@dragover.prevent
	>
		<grid-layout
			ref="gridLayoutRef"
			:layout="props.modelValue"
			:col-num="colNum"
			:row-height="rowHeight"
			:is-draggable="true"
			:is-resizable="true"
			:prevent-collision="false"
			:use-css-transforms="false"
			:margin="[0, 0]"
			@layout-updated="updated"
		>
			<grid-item
				v-for="item in props.modelValue"
				:key="item.i"
				:x="item.x"
				:y="item.y"
				:w="item.w"
				:h="item.h"
				:i="item.i"
				@move="move"
				@moved="moved"
				@resize="resize"
				@resized="resized"
			>
				<div :class="[classes.itemWrapper, classListItem]">
					<!-- <div :class="[classes.text, classListItem]">
						<div>{{ item.i }}</div>
					</div> -->
					<base-dashboard-component :class="classes.item">
						<template #title> some widget {{ item.i }} </template>
						<template #content>
							<div :class="classes.content">{{ item.i }}</div>
						</template>
					</base-dashboard-component>
				</div>
			</grid-item>
		</grid-layout>
	</div>
</template>

<style scoped>
.gridLayout {
	width: 100%;

	--vgl-item-resizing-opacity: 100% !important;
}
</style>

<style module="classes">
.content {
	margin: 0 16px 18px;
}

.item {
	width: 100%;
	height: 100%;
}

.gridLayout {
	width: 100%;
}

.isDnd {
	padding: 7px;
}

.notDnd {
	padding: 3px;
}

:global(.vgl-layout) {
	opacity: 1 !important;
	transition: none;
	touch-action: none;

	--vgl-item-resizing-opacity: 100% !important;
}

:global(.vgl-item:not(.vgl-item--placeholder)) {
	/* background-color: transparent; */
	user-select: none;
}

:global(.vgl-item--placeholder .vgl-item__resizer) {
	display: none !important;
}

:global(.vgl-item__resizer) {
	right: 15px !important;
	bottom: 10px !important;
	background-color: #000000 !important;
}

:global(.vgl-item--placeholder) {
	background-color: rgb(0 128 255 / 80%) !important;
	border: 7px solid #000000 !important;
	border-radius: 18px;
	opacity: 0.1 !important;
}

.itemWrapper {
	z-index: 1;
	display: flex;
	flex-direction: column;
	justify-content: center;
	height: 100%;
	transition: padding 0.3s ease;
}

.text {
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	height: 100%;
	font-size: 40px;
	background-color: rgb(200 200 200 / 50%);
}
</style>
