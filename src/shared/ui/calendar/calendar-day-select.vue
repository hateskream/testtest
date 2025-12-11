<script setup lang="ts">
import type { DatePickerModel } from '@/shared/ui/date-picker';
import { UiDatePicker } from '@/shared/ui/date-picker';

const emit = defineEmits<{
	'update-week': [Date];
}>();

const selectedDate = defineModel<Date>({ required: true });

function updateWeek(model: DatePickerModel) {
	emit('update-week', model as Date);
}
</script>

<template>
	<div :class="classes.calendarComponent">
		<ui-date-picker
			v-model="selectedDate"
			view="monthly"
			@update:model-value="updateWeek"
		/>
	</div>
</template>

<style module="classes">
.calendarComponent {
	display: flex;
	align-self: stretch;
	padding: 16px;
}
</style>

<style scoped>
:deep(.vc-day.is-today .vc-day-content:not(.vc-highlight-content-solid)) {
	font-weight: 700;
	color: #ffffff;
	background-color: #ff0000;
}
</style>

<style src="./styles.css">

</style>
