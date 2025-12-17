<script setup lang="ts">
import { computed, defineAsyncComponent } from 'vue';

import { DatePickerMaskKey, type DatePickerModel } from './model';
import { setupVCalendar } from './setup';
import { UiSkeletonGroup } from '@/shared/ui/skeleton';

const DatePicker = defineAsyncComponent(async () => {
	const { DatePicker: component } = await setupVCalendar();
	return component;
});

interface ICalendarDatePickerProps {
	view: 'monthly' | 'weekly';
	masks?: Partial<Record<DatePickerMaskKey, string | string[]>>;
	titlePosition?: 'center' | 'left' | 'right';
	isRange?: boolean;
	transparent?: boolean;
	borderless?: boolean;
	isDark?: boolean;
	trimWeeks?: boolean;
	highlightToday?: boolean;
	inputDebounce?: number;
}

const props = withDefaults(defineProps<ICalendarDatePickerProps>(), {
	masks: () => ({ [DatePickerMaskKey.Title]: 'MMMM yyyy' }),
	titlePosition: 'right',
	transparent: true,
	borderless: true,
	isDark: true,
	trimWeeks: true,
	highlightToday: true,
	inputDebounce: 1000,
});

const modelValue = defineModel<DatePickerModel>({ required: true });

const skeletonCount = computed(() => props.view === 'monthly' ? 7 : 3);
</script>

<template>
	<suspense>
		<date-picker
			v-model="modelValue"
			:view="props.view"
			:is-range="props.isRange"
			:masks="props.masks"
			:transparent="props.transparent"
			:title-position="props.titlePosition"
			:borderless="props.borderless"
			:is-dark="props.isDark"
			:trim-weeks="props.trimWeeks"
			:highlight-today="props.highlightToday"
			:input-debounce="props.inputDebounce"
			:locale="{ id: 'en', firstDayOfWeek: 2, masks: { weekdays: 'WWW' } }"
			:class="classes.datePicker"
			color="white"
		>
			<template #header-left-button>
				<button>
					Today
				</button>
			</template>
		</date-picker>
		<template #fallback>
			<ui-skeleton-group
				:count="skeletonCount"
				height="30px"
				gap="2px"
				:class="classes.skeleton"
			/>
		</template>
	</suspense>
</template>

<style module="classes">
.datePicker {
	width: 100% !important;
}

.skeleton {
	width: 100%;
}
</style>
