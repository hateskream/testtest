<script setup lang="ts">
import { computed, onUnmounted, shallowRef, useTemplateRef } from 'vue';

import { createRange } from '@/shared/lib';
import { UiText } from '@/shared/ui/text';
import { IconIds, UiIcon } from '@/shared/ui/icon';

const THUMB_WIDTH = 17;
const THUMB_HEIGHT = 12;
const MIN_BAR_GAP_PX = THUMB_WIDTH + 6;

interface IYearsSelectorProps {
	start: number;
	end: number;
}

const props = defineProps<IYearsSelectorProps>();

const modelValue = defineModel<number[]>({ required: true });

const trackRef = useTemplateRef('trackRef');

const totalSteps = computed(() => props.end - props.start);

const years = computed(() => {
	const total = totalSteps.value;
	if (total === 0) {
		return [];
	}

	return createRange(props.start, props.end).map((year, key) => {
		return { value: year, left: (key / total) * 100 + '%' };
	});
});

const selectedLeft = computed(() => {
	if (!modelValue.value.length) {
		return 0;
	}

	return modelValue.value[0] - props.start;
});

const selectedRight = computed(() => {
	if (!modelValue.value.length) {
		return 0;
	}

	return modelValue.value[modelValue.value.length - 1] - props.start;
});

const isDragging = shallowRef(false);
let dragLeftIndex = shallowRef<number | null>(null);
let dragRightIndex = shallowRef<number | null>(null);

const leftIndex = computed(() => dragLeftIndex.value ?? selectedLeft.value);
const rightIndex = computed(() => dragRightIndex.value ?? selectedRight.value);

const leftPercent = computed(() => {
	if (totalSteps.value === 0) {
		return 0;
	}

	return (leftIndex.value / totalSteps.value) * 100;
});

const rightPercent = computed(() => {
	if (totalSteps.value === 0) {
		return 0;
	}

	return (rightIndex.value / totalSteps.value) * 100;
});

const isSingleYear = computed(() => leftIndex.value === rightIndex.value);

const barWidthPercent = computed(() => rightPercent.value - leftPercent.value);

const singleYearOffsets = computed(() => {
	if (!isSingleYear.value) {
		return { left: 0, right: 0 };
	}

	const isAtStart = leftIndex.value === 0;
	const isAtEnd = rightIndex.value === totalSteps.value;

	if (isAtStart) {
		return { left: 0, right: MIN_BAR_GAP_PX };
	}

	if (isAtEnd) {
		return { left: -MIN_BAR_GAP_PX, right: 0 };
	}

	return { left: -(MIN_BAR_GAP_PX / 2), right: MIN_BAR_GAP_PX / 2 };
});

const leftThumbStyle = computed(() => {
	const base = leftPercent.value + '%';
	const offset = singleYearOffsets.value.left;

	if (offset !== 0) {
		return {
			left: `calc(${base} + ${offset}px)`,
			height: `${THUMB_HEIGHT}px`,
			width: `${THUMB_WIDTH}px`,
		};
	}

	return { left: base, height: `${THUMB_HEIGHT}px`, width: `${THUMB_WIDTH}px` };
});

const rightThumbStyle = computed(() => {
	const base = rightPercent.value + '%';
	const offset = singleYearOffsets.value.right;

	if (offset !== 0) {
		return {
			left: `calc(${base} + ${offset}px)`,
			height: `${THUMB_HEIGHT}px`,
			width: `${THUMB_WIDTH}px`,
		};
	}

	return { left: base, height: `${THUMB_HEIGHT}px`, width: `${THUMB_WIDTH}px` };
});

const activeBarStyle = computed(() => {
	if (isSingleYear.value) {
		const offset = singleYearOffsets.value.left;

		return {
			left:
				offset !== 0
					? `calc(${leftPercent.value}% + ${offset}px)`
					: leftPercent.value + '%',
			width: `${MIN_BAR_GAP_PX}px`,
		};
	}

	return {
		left: leftPercent.value + '%',
		width: barWidthPercent.value + '%',
	};
});

function clientXToIndex(clientX: number) {
	const track = trackRef.value;

	if (!track) {
		return 0;
	}

	const rect = track.getBoundingClientRect();
	const ratio = (clientX - rect.left) / rect.width;

	return Math.max(
		0,
		Math.min(Math.round(ratio * totalSteps.value), totalSteps.value),
	);
}

function updateYears(left: number, right: number) {
	modelValue.value = createRange(props.start + left, props.start + right);
}

let activeController: AbortController | null = null;

function onThumbPointerDown(event: PointerEvent, side: 'left' | 'right') {
	event.preventDefault();
	event.stopPropagation();

	activeController?.abort();
	const controller = new AbortController();
	activeController = controller;
	const { signal } = controller;

	(event.target as HTMLElement).setPointerCapture(event.pointerId);

	isDragging.value = true;
	dragLeftIndex.value = selectedLeft.value;
	dragRightIndex.value = selectedRight.value;

	const onMove = (moveEvent: PointerEvent) => {
		const index = clientXToIndex(moveEvent.clientX);

		if (side === 'left') {
			dragLeftIndex.value = Math.min(index, dragRightIndex.value!);
		} else {
			dragRightIndex.value = Math.max(index, dragLeftIndex.value!);
		}
	};

	const onUp = () => {
		updateYears(dragLeftIndex.value!, dragRightIndex.value!);
		dragLeftIndex.value = null;
		dragRightIndex.value = null;
		isDragging.value = false;
		controller.abort();
		activeController = null;
	};

	window.addEventListener('pointermove', onMove, { signal });
	window.addEventListener('pointerup', onUp, { signal });
}

