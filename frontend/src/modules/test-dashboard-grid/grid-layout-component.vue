<script setup lang="ts">
import { ref, watch } from 'vue';
import { GridLayout, type Layout } from 'grid-layout-plus';

import GridElement from './grid-element.vue';

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

let isUserInteracted = false;

const wrapperRef = ref<HTMLDivElement | null>(null);
const gridLayoutRef = ref<InstanceType<typeof GridLayout> | null>(null);

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

function updated(newLayout: Layout) {
	emit('update-is-show-grid-state', false);

	if (isUserInteracted) {
		emit('update:modelValue', newLayout);
		isUserInteracted = false;
	}
}

function onDragStart() {
	emit('update-is-show-grid-state', true);
}

function onDragEnd() {
	emit('update-is-show-grid-state', false);
}
</script>

<template>
	<div
		ref="wrapperRef"
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
			<grid-element
				v-for="item in props.modelValue"
				:key="item.i"
				:x="item.x"
				:y="item.y"
				:w="item.w"
				:h="item.h"
				:i="item.i"
				:is-dnd="isDnd"
				@is-drag="onDragStart"
				@is-drag-end="onDragEnd"
			/>
		</grid-layout>
	</div>
</template>

<style module="classes">
:global(.vgl-layout) {
	opacity: 1 !important;
	transition: none;
	touch-action: none;

	--vgl-item-resizing-opacity: 100% !important;
}
</style>
