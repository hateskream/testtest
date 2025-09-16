<script setup lang="ts">
import { DatePicker } from 'v-calendar';
import { ref } from 'vue';

const selectedDate = ref<Date | null>(new Date());
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

/* :global(.vc-container) {
	--vc-bg: transparent;
	--vc-border: transparent;
	--vc-text: var(--text-color-base-500);

	--vc-hover-bg: var(--bg-color-surface-01);
	--vc-today-bg: transparent;

	--vc-focus-ring: 0 0 0 2px rgb(255 255 255 / 12%);

	border-radius: 16px;
} */
</style>
