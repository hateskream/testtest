<script setup lang="ts">
import { type DateYYYYMMDD, toUtcIsoDate } from '@/modules/calendar';
import { type DatePickerRangeObject, UiDatePicker } from '@/shared/ui/date-picker';

interface IDateRange {
	from: DateYYYYMMDD;
	to: DateYYYYMMDD;
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
			from: toUtcIsoDate(start),
			to: toUtcIsoDate(end),
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
			:show-header="false"
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