function onBarPointerDown(event: PointerEvent) {
	event.preventDefault();
	event.stopPropagation();

	activeController?.abort();
	const controller = new AbortController();
	activeController = controller;
	const { signal } = controller;

	(event.target as HTMLElement).setPointerCapture(event.pointerId);

	isDragging.value = true;
	const startLeft = selectedLeft.value;
	const startRight = selectedRight.value;
	const rangeSize = startRight - startLeft;
	const startIndex = clientXToIndex(event.clientX);

	dragLeftIndex.value = startLeft;
	dragRightIndex.value = startRight;

	const onMove = (moveEvent: PointerEvent) => {
		const currentIndex = clientXToIndex(moveEvent.clientX);
		const delta = currentIndex - startIndex;

		let newLeft = startLeft + delta;
		let newRight = startRight + delta;

		if (newLeft < 0) {
			newLeft = 0;
			newRight = rangeSize;
		}

		if (newRight > totalSteps.value) {
			newRight = totalSteps.value;
			newLeft = totalSteps.value - rangeSize;
		}

		dragLeftIndex.value = newLeft;
		dragRightIndex.value = newRight;
	};

	const onUp = () => {
		updateYears(dragLeftIndex.value!, dragRightIndex.value!);
		dragLeftIndex.value = null;
		dragRightIndex.value = null;
		isDragging.value = false;
		controller.abort();
		activeController = null;
	};

	window.addEventListener('pointermove', onMove, { signal });
	window.addEventListener('pointerup', onUp, { signal });
}

onUnmounted(() => {
	activeController?.abort();
});
</script>

<template>
	<div :class="classes.root">
		<div
			ref="trackRef"
			:class="[classes.track, { [classes.dragging]: isDragging }]"
		>
			<div :class="classes.trackLine" />
			<div
				:class="classes.activeBar"
				:style="activeBarStyle"
				@pointerdown="onBarPointerDown"
			>
				<ui-icon
					:id="IconIds.DragHorizontal"
					height="6px"
					width="6px"
					:class="classes.dragIcon"
				/>
			</div>
			<div
				:class="classes.thumb"
				:style="leftThumbStyle"
				@pointerdown="onThumbPointerDown($event, 'left')"
			>
				<span />
				<span />
				<span />
			</div>
			<div
				:class="classes.thumb"
				:style="rightThumbStyle"
				@pointerdown="onThumbPointerDown($event, 'right')"
			>
				<span />
				<span />
				<span />
			</div>
		</div>
		<div :class="classes.labels">
			<div
				v-for="year in years"
				:key="year.value"
				:class="classes.label"
				:style="{ left: year.left }"
			>
				<ui-text token="text-50-r">
					{{ year.value }}
				</ui-text>
			</div>
		</div>
	</div>
</template>

<style module="classes">
.root {
	display: flex;
	flex-direction: column;
	align-items: flex-start;
	align-self: stretch;
	height: var(--height-s16, 40px);
	padding: var(--padding-s4, 6px) var(--padding-s11, 20px);
	user-select: none;
	gap: var(--padding-s3, 4px);
	touch-action: none;
}

.track {
	position: relative;
	flex-shrink: 0;
	align-self: stretch;
	width: 100%;
	height: 8px;
}

.trackLine {
	position: absolute;
	top: 1px;
	left: 0;
	width: 100%;
	height: 6px;
	background-color: var(--bg-100, rgb(73 73 80 / 32%));
	border-radius: 4px;
}

.activeBar {
	position: absolute;
	top: 0;
	display: flex;
	justify-content: center;
	align-items: center;
	height: 100%;
	background-color: var(--bg-300, rgb(73 73 80 / 52%));
	border-radius: 4px;
	cursor: grab;
	transition: background-color 0.15s ease;
}

.activeBar:active {
	cursor: grabbing;
}

.dragging .activeBar {
	background-color: var(--bg-500, rgb(73 73 80 / 90%));
}

.dragIcon {
	color: var(--icon-500, #ffffff);
}

.thumb {
	position: absolute;
	top: 50%;
	z-index: 1;
	display: flex;
	justify-content: center;
	align-items: center;
	background-color: var(--bg-500, rgb(73 73 80 / 90%));
	border-radius: 4px;
	transform: translate(-50%, -50%);
	cursor: ew-resize;
	backdrop-filter: blur(18px);
	transition:
		background-color 0.15s ease,
		transform 0.15s ease;
	gap: 2px;
}

.dragging .thumb {
	background-color: var(--common-color-gray-300, rgb(146 146 149));
	transform: translate(-50%, -50%) scaleY(1.15);
}

.thumb > span {
	width: 1px;
	height: 4px;
	background-color: var(--atom-contrast-00, #ffffff);
}

.labels {
	position: relative;
	align-self: stretch;
	height: 14px;
}

.label {
	position: absolute;
	color: var(--text-100, rgb(255 255 255 / 30%));
	transform: translateX(-50%);
}
</style>
