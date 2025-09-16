<script setup lang="ts">
import { DatePicker } from 'v-calendar';

const selectedDate = defineModel<Date>({ required: true });

const emits = defineEmits<{
	'update-week': [Date];
}>();
</script>

<template>
	<div :class="classes.calendarComponent">
		<date-picker
			v-model="selectedDate"
			title-position="left"
			transparent
			borderless
			color="gray"
			is-dark
			trim-weeks
			:highlight-today="true"
			:masks="{ title: 'MMMM yyyy' }"
			:locale="{ firstDayOfWeek: 1 }"
			:class="classes.calendar"
			@update:model-value="emits('update-week', $event)"
		>
			<template #day-content="{ day }">
				<div
					class="day-cell"
					:class="[
						classes.cell,
						day.isToday && classes.today,
						selectedDate && day.date.toDateString() === selectedDate.toDateString() && classes.active
					]"
					@click="selectedDate = day.date"
				>
					{{ day.day }}
				</div>
			</template>
		</date-picker>
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

.cell {
	display: flex;
	justify-content: center;
	align-items: center;
	width: 2rem;
	height: 2rem;
	margin: 0 auto;
	line-height: 0;
	border-radius: 50%;
	cursor: pointer;
}

.today {
	border: 1px solid #ffffff;
}

.active {
	background-color: rgb(230 0 0 / 100%);
}

:global(.vc-highlights) {
	display: none;
}
</style>
