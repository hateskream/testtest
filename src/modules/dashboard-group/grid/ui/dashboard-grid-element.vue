<script setup lang="ts">
import { GridItem } from 'grid-layout-plus';
import { useCssModule, computed, onBeforeUnmount, onMounted, ref, reactive } from 'vue';

interface IComponentState {
	isDnd: boolean;
	isResize: boolean;
}

interface IGridElement {
	i: string;
	x: number;
	y: number;
	w: number;
	h: number;
	minH: number;
	minW: number;
	maxH: number;
	maxW: number;
	isEditing: boolean;
	dropId: number | string;
}

const props = defineProps<IGridElement>();

const emit = defineEmits<{
	(event: 'change-dnd-state', value: boolean): void;
	(event: 'change-resize-state', value: boolean): void;
	(event: 'set-resizable-widget-id', value: string | null): void;
	(event: 'set-dnd-widget-id', value: string | null): void;
	(event: 'resize', i : string, newH: number, newW: number): void;
	(event: 'resized'): void;
	(event: 'moved'): void;
}>();

const classes = useCssModule('classes');

const gridItemRef = ref<InstanceType<typeof GridItem> | null>(null);

const componentState = reactive<IComponentState>({
	isDnd: false,
	isResize: false,
});

const classListItem = computed(() => ({
	[classes.isEditing]: props.isEditing,
	[classes.notEditing]: !props.isEditing,
}));

let observer: MutationObserver | null = null;

onMounted(() => {
	if (!gridItemRef.value) {
		return;
	}

	const element = gridItemRef.value.$el as HTMLElement;

	observer = new MutationObserver(mutations => {
		for (const mutation of mutations) {
			if (mutation.attributeName === 'class') {
				updateResizeState(element.classList.contains('vgl-item--resizing'));
				updateDndState(element.classList.contains('vgl-item--dragging'));
			}
		}
	});
	observer.observe(element, { attributes: true, attributeFilter: ['class'] });
});

onBeforeUnmount(() => {
	observer?.disconnect();
});

function updateResizeState(newValue: boolean) {
	componentState.isResize = newValue;
	emit('change-resize-state', newValue);
	emit('set-resizable-widget-id', newValue ? props.i : null);
}

function updateDndState(newValue: boolean) {
	componentState.isDnd = newValue;
	emit('change-dnd-state', newValue);

	if (newValue) {
		emit('set-dnd-widget-id', props.i);
	} else {
		setTimeout(() => emit('set-dnd-widget-id', null));
	}
}

function resize(i: string, newH: number, newW: number) {
	emit('resize', i, newH, newW);
}
</script>

<template>
	<grid-item
		:key="props.i"
		ref="gridItemRef"
		:x="props.x"
		:y="props.y"
		:w="props.w"
		:h="props.h"
		:i="props.i"
		:max-h="props.maxH"
		:max-w="props.maxW"
		:min-h="props.minH"
		:min-w="props.minW"
		drag-allow-from=".widget-drag"
		drag-ignore-from=".widget-no-drag"
		:class="classes.root"
		@resize="resize"
		@resized="emit('resized')"
		@moved="emit('moved')"
	>
		<div :class="[classes.itemWrapper, classListItem]">
			<div
				v-if="componentState.isResize"
				:class="classes.item"
			>
				<slot name="state-resize" />
			</div>

			<div
				v-if="componentState.isDnd"
				:class="classes.item"
				:style="{ cursor: 'grabbing' }"
			>
				<slot name="state-dnd" />
			</div>

			<div
				v-if="props.dropId === props.i"
				:class="classes.item"
			>
				<slot name="state-add-widget" />
			</div>

			<keep-alive>
				<div
					v-if="!componentState.isResize && !componentState.isDnd && props.dropId !== props.i"
					:class="classes.item"
				>
					<slot name="state-calm" />
				</div>
			</keep-alive>
		</div>
	</grid-item>
</template>

<style module="classes">
.root {
	padding: 3px;
	will-change: top, left !important;
}

.root:has([data-loading='true']) {
	transition: none !important;
}

.isEditing {
	margin: 3px;
}

.notEditing {
	margin: 0;
}

.itemWrapper {
	height: 100%;
	transition: margin 0.1s ease-out;
	will-change: margin;
}

.item {
	width: 100%;
	height: 100%;
}
</style>
