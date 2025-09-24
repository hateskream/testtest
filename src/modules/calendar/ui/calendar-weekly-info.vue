<script setup lang="ts">
import { isSameCalendarDay, type IWeeklyDayInfo } from '@/modules/calendar';

const props = defineProps<{
	weekDays: IWeeklyDayInfo[];
	selectedDate: Date;
}>();

const emits = defineEmits<{
	'select-day': [Date];
}>();

function isSelected(date: Date) {
	return isSameCalendarDay(date, props.selectedDate);
}
</script>

<template>
	<div :class="classes.calendarScrollWrapper">
		<div :class="classes.calendarWeeklyInfo">
			<div
				v-for="dayItem in weekDays"
				:key="dayItem.dayNumber + '-' + dayItem.weekdayShort"
				:class="[
					classes.dayCard,
					dayItem.isToday ? classes.today : '',
					isSelected(dayItem.date) ? classes.selected : ''
				]"
				@click="emits('select-day', dayItem.date)"
			>
				<div :class="classes.dayTitle">
					{{ dayItem.weekdayShort }} {{ dayItem.dayNumber }}
					<div
						v-for="dot in dayItem.colorDots"
						:key="dot.color"
						:class="classes.colorDot"
						:style="{ backgroundColor: dot.color }"
					/>
				</div>

				<div :class="classes.dayMetrics">
					<div
						v-for="metric in dayItem.metrics"
						:key="metric.label"
						:class="classes.metric"
					>
						<div :class="classes.metricLabel">
							{{ metric.label }}:
						</div>
						<div :class="classes.metricValue">
							{{ metric.value }}
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<style module="classes">
.calendarScrollWrapper {
	width: 100%;
	overflow-x: auto;
}

.calendarWeeklyInfo {
	display: flex;
	flex-direction: row;
	justify-content: space-between;
	align-self: stretch;
	gap: 8px;

	/* TODO: Add horizontal scrollbar for smaller screens */
}

.dayCard {
	display: flex;
	flex-grow: 1;
	flex-direction: column;
	justify-content: space-between;
	align-items: flex-start;
	padding: 12px;
	border: 1px solid var(--color-border-base-300, rgb(97 97 97 / 30%));
	border-radius: 18px;
	gap: 24px;
}

.today {
	background: var(--color-bg-surface-02, #161618);
}

.selected {
	border: 1px solid var(--color-border-base-300, rgb(97 97 97));
}

.dayTitle {
	display: inline-flex;
	align-items: center;
	gap: 4px;
	font-weight: 410;
	font-size: var(--typography-headers-size-h01, 20px);
	color: var(--color-text-base-500, #ffffff);
}

.colorDot {
	width: 8px;
	height: 8px;
	border-radius: 999px;
}

.dayMetrics {
	display: flex;
	flex-direction: column;
	align-self: stretch;
	gap: 1px;
}

.metric {
	display: inline-flex;
	justify-content: space-between;
	gap: 4px;
	letter-spacing: 0.143px;
	text-shadow: 0 4px 4px rgb(0 0 0 / 25%);
}

.metricLabel {
	font-size: var(--typography-paragraph-size-p00, 13px);
	color: var(--color-text-base-100, #646568);
}

.metricValue {
	font-size: var(--typography-paragraph-size-p00, 13px);
	color: var(--color-text-base-500, #ffffff);
}
</style>
