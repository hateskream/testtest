<script setup lang="ts" generic="P extends DateRangePresetValue">
import { computed, ref } from 'vue';

import type { SegmentedControlModel } from '@/shared/ui/segmented-control';
import { UiSegmentedControl, UiSegmentedControlItem } from '@/shared/ui/segmented-control';
import {
	createPreset,
	type DateRangePresetValue,
	type DateRangeValue,
	dateStringToUtcSeconds,
	DEFAULT_PRESETS,
	getDateRangePresetLabel,
	isDateRangePreset,
	toUtcEndOfDay,
	toUtcSecondsRange,
	utcSecondsToString,
} from '@/modules/lightweight-charts/model';
import { IconIds, UiIcon } from '@/shared/ui/icon';
import { UiTooltipBase } from '@/shared/ui/tooltip-base';
import { UiScrollableRow } from '@/shared/ui/scrollable-row';
import { UiPosition } from '@/shared/ui/position';
import { ModalBadgeList } from '@/modules/widgets/base';
import { CalendarRangeSelect, type IDateRange } from '@/shared/ui/calendar';

const props = withDefaults(defineProps<{
	presets?: P[];
}>(), {
	presets: () => DEFAULT_PRESETS as P[],
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
}

const controlModel = ref(modelValue.value.type === 'preset' ? modelValue.value.preset : 'custom');

const calendarDateRangeModel = computed({
	get() {
		const { from, to } = toUtcSecondsRange(modelValue.value);
		return {
			from: utcSecondsToString(from),
			to: utcSecondsToString(to),
		};
	},
	set(value: IDateRange) {
		modelValue.value = {
			type: 'custom',
			from: dateStringToUtcSeconds(value.from),
			to: toUtcEndOfDay(dateStringToUtcSeconds(value.to)),
		};
	},
});
</script>

<template>
	<ui-scrollable-row :class="classes.dateRange" gap="var(--padding-s7, 12px)">
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
			<ui-position placement="left">
				<template #title>
					<ui-segmented-control-item
						value="custom"
						disabled
						:class="[classes.controlItem, classes.controlItemCalendar]"
					>
						<ui-icon
							:id="IconIds.Calendar"
							width="16px"
							height="16px"
						/>
					</ui-segmented-control-item>
				</template>
				<template #content>
					<modal-badge-list display-variant="new">
						<calendar-range-select
							v-model="calendarDateRangeModel"
							view="monthly"
						/>
					</modal-badge-list>
				</template>
			</ui-position>
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
	</ui-scrollable-row>
</template>


<style module="classes">
.dateRange {
	position: relative;
	width: 100%;
	height: 48px;
	padding: var(--padding-s5, 8px) 0;
	overflow: hidden;
}

.control {
	min-width: max-content;
}

.controlItem {
	flex: 1 0 0;
	min-width: fit-content;
	height: var(--height-s14, 32px);
	gap: 4px;
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
