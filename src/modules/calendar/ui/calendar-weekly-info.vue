<script setup lang="ts">
import { isSameCalendarDay, type IWeeklyDayInfo } from '@/modules/calendar';
import { UiText } from '@/shared/ui/text';

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
					isSelected(dayItem.date) ? classes.selected : '',
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
						<ui-text
							token="text-300-r"
							as="div"
							:class="classes.metricLabel"
						>
							{{ metric.label }}:
						</ui-text>
						<ui-text
							token="text-300-r"
							as="div"
							:class="classes.metricValue"
						>
							{{ metric.value }}
						</ui-text>
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
	cursor: pointer;
	transition-timing-function: ease;
	transition-duration: 0.25s;
	transition-property: border, background-color;
	gap: 24px;
}

.dayCard:not(.today):hover {
	background: var(--color-bg-hover-surface-01-hover, rgb(37 35 35 / 30%));
	border: 1px solid var(--color-border-hover-base-300-hover, rgb(166 166 166 / 30%));
}

.dayCard.selected:hover {
	border: 1px solid var(--color-border-base-300, rgb(97 97 97));
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
	font-size: var(--font-title-300-size, 20px);
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
	color: var(--color-text-base-100, #646568);
}

.metricValue {
	color: var(--color-text-base-500, #ffffff);
}
</style>
