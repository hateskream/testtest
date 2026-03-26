<script setup lang="ts">
import { computed, defineAsyncComponent, shallowRef, useTemplateRef } from 'vue';

import { type CalendarDay, DatePickerMaskKey, type DatePickerModel, type DateView, type Page } from './model';
import { setupVCalendar } from './setup';
import type { VDatePickerComponent } from './component';
import { UiSkeletonGroup } from '@/shared/ui/skeleton';

import DatePickerHeader from './date-picker-header.vue';

const DatePicker = defineAsyncComponent(async () => {
	const { DatePicker: component } = await setupVCalendar();
	return component;
});

interface ICalendarDatePickerProps {
	masks?: Partial<Record<DatePickerMaskKey, string | string[]>>;
	titlePosition?: 'center' | 'left' | 'right';
	isRange?: boolean;
	transparent?: boolean;
	borderless?: boolean;
	isDark?: boolean;
	trimWeeks?: boolean;
	highlightToday?: boolean;
	inputDebounce?: number;
	minDate?: Date;
	maxDate?: Date;
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
	minDate: undefined,
	maxDate: undefined,
});

const modelValue = defineModel<DatePickerModel>({ required: true });
const modelView = defineModel<DateView>('view', { required: true });

const skeletonCount = computed(() => modelView.value === 'monthly' ? 7 : 3);

const datePickerRef = useTemplateRef<VDatePickerComponent>('datePicker');

function setToday() {
	if (datePickerRef.value) {
		datePickerRef.value.move(new Date(), { transition: 'slide-h' });
	}
}

const currentPages = shallowRef<Page[]>([]);

function onUpdatePages(pages: Page[]) {
	currentPages.value = pages;
}

function onDayClick(_: CalendarDay, event: PointerEvent) {
	(event.target as HTMLElement).blur();
}
</script>

<template>
	<suspense>
		<date-picker
			ref="datePicker"
			v-model="modelValue"
			v-model:view="modelView"
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
			:min-date="props.minDate"
			:max-date="props.maxDate"
			color="white"
			@update:pages="onUpdatePages"
			@dayclick="onDayClick"
		>
			<template #header-title>
				<date-picker-header
					v-model:view="modelView"
					:pages="currentPages"
					@set-today="setToday"
				/>
			</template>
		</date-picker>
		<template #fallback>
			<ui-skeleton-group
				:count="skeletonCount"
				height="42px"
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
<style src="./styles.css"></style>
