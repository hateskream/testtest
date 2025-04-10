<script setup lang="ts">
import { computed, onMounted, onBeforeUnmount, useCssModule, ref, watch } from 'vue';
import { GridLayout, GridItem, type Layout } from 'grid-layout-plus';

const props = defineProps<{
	modelValue: Layout;
	isDnd: boolean;
	colNum: number;
	rowHeight: number;
	gap: number;
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

const wrapperRef = ref<HTMLDivElement | null>(null);
const gridLayoutRef = ref<InstanceType<typeof GridLayout> | null>(null);

const gridLayoutStyles = computed(() => ({
	width: `calc(100% + ${props.gap}px)`,
	margin: `-${props.gap / 2}px`,
}));

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
	// emit('update-is-show-grid-state', true);
}

function moved() {
	// emit('update-is-show-grid-state', false);
}

function resize() {
	// emit('update-is-show-grid-state', true);
}

function resized() {
	// emit('update-is-show-grid-state', false);
}

function handleDragOver(e: DragEvent) {
	// Предотвращаем стандартное поведение браузера
	e.preventDefault();

	// Проверяем, нужно ли добавить временный элемент
	// if (!props.modelValue) {
	// 	emit('dropover');
	// }
}

function handleDrop(e: DragEvent) {
	// Предотвращаем стандартное поведение браузера
	// e.preventDefault();
	// Удаляем временный элемент после завершения перетаскивания
	// emit('drop');
}
</script>

<template>
	<div
		ref="wrapperRef"
		:class="classes.gridWrapper"
	>
		<div
			:class="classes.gridLayout"
			:style="gridLayoutStyles"
		>
			<grid-layout
				ref="gridLayoutRef"
				:layout="props.modelValue"
				:col-num="colNum"
				:row-height="rowHeight"
				:is-draggable="true"
				:is-resizable="true"
				:use-css-transforms="false"
				:prevent-collision="false"
				:margin="[gap, gap]"
				@dragover="handleDragOver"
				@drop="handleDrop"
			>
				<!-- 				@dragover.prevent
												@dragover="handleDragOver"

 -->
				<grid-item
					v-for="item in props.modelValue"
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
					<div :class="[classes.text, classListItem]">
						{{ item.i }}
					</div>
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
}

.isDnd {
	transform: scale(0.9);
	transition: scale 0.3s ease;
}

:global(.vgl-layout) {
	touch-action: none;
	transition: none;
}

:global(.vgl-item:not(.vgl-item--placeholder)) {
	background-color: transparent;
	user-select: none;
}

:global(.vgl-item) {
	position: relative;
	transition: 0.1s ease-in !important;
}

:global(.vgl-item--resizing) {
	opacity: 0.9;
}

:global(.vgl-item--placeholder) {
	position: relative;
	z-index: -1;
	background-color: rgb(0 128 255 / 50%) !important;
	border: 2px solid #0000ff;
	transform: scale(0.955);
	transition: scale 0.3s ease;
}

.gridItem {
	background-color: rgb(200 200 200 / 30%);
}

.text {
	position: relative;
	z-index: 10000;
	width: 100%;
	height: 100%;
	background-color: rgb(200 200 200 / 30%);
	transition: transform 0.3s ease;
}
</style>
