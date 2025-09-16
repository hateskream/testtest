<script setup lang="ts">
import type { CSSProperties } from 'vue';

import { generateRandomColor } from '@/shared/lib/generate-random-color';

interface IWeeklyDayInfo {
	date: Date;
	dayNumber: number;
	weekdayShort: string;
	weekdayLong: string;
	isToday: boolean;
	metrics: { label: string; value: number }[];
	colorDots: { color: CSSProperties['color'] }[];
}

interface ICalendarWeeklyInfoProps {
	locale?: string;
	weekStartsOn?: 'monday' | 'sunday';
}

const props = withDefaults(defineProps<ICalendarWeeklyInfoProps>(), {
	locale: typeof navigator !== 'undefined' ? navigator.language : 'en-US',
	weekStartsOn: 'monday',
});

function getStartOfWeek(date: Date, weekStartsOn: 'monday' | 'sunday'): Date {
	const jsDayOfWeek = date.getDay(); // 0..6 (Sun..Sat)
	const startOffset = weekStartsOn === 'monday' ? (jsDayOfWeek + 6) % 7 : jsDayOfWeek;
	const start = new Date(date);
	start.setHours(0, 0, 0, 0);
	start.setDate(date.getDate() - startOffset);
	return start;
}

function isSameCalendarDay(a: Date, b: Date): boolean {
	return (
		a.getFullYear() === b.getFullYear() &&
		a.getMonth() === b.getMonth() &&
		a.getDate() === b.getDate()
	);
}

const today = new Date();
const startOfWeek = getStartOfWeek(today, props.weekStartsOn);

const shortFormatter = new Intl.DateTimeFormat(props.locale, { weekday: 'short' });
const longFormatter = new Intl.DateTimeFormat(props.locale, { weekday: 'long' });

const weekDays: IWeeklyDayInfo[] = Array.from({ length: 7 }, (_, index) => {
	const d = new Date(startOfWeek);
	d.setDate(startOfWeek.getDate() + index);
	return {
		date: d,
		dayNumber: d.getDate(),
		weekdayShort: shortFormatter.format(d),
		weekdayLong: longFormatter.format(d),
		isToday: isSameCalendarDay(d, today),
		metrics: [
			{
				label: 'Economic',
				value: Math.round(Math.random() * 100) },
			{
				label: 'Earnings',
				value: Math.round(Math.random() * 100) },
			{
				label: 'Dividends',
				value: Math.round(Math.random() * 1000) },
		],
		colorDots: Math.random() > 0.7 ? [{ color: generateRandomColor() }] : Math.random() > 0.7 ? [
			{ color: generateRandomColor() },
			{ color: generateRandomColor() },
		] : [],
	};
});

</script>

<template>
	<div :class="classes.calendarWeeklyInfo">
		<div
			v-for="dayItem in weekDays"
			:key="dayItem.dayNumber + '-' + dayItem.weekdayShort"
			:class="[classes.dayCard, dayItem.isToday ? classes.dayCardToday : '']"
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
</template>

<style module="classes">
.calendarWeeklyInfo {
	display: flex;
	flex-direction: row;
	justify-content: space-between;
	align-self: stretch;
	min-width: 850px;
	gap: 8px;

	/* TODO: Add horizontal scrollbar for smaller screens */
}

.dayCard {
	display: flex;
	flex-grow: 1;
	flex-direction: column;
	justify-content: space-between;
	align-items: flex-start;
	gap: 24px;
	padding: 12px;
	border: 1px solid var(--color-border-base-300, rgb(97 97 97 / 30%));
	border-radius: 18px;
}

.dayCardToday {
	background: var(--color-bg-surface-02, #161618);
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
