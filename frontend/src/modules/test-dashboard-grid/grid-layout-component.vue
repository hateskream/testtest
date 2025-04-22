<script setup lang="ts">
import { computed, useCssModule, ref, watch } from 'vue';
import { GridLayout, GridItem, type Layout } from 'grid-layout-plus';

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

const classListItem = computed(() => ({ [classes.isDnd]: props.isDnd }));

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
		:class="classes.gridLayout"
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
				<div :class="classes.itemWrapper">
					<div :class="[classes.text, classListItem]">
						<div>{{ item.i }}</div>
					</div>
				</div>
			</grid-item>
		</grid-layout>
	</div>
</template>

<style module="classes">
.gridLayout {
	width: 100%;
}

.isDnd {
	transform: scale(0.9);
}

:global(.vgl-layout) {
	touch-action: none;
	transition: none;
}

:global(.vgl-item:not(.vgl-item--placeholder)) {
	background-color: transparent;
	user-select: none;
}

:global(.vgl-item__resizer) {
	right: 10px !important;
	bottom: 5px !important;
	opacity: 0.9;
}

:global(.vgl-item--placeholder) {
	background-color: rgb(0 128 255 / 50%) !important;
	border: 2px solid #0000ff;
	transition: transform 0.3s ease;
}

.itemWrapper {
	display: flex;
	flex-direction: column;
	justify-content: center;
	height: 100%;
	padding: 3px;
}

.text {
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	height: 100%;
	font-size: 40px;
	background-color: rgb(200 200 200 / 50%);
	transition: transform 0.3s ease;
}
</style>
