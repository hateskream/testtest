<script setup lang="ts">
import { DatePicker } from 'v-calendar';

const emits = defineEmits<{
	'update-week': [Date];
}>();

const selectedDate = defineModel<Date>({ required: true });
</script>

<template>
	<div :class="classes.calendarComponent">
		<date-picker
			v-model="selectedDate"
			title-position="left"
			transparent
			borderless
			color="red"
			is-dark
			trim-weeks
			:highlight-today="true"
			:masks="{ title: 'MMMM yyyy' }"
			:locale="{ firstDayOfWeek: 2 }"
			:view="'monthly'"
			:class="classes.calendar"
			@update:model-value="emits('update-week', $event)"
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
