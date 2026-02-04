<script setup lang="ts" generic="P extends DateRangePresetValue">
import { computed, reactive, ref, useTemplateRef } from 'vue';

import type { SegmentedControlModel } from '@/shared/ui/segmented-control';
import { UiSegmentedControl, UiSegmentedControlItem } from '@/shared/ui/segmented-control';
import type { DateRangePresetValue, DateRangeValue } from '@/modules/lightweight-charts/model';
import {
	createPreset,
	DEFAULT_PRESETS,
	getDateRangePresetLabel,
	isDateRangePreset,
	toUtcSecondsRange,
} from '@/modules/lightweight-charts/model';
import { IconIds, UiIcon } from '@/shared/ui/icon';
import { UiTooltipBase } from '@/shared/ui/tooltip-base';

const props = withDefaults(defineProps<{
	presets?: P[];
	dragThreshold?: number;
}>(), {
	presets: () => DEFAULT_PRESETS as P[],
	dragThreshold: 4,
});

const preparedPresets = computed(() => {
	return props.presets.map(preset => ({
		label: getDateRangePresetLabel(preset.preset),
		value: preset.preset,
	}));
});

const modelValue = defineModel<DateRangeValue>({ required: true });

defineSlots<{
	preset?: (props: { preset: P['preset'] }) => unknown;
}>();

function onUpdateModelValue(value: SegmentedControlModel | undefined) {
	if (!value || typeof value === 'number') {
		return;
	}

	if (isDateRangePreset(value)) {
		modelValue.value = createPreset(value);
		return;
	}

	if (value === 'custom') {
		const { from, to } = toUtcSecondsRange(modelValue.value);
		modelValue.value = { type: 'custom', from, to };

		// TODO: Calendar
		// open calendar
	}
}

const controlModel = ref(modelValue.value.type === 'preset' ? modelValue.value.preset : 'custom');

// scrollable

const scrollableRef = useTemplateRef('scrollable');

const state = reactive({
	isDown: false,
	isDragging: false,
	startX: 0,
	startScroll: 0,
	pointerId: null as (number | null),
});

function onPointerDown(e: PointerEvent) {
	if (!scrollableRef.value) {
		return;
	}

	state.isDown = true;
	state.isDragging = false;
	state.startX = e.clientX;
	state.startScroll = scrollableRef.value.scrollLeft;
	state.pointerId = e.pointerId;
}

function onPointerMove(e: PointerEvent) {
	if (!state.isDown || !scrollableRef.value) {
		return;
	}

	const dx = e.clientX - state.startX;

	if (!state.isDragging) {
		if (Math.abs(dx) < props.dragThreshold) {
			return;
		}

		state.isDragging = true;
		e.preventDefault();
		e.stopPropagation();
		scrollableRef.value.setPointerCapture(state.pointerId!);
	}

	e.preventDefault();
	e.stopPropagation();

	scrollableRef.value.scrollLeft =
		state.startScroll - dx;
}

function onPointerUp() {
	if (!scrollableRef.value) {
		return;
	}

	if (state.pointerId !== null) {
		scrollableRef.value.releasePointerCapture(state.pointerId);
	}

	state.isDown = false;
	state.isDragging = false;
	state.pointerId = null;
}
</script>

<template>
	<div 	:class="classes.dateRange">
		<div
			ref="scrollable"
			:class="classes.scrollable"
			@scroll.prevent.stop
			@pointerdown.prevent.stop="onPointerDown"
			@pointermove.prevent.stop="onPointerMove"
			@pointerup.prevent.stop="onPointerUp"
			@pointercancel.prevent.stop
		>
			<ui-segmented-control
				v-model="controlModel"
				:class="classes.control"
				@update:model-value="onUpdateModelValue"
			>
				<ui-segmented-control-item
					v-for="preset in preparedPresets"
					:key="preset.value"
					:value="preset.value"
					:class="classes.controlItem"
				>
					<slot name="preset" :preset="preset.value">{{ preset.label }}</slot>
				</ui-segmented-control-item>
				<ui-segmented-control-item :class="[classes.controlItem, classes.controlItemCalendar]" value="custom">
					<ui-icon
						:id="IconIds.Calendar"
						width="16px"
						height="16px"
					/>
				</ui-segmented-control-item>
			</ui-segmented-control>
			<ui-tooltip-base
				:class="classes.infoWrapper"
				label="Timeframe"
				text="Switch between different time periods to analyze price movements"
			>
				<template #trigger>
					<ui-icon
						:id="IconIds.InfoRectangle"
						:class="classes.infoIcon"
						height="14"
						width="14"
					/>
				</template>
			</ui-tooltip-base>
		</div>
	</div>
</template>


<style module="classes">
.dateRange {
	position: relative;
	width: 100%;
	overflow: hidden;
}

.scrollable {
	gap: var(--padding-s7, 12px);
	display: flex;
	align-items: center;
	align-self: stretch;
	width: 100%;
	height: 48px;
	padding: var(--padding-s5, 8px) 0;
	padding-right: 18px;
	overflow-x: scroll;
	cursor: grab;
	user-select: none;
	touch-action: pan-x;
	overscroll-behavior-x: contain;
	scrollbar-width: none;
}

.scrollable::-webkit-scrollbar {
	width: 0;
	height: 0;
}

.scrollable:active {
	cursor: grabbing;
}

.control {
	flex: 1 0 0;
	width: 100%;
}

.controlItem {
	flex: 1 0 0;
	gap: 4px;
	height: var(--height-s14, 32px);
}

.controlItemCalendar {
	flex-grow: 0;
}

.infoWrapper {
	flex-shrink: 0;
	cursor: default;
}

.infoIcon {
	color: var(--icon-300, rgb(255 255 255 / 50%));
}
</style>
