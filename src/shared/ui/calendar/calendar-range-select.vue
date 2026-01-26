<script setup lang="ts">
import { parseISO } from 'date-fns';

import { type DatePickerRangeObject, UiDatePicker } from '@/shared/ui/date-picker';

interface IDateRange {
	from: string;
	to: string;
}

interface IDatePickerModel {
	start: Date;
	end: Date;
}

const props = defineProps<{
	view: 'monthly' | 'weekly';
}>();


const dateRange = defineModel<IDateRange, string, DatePickerRangeObject, IDatePickerModel>({
	required: true,
	get({ from, to }) {
		return {
			start: new Date(from + 'T00:00:00Z'),
			end: new Date(to + 'T00:00:00Z'),
		};
	},
	set({ start, end }) {
		return {
			from: parseISO(`${start}T00:00:00Z`),
			to: parseISO(`${end}T00:00:00Z`),
		};
	},
});
</script>

<template>
	<div :class="classes.calendarComponent">
		<ui-date-picker
			v-model="dateRange"
			:view="props.view"
			is-range
		/>
	</div>
</template>

<style module="classes">
.calendarComponent {
	display: flex;
	align-self: stretch;
	width: 100%;
}
</style>
