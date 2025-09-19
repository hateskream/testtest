<script setup lang="ts">
import { DatePicker } from 'v-calendar';
import { computed } from 'vue';

import { type IEventBoardRange, toUtcIsoDate } from '@/modules/calendar';

const dateRange = defineModel<IEventBoardRange>({
	required: true,
});

const proxy = computed({
	set: ({ start, end }: { start: Date; end: Date }) => {
		dateRange.value.from = toUtcIsoDate(start);
		dateRange.value.to = toUtcIsoDate(end);
	},
	get: () => {
		return {
			start: new Date(dateRange.value.from + 'T00:00:00Z'),
			end: new Date(dateRange.value.to + 'T00:00:00Z'),
		};
	},
});
</script>

<template>
	<div :class="classes.calendarComponent">
		<date-picker
			:model-value="proxy"
			:view="'weekly'"
			title-position="left"
			transparent
			borderless
			color="red"
			is-dark
			is-range
			trim-weeks
			:highlight-today="true"
			:masks="{ title: 'MMMM yyyy' }"
			:locale="{ firstDayOfWeek: 2 }"
			:class="classes.calendar"
			@update:model-value="proxy = $event"
		/>
	</div>
</template>

<style module="classes">
.calendarComponent {
	display: flex;
	align-self: stretch;
}

.calendar {
	width: 100%;
}
</style>
